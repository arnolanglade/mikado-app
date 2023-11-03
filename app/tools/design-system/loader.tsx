import React, { ReactNode } from 'react';
import styles from './loader.module.css';

export default function Loader({ text }: { text: ReactNode }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
      <p>{text}</p>
    </div>
  );
}
