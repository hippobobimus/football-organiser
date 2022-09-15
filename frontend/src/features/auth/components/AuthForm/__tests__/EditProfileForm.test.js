import { render, screen, userEvent, waitFor, createUser } from 'test-utils';
import { userGenerator } from '../../../../../test/dataGenerators';
import { toast } from 'react-toastify';

import { EditProfileForm } from '../EditProfileForm';

describe('EditProfileForm', () => {
  let testUser;
  let testUserUpdates;
  let mockErrorAlert;
  let mockOnSuccess;
  let mockOnCancel;
  let user;

  beforeEach(() => {
    testUser = createUser({ password: 'Password.123' });
    testUserUpdates = userGenerator();
    mockErrorAlert = jest.spyOn(toast, 'error');
    mockOnSuccess = jest.fn();
    mockOnCancel = jest.fn();
    user = userEvent.setup();
  });

  it('should update user and call onSuccess callback', async () => {
    render(
      <EditProfileForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} />,
      { user: testUser }
    );

    const firstNameField = await screen.findByLabelText(/first name/i);
    const lastNameField = await screen.findByLabelText(/last name/i);
    const emailField = await screen.findByLabelText(/email/i);
    const passwordField = await screen.findByLabelText(
      /enter your current password/i
    );

    expect(firstNameField.value).toBe(testUser.firstName);
    await user.clear(firstNameField);
    await user.keyboard(testUserUpdates.firstName);

    expect(lastNameField.value).toBe(testUser.lastName);
    await user.clear(lastNameField);
    await user.keyboard(testUserUpdates.lastName);

    expect(emailField.value).toBe(testUser.email);
    await user.clear(emailField);
    await user.keyboard(testUserUpdates.email);

    expect(passwordField.value).toBe('');
    await user.click(passwordField);
    await user.keyboard(testUser.password);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    expect(mockErrorAlert).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();

    // form resets
    await waitFor(() => expect(firstNameField).toHaveValue(testUser.firstName));
  });

  it('should show an error alert if an invalid password is provided', async () => {
    render(
      <EditProfileForm onCancel={mockOnCancel} onSuccess={mockOnSuccess} />,
      { user: testUser }
    );

    const firstNameField = await screen.findByLabelText(/first name/i);
    const lastNameField = await screen.findByLabelText(/last name/i);
    const emailField = await screen.findByLabelText(/email/i);
    const passwordField = await screen.findByLabelText(
      /enter your current password/i
    );

    await user.clear(firstNameField);
    await user.keyboard(testUserUpdates.firstName);

    await user.clear(lastNameField);
    await user.keyboard(testUserUpdates.lastName);

    await user.clear(emailField);
    await user.keyboard(testUserUpdates.email);

    await user.click(passwordField);
    await user.keyboard('incorrectpassword');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockErrorAlert).toHaveBeenCalledTimes(1));
    expect(mockErrorAlert).toHaveBeenCalledWith(
      expect.stringMatching(/invalid email or password/i)
    );
    expect(mockOnCancel).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // fields should be reset.
    await waitFor(() => expect(firstNameField).toHaveValue(testUser.firstName));
    expect(lastNameField).toHaveValue(testUser.lastName);
    expect(emailField.value).toBe(testUser.email);
    expect(passwordField.value).toBe('');
  });
});
