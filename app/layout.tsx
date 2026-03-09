import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Pokémon Team Builder",
  description: "Create Pokémon Team!",
  icons: {
    icon: "/pokeball.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} antialiased bg-zinc-100`}
      >
        <div className="mx-auto w-full max-w-[425px] min-w-[425px] min-h-[4000px] bg-white shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
