import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { absoluteUrl, cn } from "@/lib/utils";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
}); // Font files can be colocated inside of `pages`
// const fontHeading = localFont({
//   src: "../assets/fonts/CalSans-SemiBold.woff2",
//   variable: "--font-heading",
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
          // fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}