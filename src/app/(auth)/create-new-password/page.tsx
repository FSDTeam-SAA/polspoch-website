import AuthLayout from "@/components/website/Auth/AuthLayout";
import CreateNewPassword from "@/components/website/Auth/CreateNewPassword";

export default function page() {
  return (
    <div>
      <AuthLayout imageSrc="/images/creatnew-password.jpg">
        <CreateNewPassword />
      </AuthLayout>
    </div>
  );
}
