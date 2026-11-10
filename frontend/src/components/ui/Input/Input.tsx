import type { ChangeEvent } from "react";
import "./Input.scss";

type InputProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  name?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  id,
  label,
  type = "text",
  name,
  placeholder,
  value,
  required = false,
  disabled = false,
  error,
  onChange,
}: InputProps) {
  return (
    <div className="input">
      <label className="input__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <input
        id={id}
        className={`input__field${error ? " input__field--error" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={onChange}
      />

      {error && (
        <p id={`${id}-error`} className="input__error">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
