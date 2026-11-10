import type { ChangeEvent } from "react";
import "./Select.scss";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function Select({
  id,
  label,
  options,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  onChange,
}: SelectProps) {
  return (
    <div className="select">
      <label className="select__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <select
        id={id}
        className={`select__field${error ? " select__field--error" : ""}`}
        value={value}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="select__error">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
