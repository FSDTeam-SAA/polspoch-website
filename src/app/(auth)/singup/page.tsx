import CreateYourAccount from "@/components/website/Auth/CreateYourAccount";
import AuthLayout from "@/components/website/Auth/AuthLayout";
export default function page() {
  return (
    <AuthLayout imageSrc="/images/singup.jpg">
      <CreateYourAccount />
    </AuthLayout>
  );
}
