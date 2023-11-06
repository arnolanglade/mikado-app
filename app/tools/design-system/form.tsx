import React, { ReactNode } from 'react';
import Typography from '@/tools/design-system/typography';
import styles from './form.module.css';

export function Form(
  { onSubmit, children, className }:
  { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, children: ReactNode, className?: string },
) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

export function ButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className={styles.buttonGroup}>
      {children}
    </div>
  );
}

export function Button(
  { children, variant, onClick }:
  { children: ReactNode, variant: 'primary' | 'secondary', onClick: () => void },
) {
  return (
    <button type="button" onClick={onClick} className={`${styles.button} ${styles[variant]} ${styles.formElement}`}>
      {children}
    </button>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className={`${styles.button} ${styles.primary} ${styles.formElement}`}>
      {children}
    </button>
  );
}

export function Textarea({ name, placeholder }: { name: string, placeholder: string }) {
  return (
    <textarea className={`${styles.textarea} ${styles.formElement}`} name={name} placeholder={placeholder} />
  );
}

export function FormError({ error }: { error: ReactNode }) {
  if (!error) { return null; }

  return (
    <Typography className={styles.formError} variant="p">
      {error}
    </Typography>
  );
}
