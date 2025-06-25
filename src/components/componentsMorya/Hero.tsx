'use client';

import React, { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // sound ON by default

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="p-4 md:p-10 bg-yellow-50 mt-14">
      <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden aspect-[3/2] sm:aspect-[16/9]">
        {/* External Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fynbnk.com/morya-final.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>


        {/* Overlay Text */}
        <div className="absolute bottom-4 left-4 text-white text-xl sm:text-3xl font-semibold whitespace-nowrap overflow-hidden border-r-2 border-white animate-typewriter">
          Sugam Morya
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>
    </section>
  );
};

export default Hero;
