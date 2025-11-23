"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import React from "react"

// Dummy data - replace with real API data later
const profileData = {
  name: "Olivia Rhye",
  email: "bessieedwards@gmail.com",
  phone: "+1 (555) 123-4567",
  company: "Company Name Here",
  location: "4517 Washington Ave.\nManchester, Kentucky 39495",
  id: "#1234567890",
  avatar: "/images/profile-pic.jpg", // put the real image at public/images/profile-pic.jpg
}

export function ProfileCard() {
  return (
    <Card className="overflow-hidden py-0! rounded-2xl shadow-[0_6px_18px_rgba(45,52,54,0.08)]">
      {/* top gradient header (rose/copper like screenshot) */}
      <div className="h-32 bg-linear-to-r from-rose-300 via-rose-200 to-rose-100" />

      {/* profile body */}
      <div className="relative px-8 pb-8 -mt-16">
        {/* avatar circle with white border and small edit button */}
        <div className="relative mx-auto w-max">
          <Avatar className="h-36 w-36 ring-8 ring-white shadow-xl">
            <AvatarImage
              src={profileData.avatar}
              alt={profileData.name}
            />
            <AvatarFallback className="text-lg font-semibold">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* small edit button overlapping avatar */}
          <button
            aria-label="Edit avatar"
            className="absolute -bottom-1 right-0 h-9 w-9 rounded-full bg-[#7a200e] flex items-center justify-center text-white shadow-md ring-2 ring-white"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* name / id */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-[#7a200e]">{profileData.name}</h2>
          <p className="text-xs text-gray-400 mt-1">ID: <span className="text-gray-500 font-medium">{profileData.id}</span></p>
        </div>

        {/* details list */}
        <div className="mt-6 px-2">
          <div className="space-y-5 text-sm">
            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">Name:</div>
              <div className="text-gray-500">{profileData.name}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">Email:</div>
              <div className="text-gray-500 break-word">{profileData.email}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">Phone:</div>
              <div className="text-gray-500">{profileData.phone}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">Company:</div>
              <div className="text-gray-500">{profileData.company}</div>
            </div>

            <div className="flex gap-4">
              <div className="w-28 text-right pr-2 text-sm font-medium text-gray-800">Location:</div>
              <div className="text-gray-500 whitespace-pre-line">{profileData.location}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard
