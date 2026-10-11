import { Bricolage_Grotesque, Fraunces, Newsreader } from "next/font/google";
import "./globals.css";

// Fraunces sets the name and the headings, Newsreader sets the
// prose and every italic, Bricolage Grotesque sets the chrome.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const BLURB =
  "Foundation Year student at Nazarbayev University and a member of its Student Council. " +
  "Altyn Belgi graduate of Gymnasium 27 in Almaty, SAT 1530, applying to MBZUAI for the " +
  "BSc in Artificial Intelligence (Business).";

export const metadata = {
  // Set this to your real deployed URL so social previews resolve the image:
  // metadataBase: new URL("https://your-domain.com"),
  title: "Nurymzhan Baktygali — Astana and Almaty, Kazakhstan",
  description: BLURB,
  openGraph: {
    title: "Nurymzhan Baktygali",
    description: BLURB,
    type: "profile",
    locale: "en_US",
    images: ["/profile-photo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurymzhan Baktygali",
    description: BLURB,
    images: ["/profile-photo.jpg"],
  },
};

export const viewport = {
  themeColor: "#E9EDEC",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${bricolage.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
