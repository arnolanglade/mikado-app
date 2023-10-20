import React, { ReactNode } from 'react';
import styles from './alert.module.css';

export default function Alert(
  { children, severity = 'info' }:
  { children: ReactNode, severity: 'info' | 'success' | 'warning' | 'danger' },
) {
  return (
    <div className={`${styles.alert} ${styles[severity]}`} role="alert">
      {children}
    </div>
  );
}
