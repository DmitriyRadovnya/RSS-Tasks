import '../form.css';
import { useRef, useState, type FC } from 'react';
import type { IFormData } from '../../../interfaces/interfaces';
import { formSchema } from '../../../lib/validation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { registerUser } from '../../../store/users-slice';
import { CountrySelectWithoutHook } from './uncontrolled-country-select/uncontrolled-country-select';
import { currentPasswordStrength } from '../forms.lib';
import { FormField } from '../hook-form/form-field/form-filed';

interface IUncontrolledFormProps {
  onClose: () => void;
}

export const UncontrolledForm: FC<IUncontrolledFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<
    '' | 'easy-pass' | 'medium-pass' | 'hard-pass'
  >('');
  const [country, setCountry] = useState('');

  const passwordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswordStrength(currentPasswordStrength(password));
  };

  const handleFileChange = (file: File | null): Promise<string> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve('');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1] || '';
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const avatarInput = formRef.current?.querySelector(
      '#avatar'
    ) as HTMLInputElement | null;
    const avatarFile = avatarInput?.files?.[0] || null;

    const data: IFormData = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as 'Male' | 'Female',
      terms: formData.get('terms') === 'on',
      country: country,
      avatar: await handleFileChange(avatarFile),
    };

    const result = formSchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    dispatch(registerUser(data));
    onClose();
  };

  return (
    <form className="form" onSubmit={onSubmit} ref={formRef}>
      <h1>useRef Form</h1>
      <FormField labelText="Name:" htmlFor="name" error={errors.name}>
        <input
          className="input-name"
          id="name"
          name="name"
          placeholder="Your name"
          data-testid="name-input"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </FormField>

      <FormField labelText="Age:" htmlFor="age" error={errors.age}>
        <input
          className="input-age"
          placeholder="Your age"
          type="number"
          id="age"
          name="age"
          data-testid="age-input"
        />
        {errors.age && <p className="error">{errors.age}</p>}
      </FormField>

      <FormField labelText="Email:" htmlFor="email" error={errors.email}>
        <input
          className="input-email"
          placeholder="Your email"
          type="email"
          id="email"
          name="email"
          data-testid="email-input"
        />
        {errors.email && <p className="error">{errors.email}</p>}
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
          className={`input-password ${passwordStrength}`}
          placeholder="Enter password"
          type="password"
          id="password"
          name="password"
          onChange={passwordOnChange}
          data-testid="password-input"
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </FormField>

      <FormField
        labelText="Confirm password:"
        htmlFor="confirmPassword"
        error={errors.confirmPassword}
      >
        <input
          className="input-password"
          placeholder="Repeat password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          data-testid="confirm-password-input"
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
      </FormField>

      <FormField labelText="Gender:" htmlFor="gender" error={errors.gender}>
        <select id="gender" name="gender" data-testid="gender-select">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="error">{errors.gender}</p>}
      </FormField>

      <CountrySelectWithoutHook
        value={country}
        onChange={setCountry}
        errors={errors}
      />

      <FormField
        labelText="Select avatar:"
        htmlFor="avatar"
        error={errors.avatar}
      >
        <input
          className="input-avatar"
          type="file"
          accept="image/png, image/jpeg"
          id="avatar"
          name="avatar"
          data-testid="avatar-input"
        />
        {errors.avatar && <p className="error">{errors.avatar}</p>}
      </FormField>

      <label htmlFor="terms" className="form-terms">
        <input
          className="checkbox-terms"
          type="checkbox"
          id="terms"
          name="terms"
          data-testid="terms-checkbox"
        />
        Accept Terms and Conditions
        {errors.terms && <p className="error">{errors.terms}</p>}
      </label>

      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  );
};
