import Home from '../pages/index';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, container } from '@testing-library/react';

describe('testing the app', () => {
  it('renders button component', () => {
    render(<Home />);
    const btn = screen.getByRole('button', { name: /\+/i });
    expect(btn).toBeInTheDocument();
  });

  // it('renders Form component', () => {
  //   render(<Home />);
  //   // check if Form components is rendered on click
  //   const addButton = screen.getByRole('button', { name: /\+/i });
  //   addButton.click();
  //   const mySubmit = screen.getByRole('button', { name: /submit/i });
  //   const myTitle = screen.getByRole(/title/i);
  //   const myTitle2 = screen.getByRole('button');
  //   // const myForm = screen.querySelectorAll('#__next > div > form');
  //   expect(myTitle2).toBeInTheDocument();
  // });
});
