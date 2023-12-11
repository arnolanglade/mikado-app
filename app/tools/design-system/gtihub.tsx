import React from 'react';
import styles from './github.module.css';

export default function GithubForkRibbons() {
  return (
    <a
      href="https://github.com/arnolanglade/mikado-app"
      className={styles.githubRibbons}
      target="_blank"
    >
      <img
        decoding="async"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
        alt="Fork me on GitHub"
        loading="lazy"
        data-recalc-dims="1"
      />
    </a>
  );
}
