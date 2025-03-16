const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Correctly require cors
const authRoutes = require('./routes/auth'); // Correctly require your routes
const projectRoutes =require('./routes/project');
const taskRoutes = require('./routes/task');
const issuesRoutes= require('./routes/issues')
const postRoutes = require("./routes/post");

const app = express();

// Load environment variables from .env file
dotenv.config();

app.use('/uploads', express.static('uploads'));

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST','DELETE','PUT','PATCH'],
    credentials: true
}));



app.use('/', authRoutes); // Use the routes
app.use('/', projectRoutes);
app.use('/', taskRoutes);
app.use('/', issuesRoutes);
app.use("/", postRoutes);

// Get port and database connection string from environment variables
const port = process.env.PORT || 5000;
const connection = process.env.CONNECTION_STRING;

// Connect to MongoDB
mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('DB connected');
})
.catch((error) => {
    console.log('Database is not connected:', error.message);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

