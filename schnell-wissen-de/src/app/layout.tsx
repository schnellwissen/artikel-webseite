import type { Metadata } from "next";
import "./globals.css";
import "@/styles/fonts.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConsentProvider } from "@/contexts/ConsentContext";
import GoogleConsentBootstrap from "@/components/consent/GoogleConsentBootstrap";
import ConsentAwareScripts from "@/components/consent/ConsentAwareScripts";

// Use local fonts instead of Google Fonts for DSGVO compliance

export const metadata: Metadata = {
  title: "SchnellWissen.de - Täglich neue interessante Artikel",
  description: "Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr. Schnell informiert, fundiert erklärt.",
  keywords: ["Artikel", "Wissen", "Technologie", "Wissenschaft", "Gesundheit", "News"],
  authors: [{ name: "SchnellWissen.de Team" }],
  openGraph: {
    title: "SchnellWissen.de - Täglich neue interessante Artikel",
    description: "Deine tägliche Quelle für interessante Artikel zu Technologie, Wissenschaft, Gesundheit und vielem mehr.",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <GoogleConsentBootstrap />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <ConsentProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
          <ConsentAwareScripts />
        </ConsentProvider>
      </body>
    </html>
  );
}
