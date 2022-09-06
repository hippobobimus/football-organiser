import {
  render,
  screen,
  userEvent,
  fireEvent,
  waitFor,
  createUser,
} from 'test-utils';
import { eventGenerator } from '../../../../../test/dataGenerators';

import { CreateEventForm } from '../CreateEventForm';

describe('CreateEventForm', () => {
  it("should display event name input for 'social' category events", async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <CreateEventForm
        category="social"
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: createUser() }
    );

    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
  });

  it("should not display event name input for 'match' category events", async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <CreateEventForm
        category="match"
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: createUser() }
    );

    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('should create match event and call onSuccess callback', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const eventInput = eventGenerator({ formatTime: true });

    render(
      <CreateEventForm
        category="match"
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: createUser() }
    );

    // page 1
    await user.click(screen.getByLabelText(/warm up/i));
    fireEvent.change(screen.getByLabelText(/warm up/i), {
      target: { value: eventInput.buildUpTime },
    });

    await user.click(screen.getByLabelText(/kick off/i));
    fireEvent.change(screen.getByLabelText(/kick off/i), {
      target: { value: eventInput.startTime },
    });

    await user.click(screen.getByLabelText(/finish/i));
    fireEvent.change(screen.getByLabelText(/finish/i), {
      target: { value: eventInput.endTime },
    });

    await user.click(screen.getByLabelText(/maximum no. of attendees/i));
    await user.keyboard(eventInput.capacity);

    await user.click(screen.getByRole('button', { name: /next/i }));

    // page 2
    await user.click(await screen.findByLabelText(/name/i));
    await user.keyboard(eventInput.locationName);

    await user.click(await screen.findByLabelText(/line 1/i));
    await user.keyboard(eventInput.locationLine1);

    await user.click(await screen.findByLabelText(/line 2/i));
    await user.keyboard(eventInput.locationLine2);

    await user.click(await screen.findByLabelText(/town/i));
    await user.keyboard(eventInput.locationTown);

    await user.click(await screen.findByLabelText(/postcode/i));
    await user.keyboard(eventInput.locationPostcode);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should display an error alert if page 1 input validation fails', async () => {
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();
    const eventInput = eventGenerator({ formatTime: true, past: true });

    render(
      <CreateEventForm
        category="match"
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: createUser() }
    );

    // page 1
    const buildUpInput = screen.getByLabelText(/warm up/i);
    const startInput = screen.getByLabelText(/kick off/i);
    const endInput = screen.getByLabelText(/finish/i);
    const capacityInput = screen.getByLabelText(/maximum no. of attendees/i);

    fireEvent.change(buildUpInput, { target: { value: eventInput.endTime } });
    fireEvent.blur(buildUpInput);
    expect(
      await screen.findByText(/cannot be in the past/i)
    ).toBeInTheDocument();

    fireEvent.change(startInput, { target: { value: eventInput.startTime } });
    fireEvent.blur(startInput);
    expect(
      await screen.findByText(/cannot precede the warm up time/i)
    ).toBeInTheDocument();

    fireEvent.change(endInput, { target: { value: eventInput.buildUpTime } });
    fireEvent.blur(endInput);
    expect(
      await screen.findByText(/cannot precede the kick off time/i)
    ).toBeInTheDocument();

    await user.click(capacityInput);
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
    const eventInput = eventGenerator({ formatTime: true });

    render(
      <CreateEventForm
        category="match"
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
      { user: createUser() }
    );

    // page 1
    await user.click(screen.getByLabelText(/warm up/i));
    fireEvent.change(screen.getByLabelText(/warm up/i), {
      target: { value: eventInput.buildUpTime },
    });

    await user.click(screen.getByLabelText(/kick off/i));
    fireEvent.change(screen.getByLabelText(/kick off/i), {
      target: { value: eventInput.startTime },
    });

    await user.click(screen.getByLabelText(/finish/i));
    fireEvent.change(screen.getByLabelText(/finish/i), {
      target: { value: eventInput.endTime },
    });

    await user.click(screen.getByLabelText(/maximum no. of attendees/i));
    await user.keyboard(eventInput.capacity);

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
    await user.keyboard(eventInput.name);

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
    await user.keyboard(eventInput.locationLine1);

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
    await user.keyboard(eventInput.locationLine2);

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
    await user.keyboard(eventInput.locationTown);

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
