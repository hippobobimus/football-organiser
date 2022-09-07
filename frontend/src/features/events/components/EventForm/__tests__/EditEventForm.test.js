import {
  render,
  screen,
  userEvent,
  fireEvent,
  waitFor,
  createUser,
  createEvent,
} from 'test-utils';
import { eventGenerator } from '../../../../../test/dataGenerators';

import { EditEventForm } from '../EditEventForm';

describe('EditEventForm', () => {
  it("should display event name input for 'social' category events", async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const event = createEvent({ overrides: { category: 'social' } });

    render(
      <EditEventForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      {
        user: createUser(),
        initialRouterEntries: [`/events/${event.id}/edit`],
      }
    );

    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });

  it("should not display event name input for 'match' category events", async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const event = createEvent();

    render(
      <EditEventForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      {
        user: createUser(),
        initialRouterEntries: [`/events/${event.id}/edit`],
      }
    );

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('should update event and call onSuccess callback', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const event = createEvent();
    const update = eventGenerator({ formatTime: true });

    render(
      <EditEventForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      {
        user: createUser(),
        initialRouterEntries: [`/events/${event.id}/edit`],
      }
    );

    // page 1
    const buildUpInput = await screen.findByLabelText(/warm up/i);
    const startInput = screen.getByLabelText(/kick off/i);
    const endInput = screen.getByLabelText(/finish/i);
    const capacityInput = screen.getByLabelText(/maximum no. of attendees/i);

    await user.click(buildUpInput);
    fireEvent.change(buildUpInput, {
      target: { value: update.time.buildUp },
    });

    await user.click(startInput);
    fireEvent.change(startInput, {
      target: { value: update.time.start },
    });

    await user.click(endInput);
    fireEvent.change(endInput, {
      target: { value: update.time.end },
    });

    await user.click(capacityInput);
    await user.clear(capacityInput);
    await user.keyboard(update.capacity);

    await user.click(screen.getByRole('button', { name: /next/i }));

    // page 2
    const nameInput = await screen.findByLabelText(/name/i);
    const line1Input = screen.getByLabelText(/line 1/i);
    const line2Input = screen.getByLabelText(/line 2/i);
    const townInput = screen.getByLabelText(/town/i);
    const postcodeInput = screen.getByLabelText(/postcode/i);

    await user.click(nameInput);
    await user.clear(nameInput);
    await user.keyboard(update.location.name);

    await user.click(line1Input);
    await user.clear(line1Input);
    await user.keyboard(update.location.line1);

    await user.click(line2Input);
    await user.clear(line2Input);
    await user.keyboard(update.location.line2);

    await user.click(townInput);
    await user.clear(townInput);
    await user.keyboard(update.location.town);

    await user.click(postcodeInput);
    await user.clear(postcodeInput);
    await user.keyboard(update.location.postcode);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should display an error alert if page 1 input validation fails', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const event = createEvent();
    const update = eventGenerator({ formatTime: true, past: true });

    render(
      <EditEventForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      {
        user: createUser(),
        initialRouterEntries: [`/events/${event.id}/edit`],
      }
    );

    // page 1
    const buildUpInput = await screen.findByLabelText(/warm up/i);
    const startInput = screen.getByLabelText(/kick off/i);
    const endInput = screen.getByLabelText(/finish/i);
    const capacityInput = screen.getByLabelText(/maximum no. of attendees/i);

    fireEvent.change(buildUpInput, { target: { value: update.time.end } });
    fireEvent.blur(buildUpInput);
    expect(
      await screen.findByText(/cannot be in the past/i)
    ).toBeInTheDocument();

    fireEvent.change(startInput, { target: { value: update.time.start } });
    fireEvent.blur(startInput);
    expect(
      await screen.findByText(/cannot precede the warm up time/i)
    ).toBeInTheDocument();

    fireEvent.change(endInput, { target: { value: update.time.buildUp } });
    fireEvent.blur(endInput);
    expect(
      await screen.findByText(/cannot precede the kick off time/i)
    ).toBeInTheDocument();

    await user.click(capacityInput);
    await user.clear(capacityInput);
    await user.keyboard('-1');
    fireEvent.blur(capacityInput);
    expect(await screen.findByText(/must be at least 1/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    // should not proceed to next page
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('should display error alerts if page 2 input validation fails', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const event = createEvent();
    const update = eventGenerator({ formatTime: true });

    render(
      <EditEventForm
        eventId={event.id}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      {
        user: createUser(),
        initialRouterEntries: [`/events/${event.id}/edit`],
      }
    );

    // page 1
    const buildUpInput = await screen.findByLabelText(/warm up/i);
    const startInput = screen.getByLabelText(/kick off/i);
    const endInput = screen.getByLabelText(/finish/i);
    const capacityInput = screen.getByLabelText(/maximum no. of attendees/i);

    await user.click(buildUpInput);
    fireEvent.change(buildUpInput, {
      target: { value: update.time.buildUp },
    });

    await user.click(startInput);
    fireEvent.change(startInput, {
      target: { value: update.time.start },
    });

    await user.click(endInput);
    fireEvent.change(endInput, {
      target: { value: update.time.end },
    });

    await user.click(capacityInput);
    await user.clear(capacityInput);
    await user.keyboard(update.capacity);

    await user.click(screen.getByRole('button', { name: /next/i }));

    // page 2
    const nameInput = await screen.findByLabelText(/name/i);
    const line1Input = screen.getByLabelText(/line 1/i);
    const line2Input = screen.getByLabelText(/line 2/i);
    const townInput = screen.getByLabelText(/town/i);
    const postcodeInput = screen.getByLabelText(/postcode/i);

    await user.click(nameInput);
    await user.keyboard('thisnameisfartoolongforvalidationtosucceed');
    fireEvent.blur(nameInput);
    expect(
      await screen.findByText(/maximum length 20 characters/i)
    ).toBeInTheDocument();
    await user.click(nameInput);
    await user.clear(nameInput);
    await user.keyboard(update.location.name);

    await user.click(line1Input);
    expect(
      screen.queryByText(/maximum length 30 characters/i)
    ).not.toBeInTheDocument();
    await user.keyboard('thisnameisfartoolongforvalidationtosucceed');
    fireEvent.blur(line1Input);
    expect(
      await screen.findByText(/maximum length 30 characters/i)
    ).toBeInTheDocument();
    await user.click(line1Input);
    await user.clear(line1Input);
    await user.keyboard(update.location.line1);

    await user.click(line2Input);
    expect(
      screen.queryByText(/maximum length 30 characters/i)
    ).not.toBeInTheDocument();
    await user.keyboard('thisnameisfartoolongforvalidationtosucceed');
    fireEvent.blur(line2Input);
    expect(
      await screen.findByText(/maximum length 30 characters/i)
    ).toBeInTheDocument();
    await user.click(line2Input);
    await user.clear(line2Input);
    await user.keyboard(update.location.line2);

    await user.click(townInput);
    expect(
      screen.queryByText(/maximum length 30 characters/i)
    ).not.toBeInTheDocument();
    await user.keyboard('thisnameisfartoolongforvalidationtosucceed');
    fireEvent.blur(townInput);
    expect(
      await screen.findByText(/maximum length 30 characters/i)
    ).toBeInTheDocument();
    await user.click(townInput);
    await user.clear(townInput);
    await user.keyboard(update.location.town);

    await user.click(postcodeInput);
    await user.keyboard('ABC 123');
    fireEvent.blur(postcodeInput);
    expect(
      await screen.findByText(/must be a valid uk postcode format/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).not.toHaveBeenCalled());
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});
