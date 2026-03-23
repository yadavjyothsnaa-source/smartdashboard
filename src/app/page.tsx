import Navbar from "@/components/Navbar";
import CanvasSequence from "@/components/CanvasSequence";
import ScrollStory from "@/components/ScrollStory";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full">
      <Navbar />
      <CanvasSequence />
      <ScrollStory />
      
      {/* Static Footer Section with Login Form */}
      <div className="relative z-20 bg-[#050505] flex flex-col items-center pt-32 shadow-[0_-20px_50px_rgba(5,5,5,1)]">
        <LoginForm />
        <div className="mt-20 w-full">
          <Footer />
        </div>
      </div>
    </main>
  );
}
