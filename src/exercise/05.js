// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt';

function Tilt({children}) {
  // React.useRef gives you an object that has a current property on it,
  // and that current property is mutable. This is useful for more than just DOM nodes.
  // Basically you use the ref hook. Anytime you want to maintain a reference to something
  // and you want to be able to make changes to that thing without triggering a rerender.
  const tiltRef = React.useRef();

  React.useEffect(() => {
    const tiltNode = tiltRef.current;
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    });

    return () => tiltNode.vanillaTilt.destroy();
  }, []);

  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  );
}

export default App;
