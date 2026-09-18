"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading1,
  Body,
  Card,
  CardBody,
  InputText,
  Select,
  Badge,
  DataTable,
  PaginationControls,
  EmptyState,
  BulkActionBar,
} from "@/components/ui";
import { UserStatusToggle } from "@/components/ui/Admin/UserStatusToggle/UserStatusToggle";
import { FaUsers } from "react-icons/fa6";
import type { AdminUserRow, PaginatedResult } from "@/types/dashboard";
import { suspendUser, reactivateUser } from "@/lib/dashboard/adminActions";

function buildQuery(params: Record<string, string>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) usp.set(k, v);
  });
  const qs = usp.toString();
  return qs ? `/dashboard/admin/users?${qs}` : "/dashboard/admin/users";
}

export function AdminUsersView({
  result,
  search,
  role,
  status,
}: {
  result: PaginatedResult<AdminUserRow>;
  search: string;
  role: string;
  status: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const navigate = (overrides: Record<string, string>) => {
    router.push(buildQuery({ search: searchInput, role, status, page: "1", ...overrides }));
  };

  const toggle = (id: string, active: boolean) => {
    startTransition(async () => {
      await (active ? reactivateUser(id) : suspendUser(id));
      router.refresh();
    });
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Users</Heading1>
        <Body muted>Manage every account on Khazu.</Body>
      </div>

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-line">
          <form
            className="flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({});
            }}
          >
            <InputText
              placeholder="Search by name or business…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              fullWidth
            />
          </form>
          <Select
            value={role}
            onChange={(e) => navigate({ role: e.target.value })}
            options={[
              { value: "", label: "All roles" },
              { value: "individual", label: "Personal" },
              { value: "dealer", label: "Dealer" },
              { value: "admin", label: "Admin" },
            ]}
            className="sm:max-w-[160px]"
          />
          <Select
            value={status}
            onChange={(e) => navigate({ status: e.target.value })}
            options={[
              { value: "", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
            ]}
            className="sm:max-w-[160px]"
          />
        </div>

        <BulkActionBar
          selectedCount={selected.size}
          actions={[
            {
              label: "Suspend selected",
              variant: "danger",
              onClick: () =>
                startTransition(async () => {
                  await Promise.all(Array.from(selected).map((id) => suspendUser(id)));
                  setSelected(new Set());
                  router.refresh();
                }),
            },
          ]}
        />

        {result.rows.length === 0 ? (
          <EmptyState
            icon={<FaUsers size={18} />}
            title="No users found"
            description="Try a different search or filter."
          />
        ) : (
          <DataTable
            data={result.rows}
            columns={[
              {
                key: "select",
                label: "",
                render: (u) => (
                  <input
                    type="checkbox"
                    checked={selected.has(u.id)}
                    onChange={() => toggleSelected(u.id)}
                  />
                ),
              },
              {
                key: "fullName",
                label: "Name",
                render: (u) => (
                  <div>
                    <p className="font-semibold text-ink">{u.fullName}</p>
                    {u.businessName && (
                      <p className="text-xs text-muted">{u.businessName}</p>
                    )}
                  </div>
                ),
              },
              {
                key: "role",
                label: "Role",
                render: (u) => (
                  <Badge variant={u.role === "admin" ? "primary" : u.role === "dealer" ? "info" : "secondary"}>
                    {u.role}
                  </Badge>
                ),
              },
              {
                key: "accountStatus",
                label: "Status",
                render: (u) => (
                  <UserStatusToggle
                    isActive={u.accountStatus === "active"}
                    onToggle={(active) => toggle(u.id, active)}
                    label={u.accountStatus === "active" ? "Active" : "Suspended"}
                  />
                ),
              },
              {
                key: "createdAt",
                label: "Joined",
                render: (u) => new Date(u.createdAt).toLocaleDateString(),
              },
            ]}
          />
        )}

        <div className="p-4 border-t border-line flex justify-center">
          <PaginationControls
            currentPage={result.page}
            totalPages={result.totalPages}
            onPageChange={(p) => navigate({ page: String(p) })}
          />
        </div>
      </Card>
    </Container>
  );
}
