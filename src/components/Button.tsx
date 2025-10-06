'use client';

import styles from '@/styles/Button.module.scss';

interface ButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClickCallback?: () => void;
}

export default function Button({ label, type, disabled, onClickCallback }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.buttonDisabled : ''}`}
      type={type}
      disabled={disabled}
      onClick={onClickCallback}>
      {label}
    </button>
  );
}
