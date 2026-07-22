import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Heading1, Body, Card } from "@/components/ui";
import { ProfileForm } from "@/components/khazu/ProfileForm";

export default async function PersonalProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/personal/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, address, city, bio, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <Container className="py-8 max-w-2xl">
      <div className="mb-8">
        <Heading1>Profile</Heading1>
        <Body muted>Update how buyers see you on Khazu.</Body>
      </div>

      <Card padding="lg" className="bg-white border-gray-100">
        <ProfileForm
          email={user.email ?? ""}
          initial={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            address: profile?.address ?? "",
            city: profile?.city ?? "",
            bio: profile?.bio ?? "",
          }}
        />
      </Card>
    </Container>
  );
}
