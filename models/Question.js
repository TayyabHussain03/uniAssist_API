import mongoose from "mongoose";

// Define the schema for answers
const AnswerSchema = new mongoose.Schema({
    text: { type: String }, // Answer text
    imageUrl: { type: String } // URL for an image
});

// Define the schema for questions
const QuestionSchema = new mongoose.Schema({
    questionVariations: { type: [String], required: true }, // Array of question variations
    answers: { type: [AnswerSchema], required: true }, // Array of answers
    department: { type: String, required: true }, // Department name
    intent: { type: String, required: true }, // Intent name
    entities: { type: [String], default: [] }, // Array of entities
    context: { type: String, default: "" } // Context or additional information
});

const Question = mongoose.model('Question', QuestionSchema)

export default Question