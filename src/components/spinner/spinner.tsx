import type { FC } from 'react';
import s from './spinner.module.css';

const Spinner: FC = () => (
  <div className={s.spinner}>
    <div className={s.circle} />
  </div>
);

export default Spinner;
