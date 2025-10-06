'use client';

import { useConfig } from '@/contexts/configExports';
import styles from '@/styles/Imprint.module.scss';

export default function Imprint() {
  const { config } = useConfig();

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
