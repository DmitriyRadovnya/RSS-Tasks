import SearchForm from '../search-form';
import './header.css';
import React from 'react';

interface HeaderProps {
  setQueryResponse: (query: string, currentURL: string) => void;
}

export default class Header extends React.Component<HeaderProps> {
  render(): React.ReactNode {
    return (
      <header className="header">
        <SearchForm setQueryResponse={this.props.setQueryResponse}></SearchForm>
      </header>
    );
  }
}
