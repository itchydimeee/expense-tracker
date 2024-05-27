import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  getByTestId,
} from "@testing-library/react";
import Navbar from "@/components/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";

jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: () => ({
    user: { picture: "https://example.com/picture" },
    error: null,
    isLoading: false,
  }),
}));

describe("Navbar", () => {
  it("renders logo image", () => {
    const { getByAltText } = render(<Navbar />);
    expect(getByAltText("logoImg")).toBeInTheDocument;
  });

  it("renders profile picture when user is logged in", () => {
    const { getByAltText } = render(<Navbar />);
    expect(getByAltText("Profile picture")).toBeInTheDocument;
  });

  it("renders logout button when user is logged in", () => {
    const { getByText, getByTestId } = render(<Navbar />);
    const profilePictureButton = getByTestId("profile-pic");

    fireEvent.click(profilePictureButton);
    expect(getByText("Logout")).toBeInTheDocument;
  });

  it("closes menu on outside click", () => {
    const { getByTestId, getByText } = render(<Navbar />);
    const profilePic = getByTestId("profile-pic");
    fireEvent.click(profilePic);
    const outsideElement = document.createElement("div");
    fireEvent.click(outsideElement);
    expect(getByText("Logout")).not.toBeInTheDocument;
  });
});
