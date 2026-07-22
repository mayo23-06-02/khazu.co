"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, InputText, Textarea, Body } from "@/components/ui";
import { updateProfile } from "@/lib/listings/actions";

export function ProfileForm({
  email,
  initial,
}: {
  email: string;
  initial: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    bio: string;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const res = await updateProfile(form);
      if (!res.success) {
        setMessage({ type: "err", text: res.error || "Update failed" });
        return;
      }
      setMessage({ type: "ok", text: "Profile saved." });
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <InputText label="Email" value={email} fullWidth disabled />
      <InputText
        label="Full name"
        value={form.full_name}
        onChange={set("full_name")}
        fullWidth
        required
      />
      <InputText
        label="Phone"
        value={form.phone}
        onChange={set("phone")}
        fullWidth
      />
      <InputText
        label="Address"
        value={form.address}
        onChange={set("address")}
        fullWidth
      />
      <InputText
        label="City"
        value={form.city}
        onChange={set("city")}
        fullWidth
      />
      <Textarea
        label="Bio"
        value={form.bio}
        onChange={set("bio")}
        fullWidth
        rows={4}
      />

      {message && (
        <Body
          size="sm"
          className={
            message.type === "ok" ? "text-green-600" : "text-red-600"
          }
        >
          {message.text}
        </Body>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={pending}
        className="bg-[#a72346] hover:bg-[#8e1c3a] text-white"
      >
        Save changes
      </Button>
    </form>
  );
}
