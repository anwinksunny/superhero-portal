import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OriginStory from "@/components/OriginStory";
import Powers from "@/components/Powers";
import Mission from "@/components/Mission";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import LazyChatWidget from "@/components/LazyChatWidget";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Navbar />
      <Hero />
      <OriginStory />
      <Powers />
      <Mission />
      <CallToAction />
      <Footer />
      <LazyChatWidget />
    </main>
  );
}
