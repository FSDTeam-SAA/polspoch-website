import AuthLayout from "@/components/website/Auth/AuthLayout";
import Login from "@/components/website/Auth/Login";

export default function page() {
  return (
    <AuthLayout imageSrc="/images/login.jpg">
      <Login />
    </AuthLayout>
  );
}

