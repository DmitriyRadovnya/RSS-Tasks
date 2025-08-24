import './country-select.css';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { filterCountries } from '../../store/countries-slice';
import type { IFormData } from '../../interfaces/interfaces';

interface IOptionType {
  value: string;
  label: string;
}

interface CountrySelectProps {
  control: Control<IFormData>;
  errors: FieldErrors<IFormData>;
}

export const CountrySelect = ({ control, errors }: CountrySelectProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const countryOptions = useSelector(
    (state: RootState) => state.countries.filteredCountries
  );

  const handleInputChange = (inputValue: string) => {
    dispatch(filterCountries(inputValue));
    return inputValue;
  };

  return (
    <div className="form-field">
      <label htmlFor="country">Country:</label>
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Select
            className="country-select"
            inputId="country"
            options={countryOptions}
            value={
              field.value
                ? countryOptions.find(
                    (option) => option.value === field.value
                  ) || null
                : null
            }
            onChange={(option: SingleValue<IOptionType>) =>
              field.onChange(option ? option.value : '')
            }
            onInputChange={handleInputChange}
            onBlur={field.onBlur}
            placeholder="Select country"
            isClearable
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                borderColor: errors.country ? 'red' : base.borderColor,
              }),
            }}
          />
        )}
      />
      {errors.country && <p className="error">{errors.country.message}</p>}
    </div>
  );
};
