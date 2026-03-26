import Navbar from "@/components/Navbar";
import CanvasSequence from "@/components/CanvasSequence";
import ScrollStory from "@/components/ScrollStory";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-black">
      <Navbar />
      
      {/* Background Canvas fixed to screen */}
      <CanvasSequence />
      
      {/* Subtle translucent glassmorphism layer to enhance text legibility */}
      <div className="fixed inset-0 z-[5] bg-black/20 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Scrollable Content overlaying the canvas */}
      <ScrollStory />
      
      {/* Login and Footer cleanly attached to flow with transparent backgrounds */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-end w-full px-4 z-20 relative pb-8 pt-32">
           <LoginForm />
        </div>
        <div className="w-full z-20 relative mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}
