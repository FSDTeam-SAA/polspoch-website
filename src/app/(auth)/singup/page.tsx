import CreateYourAccount from "@/components/website/Auth/CreateYourAccount";
import AuthLayout from "@/components/website/Auth/AuthLayout"; // Import the new component

export default function page() {
  return (
    <AuthLayout imageSrc="/images/singup.jpg"> 
      <CreateYourAccount />
    </AuthLayout>
  );
}

// import CreateYourAccount from "@/components/website/Auth/CreateYourAccount";

// export default function page() {
//   return (
//     <div>
//       <CreateYourAccount />
//     </div>
//   );
// }
