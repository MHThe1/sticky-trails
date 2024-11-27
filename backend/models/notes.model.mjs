import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    bgimage: {
        type: String,
        required: false
    },
}, {
    timestamps: true // add createdAt and updatedAt fields
});

const Note = mongoose.model("Note", noteSchema);

export default Note;