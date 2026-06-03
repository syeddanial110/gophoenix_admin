import { Geist, Geist_Mono } from "next/font/google";
import logo from "../../assets/Images/logo2.png";
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
             <div className="flex justify-center mb-4 sm:mb-6">
              <Image src={logo} alt="logo" height={300} width={300} className="w-28 sm:w-40 lg:w-[200px] h-auto" />
            </div>
            </div>
            <div className="bg-card border border-border rounded-lg shadow-sm p-8">
              {children}
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Phoenix Sports. All rights
              reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
