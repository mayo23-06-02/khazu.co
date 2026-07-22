import { RegisterWizard } from "@/components/auth/register/RegisterWizard";

export const metadata = {
  title: "Create account | Khazu",
  description: "Register as an individual seller or dealership on Khazu.",
};

export default function RegisterPage() {
  return <RegisterWizard />;
}
