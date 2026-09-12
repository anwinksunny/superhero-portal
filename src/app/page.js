import Hero from "@/components/Hero";
import OriginStory from "@/components/OriginStory";
import Powers from "@/components/Powers";
import Mission from "@/components/Mission";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <OriginStory />
      <Powers />
      <Mission />
      <Footer />
      <ChatWidget />
    </main>
  );
}