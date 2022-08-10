import { render, screen, createUser, userEvent, waitFor } from 'test-utils';
import { toast } from 'react-toastify';

import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should login user and call onSuccess function', async () => {
    const mockOnSuccess = jest.fn();
    const user = userEvent.setup();
    const testUser = await createUser();

    render(<LoginForm onSuccess={mockOnSuccess} />);

    await user.click(screen.getByLabelText(/email/i));
    await user.keyboard(testUser.email);

    await user.click(screen.getByLabelText(/password/i));
    await user.keyboard(testUser.password);

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
  });

  it('should show an error alert if invalid credentials are provided', async () => {
    const mockAlert = jest.spyOn(toast, 'error');
    const mockOnSuccess = jest.fn();

    const user = userEvent.setup();
    const testUser = await createUser();

    render(<LoginForm onSuccess={mockOnSuccess} />);

    await user.click(screen.getByLabelText(/email/i));
    await user.keyboard(testUser.email);

    await user.click(screen.getByLabelText(/password/i));
    await user.keyboard('wrongpassword');

    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockAlert).toHaveBeenCalledTimes(1));
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringMatching(/invalid email or password/i)
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
