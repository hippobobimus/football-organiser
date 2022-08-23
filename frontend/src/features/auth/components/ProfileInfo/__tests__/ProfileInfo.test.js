import { render, screen, userEvent, createUser } from 'test-utils';

import { ProfileInfo } from '../ProfileInfo';

describe('ProfileHome', () => {
  let testUser;
  let onEditMock;
  let user;

  beforeEach(() => {
    testUser = createUser({ password: 'Password.123' });
    user = userEvent.setup();
    onEditMock = jest.fn();
  });

  it("should display a subheading followed by the user's name and email address", () => {
    render(<ProfileInfo user={testUser} onEdit={onEditMock} />, {
      user: testUser,
    });
    expect(screen.getByRole('heading', /your info/i)).toBeInTheDocument();
    expect(screen.getByText(testUser.name)).toBeInTheDocument();
    expect(screen.getByText(testUser.email)).toBeInTheDocument();
    expect(onEditMock).not.toHaveBeenCalled();
  });

  it("should call onEdit callback when the 'edit' button is clicked", async () => {
    render(<ProfileInfo user={testUser} onEdit={onEditMock} />, {
      user: testUser,
    });

    expect(onEditMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', /edit/i));

    expect(onEditMock).toHaveBeenCalledTimes(1);
  });
});
