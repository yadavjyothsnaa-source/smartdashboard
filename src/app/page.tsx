import Navbar from "@/components/Navbar";
import CanvasSequence from "@/components/CanvasSequence";
import ScrollStory from "@/components/ScrollStory";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505]">
      <Navbar />
      <CanvasSequence />
      <ScrollStory />
    </main>
  );
}
