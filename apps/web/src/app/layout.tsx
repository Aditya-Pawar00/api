import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedCore — Next-Gen Patient & Clinical OS",
  description: "Enterprise Health Management System built with NestJS & PostgreSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
            background-color: #060911 !important;
            color: #f1f5f9 !important;
          }
        `}} />
      </head>
      <body className="bg-[#060911] text-slate-100 antialiased selection:bg-teal-400 selection:text-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
