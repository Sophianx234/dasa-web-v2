import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["dues", "donation"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    packageTitle: {
      type: String, // e.g., "Semester Dues" (for dues only)
    },
    reference: {
      type: String,
      required: true,
      unique: true, // Paystack transaction reference
    },
    isAnonymous: {
      type: Boolean,
      default: false, // For donations
    },
    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recompiling the model upon hot reload in development
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
