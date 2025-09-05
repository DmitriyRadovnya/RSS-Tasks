import type { FC } from 'react';
import { type FieldError } from 'react-hook-form';

interface FormFieldProps {
  labelText: React.ReactNode;
  htmlFor: string;
  labelClassName?: string;
  children: React.ReactNode;
  error?: FieldError | string;
}

export const FormField: FC<FormFieldProps> = ({
  labelText,
  htmlFor,
  labelClassName,
  children,
  error,
}) => {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className={labelClassName}>
        {labelText}
      </label>
      {children}
      {error && (
        <p className="error">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};
