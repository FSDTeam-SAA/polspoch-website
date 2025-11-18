// import ProfileCard from '@/components/website/Account/Profile-Common/ProfileCard'
// import { PersonalInformationForm } from '@/components/website/Account/ProfilePage/PersonalInformationForm'
// import React from 'react'

// const page = () => {
//   return (
//    <div className="flex flex-col lg:flex-row gap-5 p-5">
//      {/* Profile Card */}
//           <div className="w-full lg:w-1/3">
//             <ProfileCard />
//           </div>
//           {/* ChangePassword Form */}
//         <div className="w-full lg:w-2/3">
//         <PersonalInformationForm />
//         </div>
//     </div>
//   )
// }

// export default page

// app/(your-route)/page.tsx   (or wherever your page lives)
import React from "react";
import ProfileCard from "@/components/website/Account/Profile-Common/ProfileCard";
import { PersonalInformationForm } from "@/components/website/Account/ProfilePage/PersonalInformationForm";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#fbf8f5]">
      {/* center container same width as screenshot */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Optional page header (title + small nav under navbar area) */}
        

        {/* Grid: left profile column + right form column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column: takes 4/12 (≈1/3) on large screens */}
          <aside className="lg:col-span-4">
            {/* keep the visual card container here in case ProfileCard is unstyled */}
            <div className="bg-white rounded-2xl shadow-sm border border-transparent hover:shadow-md transition p-0">
              {/* if ProfileCard already includes its own white card wrapper, remove the wrapper div */}
              <ProfileCard />
            </div>
          </aside>

          {/* Right column: takes 8/12 (≈2/3) on large screens */}
          <main className="lg:col-span-8">
            {/* Outer card for the personal info form to match screenshot */}
            <div className="bg-white rounded-2xl shadow-sm border border-transparent hover:shadow-md transition p-8">
              {/* If your form component already renders the card container, you can pass a prop
                  or remove this wrapper and let the form handle the look. */}
              <PersonalInformationForm />
            </div>

            {/* action buttons area alignment (if form doesn't render them) */}
            {/* If your form renders the Save/Discard buttons, remove this block */}
            {/* <div className="mt-6 flex justify-end gap-4">
              <button className="py-2 px-4 rounded-md border border-gray-300">Discard Changes</button>
              <button className="py-2 px-6 rounded-md bg-[#7a200e] text-white">Save Changes</button>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
