import React, { ReactNode, RefObject } from 'react';

export function Form(
  { onSubmit, children }:
  { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, children: ReactNode },
) {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function Button(
  { label, onClick }:
  { label: ReactNode, onClick: () => void },
) {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
}

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
