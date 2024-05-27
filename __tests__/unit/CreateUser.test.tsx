import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import CreateUser from "@/components/createUser";

jest.mock("axios");
jest.mock("@auth0/nextjs-auth0/client");

describe("CreateUser component", () => {
  const mockUser = {
    sub: "auth0|123456789",
    email: "misaky@example.com",
    name: "macoco",
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches user data and creates user if not found", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { error: true } });
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    render(<CreateUser />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/api/users", {
        auth0Id: mockUser.sub,
        email: mockUser.email,
        username: mockUser.name,
      });
    });
  });

  it("does not create the user if already exists", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
    });

    render(<CreateUser />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("logs an error if the GET request fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("GET request failed")
    );

    render(<CreateUser />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("verifies user creation if user was successfully created", async () => {
    const createUserUrl = "/api/users";
    const postUserUrl = "/api/users";

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { error: true } });
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    render(<CreateUser />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(createUserUrl, {
        params: { auth0Id: mockUser.sub },
      });
      expect(axios.post).toHaveBeenCalledWith(postUserUrl, {
        auth0Id: mockUser.sub,
        email: mockUser.email,
        username: mockUser.name,
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
