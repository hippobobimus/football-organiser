import { Subtitle } from './styles';

export const DisplayError = ({ error }) => {
  const msg = error?.data?.message || error?.message || error;

  return (
    <>
      <Subtitle>Something went wrong...</Subtitle>
      {msg && <p>{msg}</p>}
    </>
  );
};
