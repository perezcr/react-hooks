// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

// What if the user of this hook didn't want to use JSON.stringify and JSON.parse, and they wanted to serialize and deserialize this a different way themselves?
function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    // What if the default value that they want to provide is computationally expensive for them to create?
    // Maybe their initial name here is some sort of calculate numbers 2π or something really weird like that.
    // If it's computationally expensive, then I don't want to have them have to pass that every single time.
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  // What happens if the key changes on us?
  // useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).
  // The returned object will persist for the full lifetime of the component.
  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
