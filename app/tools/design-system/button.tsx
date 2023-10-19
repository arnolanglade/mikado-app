import React, { ReactNode } from 'react';

export default function SubmitButton({ label }: { label: ReactNode }) {
  return (
    <button type="submit">
      {label}
    </button>
  );
}
