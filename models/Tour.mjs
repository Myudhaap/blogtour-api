import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  name: {
    type: String,
  },
  creator: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  imageFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
  },
});

export default mongoose.model("Tour", tourSchema);
