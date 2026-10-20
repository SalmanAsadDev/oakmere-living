alter table public.checkout_quotes add column context jsonb not null default '{}';
alter table public.checkout_quotes add column policy_version text not null default 'reference-2026-10-20';
alter table public.orders add column request_context jsonb;
alter table public.orders add column terms_version text;
create unique index one_order_per_quote on public.orders(quote_id) where quote_id is not null;

create table private.checkout_limits (
  key text primary key, count integer not null, expires_at timestamptz not null
);
alter table private.checkout_limits enable row level security;
revoke all on private.checkout_limits from public,anon,authenticated;
grant all on private.checkout_limits to service_role;
create function public.consume_checkout_limit(limit_key text, maximum integer, seconds integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare hits integer;
begin
  insert into private.checkout_limits(key,count,expires_at) values(limit_key,1,now()+make_interval(secs=>seconds))
  on conflict(key) do update set count=case when checkout_limits.expires_at<now() then 1 else checkout_limits.count+1 end,
    expires_at=case when checkout_limits.expires_at<now() then now()+make_interval(secs=>seconds) else checkout_limits.expires_at end
  returning count into hits;
  delete from private.checkout_limits where key in (select key from private.checkout_limits where expires_at<now()-interval '1 day' limit 100);
  return hits<=maximum;
end;
$$;

create function public.create_checkout_quote(session_key text, basket jsonb, delivery_context jsonb, policy text, shipping_pence integer) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare item jsonb; v record; lines jsonb:='[]'; subtotal bigint:=0; quantity integer; quote public.checkout_quotes;
begin
  if session_key !~ '^[a-f0-9]{64}$' or jsonb_typeof(basket)<>'array' or jsonb_array_length(basket) not between 1 and 30
    or shipping_pence not between 0 and 100000 or policy<>'reference-2026-10-20' then raise exception 'Invalid quote' using errcode='22023'; end if;
  if (select count(distinct x->>'variantId') from jsonb_array_elements(basket) x)<>jsonb_array_length(basket) then raise exception 'Duplicate configurations' using errcode='22023'; end if;
  for item in select * from jsonb_array_elements(basket) loop
    quantity:=(item->>'quantity')::int;
    select v.id,v.product_id,v.name as label,v.price_pence,v.stock_level,p.name,p.slug,p.is_active as published,p.price_type,v.is_active
      into v from public.variants v join public.products p on p.id=v.product_id where v.id=item->>'variantId';
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

create function public.submit_checkout_order(session_key text, quote_key uuid, idem uuid, contact jsonb, payment text, terms text) returns uuid
language plpgsql security invoker set search_path='' as $$
declare quote public.checkout_quotes; existing public.orders; order_key uuid; item jsonb; v record; context jsonb;
begin
  if session_key !~ '^[a-f0-9]{64}$' or idem is null or payment not in ('cash_on_delivery','card_on_delivery') or terms<>'2026-10-20'
    or length(btrim(contact->>'name')) not between 1 and 180 or length(contact->>'email') not between 3 and 254 then raise exception 'Invalid order' using errcode='22023'; end if;
  context:=jsonb_build_object('quote',quote_key,'contact',contact,'payment',payment,'terms',terms);
  perform pg_advisory_xact_lock(hashtextextended(idem::text,0));
  select * into existing from public.orders where idempotency_key=idem;
  if found then
    if existing.session_id<>session_key or existing.request_context<>context then raise exception 'Idempotency conflict' using errcode='P0001'; end if;
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
    select v.*,p.is_active as published,p.price_type into v from public.variants v join public.products p on p.id=v.product_id where v.id=item->>'variantId';
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

-- A pending order reserves known stock. Cancelling before dispatch returns it once.
-- Prevent reopening cancelled orders without a fresh stock/price check.
create function private.order_status_transition() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if old.status=new.status then return new; end if;
  if not ((old.status='pending' and new.status in ('processing','cancelled')) or
    (old.status='processing' and new.status in ('shipped','cancelled')) or (old.status='shipped' and new.status='delivered')) then
    raise exception 'Invalid order status transition' using errcode='22023';
  end if;
  if new.status='cancelled' and old.quote_id is not null then
    update public.variants v set stock_level=v.stock_level+i.quantity from public.order_items i where i.order_id=old.id and i.variant_id=v.id and v.stock_level is not null;
  end if;
  new.updated_at:=now(); return new;
end;
$$;
revoke all on function private.order_status_transition() from public,anon,authenticated;
create trigger order_status_transition before update of status on public.orders for each row execute function private.order_status_transition();
revoke all on function public.consume_checkout_limit(text,integer,integer),public.create_checkout_quote(text,jsonb,jsonb,text,integer),public.submit_checkout_order(text,uuid,uuid,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.consume_checkout_limit(text,integer,integer),public.create_checkout_quote(text,jsonb,jsonb,text,integer),public.submit_checkout_order(text,uuid,uuid,jsonb,text,text) to service_role;
notify pgrst,'reload schema';
