import SearchForm from './search-form/search-form';
import './header.css';
import React from 'react';
import type { SetAppState } from '../../interfaces/interfaces';

interface HeaderProps {
  setAppState: SetAppState;
  setAppError: (error: Error | null) => void;
}

export default class Header extends React.Component<HeaderProps> {
  render(): React.ReactNode {
    return (
      <header className="header">
        <SearchForm
          setAppState={this.props.setAppState}
          setAppError={this.props.setAppError}
        ></SearchForm>
      </header>
    );
  }
}
