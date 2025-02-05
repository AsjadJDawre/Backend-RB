import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
