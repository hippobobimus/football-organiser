import { Subtitle, Link } from './styles';

export const PageNotFound = () => {
  return (
    <>
      <Subtitle>Page not found...</Subtitle>
      <Link to={'/'}>Return to homepage</Link>
    </>
  );
};
