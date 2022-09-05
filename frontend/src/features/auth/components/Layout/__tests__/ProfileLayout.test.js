import { render, screen, createUser } from 'test-utils';

import { ProfileLayout } from '../ProfileLayout';

describe('ProfileLayout', () => {
  it('should display a greeting to the user', async () => {
    const testUser = createUser();

    render(<ProfileLayout />, { user: testUser });

    expect(
      await screen.findByRole(
        'heading',
        new RegExp(`hi ${testUser.firstName}`, 'i')
      )
    ).toBeInTheDocument();
  });
});
