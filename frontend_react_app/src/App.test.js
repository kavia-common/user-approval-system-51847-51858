import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders todo header", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /todo/i })).toBeInTheDocument();
});
