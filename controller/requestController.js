import Question from "../models/Question.js";

// **********Get All Queries**********
const query_all = async (req, res) => {
    try {
        const allQuestions = await Question.find();

        if (allQuestions.length === 0) {
            return res.status(404).json({ message: "No questions found." });
        }

        res.status(200).json({ questions: allQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching questions." });
    }
};


// **********Get Queries Department Wise**********
const query_department = async (req, res) => {
    try {
        const { department } = req.params;

        if (!department) {
            return res.status(400).json({ error: "Department name parameter is required." });
        }

        // Normalize department name by removing spaces
        const normalizedDepartment = department.replace(/\s+/g, '');

        const questions = await Question.find({ department: normalizedDepartment });

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this department." });
        }

        res.status(200).json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching questions." });
    }
};

// **********Add New Query**********
const query_add = async (req, res) => {
    try {
        const { questionVariations, answers, department, intent, entities, context } = req.body;

        // Validate input
        if (!department || !questionVariations || !answers || !intent || !entities || !context) {
            return res.status(400).json({ error: "Missing department, question variations, answers, intent, entities, or context." });
        }

        // Validate number of question variations
        if (questionVariations.length < 3) {
            return res.status(400).json({ error: "Please provide at least 3 question variations." });
        }

        // Validate number of answer variations
        if (answers.length < 2) {
            return res.status(400).json({ error: "Please provide at least 2 answer variations." });
        }
        if (entities.length < 1) {
            return res.status(400).json({ error: "Please provide at least 1 entity." });
        }

        // Validate and format intent
        const intentPattern = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)+$/;
        if (!intentPattern.test(intent)) {
            return res.status(400).json({ error: "Intent must contain underscores (_) between words and cannot start or end with an underscore." });
        }

        // Convert department, entities, and context to lowercase
        const normalizedDepartment = department.replace(/\s+/g, '').toLowerCase();
        const lowercaseEntities = entities.map(entity => entity.toLowerCase());
        const lowercaseContext = context.toLowerCase(); // Assuming context is a single string, not an array

        // Create a new question document
        const newQuestion = new Question({
            department: normalizedDepartment,
            questionVariations,
            answers,
            intent,
            entities: lowercaseEntities,
            context: lowercaseContext
        });

        // Save the question document to the database
        await newQuestion.save();

        // Send a success response
        res.status(201).json({ message: "Question added successfully!", question: newQuestion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while adding the question." });
    }
};

// **********Update Query**********
const query_update = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionVariations, answers, department, intent, entities, context } = req.body;

        // Validate the ID parameter
        if (!id) {
            return res.status(400).json({ error: "ID parameter is required." });
        }

        // Validate and format intent
        if (intent) {
            // Validate and format intent
            const intentPattern = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)+$/;
            if (!intentPattern.test(intent)) {
                return res.status(400).json({ error: "Intent must contain underscores (_) between words and cannot start or end with an underscore." });
            }
        }

        // Validate entities
        if (entities && entities.length === 0) {
            return res.status(400).json({ error: "At least one entity is required." });
        }

        // Prepare update object
        const updateFields = {};
        if (questionVariations) updateFields.questionVariations = questionVariations;
        if (answers) updateFields.answers = answers;
        if (department) updateFields.department = department.replace(/\s+/g, '').toLowerCase();
        if (intent) updateFields.intent = intent;
        if (entities) updateFields.entities = entities.map(entity => entity.toLowerCase());
        if (context) updateFields.context = context.toLowerCase(); // Assuming context is a single string

        // Check if there are fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: "No fields to update." });
        }

        // Update the question in the database
        const updatedQuestion = await Question.findByIdAndUpdate(id, updateFields, { new: true });

        // Check if no question was found
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found with this ID." });
        }

        // Send success response with the updated question
        res.status(200).json({ message: "Question updated successfully.", updatedQuestion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while updating the question." });
    }
};


// **********Search Queries**********
const query_search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Search query parameter is required." });
        }

        // Create a regex pattern for case-insensitive search
        const searchPattern = new RegExp(query.trim().split(/\s+/).map(word => `(?=.*${word})`).join(''), 'i');

        // Search across all relevant fields
        const results = await Question.find({
            $or: [
                { questionVariations: { $elemMatch: { $regex: searchPattern } } },
                { 'answers.text': { $regex: searchPattern } },
                { entities: { $elemMatch: { $regex: searchPattern } } },
                { intent: { $regex: searchPattern } },
                { context: { $regex: searchPattern } }
            ]
        });

        if (results.length === 0) {
            return res.status(404).json({ message: "No matching questions found." });
        }

        res.status(200).json({ questions: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while searching for questions." });
    }
};


// **********Delete Query**********
const query_delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID parameter is required." });
        }

        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found with this ID." });
        }

        res.status(200).json({ message: "Question deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting the question." });
    }
};

export {
    query_add,
    query_all,
    query_delete,
    query_department,
    query_update,
    query_search
}
