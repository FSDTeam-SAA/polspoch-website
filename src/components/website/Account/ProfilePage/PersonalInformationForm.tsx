// "use client";

// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import { Crown } from "lucide-react";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";

// type FormDataType = {
//   gender: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNum: string;
//   bio: string;
//   address: string;
//   location: string;
//   postCode: string;
//   photo: File | string | null;
// };

// const initialFormData: FormDataType = {
//   gender: "female",
//   firstName: "Olivia",
//   lastName: "Rhye",
//   email: "bessieedwards@gmail.com",
//   phoneNum: "+1 (555) 123-4567",
//   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   address: "1234 Oak Avenue, San Francisco, CA 94102A",
//   location: "Florida, USA",
//   postCode: "30301",
//   photo: null,
// };

// const updateUserProfile = async (
//   userData: FormDataType,
//   accessToken: string
// ) => {
//   if (!accessToken) throw new Error("Session expired. Please login again.");

//   const formData = new FormData();
//   formData.append("firstName", userData.firstName);
//   formData.append("lastName", userData.lastName);
//   formData.append("email", userData.email);
//   formData.append("phoneNum", userData.phoneNum);
//   formData.append("bio", userData.bio);
//   formData.append("address", userData.address);
//   formData.append("location", userData.location);
//   formData.append("postCode", userData.postCode);
//   if (userData.photo instanceof File) {
//     formData.append("photo", userData.photo);
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
//     {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     if (response.status === 401)
//       throw new Error("Session expired. Please login again.");
//     throw new Error("Failed to update profile");
//   }

//   return response.json();
// };

// export function PersonalInformationForm() {
//   const [formData, setFormData] = useState<FormDataType>(initialFormData);
//   const [hasChanges, setHasChanges] = useState(false);
//   const queryClient = useQueryClient();
//   const { data: session } = useSession();

//   const updateProfileMutation = useMutation({
//     //eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mutationFn: () => updateUserProfile(formData, (session as any)?.accessToken || ""),
//     onSuccess: (data) => {
//       toast.success("Profile updated successfully!",data);
//       setHasChanges(false);
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//     },
//     onError: (error: unknown) => {
//       const msg =
//         error instanceof Error ? error.message : "Failed to update profile";
//       toast.error(msg);
//     },
//   });

//   const handleInputChange = (
//     field: keyof FormDataType,
//     value: string | File | null
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setHasChanges(true);
//   };

//   const handleSave = () => updateProfileMutation.mutate();
//   const handleDiscard = () => {
//     setFormData(initialFormData);
//     setHasChanges(false);
//   };

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900">
//             Personal Information
//           </h3>
//           <p className="text-sm text-gray-600">
//             Manage your personal information and profile details.
//           </p>
//         </div>
//         <Badge
//           variant="secondary"
//           className="bg-green-100 text-green-700 hover:bg-green-100"
//         >
//           <Crown className="mr-1 h-3 w-3" />
//           Subscribed
//         </Badge>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Gender */}
//         <RadioGroup
//           value={formData.gender}
//           onValueChange={(value) => handleInputChange("gender", value)}
//           className="flex gap-6"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="male" id="male" />
//             <Label htmlFor="male">Male</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="female" id="female" />
//             <Label htmlFor="female">Female</Label>
//           </div>
//         </RadioGroup>

//         {/* Text Inputs */}
//         {[
//           "firstName",
//           "lastName",
//           "email",
//           "phoneNum",
//           "bio",
//           "address",
//           "location",
//           "postCode",
//         ].map((field) => (
//           <div key={field} className="space-y-2">
//             <Label className="capitalize text-sm font-medium text-gray-700">
//               {field}
//             </Label>
//             <Input
//               type={field === "email" ? "email" : "text"}
//               value={formData[field as keyof FormDataType] as string}
//               onChange={(e) =>
//                 handleInputChange(field as keyof FormDataType, e.target.value)
//               }
//               className="w-full"
//             />
//           </div>
//         ))}

