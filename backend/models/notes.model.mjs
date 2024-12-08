import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 0, // Temporary default, will be overridden in the middleware
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

// Pre-validate middleware to calculate priority
noteSchema.pre("validate", async function (next) {
  if (this.isNew && this.priority === 0) { // Only run for new documents with unset priority
    try {
      const noteCount = await mongoose.model("Note").countDocuments();
      this.priority = noteCount + 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
