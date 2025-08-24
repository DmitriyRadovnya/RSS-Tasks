import { useForm } from 'react-hook-form';
import type { IFormData } from '../../interfaces/interfaces';

export const HookForm = () => {
  const { register, handleSubmit } = useForm<IFormData>({
    defaultValues: {
      name: '',
      age: 18,
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      terms: false,
      country: '',
    },
  });

  const onSubmit = (data: IFormData) => {
    console.log(data);
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1></h1>
      <div className="form-field">
        <label htmlFor="name">Name:</label>
        <input className="input_name" id="name" {...register('name')} />
      </div>

      <div className="form-field">
        <label htmlFor="age">Age:</label>
        <input
          className="input_age"
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true })}
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email:</label>
        <input
          className="input_email"
          type="email"
          id="email"
          {...register('email')}
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password:</label>
        <input
          className="input_password"
          type="password"
          id="password"
          {...register('password')}
        />
      </div>
      <div className="form-field">
        <label htmlFor="confirm-password">Confirm password:</label>
        <input
          className="input_password"
          type="password"
          id="confirm-password"
          {...register('confirmPassword')}
        />
      </div>

      <div className="form-field">
        <label htmlFor="gender"></label>
        <select id="gender" {...register('gender')}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="avatar">Select avatar</label>
        <input
          className="input_avatar"
          type="file"
          accept="image/png, image/jpeg"
          id="avatar"
        />
      </div>

      <label htmlFor="terms">
        <input
          className="checkbox_terms"
          type="checkbox"
          id="terms"
          {...register('terms')}
        />
        Accept Terms and Conditions
      </label>
      <button>Submit</button>
    </form>
  );
};
