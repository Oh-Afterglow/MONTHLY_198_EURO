import React, { useState } from 'react';

// mock data, should be deleted later
const mocked = {
  all: [
    'pytorch/pytorch',
    'tensorflow/tensorflow',
    'tensorflow/tensorflow-gpu',
  ],
};

const Ctx = React.createContext(null);

export default ({ children }) => {
  const [curProj, setCurProj] = useState('');
  const [allProj, setAllProj] = useState(mocked.all);
  const setEncodedCurProj = (url) => {
    console.log(url);
    setCurProj(encodeURIComponent(url));
  };
  return (
    <Ctx.Provider
      value={{
        value: curProj,
        set: setEncodedCurProj,
        all: allProj,
        setAll: setAllProj,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export { Ctx };
