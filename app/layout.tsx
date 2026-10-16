import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const title = "Cobble: edit your videos in minutes";
const description =
  "Cobble learns your style and edits the way you would. No more wasting time on editing. A native iPhone editor for short-form video. Join the waitlist.";

const previewImage = {
  url: "/og-preview.jpg",
  width: 1200,
  height: 630,
  alt: "Cobble logo",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cobble.video"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Cobble",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolageGrotesque.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <script
          dangerouslySetInnerHTML={{
            __html: '(function(){var d=document.documentElement;d.classList.add("js");if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)){d.classList.add("intro-pending")}})()',
          }}
        />
        {children}
      </body>
    </html>
  );
}
