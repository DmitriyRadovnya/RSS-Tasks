import '../../country-select.css';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store/store';
import { filterCountries } from '../../../../store/countries-slice';

interface IOptionType {
  value: string;
  label: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
}

export const CountrySelectWithoutHook = ({
  value,
  onChange,
  errors,
}: CountrySelectProps) => {
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
      <Select
        className="country-select"
        inputId="country"
        name="country"
        options={countryOptions}
        value={
          countryOptions.find(
            (option: { value: string }) => option.value === value
          ) || null
        }
        onChange={(option: SingleValue<IOptionType>) =>
          onChange(option ? option.value : '')
        }
        onInputChange={handleInputChange}
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
      {errors.country && <p className="error">{errors.country}</p>}
    </div>
  );
};
