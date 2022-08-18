import { render, screen, userEvent, waitFor, createUser } from 'test-utils';
import { toast } from 'react-toastify';
import { userGenerator } from '../../../../../test/dataGenerators';

import { RegisterForm } from '../RegisterForm';

describe('RegisterForm', () => {
  it('should create user and call onSuccess callback', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const testUser = userGenerator({ password: 'Password.123' });

    render(<RegisterForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);

    await user.click(screen.getByLabelText(/first name/i));
    await user.keyboard(testUser.firstName);

    await user.click(screen.getByLabelText(/last name/i));
    await user.keyboard(testUser.lastName);

    await user.click(screen.getByLabelText(/email/i));
    await user.keyboard(testUser.email);

    await user.click(screen.getByLabelText(/enter a strong password/i));
    await user.keyboard(testUser.password);

    await user.click(screen.getByLabelText(/confirm password/i));
    await user.keyboard(testUser.password);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should display an error alert if a user with the given email already exists', async () => {
    const mockAlert = jest.spyOn(toast, 'error');
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const testUser = userGenerator({ password: 'Password.123' });

    // existing user with same email.
    createUser({ email: testUser.email });

    render(<RegisterForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);

    await user.click(screen.getByLabelText(/first name/i));
    await user.keyboard(testUser.firstName);

    await user.click(screen.getByLabelText(/last name/i));
    await user.keyboard(testUser.lastName);

    await user.click(screen.getByLabelText(/email/i));
    await user.keyboard(testUser.email);

    await user.click(screen.getByLabelText(/enter a strong password/i));
    await user.keyboard(testUser.password);

    await user.click(screen.getByLabelText(/confirm password/i));
    await user.keyboard(testUser.password);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockAlert).toHaveBeenCalledTimes(1));
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringMatching(/already exists/i)
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});
