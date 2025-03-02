import * as React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../exercise/03.extra-1';

test('App works', () => {
  render(<App />);
  userEvent.type(screen.getByRole('textbox', {name: /name/i}), 'mulan');
  userEvent.type(screen.getByRole('textbox', {name: /animal/i}), 'dragon');
  expect(
    screen.getByText('Your favorite animal is: dragon!'),
  ).toBeInTheDocument();
});
