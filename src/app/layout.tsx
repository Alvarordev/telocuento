import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./common/header";
import Footer from "./common/footer";
import { montserrat } from "@/lib/font";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "width=device-width, initial-scale=1.0",
  themeColor: "#6B46C1",
}

export const metadata: Metadata = {
  title: {
    default: "TelosCuento - Encuentra tu telo ideal en Lima",
    template: "%s | TelosCuento", 
  },
  description: "Descubre los mejores telos y hostales por horas en Lima. Tu guía definitiva de hospedaje por horas en Lince, Miraflores y más distritos.",
  keywords: [
    "telos Lima",
    "hoteles por horas Lima",
    "hostales por horas",
    "alojamiento íntimo Lima",
    "habitaciones por horas",
    "encuentros Lima",
    "privacidad Lima",
    "ofertas telos",
    "telos en Lince",
    "telos en Miraflores",
    "telos en San Isidro",
    "moteles Lima",
    "telos en lima"
  ],
  metadataBase: new URL('https://teloscuento.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TelosCuento - Encuentra tu espacio ideal en Lima",
    description: "Descubre los mejores telos y hostales por horas en Lima. Tu guía definitiva de hospedaje por horas en Lince, Miraflores y más distritos.",
    url: "/", 
    siteName: "TelosCuento",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "TelosCuento - Encuentra tu espacio ideal en Lima",
      },
    ],
    locale: "es_PE", 
    type: "website",
  },
  icons: {
    icon: '/teloscuento.ico',
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} antialiased`}
      >
        <div className="w-full h-screen flex flex-col relative">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
