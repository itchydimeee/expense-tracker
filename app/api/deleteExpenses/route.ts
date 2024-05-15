import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    await prisma.expenses.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
