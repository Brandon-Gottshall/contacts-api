// Import express module
const express = require('express');
// Create express application
const app = express();
// Import queries file
const db = require('./queries.js');
// Specify route num
const port = 3000;

const cors = require('cors');

// Add middleware
app.use(express.json());
app.use(cors());

// Route is '/' and Returns JSON response
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express and Postgres API'})
})

// Contact Route

// Get one contact
app.get('/contact/:id', db.getContactById);
// Get all contacts
app.get('/contacts', db.getContacts);
// Post Routes
app.post('/contacts', db.addContact);
// Delete Routes
app.delete('/contact/:id', db.deleteContact);
// Update contacts
app.put('/contact/:id', db.updateContact);


// Start server with listen on specified port
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})