import React from "react";

// Easily adjust width/height for various skeletons!
export function Skeleton({ className = "" }) {
  return (
    <div className={`bg-gradient-to-r from-zinc-800 via-zinc-700/20 to-zinc-800 rounded-md animate-pulse ${className}`}>
      {/* Empty—just for visual shimmer */}
    </div>
  );
}

// Main skeleton screen: Example for a card grid or list—customize for your UI!
export default function SkeletonLoader() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-8 items-center justify-center bg-black">
      {/* Example: mimic a title */}
      <Skeleton className="w-1/2 h-8 mb-8" />
      {/* Example: mimic cards (e.g., dashboard grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-4/5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className='p-6 rounded-xl bg-zinc-950 flex flex-col gap-3 shadow-lg'>
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-3/4 h-10 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
