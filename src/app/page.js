import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OriginStory from "@/components/OriginStory";
import Powers from "@/components/Powers";
import Mission from "@/components/Mission";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ImagePreloader from "@/components/ImagePreloader";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <ImagePreloader />
      <Navbar />
      <Hero />
      <OriginStory />
      <Powers />
      <Mission />
      <CallToAction />
      <Footer />
      <ChatWidget />
    </main>
  );
}