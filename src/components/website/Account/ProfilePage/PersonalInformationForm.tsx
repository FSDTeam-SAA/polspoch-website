// path: app/components/PersonalInformationForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil } from "lucide-react";
import { Loader2 } from "lucide-react";
import { startTransition } from "react";
import { FormDataType } from "@/lib/types/profile";
import { useUpdateProfile } from "@/lib/hooks/useUpdateProfile";
import { useUserProfile } from "@/lib/hooks/useSserProfile";

const emptyForm: FormDataType = {
  gender: "female",
  firstName: "",
  lastName: "",
  email: "",
  phoneNum: "",
  bio: "",
  address: "",
  location: "",
  postCode: "",
  photo: null,
};

export function PersonalInformationForm() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken || "";

  // fetch profile from API
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfile();

  // mutation hook (handles toast + invalidation internally)
  const updateProfileMutation = useUpdateProfile(accessToken);

  const [formData, setFormData] = useState<FormDataType>(emptyForm);
  const [hasChanges, setHasChanges] = useState(false);

  // when profile arrives, populate form (one-time)
  useEffect(() => {
    if (profile) {
      startTransition(() => {
        setFormData({
          gender: (profile as any).gender ?? "female",
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          phoneNum: (profile as any).phoneNum ?? "",
          bio: (profile as any).bio ?? "",
          address: (profile as any).address ?? "",
          location: (profile as any).location ?? "",
          postCode: (profile as any).postCode ?? "",
          photo: (profile as any).image ?? null,
        });
        setHasChanges(false);
      });
    }
  }, [profile]);

  const handleInputChange = (
    field: keyof FormDataType,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Optionally, you can validate here before mutate
    updateProfileMutation.mutate(formData);
  };

  const handleDiscard = () => {
    if (profile) {
      // reset to profile values
      setFormData({
        gender: (profile as any).gender ?? "female",
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phoneNum: (profile as any).phoneNum ?? "",
        bio: (profile as any).bio ?? "",
        address: (profile as any).address ?? "",
        location: (profile as any).location ?? "",
        postCode: (profile as any).postCode ?? "",
        photo: (profile as any).image ?? null,
      });
    } else {
      // no profile — reset to empty
      setFormData(emptyForm);
    }
    setHasChanges(false);
  };

  if (profileLoading) {
    return (
      <Card className="rounded-2xl border-none! p-6 flex items-center justify-center">
        <Loader2 className="animate-spin" />
        <span className="ml-3">Loading profile...</span>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card className="rounded-2xl border-none! p-6">
        <div className="text-red-600">Failed to load profile.</div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-none! ">
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

        {/* Edit Profile button */}
        <div className="ml-4">
          <Button
            className="bg-[#7a200e] hover:bg-[#6a1a0f] text-white shadow-sm px-4 py-2 rounded-md flex items-center gap-2"
            onClick={() => {
              /* optional: toggle edit-only mode */
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
              value={(formData as any).company || "Company Name Here"}
              onChange={
                (e) => handleInputChange("bio", e.target.value) // placeholder mapping
              }
              className="w-full"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Location
            </Label>
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
            {updateProfileMutation.status === "pending"
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalInformationForm;
