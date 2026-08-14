import mongoose from "mongoose";

const AnonymousMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    authorName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AnonymousMessage = mongoose.models.AnonymousMessage || mongoose.model("AnonymousMessage", AnonymousMessageSchema);

export default AnonymousMessage;
