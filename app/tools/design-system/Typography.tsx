import React, { ReactNode } from 'react';
import { JSX } from 'react/jsx-runtime';
import IntrinsicElements = JSX.IntrinsicElements;

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export default function Typography({ children, variant, className }: { children: ReactNode, variant: Variant, className?: string }) {
  const Component = variant as keyof IntrinsicElements;

  return (
    <Component className={className}>
      {children}
    </Component>
  );
}
