import AuthLayout from "@/components/website/Auth/AuthLayout";
import ResetPassword from "@/components/website/Auth/ResetPassword";
export default function page() {
  return (
    <AuthLayout imageSrc="/images/singup.jpg">
      <ResetPassword />
    </AuthLayout>
  );
}
