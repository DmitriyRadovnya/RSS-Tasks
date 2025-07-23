import React from 'react';
import CardList from './card-list/card-list';
import type { PokemonDetails } from '../../interfaces/interfaces';

interface MainProps {
  details: PokemonDetails[];
}

interface MainState {
  errorTrigger: boolean;
}

export default class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      errorTrigger: false,
    };
  }

  triggerError = () => {
    this.setState({ errorTrigger: true });
  };

  componentDidUpdate() {
    if (this.state.errorTrigger) {
      throw new Error('My Error');
    }
  }

  render() {
    const { details } = this.props;

    if (this.state.errorTrigger) {
      throw new Error('My Error');
    }

    return (
      <main>
        <CardList details={details}></CardList>
        <button onClick={this.triggerError}>Throw My Error</button>
      </main>
    );
  }
}
