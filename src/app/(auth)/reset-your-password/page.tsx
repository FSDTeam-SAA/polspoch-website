import AuthLayout from "@/components/website/Auth/AuthLayout";
import ResetYourPassword from "@/components/website/Auth/ResetYourPassword";

export default function page() {
  return (
    <div>
      <AuthLayout imageSrc="/images/reset-password.jpg">
        <ResetYourPassword />
      </AuthLayout>
    </div>
  );
}
