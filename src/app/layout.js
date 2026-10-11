import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  // Set this to your real deployed URL so social previews resolve the image:
  // metadataBase: new URL("https://your-domain.com"),
  title: "Nurymzhan Baktygali — Almaty, Kazakhstan",
  description:
    "Final-year student at Gymnasium 27 in Almaty, applying to MBZUAI for the BSc in Artificial Intelligence (Business). School president, web developer, volunteer tutor.",
  openGraph: {
    title: "Nurymzhan Baktygali",
    description:
      "Final-year student in Almaty applying to MBZUAI for the BSc in Artificial Intelligence (Business).",
    type: "profile",
    locale: "en_US",
    images: ["/profile-photo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurymzhan Baktygali",
    description:
      "Final-year student in Almaty applying to MBZUAI for the BSc in Artificial Intelligence (Business).",
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
      <body className={`${bricolage.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
