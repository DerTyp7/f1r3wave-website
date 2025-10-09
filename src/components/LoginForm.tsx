'use client';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import styles from '@/styles/LoginForm.module.scss';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setErrorMessage((await response.json()).error ?? '');
      setIsPending(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.errorMessage}>{errorMessage}</span>
        <InputField
          label="Token"
          name="token"
          type="password"
          onValueChange={(v) => {
            setPassword(v.currentTarget.value);
          }}
          required={true}
          placeholder="Enter your token"
          disabled={isPending}
          invalid={errorMessage?.length ? true : false}
        />
        <Button label={isPending ? 'Verifying...' : 'Log in'} type="submit" disabled={isPending} />
      </form>
    </div>
  );
}
