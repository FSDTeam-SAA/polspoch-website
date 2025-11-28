"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useUpdateProfileImage } from "@/lib/hooks/useUpdateProfileImage";
import { useUserProfile } from "@/lib/hooks/useSserProfile";
import { Skeleton } from "@/components/ui/skeleton";

// ⭐ SKELETON COMPONENT
function ProfileCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0! rounded-2xl shadow-[0_6px_18px_rgba(45,52,54,0.08)] animate-pulse">
      {/* Top Banner */}
      <div className="h-32 w-full bg-liner-to-r from-gray-200 to-gray-100" />

      <div className="relative px-8 pb-8 -mt-16">
        <div className="relative mx-auto w-max">
          {/* Avatar Skeleton */}
          <Skeleton className="h-36 w-36 rounded-full ring-8 ring-white shadow-xl" />

          {/* Edit Button Skeleton */}
          <Skeleton className="absolute -bottom-1 right-0 h-9 w-9 rounded-full bg-gray-300 ring-2 ring-white" />
        </div>

        <div className="text-center mt-4 space-y-2">
          <Skeleton className="h-6 w-40 mx-auto" />
        </div>

        {/* Info Rows */}
        <div className="mt-6 px-2 space-y-5">
          {[...Array(4)].map((_, i) => (
            <div className="flex gap-4" key={i}>
              <Skeleton className="w-28 h-5 rounded-md" />
              <Skeleton className="flex-1 h-5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ProfileCard() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = (session as any)?.accessToken || "";

  const { data: profile, isLoading } = useUserProfile();
  const updateImageMutation = useUpdateProfileImage(token);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(profile)
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEditAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));

      updateImageMutation.mutate(file, {
        onSuccess: () => {
          setPreviewImage(null);
        },
      });
    }
  };

  // ⭐ Replace loading with skeleton
  if (isLoading || !profile) return <ProfileCardSkeleton />;

  return (
    <Card className="overflow-hidden py-0! rounded-2xl shadow-[0_6px_18px_rgba(45,52,54,0.08)]">
      <div className="h-32 bg-linear-to-r from-rose-300 via-rose-200 to-rose-100" />

      <div className="relative px-8 pb-8 -mt-16">
        <div className="relative mx-auto w-max">
          <Avatar className="h-36 w-36 ring-8 ring-white shadow-xl">
            <AvatarImage
              src={previewImage || profile.image?.url || ""}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-semibold">
              {`${profile.firstName[0] || ""}${profile.lastName[0] || ""}`}
            </AvatarFallback>
          </Avatar>

          <button
            aria-label="Edit avatar"
            onClick={handleEditAvatar}
            className="absolute -bottom-1 right-0 cursor-pointer h-9 w-9 rounded-full bg-[#7a200e] flex items-center justify-center text-white shadow-md ring-2 ring-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-[#7a200e]">
            {profile.firstName} {profile.lastName}
          </h2>
        </div>

        <div className="mt-6 px-2">
          <div className="space-y-5 text-sm">
            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">
                Email:
              </div>
              <div className="text-gray-500 break-word">{profile.email}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">
                Phone:
              </div>
              <div className="text-gray-500">{profile.phone || "-"}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">
                Company:
              </div>
              <div className="text-gray-500">{profile.companyName || "-"}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">
                Location:
              </div>
              <div className="text-gray-500 whitespace-pre-line">
                {profile.location || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;
