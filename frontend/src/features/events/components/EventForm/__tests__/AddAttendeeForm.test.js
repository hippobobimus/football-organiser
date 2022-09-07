import { toast } from 'react-toastify';
import {
  render,
  screen,
  userEvent,
  waitFor,
  createUser,
  createEvent,
  addUserToEvent,
} from 'test-utils';

import { db } from '../../../../../test/server/db';
import { AddAttendeeForm } from '../AddAttendeeForm';

describe('AddAttendeeForm', () => {
  it('should add selected user to event and call onSuccess callback', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const event = createEvent();

    let users = [];
    for (let i = 0; i < 10; i += 1) {
      users.push(createUser());
    }

    const authUser = users[0];
    const testUser = users[3];

    render(
      <AddAttendeeForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: authUser }
    );

    expect(await screen.findByLabelText(/user/i)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/user/i), testUser.name);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));

    const updatedEvent = db.event.findFirst({
      where: { id: { equals: event.id } },
    });
    expect(
      updatedEvent.attendees.find((att) => att.user.id === testUser.id)
    ).toBeTruthy();
  });

  it('should trigger an error alert if the user is already registered', async () => {
    const mockAlert = jest.spyOn(toast, 'error');
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();

    let users = [];
    for (let i = 0; i < 10; i += 1) {
      users.push(createUser());
    }

    const authUser = users[0];
    const testUser = users[3];

    const event = addUserToEvent(createEvent(), testUser);

    render(
      <AddAttendeeForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: authUser }
    );

    expect(await screen.findByLabelText(/user/i)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/user/i), testUser.name);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockAlert).toHaveBeenCalledTimes(1));
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringMatching(/attendee already exists/i)
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});
