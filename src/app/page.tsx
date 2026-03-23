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
      
      {/* Scrollable Content overlaying the canvas */}
      <ScrollStory />
      
      {/* Login and Footer cleanly attached to flow with transparent backgrounds */}
      <div className="relative z-10 w-full min-h-screen flex flex-col pt-20">
        <div className="flex-1 flex flex-col items-center justify-end w-full px-4 z-20 relative pb-24">
           <LoginForm />
        </div>
        <div className="w-full z-20 relative mt-auto">
          <Footer />
        </div>
      </div>
    </main>
  );
}
