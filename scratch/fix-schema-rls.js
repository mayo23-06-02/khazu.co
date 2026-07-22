const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "supabase", "schema.sql");
let t = fs.readFileSync(file, "utf8");

const oldBlock = `drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );`;

const newBlock = `-- Admin check without recursive RLS (subquery on profiles would recurse)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());`;

const oldNorm = oldBlock.replace(/\r\n/g, "\n");
const tNorm = t.replace(/\r\n/g, "\n");

if (!tNorm.includes(oldNorm)) {
  console.error("profiles_admin_all block not found");
  process.exit(1);
}

let next = tNorm.replace(oldNorm, newBlock);

// storage admin policy that also subqueries profiles
next = next.replace(
  /and exists \(\s*select 1 from public\.profiles p\s*where p\.id = auth\.uid\(\) and p\.role = 'admin'\s*\)/g,
  "and public.is_admin()",
);

fs.writeFileSync(file, next, "utf8");
console.log("schema.sql updated");
