import * as React from 'react';
import { cn } from '@/lib/utils';

export type ElementType = 'Physical' | 'Fire' | 'Ice' | 'Lightning' | 'Wind' | 'Quantum' | 'Imaginary';

interface BadgeElementProps extends React.HTMLAttributes<HTMLSpanElement> {
  element: ElementType;
}

const elementColors: Record<ElementType, string> = {
  Physical: 'bg-hsr-physical text-black',
  Fire: 'bg-hsr-fire text-white',
  Ice: 'bg-hsr-ice text-black',
  Lightning: 'bg-hsr-lightning text-white',
  Wind: 'bg-hsr-wind text-black',
  Quantum: 'bg-hsr-quantum text-white',
  Imaginary: 'bg-hsr-imaginary text-black',
};

export function BadgeElement({ element, className, ...props }: BadgeElementProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-bold rounded-md shadow-sm uppercase tracking-wider inline-flex items-center justify-center",
        elementColors[element] || 'bg-gray-500 text-white',
        className
      )}
      {...props}
    >
      {element}
    </span>
  );
}
