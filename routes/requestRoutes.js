import express from "express";
import {
    query_add,
    query_all,
    query_delete,
    query_department,
    query_update,
    query_search
} from "../controller/requestController.js";

const router = express.Router();

// **Get All Queries**
// Route: GET /api/queries
// Description: Retrieves all questions and answers from the database.
router.get('/', query_all);

// **Search Queries**
// Route: GET /api/queries/search
// Description: Searches for questions based on a query string provided by the user.
router.get('/search', query_search);

// **Add New Query**
// Route: POST /api/queries
// Description: Adds a new question with variations and answers to the database.
// The request body should contain questionVariations, answers, and department.
router.post('/', query_add);

// **Update Query**
// Route: PUT /api/queries/:id
// Description: Updates an existing question based on the provided ID.
// The request body can include any fields to update: question, answer, imageUrl, or department.
router.put('/:id', query_update);

// **Get Queries by Department**
// Route: GET /api/queries/department/:department
// Description: Retrieves questions and answers filtered by the specified department.
// The department name is provided as a URL parameter.
router.get('/department/:department', query_department);

// **Delete Query**
// Route: DELETE /api/queries/:id
// Description: Deletes a question based on the provided ID from the database.
router.delete('/:id', query_delete);

export default router;
