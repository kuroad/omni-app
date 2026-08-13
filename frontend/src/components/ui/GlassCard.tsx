'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  tiltOnHover?: boolean;
}

export function GlassCard({ children, className, tiltOnHover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={tiltOnHover ? { scale: 1.02, rotateX: 2, rotateY: 2 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        "glass-panel p-6 relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Optional: Add a subtle inner glow or background accent here if needed */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
