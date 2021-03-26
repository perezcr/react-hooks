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
import {ErrorBoundary} from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
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

  // ErrorBoundary will call onReset when it is reset.
  function handleReset() {
    setPokemonName('');
  }

  // Every single time we change the pokemonName, it's going to completely unmount
  // this ErrorBoundary, which in turn unmounts the PokmonInfo, and then it's going
  // to mount a new instance of each of these elements. That's how the key works.

  // react-error-boundary supports this with the resetKeys prop.
  // You pass an array of values to resetKeys and if the ErrorBoundary is in an
  // error state and any of those values change, it will reset the error boundary.
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
