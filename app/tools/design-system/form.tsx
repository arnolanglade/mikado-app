import React, { ReactNode, RefObject } from 'react';

export function SubmitButton({ label }: { label: ReactNode }) {
  return (
    <button type="submit">
      {label}
    </button>
  );
}

export function Textarea({ ref }: { ref: RefObject<HTMLTextAreaElement> }) {
  return (
    <textarea ref={ref} />
  );
}
