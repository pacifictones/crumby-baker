import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to the baking blog/i);
  expect(headingElement).toBeInTheDocument();
});
