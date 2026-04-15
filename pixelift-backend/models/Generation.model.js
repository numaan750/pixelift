import mongoose from "mongoose";

const generationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    uploadedImage: {
      type: String,
      default: null,
    },
    toolId: {
      type: String,
      default: null,
    },
    section: {
      type: String,
      default: null,
    },
    toolOptions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export default mongoose.model("Generation", generationSchema);
