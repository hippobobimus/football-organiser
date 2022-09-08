import { render, screen, createUser } from 'test-utils';

import { SelectUserField } from './SelectUserField';

jest.mock('../../../../components/Form/SelectField', () => ({
  __esModule: true,
  SelectField: ({ children }) => <select>{children}</select>,
}));

describe('SelectUserField', () => {
  it('should render a select input with an options list that includes all users', async () => {
    const users = [];
    for (let i = 0; i < 20; i += 1) {
      users.push(createUser());
    }

    render(<SelectUserField />, { user: users[0] });

    expect(await screen.findByRole('combobox')).toBeInTheDocument();

    // should be 1 additional blank option.
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(users.length + 1);

    users.forEach((user) => {
      const opt = screen.getByText(`${user.name}`);
      expect(opt).toBeInTheDocument();
      expect(opt.value).toBe(user.id);
    });
  });
});
