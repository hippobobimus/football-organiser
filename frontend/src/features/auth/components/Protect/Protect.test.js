import { render, screen, createUser } from 'test-utils';

import { Protect } from './Protect';

const mockRedirect = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => {
    mockRedirect(to);
    return <div data-testid="mock-navigate" />;
  },
  Outlet: () => <div data-testid="mock-outlet" />,
}));

describe('Protect', () => {
  it('should allow users with the required privileges access to child routes', async () => {
    const testUser = createUser({ role: 'test-role' });

    render(<Protect allowedRoles={['test-role', 'other-role']} />, {
      user: testUser,
    });

    expect(await screen.findByTestId('mock-outlet')).toBeInTheDocument();
  });

  it('should redirect unauthenticated users', async () => {
    render(<Protect allowedRoles={['test-role', 'other-role']} />);

    expect(await screen.queryByTestId('mock-outlet')).not.toBeInTheDocument();
    expect(await screen.queryByTestId('mock-navigate')).toBeInTheDocument();
    expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
  });

  it('should display message for unauthorised users and prevent access to child routes', async () => {
    const testUser = createUser({ role: 'test-role' });

    render(
      <Protect
        allowedRoles={['some-test-role', 'other-role']}
        redirectTo="unauthorised-path"
      />,
      {
        user: testUser,
      }
    );

    expect(await screen.queryByTestId('mock-outlet')).not.toBeInTheDocument();
    expect(
      await screen.findByRole('heading', /access denied/i)
    ).toBeInTheDocument();
  });
});
