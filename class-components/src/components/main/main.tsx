import React from 'react';
import CardList from './card-list/card-list';
import type { PokemonDetails } from '../../interfaces/pokemon';

interface MainProps {
  details: PokemonDetails[];
}

interface MainState {
  errorTrigger: boolean;
}

export default class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = { errorTrigger: false };
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
    if (this.state.errorTrigger) {
      throw new Error('My Error');
    }
    const { details } = this.props;
    return (
      <main>
        <button onClick={this.triggerError}>Throw My Error</button>
        <CardList details={details}></CardList>
      </main>
    );
  }
}
