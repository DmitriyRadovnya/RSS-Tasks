import '../form.css';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useState, type FC } from 'react';
import type { AppDispatch } from '../../../store/store';
import type { IFormData } from '../../../interfaces/interfaces';
import { formSchema } from '../../../lib/validation';
import { registerUser } from '../../../store/users-slice';
import { CountrySelect } from './country-select/country-select';
import { currentPasswordStrength } from '../forms.lib';
import { FormField } from './form-field/form-filed';

interface IHookFormProps {
  onClose: () => void;
}

export const HookForm: FC<IHookFormProps> = ({ onClose }) => {
  const [passwordStrength, setPasswordStrength] = useState<
    '' | 'easy-pass' | 'medium-pass' | 'hard-pass'
  >('');
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm<IFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'Male',
      terms: false,
      country: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setValue('avatar', base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const passwordOnChange = (event: { target: { value: string } }) => {
    const password = event.target.value;
    setPasswordStrength(currentPasswordStrength(password));
  };

  const onSubmit = (data: IFormData) => {
    dispatch(registerUser(data));
    onClose();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1>React-Hook-Form</h1>
      <FormField labelText="Name:" htmlFor="name" error={errors.name}>
        <input
          className="input_name"
          id="name"
          {...register('name')}
          placeholder="Your name"
          data-testid="name-input"
        />
      </FormField>

      <FormField labelText="Age:" htmlFor="age" error={errors.age}>
        <input
          className="input_age"
          placeholder="Your age"
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
          data-testid="age-input"
        />
      </FormField>

      <FormField labelText="Email:" htmlFor="email" error={errors.email}>
        <input
          className="input_email"
          placeholder="Your email"
          type="text"
          id="email"
          {...register('email')}
          data-testid="email-input"
        />
      </FormField>

      <FormField
        labelText={
          <>
            Password:
            <div className={`strength ${passwordStrength}`}></div>
          </>
        }
        htmlFor="password"
        labelClassName="label-password"
        error={errors.password}
      >
        <input
          className="input_password"
          placeholder="Enter password"
          type="password"
          id="password"
          {...register('password')}
          onChange={passwordOnChange}
          data-testid="password-input"
        />
      </FormField>

      <FormField
        labelText="Confirm password:"
        htmlFor="confirmPassword"
        error={errors.confirmPassword}
      >
        <input
          className="input_password"
          placeholder="Repeat password"
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          data-testid="confirm-password-input"
        />
      </FormField>

      <FormField labelText="Gender:" htmlFor="gender" error={errors.gender}>
        <select id="gender" {...register('gender')} data-testid="gender-select">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </FormField>

      <CountrySelect control={control} errors={errors} />

      <FormField
        labelText="Select avatar:"
        htmlFor="avatar"
        error={errors.avatar}
      >
        <input
          className="input_avatar"
          type="file"
          accept="image/png, image/jpeg"
          id="avatar"
          onChange={handleFileChange}
          data-testid="avatar-input"
        />
      </FormField>

      <label htmlFor="terms" className="form-terms">
        <input
          className="checkbox_terms"
          type="checkbox"
          id="terms"
          {...register('terms')}
          data-testid="terms-checkbox"
        />
        Accept Terms and Conditions
        {errors.terms && <p className="error">{errors.terms.message}</p>}
      </label>

      <button type="submit" disabled={!isValid} data-testid="submit-button">
        Submit
      </button>
    </form>
  );
};
