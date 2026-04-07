import React from "react";

export default function LoadingSkeleton() {
   return (
    <div className="min-h-screen w-full bg-zinc-950 text-white animate-pulse">
      
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">
        <div className="h-6 w-32 bg-zinc-800 rounded" />
        <div className="hidden md:flex gap-4">
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-zinc-800 rounded" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-6 py-12 flex items-center">
        <div className="w-full flex flex-col-reverse md:flex-row items-center gap-12">
          
          {/* Left Content Skeleton */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-10 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-zinc-800 rounded" />
            <div className="h-4 w-2/3 bg-zinc-800 rounded" />
            <div className="h-11 w-44 bg-zinc-800 rounded-lg mt-6" />
          </div>

          {/* Right Image Skeleton */}
          <div className="w-full md:w-1/2">
            <div className="h-72 md:h-96 w-full bg-zinc-800 rounded-2xl" />
          </div>

        </div>
      </div>
    </div>
  );
}