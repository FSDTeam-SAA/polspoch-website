import AuthLayout from "@/components/website/Auth/AuthLayout";
import VerifyOTP from "@/components/website/Auth/VerifyOTP";

export default function page() {
  return (
    <div>
      <AuthLayout imageSrc="/images/singup.jpg">
        <VerifyOTP />
      </AuthLayout>
    </div>
  );
}
