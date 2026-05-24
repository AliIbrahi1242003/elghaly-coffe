"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')",
        }}
      >
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#321a12]/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center text-white mt-16">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          Experience the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Perfect Cup</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-200 font-light"
        >
          Premium coffee beans sourced from the finest farms. Roasted to
          perfection for your daily delight.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/shop"
            className="group relative px-8 py-4 bg-primary text-white rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(0,147,67,0.3)] hover:shadow-[0_0_60px_rgba(0,147,67,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="relative z-10">Shop Now</span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-green-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
