-- Catalogue writes are one transaction under the verified user's RLS context.
create function public.save_catalogue_product(payload jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare
  product_key text := nullif(payload->>'id','');
  existing_slug text;
  category_key uuid := (payload->>'categoryId')::uuid;
  category_slug text;
  active boolean := coalesce((payload->>'isActive')::boolean,false);
  price_kind text := coalesce(payload->>'priceType','base');
  base_pence integer := nullif(payload->>'basePricePence','')::integer;
  item jsonb;
  variant_key text;
  variant_parent text;
  minimum_price integer;
  maximum_price integer;
  active_count integer;
  image_count integer;
begin
  if not private.staff_has_role(array['admin']) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  if length(btrim(payload->>'name')) not between 1 and 180
    or (payload->>'slug') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or length(payload->>'slug') > 180
    or price_kind not in ('base','from','ask') then
    raise exception 'Invalid product details' using errcode='22023';
  end if;
  if jsonb_typeof(payload->'variants') <> 'array' or jsonb_array_length(payload->'variants') > 30
    or jsonb_typeof(payload->'images') <> 'array' or jsonb_array_length(payload->'images') > 30 then
    raise exception 'Invalid product collections' using errcode='22023';
  end if;
  select slug into category_slug from public.categories where id=category_key;
  if category_slug is null then raise exception 'Choose a category' using errcode='22023'; end if;
  select count(*)::int,min((v->>'pricePence')::int),max((v->>'pricePence')::int)
    into active_count,minimum_price,maximum_price
    from jsonb_array_elements(payload->'variants') v where coalesce((v->>'isActive')::boolean,true);
  select count(*)::int into image_count from jsonb_array_elements_text(payload->'images') i where length(btrim(i))>0;
  if active and (image_count=0 or (price_kind<>'ask' and active_count=0)) then
    raise exception 'Published products need a photograph and a priced configuration, or an enquiry-only price type' using errcode='22023';
  end if;
  if price_kind='ask' then
    if active_count>0 then raise exception 'Enquiry-only products cannot have active priced configurations' using errcode='22023'; end if;
    base_pence:=null;
  elsif active_count>0 then
    base_pence:=minimum_price;
    if minimum_price<>maximum_price then price_kind:='from'; end if;
  end if;
  if product_key is not null then
    select slug into existing_slug from public.products where id=product_key for update;
    if existing_slug is null then raise exception 'Product not found' using errcode='P0002'; end if;
    if existing_slug<>payload->>'slug' then raise exception 'Existing product URLs cannot be changed without a redirect' using errcode='22023'; end if;
    update public.products set name=btrim(payload->>'name'),description=payload->>'description',
      category_id=category_key,category_slugs=array[category_slug],materials=array(select jsonb_array_elements_text(payload->'materials')),
      dimensions=nullif(btrim(payload->>'dimensions'),''),base_price=base_pence::numeric/100,
      price_type=price_kind,is_active=active,updated_at=now() where id=product_key;
  else
    product_key:=gen_random_uuid()::text;
    insert into public.products(id,name,slug,description,category_id,category_slugs,materials,dimensions,base_price,price_type,is_active)
      values(product_key,btrim(payload->>'name'),payload->>'slug',payload->>'description',category_key,array[category_slug],
        array(select jsonb_array_elements_text(payload->'materials')),nullif(btrim(payload->>'dimensions'),''),base_pence::numeric/100,price_kind,active);
  end if;
  update public.variants set is_active=false,updated_at=now() where product_id=product_key;
  delete from public.media_assets where product_id=product_key;
  for item in select * from jsonb_array_elements(payload->'variants') loop
    variant_key:=coalesce(nullif(item->>'id',''),gen_random_uuid()::text);
    select product_id into variant_parent from public.variants where id=variant_key;
    if variant_parent is not null and variant_parent<>product_key then
      raise exception 'Configuration belongs to another product' using errcode='22023';
    end if;
    if length(btrim(item->>'name')) not between 1 and 180 or (item->>'pricePence')::int not between 1 and 10000000 then
      raise exception 'Invalid configuration' using errcode='22023';
    end if;
    insert into public.variants(id,product_id,name,colour,colour_hex,price_pence,stock_level,is_active)
      values(variant_key,product_key,btrim(item->>'name'),item->>'colour',item->>'hex',(item->>'pricePence')::int,
        nullif(item->>'stockLevel','')::int,coalesce((item->>'isActive')::boolean,true))
      on conflict(id) do update set name=excluded.name,colour=excluded.colour,colour_hex=excluded.colour_hex,
        price_pence=excluded.price_pence,stock_level=excluded.stock_level,is_active=excluded.is_active,updated_at=now();
    if length(coalesce(item->>'image',''))>0 then
      insert into public.media_assets(product_id,variant_id,url,alt_text) values(product_key,variant_key,item->>'image',(payload->>'name')||' — '||(item->>'name'));
    end if;
  end loop;
  insert into public.media_assets(product_id,url,alt_text,display_order)
    select product_key,value,payload->>'name',(ordinality-1)::int
    from jsonb_array_elements_text(payload->'images') with ordinality;
  return product_key;
end;
$$;
revoke all on function public.save_catalogue_product(jsonb) from public,anon;
grant execute on function public.save_catalogue_product(jsonb) to authenticated;
notify pgrst,'reload schema';
