'use client';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { authenticate } from '@/lib/actions';
import styles from '@/styles/LoginForm.module.scss';
import { useActionState } from 'react';

export default function LoginForm() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

  return (
    <div className={styles.container}>
      <form action={dispatch} className={styles.form}>
        <span className={styles.errorMessage}>{errorMessage}</span>
        <InputField
          label="Token"
          name="token"
          type="password"
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
