import React, { ReactNode } from 'react';
import styles from './alert.module.css';

export default function Alert(
  { children, severity = 'info', className }:
  { children: ReactNode, severity: 'info' | 'success' | 'warning' | 'danger', className?: string },
) {
  return (
    <div className={`${styles.alert} ${styles[severity]} ${className}`} role="alert">
      {children}
    </div>
  );
}
