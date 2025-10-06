"use client";

import React from "react";
import styles from "@/styles/InputField.module.scss";

export interface InputFieldProps {
  defaultValue?: string;
  name?: string;
  type?: "text" | "password" | "email" | "file";
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  accept?: string;
  onValueChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  defaultValue,
  name,
  type,
  label,
  required,
  placeholder,
  disabled,
  invalid,
  accept,
  onValueChange,
}: InputFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event);
    }
  };

  return (
    <div className={styles.container}>
      {label ? (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        className={`${styles.input} ${invalid ? styles.inputInvalid : ""} ${disabled ? styles.inputDisabled : ""}`}
        type={type}
        defaultValue={defaultValue}
        name={name}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        accept={accept}
        onChange={handleChange}
      />
    </div>
  );
}
