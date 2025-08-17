import { ChangeEvent } from 'react';

export interface SearchFormProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}
