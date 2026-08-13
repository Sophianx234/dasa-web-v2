"use server";

import connectToDatabase from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";

export type RecordTransactionParams = {
  type: "dues" | "donation";
  amount: number;
  email: string;
  fullName?: string;
  phone?: string;
  packageTitle?: string;
  reference: string;
  isAnonymous?: boolean;
};

export async function recordTransaction(data: RecordTransactionParams) {
  try {
    await connectToDatabase();
    
    const transaction = await Transaction.create(data);
    
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    console.error("Error recording transaction:", error);
    return { success: false, error: "Failed to record transaction" };
  }
}
