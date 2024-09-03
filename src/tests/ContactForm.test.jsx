import { render, screen } from "@testing-library/react";
import ContactForm from "../components/ContactForm";

test("renders contact form", () => {
  render(<ContactForm />);
  const nameInput = screen.getByPlaceholderText(/your name/i);

  expect(nameInput).toBeInTheDocument();
});
