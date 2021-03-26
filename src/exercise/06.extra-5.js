// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon';

class ErrorBoundary extends React.Component {
  state = {error: null};

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error};
  }

  render() {
    const {error} = this.state;
    if (error) {
      // You can render any custom fallback UI
      return <this.props.FallbackComponent error={error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  );
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  });
  const {status, pokemon, error} = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({status: 'pending'});
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon, status: 'resolved'});
      })
      .catch(error => {
        setState({error, status: 'rejected'});
      });
  }, [pokemonName]);

  if (status === 'idle') {
    return 'Submit a pokemon';
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />;
  } else if (status === 'rejected') {
    // This will be handled by our error boundary
    throw error;
  }

  throw new Error('This should be impossible');
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
