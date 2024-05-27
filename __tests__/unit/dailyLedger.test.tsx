import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import axios from "axios";
import DailyLedger from "@/components/dailyLedger";

jest.mock("axios");

describe("DailyLedger", () => {
  const userId = "someUserId";

  it("renders loading state initially", () => {
    const { getAllByText } = render(<DailyLedger userId={userId} />);
    expect(getAllByText("Loading transactions...").length).toBeGreaterThan(0);
  });
});
