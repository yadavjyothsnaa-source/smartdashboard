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
      <div className="relative z-10 w-full flex flex-col items-center pt-32">
        <div className="w-full max-w-md mx-auto px-4 z-20 relative mb-32">
           <LoginForm />
        </div>
        <div className="w-full z-20 relative">
          <Footer />
        </div>
      </div>
    </main>
  );
}
