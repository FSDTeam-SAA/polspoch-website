import AuthLayout from "@/components/website/Auth/AuthLayout";
import VerfityEmailOTP from "@/components/website/Auth/VerfityEmailOTP";

export default function page() {
  return (
    <div>
      <AuthLayout imageSrc="/images/Verify-OTP.jpg">
        <VerfityEmailOTP />
      </AuthLayout>
    </div>
  );
}
