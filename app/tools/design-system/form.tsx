import React, { ReactNode, RefObject } from 'react';
import styles from './form.module.css';

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
    <button type="button" onClick={onClick} className={`${styles.button} ${styles.formElement}`}>
      {label}
    </button>
  );
}

export function SubmitButton({ label }: { label: ReactNode }) {
  return (
    <button type="submit" className={`${styles.button} ${styles.formElement}`}>
      {label}
    </button>
  );
}

export function Textarea({ ref }: { ref: RefObject<HTMLTextAreaElement> }) {
  return (
    <textarea ref={ref} className={`${styles.textarea} ${styles.formElement}`} />
  );
}
