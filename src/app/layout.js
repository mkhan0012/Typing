import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// --- SEO METADATA ---
export const metadata = {
  metadataBase: new URL('https://monotype-typing.vercel.app'), // REPLACE with your actual Vercel URL
  title: {
    default: "MonoType | Ultimate Aesthetic Typing Test",
    template: "%s | MonoType"
  },
  description: "Test your typing speed with MonoType. A smooth, aesthetic, and customizable typing game with WPM tracking, themes, and detailed analytics.",
  keywords: ["typing test", "wpm test", "speed typing", "keyboard practice", "typing game", "mechanical keyboard sound", "aesthetic typing"],
  authors: [{ name: "Md Moshin Khan" }],
  creator: "Md Moshin Khan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://monotype-typing.vercel.app",
    title: "MonoType | Master Your Typing Speed",
    description: "Join the most aesthetic typing practice platform. Track your WPM, accuracy, and streaks.",
    siteName: "MonoType",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonoType | Aesthetic Typing Test",
    description: "Test your typing speed in style.",
    creator: "@yourtwitterhandle", // Optional
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MonoType",
              "url": "https://monotype-typing.vercel.app",
              "description": "An aesthetic, real-time typing speed test application.",
              "applicationCategory": "Game",
              "genre": "Typing Tutor",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}