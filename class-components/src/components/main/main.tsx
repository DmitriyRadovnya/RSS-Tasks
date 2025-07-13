import React from 'react';
import CardList from './card-list/card-list';
import type { PokemonDetails } from '../../interfaces/pokemon';

interface MainProps {
  details: PokemonDetails[] | null;
  // error?: Error | null;
}

interface MainState {
  errorTrigger: boolean;
  // searchError: Error | null;
}

export default class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      errorTrigger: false,
      // searchError: Array.isArray(this.props.details)
      //   ? null
      //   : this.props.details,
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

    // if (error) {
    //   return (
    //     <div>
    //       <h2>Unfortunately, such a Pokemon does not exist!</h2>
    //       <p>I remind you that to catch a Pokemon, you need to know and specify its full name.</p>
    //     </div>
    //   )
    // }

    if (details && Array.isArray(details)) {
      return (
        <main>
          <CardList details={details}></CardList>
          <button onClick={this.triggerError}>Throw My Error</button>
        </main>
      );
    } 
    // else if (error) {
    //   return (
    //     <div>
    //       <h2>Unfortunately, such a Pokemon does not exist!</h2>
    //       <p>
    //         I remind you that to catch a Pokemon, you need to know and specify
    //         its full name.
    //       </p>
    //     </div>
    //   );
    // }

    // return (
    //   <main>
    //     <button onClick={this.triggerError}>Throw My Error</button>
    //     <CardList details={details}></CardList>
    //   </main>
    // );
  }
}
