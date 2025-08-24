import './form.css';
import { useForm } from 'react-hook-form';
import type { IFormData } from '../../interfaces/interfaces';
import { formSchema } from '../../lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { registerUser } from '../../store/users-slice';

export const HookForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  const onSubmit = (data: IFormData) => {
    console.log(data);
    dispatch(registerUser(data));
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Registration Form</h1>
      <div className="form-field">
        <label htmlFor="name">Name:</label>
        <input className="input_name" id="name" {...register('name')} />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="age">Age:</label>
        <input
          className="input_age"
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email:</label>
        <input
          className="input_email"
          type="text"
          id="email"
          {...register('email')}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="password">Password:</label>
        <input
          className="input_password"
          type="password"
          id="password"
          {...register('password')}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          className="input_password"
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="gender">Gender:</label>
        <select id="gender" {...register('gender')}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && <p className="error">{errors.gender.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="country">Country:</label>
        <select id="country" {...register('country')}>
          <option value="">Select a country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
        </select>
        {errors.country && <p className="error">{errors.country.message}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="avatar">Select avatar:</label>
        <input
          className="input_avatar"
          type="file"
          accept="image/png, image/jpeg"
          id="avatar"
          onChange={handleFileChange}
        />
        {errors.avatar && <p className="error">{errors.avatar.message}</p>}
      </div>

      <label htmlFor="terms">
        <input
          className="checkbox_terms"
          type="checkbox"
          id="terms"
          {...register('terms')}
        />
        Accept Terms and Conditions
        {errors.terms && <p className="error">{errors.terms.message}</p>}
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};
