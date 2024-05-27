import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: jest.fn(() => <span>Icon</span>),
}));

describe("Footer", () => {
  it("renders correctly with /home pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/home");

    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    const homeLink = links.find(
      (link) => link.getAttribute("href") === "/home"
    );
    const statsLink = links.find(
      (link) => link.getAttribute("href") === "/stats"
    );

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveClass("bg-background text-white");

    expect(statsLink).toBeInTheDocument();
    expect(statsLink).not.toHaveClass("bg-background");
  });

  it("renders correctly with /stats pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/stats");

    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    const homeLink = links.find(
      (link) => link.getAttribute("href") === "/home"
    );
    const statsLink = links.find(
      (link) => link.getAttribute("href") === "/stats"
    );

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).not.toHaveClass("bg-background");

    expect(statsLink).toBeInTheDocument();
    expect(statsLink).toHaveClass("bg-background text-white");
  });

  it("renders correctly with unknown pathname", () => {
    (usePathname as jest.Mock).mockReturnValue("/unknown");

    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    const homeLink = links.find(
      (link) => link.getAttribute("href") === "/home"
    );
    const statsLink = links.find(
      (link) => link.getAttribute("href") === "/stats"
    );

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).not.toHaveClass("bg-background");

    expect(statsLink).toBeInTheDocument();
    expect(statsLink).not.toHaveClass("bg-background");
  });
});
