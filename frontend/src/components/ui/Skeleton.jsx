import React from 'react';
import { clsx} from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded-md', className)}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
    <div className="flex gap-4">
      <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;