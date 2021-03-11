// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react';

function Greeting({initialName = ''}) {
  // Hey, React, this component can re-render any time this state that I want you to manage is going to change.
  // React gives us the state value for the current render, and then it gives you a mechanism for updating that state, which is the state update or function. When you call that function then that will trigger the re-render.
  const [name, setName] = React.useState(initialName);

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting initialName="Cristian" />;
}

export default App;