//         {/* Photo Upload */}
//         <div className="space-y-2">
//           <Label className="text-sm font-medium text-gray-700">
//             Profile Photo
//           </Label>
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) =>
//               handleInputChange("photo", e.target.files?.[0] || null)
//             }
//           />
//           {formData.photo instanceof File && (
//             <p className="text-xs text-gray-500">
//               Selected: {formData.photo.name}
//             </p>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 pt-4">
//           <Button
//             variant="outline"
//             onClick={handleDiscard}
//             disabled={!hasChanges}
//           >
//             Discard Changes
//           </Button>
//           <Button
//             onClick={handleSave}
//             disabled={!hasChanges || updateProfileMutation.isPending}
//           >
//             {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type FormDataType = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  bio: string;
  address: string;
  location: string;
  postCode: string;
  photo: File | string | null;
};

const initialFormData: FormDataType = {
  gender: "female",
  firstName: "Olivia",
  lastName: "Rhye",
  email: "bessieedwards@gmail.com",
  phoneNum: "+1 (555) 123-4567",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  address: "1234 Oak Avenue, San Francisco, CA 94102A",
  location: "Florida, USA",
  postCode: "30301",
  photo: null,
};

const updateUserProfile = async (
  userData: FormDataType,
  accessToken: string
) => {
  if (!accessToken) throw new Error("Session expired. Please login again.");

  const formData = new FormData();
  formData.append("firstName", userData.firstName);
  formData.append("lastName", userData.lastName);
  formData.append("email", userData.email);
  formData.append("phoneNum", userData.phoneNum);
  formData.append("bio", userData.bio);
  formData.append("address", userData.address);
  formData.append("location", userData.location);
  formData.append("postCode", userData.postCode);
  if (userData.photo instanceof File) {
    formData.append("photo", userData.photo);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Session expired. Please login again.");
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export function PersonalInformationForm() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const updateProfileMutation = useMutation({
    mutationFn: () =>
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateUserProfile(formData, (session as any)?.accessToken || ""),
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(msg);
    },
  });

  const handleInputChange = (
    field: keyof FormDataType,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => updateProfileMutation.mutate();
  const handleDiscard = () => {
    setFormData(initialFormData);
    setHasChanges(false);
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      {/* Header: title + subtitle + Edit Profile button aligned right */}
      <CardHeader className="flex items-start justify-between space-y-0 pb-6">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            Personal Information
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and profile details.
          </p>
        </div>

        {/* Edit Profile button (matches screenshot style) */}
        <div className="ml-4">
          <Button
            className="bg-[#7a200e] hover:bg-[#6a1a0f] text-white shadow-sm px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => {
              /* optional: open edit mode */
              toast("Edit profile clicked");
            }}
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gender radio group */}
        <div>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex items-center gap-6"
          >
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioGroupItem value="male" id="male" />
              Male
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <RadioGroupItem value="female" id="female" />
              Female
            </label>
          </RadioGroup>
        </div>

        {/* Grid for inputs - 2 columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              value={formData.phoneNum}
              onChange={(e) => handleInputChange("phoneNum", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Company Name - full width across both columns */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Company Name
            </Label>
            <Input
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
              value={(formData as any).company || "Company Name Here"}
              onChange={(e) =>
                // keep compatibility; if your FormDataType had company, replace properly
                handleInputChange("bio", e.target.value) // placeholder mapping
              }
              className="w-full"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Post Code */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Postal Code
            </Label>
            <Input
              value={formData.postCode}
              onChange={(e) => handleInputChange("postCode", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Photo upload (keeps existing behavior) */}
        {/* <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Profile Photo
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleInputChange("photo", e.target.files?.[0] || null)
            }
            className="w-full"
          />
          {formData.photo instanceof File && (
            <p className="text-xs text-gray-500">
              Selected: {formData.photo.name}
            </p>
          )}
        </div> */}

        {/* Buttons row (aligned to the right) */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={!hasChanges}
            className="px-6 py-2 rounded-md"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfileMutation.status === "pending"}
            className="px-6 py-2 rounded-md bg-[#7a200e] hover:bg-[#6a1a0f] text-white"
          >
            {updateProfileMutation.status === "pending" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalInformationForm;
