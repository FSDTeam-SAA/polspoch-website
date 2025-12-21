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
import { Skeleton } from "@/components/ui/skeleton";

const emptyForm: FormDataType = {
  gender: "female",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
  address: "",
  location: "",
  postalCode: "",
  photo: null,
  companyName: "",
};

/* 🔥 Skeleton Component */
function PersonalInformationFormSkeleton() {
  return (
    <Card className="rounded-2xl p-6 space-y-6">
      <CardHeader className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gender */}
        <div className="flex gap-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full md:col-span-2" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PersonalInformationForm() {
  const { data: session } = useSession();
  const accessToken = (session as any)?.accessToken || "";

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfile();

  const updateProfileMutation = useUpdateProfile(accessToken);

  const [formData, setFormData] = useState<FormDataType>(emptyForm);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  console.log(formData);

  // useEffect(() => {
  //   if (profile) {
  //     startTransition(() => {
  //       setFormData({
  //         gender: (profile as any).gender ?? "female",
  //         firstName: profile.firstName ?? "",
  //         lastName: profile.lastName ?? "",
  //         email: profile.email ?? "",
  //         phone: (profile as any).phoneNum ?? "",
  //         bio: (profile as any).bio ?? "",
  //         address: (profile as any).address ?? "",
  //         location: (profile as any).location ?? "",
  //         postalCode: (profile as any).postalCode ?? "",
  //         photo: (profile as any).image ?? null,
  //       });
  //       setHasChanges(false);
  //     });
  //   }
  // }, [profile]);

  useEffect(() => {
    if (profile) {
      startTransition(() => {
        setFormData({
          gender: profile.gender ?? "female",
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "", // ✔ FIXED
          bio: profile.bio ?? "", // if exists
          address: profile.street ?? "", // ✔ FIXED
          location: profile.location ?? "",
          postalCode: profile.postalCode ?? "",
          photo: profile.image?.url ?? null,
          companyName: profile.companyName ?? "",
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
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setHasChanges(false);
      },
    });
  };

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        gender: (profile as any).gender ?? "female",
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phone: (profile as any).phone ?? "",
        bio: (profile as any).bio ?? "",
        address: (profile as any).address ?? "",
        location: (profile as any).location ?? "",
        postalCode: (profile as any).postalCode ?? "",
        photo: (profile as any).image ?? null,
        companyName: (profile as any).companyName ?? "",
      });
    } else {
      setFormData(emptyForm);
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  /* 🔥 Return Skeleton Instead of Loader */
  if (profileLoading) {
    return <PersonalInformationFormSkeleton />;
  }

  if (profileError) {
    return (
      <Card className="rounded-2xl p-6">
        <div className="text-red-600">Failed to load profile.</div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      {/* Header */}
      <CardHeader className="flex items-start justify-between space-y-0 pb-6">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900">
            Personal Information
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and profile details.
          </p>
        </div>

        <div className="ml-4">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#7a200e] hover:bg-[#6a1a0f] text-white shadow-sm px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 text-[#7a200e] bg-orange-50 rounded-md border border-orange-100 animate-pulse font-medium text-sm">
              <Pencil className="w-4 h-4" />
              Editing Mode
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gender */}
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          className="flex items-center gap-6"
          disabled={!isEditing}
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

        {/* All Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing || true} // Email usually disabled as it's the primary key/identity
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-2">
            <Label>Company Name</Label>
            <Input
              value={formData.companyName || ""} // ✔ FIXED
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={updateProfileMutation.status === "pending"}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !hasChanges || updateProfileMutation.status === "pending"
              }
              className="bg-[#7a200e] hover:bg-[#6a1a0f] text-white"
            >
              {updateProfileMutation.status === "pending"
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PersonalInformationForm;
