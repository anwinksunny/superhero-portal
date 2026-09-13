import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LazyChatWidget from "@/components/LazyChatWidget";

// Everything below the fold is split out of the initial bundle and streamed
// in as its own chunk after the hero paints. Each component keeps its own
// in-view reveal animations, so there is no visual difference — the browser
// just parses less JavaScript before first paint.
const OriginStory = dynamic(() => import("@/components/OriginStory"));
const Powers = dynamic(() => import("@/components/Powers"));
const Mission = dynamic(() => import("@/components/Mission"));
const CallToAction = dynamic(() => import("@/components/CallToAction"));

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
