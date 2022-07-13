import { screen } from '@testing-library/react';

import { appRender } from './testUtils';
import RouteSwitch from './RouteSwitch';

jest.mock('./components', () => {
  return {
    Navbar: () => <div>NavbarMock</div>,
    PageNotFound: () => <div>PageNotFoundMock</div>,
  };
});

jest.mock('./components/PageNotFound', () => {
  return {
    __esModule: true,
    default: () => <div>PageNotFoundMock</div>,
  };
});

jest.mock('./features/events/Event', () => {
  return {
    __esModule: true,
    default: (nextMatch) =>
      nextMatch ? <div>{'NextMatchMock'}</div> : <div>{'EventMock'}</div>,
  };
});

jest.mock('./features/auth/Login', () => {
  return {
    __esModule: true,
    default: () => <div>LoginMock</div>,
  };
});

describe('RouteSwitch', () => {
  const checkCorrectRendering = (path, expectedText) => {
    appRender([path], <RouteSwitch />);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.getByText('NavbarMock')).toBeInTheDocument();
  };

  it("should render navbar and login page on '/login' route", () => {
    checkCorrectRendering('/login', 'LoginMock');
  });

  it('should send invalid routes to the page not found landing page', () => {
    checkCorrectRendering('/not/a/valid/path', 'PageNotFoundMock');
  });
});
