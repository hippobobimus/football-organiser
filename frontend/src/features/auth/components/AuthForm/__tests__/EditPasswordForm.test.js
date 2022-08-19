import { render, screen, userEvent, waitFor, createUser } from 'test-utils';
import { toast } from 'react-toastify';

import { EditPasswordForm } from '../EditPasswordForm';

describe('EditPasswordForm', () => {
  let testUser;
  let mockErrorAlert;
  let mockOnSuccess;
  let mockOnCancel;
  let user;

  beforeEach(() => {
    testUser = createUser({ password: 'Password.123' });
    mockErrorAlert = jest.spyOn(toast, 'error');
    mockOnSuccess = jest.fn();
    mockOnCancel = jest.fn();
    user = userEvent.setup();

    render(
      <EditPasswordForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} />,
      { user: testUser }
    );
  });

  it('should update password and call onSuccess callback', async () => {
    const newPassword = 'NewPassword.123';

    const currentPasswordField = await screen.findByLabelText(
      /current password/i
    );
    const newPasswordField = await screen.findByLabelText(/new password/i);
    const confirmPasswordField = await screen.findByLabelText(
      /confirm password/i
    );

    expect(currentPasswordField.value).toBe('');
    await user.click(currentPasswordField);
    await user.keyboard(testUser.password);

    expect(newPasswordField.value).toBe('');
    await user.click(newPasswordField);
    await user.keyboard(newPassword);

    expect(confirmPasswordField.value).toBe('');
    await user.click(confirmPasswordField);
    await user.keyboard(newPassword);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    expect(mockErrorAlert).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});
