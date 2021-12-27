import { useContext } from 'react';
import { Ctx } from './CtxWrapper';

export default () => {
  const context = useContext(Ctx);
  console.log(context);
  return context;
};
