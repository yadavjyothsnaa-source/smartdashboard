"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

const FRAME_COUNT = 240;

const CanvasSequence = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const { scrollYProgress } = useScroll();

  // Map scroll progress (0 to 1) to frame index (1 to 240)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

  // Track loaded count via state to force render for debugger
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const currentFrame = Math.round(frameIndex.get()) - 1;
      const safeIndex = Math.max(0, Math.min(currentFrame, FRAME_COUNT - 1));
      const img = images[safeIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        // Clear canvas with base background color
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image covering the canvas
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [images, frameIndex]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Using devicePixelRatio for high-res screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sticky top-0 h-screen w-full bg-[#050505] overflow-hidden -z-10">
      <div className="absolute top-20 left-4 z-50 text-white bg-black/50 p-2 font-mono text-sm border border-white/20">
        Debug: Loaded {loadedCount} / {FRAME_COUNT} frames
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      {/* Fallback gradient behind canvas just in case */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#050815_0%,_#050505_100%)] opacity-50 -z-10"></div>
    </div>
  );
};

export default CanvasSequence;
