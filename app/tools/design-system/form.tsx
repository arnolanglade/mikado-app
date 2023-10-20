import React, { forwardRef, ReactNode } from 'react';
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
  { children, onClick }:
  { children: ReactNode, onClick: () => void },
) {
  return (
    <button type="button" onClick={onClick} className={`${styles.button} ${styles.formElement}`}>
      {children}
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

// eslint-disable-next-line react/display-name
export const Textarea = forwardRef<HTMLTextAreaElement>((props, ref) => (
  <textarea ref={ref} className={`${styles.textarea} ${styles.formElement}`} />
));
