import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "StudyForge AI",
  description:
    "An AI-native study planner — Week 1: Generative Core Agent.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-zinc-900 font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
