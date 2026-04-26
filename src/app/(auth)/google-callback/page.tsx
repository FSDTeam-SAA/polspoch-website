import { Suspense } from "react";
import GoogleCallback from "@/components/website/Auth/GoogleAuth";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <GoogleCallback />
      </Suspense>
    </div>
  );
}