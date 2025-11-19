import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  imageSrc: string;
  children: React.ReactNode;
}

export default function AuthLayout({ imageSrc, children }: AuthLayoutProps) {
  return (
    <div className="h-auto flex flex-col-reverse md:flex-row items-center justify-center p-4 md:p-0 my-20 md:my-0">
      {/* Image Section with Logo */}
      <div className="w-full md:w-1/2 relative flex justify-center">
        {/* Logo - positioned top-left over image */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <Image
            src="/images/logo.png"
            width={60}
            height={60}
            alt="Hierro a Medida Logo"
            className="w-auto h-auto"
        
          />
        </div>

        {/* Background Image */}
        <Image
          src={imageSrc}
          width={1024}
          height={1024}
          alt="Auth Background"
          className="w-full h-full   object-cover"
          priority
        />
      </div>

      {/* Form Section with Back to Home Button */}
      <div className="w-full md:w-1/2 flex flex-col items-start justify-start pl-4 md:pl-2 lg:p-32 relative">
        {/* Back to Home Button - top-right */}
        <div className="absolute top-4 right-4 md:top-4 md:right-8">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
          >
            Back to Home
          </Link>
        </div>

        {/* Form Content */}
        <div className="w-full mt-12 md:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}