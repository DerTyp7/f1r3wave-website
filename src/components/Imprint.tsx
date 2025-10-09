'use client';

import { useConfig } from '@/contexts/configExports';
import styles from '@/styles/Imprint.module.scss';
import { useRouter } from 'next/navigation';

export default function Imprint() {
  const { config } = useConfig();
  const router = useRouter();

  if (!config || !config?.contact.imprint.enable) {
    router.push('/');
  }

  return (
    <div className={styles.imprint}>
      <h2 className={styles.imprintHeadline}>{config?.contact.imprint.headline}</h2>
      <span>{config?.contact.imprint.name}</span>
      <span>{config?.contact.imprint.address}</span>
      <span>{config?.contact.imprint.country}</span>
      <span>{config?.contact.imprint.email}</span>
    </div>
  );
}
