import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './components';
import Faq from './routes/Faq';
import Home from './routes/Home';
import MatchLineup from './routes/MatchLineup';
import MatchLocation from './routes/MatchLocation';
import MatchWeather from './routes/MatchWeather';
import RouteSwitch from './RouteSwitch';

jest.mock('./components');
jest.mock('./routes/Faq');
jest.mock('./routes/Home');
jest.mock('./routes/MatchLineup');
jest.mock('./routes/MatchLocation');
jest.mock('./routes/MatchWeather');

describe('RouteSwitch', () => {
  beforeEach(() => {
    Navbar.mockImplementation(() => <div>NavbarMock</div>);
  });

  function checkCorrectRendering(path, expectedText) {
    render(
      <MemoryRouter initialEntries={[path]}>
        <RouteSwitch />
      </MemoryRouter>
    );

    expect(screen.getByText('NavbarMock')).toBeInTheDocument();
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  }

  test('should render navbar and home page on \'/\' route', () => {
    const testString = 'HomeMock';
    Home.mockImplementation(() => <div>HomeMock</div>);
    checkCorrectRendering('/', testString);
  });

  test('should render navbar and lineup page on \'/lineup\' route', () => {
    const testString = 'LineupMock';
    MatchLineup.mockImplementation(() => <div>{testString}</div>);
    checkCorrectRendering('/lineup', testString);
  });

  test('should render navbar and weather page on \'/weather\' route', () => {
    const testString = 'WeatherMock';
    MatchWeather.mockImplementation(() => <div>{testString}</div>);
    checkCorrectRendering('/weather', testString);
  });

  test('should render navbar and location page on \'/location\' route', () => {
    const testString = 'LocationMock';
    MatchLocation.mockImplementation(() => <div>{testString}</div>);
    checkCorrectRendering('/location', testString);
  });

  test('should render navbar and FAQ page on \'/faq\' route', () => {
    const testString = 'FaqMock';
    Faq.mockImplementation(() => <div>{testString}</div>);
    checkCorrectRendering('/faq', testString);
  });

  test('sends bad routes to the page not found landing page', () => {
    checkCorrectRendering('/not/a/valid/path', /page not found/i);
  });
});
