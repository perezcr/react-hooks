// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue,
  );

  React.useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
  // It is not great for our performance because every single time we type a character, we're reading out of localStorage.
  // We don't need to because we already did that the first time. We don't care about that value thereafter.
  // React’s useState hook allows you to pass a function instead of the actual value, and then it will only call that function to get the state value when the component is rendered the first time
  const [name, setName] = useLocalStorageState('name', initialName);

  // React.useEffect allows you to pass a second argument called the "dependency array" which signals to React that your effect callback function should be called when (and only when) those dependencies change.
  React.useEffect(() => {
    // Anytime my component renders, this function is going to get called. My component can re-render because the name update it.
    window.localStorage.setItem('name', name);

    // Another thing to keep in mind here is that react does a shallow comparison for all of these dependencies.
    // If you have two objects between renders, object A and then object B, even if those have all of
    // the same properties, you're going to get a rerun of your useEffect because it does this shallow comparison,
    // because the object before is not the same as the current object, even if they look exactly the same.
    // Keep in mind that the values that you pass in here are compared basically as if you were to do a triple equals, or Object.is(), which is what react is using internally.
  }, [name]);

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
