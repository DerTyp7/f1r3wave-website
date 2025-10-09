'use client';

import logo from '@/assets/logo_text.png';
import { deleteSessionCookie } from '@/lib/actions';
import styles from '@/styles/Header.module.scss';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const isActive = (path: string) => pathname.split('/')[1] === path.split('/')[1];

  const performLogout = async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
  };

  useEffect(() => {
    const auth = async () => {
      const result = await fetch('/api/auth/status', { method: 'GET' });
      const isAuthenticated = (await result.json()).isAuthenticated;

      if (!isAuthenticated) {
        await deleteSessionCookie();
      }

      setIsAuth(isAuthenticated);
    };
    auth();
  }, [pathname]);

  const handleLogout = async () => {
    await performLogout();
    setIsAuth(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className={`${styles.header}`}>
      <Link href="/" className={styles.logo}>
        <Image src={logo} alt="Logo F1r3wave" priority />
      </Link>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>
          Home
        </Link>
        <Link href="/gallery" className={`${styles.navLink} ${isActive('/gallery') ? styles.navLinkActive : ''}`}>
          Gallery
        </Link>

        {isAuth ? (
          <>
            <Link href="/admin" className={`${styles.navLink} ${isActive('/admin') ? styles.navLinkActive : ''}`}>
              Admin
            </Link>

            <p
              onClick={async () => {
                handleLogout();
              }}
              className={`${styles.navLink}`}>
              Logout
            </p>
          </>
        ) : (
          ''
        )}
        <div className={styles.navSocials}>
          <Link className={styles.navLink} href="https://www.instagram.com/f1r3wave" target="_blank">
            <FontAwesomeIcon icon={faInstagram} />
          </Link>

          <Link className={styles.navLink} href="mailto:f1r3wave@tealfire.de" target="_blank">
            <FontAwesomeIcon icon={faEnvelope} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
