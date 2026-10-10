import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create account | Addis Eats",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
