'use client';

import styles from '@/styles/Footer.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FooterProps {
  currentYear: number;
}

export default function Footer({ currentYear }: FooterProps) {
  const [isInLandingPage, setIsInLandingPage] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsInLandingPage(pathname === '/');
  }, [pathname]);

  return (
    <footer className={`${styles.footer} ${isInLandingPage ? styles.footerLandingPage : ''}`}>
      <div className={styles.links}>
        <Link href="/imprint" className={styles.linksLink}>
          Imprint
        </Link>
        <Link
          href="https://github.com/DerTyp7/f1r3wave-website"
          className={styles.linksLink}
          target="_blank"
          rel="noopener noreferrer">
          View Source Code on GitHub
        </Link>
      </div>

      <span>
        &#169; {currentYear} <Link href="https://github.com/DerTyp7">DerTyp7</Link>. All rights reserved.
      </span>
    </footer>
  );
}
