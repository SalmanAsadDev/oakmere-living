create or replace function public.create_checkout_quote(session_key text, basket jsonb, delivery_context jsonb, policy text, shipping_pence integer) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare item jsonb; v record; lines jsonb:='[]'; subtotal bigint:=0; quantity integer; quote public.checkout_quotes;
begin
  if session_key !~ '^[a-f0-9]{64}$' or jsonb_typeof(basket)<>'array' or jsonb_array_length(basket) not between 1 and 30
    or shipping_pence not between 0 and 100000 or policy<>'reference-2026-10-20' then raise exception 'Invalid quote' using errcode='22023'; end if;
  if (select count(distinct x->>'variantId') from jsonb_array_elements(basket) x)<>jsonb_array_length(basket) then raise exception 'Duplicate configurations' using errcode='22023'; end if;
  for item in select * from jsonb_array_elements(basket) loop
    quantity:=(item->>'quantity')::int;
    select cfg.id,cfg.product_id,cfg.name as label,cfg.price_pence,cfg.stock_level,p.name,p.slug,p.is_active as published,p.price_type,cfg.is_active
      into v from public.variants cfg join public.products p on p.id=cfg.product_id where cfg.id=item->>'variantId';
    if not found or not v.published or not v.is_active or v.price_type='ask' or quantity not between 1 and 10
      or (v.stock_level is not null and v.stock_level<quantity) then raise exception 'Configuration unavailable' using errcode='P0001'; end if;
    subtotal:=subtotal+v.price_pence::bigint*quantity;
    lines:=lines||jsonb_build_array(jsonb_build_object('variantId',v.id,'productId',v.product_id,'name',v.name,'label',v.label,'slug',v.slug,'quantity',quantity,'unitPence',v.price_pence,'totalPence',v.price_pence*quantity));
  end loop;
  if subtotal>90000000 then raise exception 'Order requires team review' using errcode='P0001'; end if;
  insert into public.checkout_quotes(session_id,cart_items,total_amount,delivery_cost,expires_at,context,policy_version)
    values(session_key,lines,(subtotal+shipping_pence)::numeric/100,shipping_pence::numeric/100,now()+interval '15 minutes',delivery_context,policy) returning * into quote;
  return jsonb_build_object('id',quote.id,'items',lines,'subtotalPence',subtotal,'deliveryPence',shipping_pence,'totalPence',subtotal+shipping_pence,'expiresAt',quote.expires_at,'policyVersion',policy);
end;
$$;

create or replace function public.submit_checkout_order(session_key text, quote_key uuid, idem uuid, contact jsonb, payment text, terms text) returns uuid
language plpgsql security invoker set search_path='' as $$
declare quote public.checkout_quotes; existing public.orders; order_key uuid; item jsonb; v record; context jsonb;
begin
  if session_key !~ '^[a-f0-9]{64}$' or idem is null or payment not in ('cash_on_delivery','card_on_delivery') or terms<>'2026-10-20'
    or length(btrim(contact->>'name')) not between 1 and 180 or length(contact->>'email') not between 3 and 254 then raise exception 'Invalid order' using errcode='22023'; end if;
  context:=jsonb_build_object('quote',quote_key,'contact',contact,'payment',payment,'terms',terms);
  perform pg_advisory_xact_lock(hashtextextended(idem::text,0));
  select * into existing from public.orders where idempotency_key=idem;
  if found then
    if existing.session_id<>session_key or existing.request_context is distinct from context then raise exception 'Idempotency conflict' using errcode='P0001'; end if;
    return existing.id;
  end if;
  select * into quote from public.checkout_quotes where id=quote_key and session_id=session_key for update;
  if not found then raise exception 'Quote unavailable' using errcode='P0001'; end if;
  select * into existing from public.orders where quote_id=quote_key;
  if found then
    if existing.session_id=session_key and existing.request_context=context then return existing.id; end if;
    raise exception 'Quote already used' using errcode='P0001';
  end if;
  if quote.expires_at<=now() or quote.policy_version<>'reference-2026-10-20' then raise exception 'Quote expired' using errcode='P0001'; end if;
  -- Lock parents then configurations in a deterministic order, matching catalogue edits.
  perform 1 from public.products where id in (select x->>'productId' from jsonb_array_elements(quote.cart_items) x) order by id for share;
  perform 1 from public.variants where id in (select x->>'variantId' from jsonb_array_elements(quote.cart_items) x) order by id for update;
  for item in select * from jsonb_array_elements(quote.cart_items) loop
    select cfg.*,p.is_active as published,p.price_type into v from public.variants cfg join public.products p on p.id=cfg.product_id where cfg.id=item->>'variantId';
    if not found or not v.is_active or not v.published or v.price_type='ask' or v.price_pence<>(item->>'unitPence')::int
      or (v.stock_level is not null and v.stock_level<(item->>'quantity')::int) then raise exception 'Price or availability changed; request a new quote' using errcode='P0001'; end if;
  end loop;
  insert into public.orders(session_id,customer_email,customer_name,customer_phone,delivery_address,payment_method,subtotal,delivery_cost,total_amount,idempotency_key,quote_id,request_context,terms_version)
    values(session_key,contact->>'email',contact->>'name',contact->>'phone',quote.context->'address',payment::public.payment_method,
      quote.total_amount-quote.delivery_cost,quote.delivery_cost,quote.total_amount,idem,quote.id,context,terms) returning id into order_key;
  for item in select * from jsonb_array_elements(quote.cart_items) loop
    insert into public.order_items(order_id,product_id,variant_id,product_name,quantity,unit_price,total_price)
      values(order_key,item->>'productId',item->>'variantId',(item->>'name')||' — '||(item->>'label'),(item->>'quantity')::int,(item->>'unitPence')::numeric/100,(item->>'totalPence')::numeric/100);
    update public.variants set stock_level=stock_level-(item->>'quantity')::int where id=item->>'variantId' and stock_level is not null;
  end loop;
  return order_key;
end;
$$;


