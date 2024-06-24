const express = require('express');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', require('./route/auth'));
app.use('/api/books', require('./route/book'));


app.get("/",(req,res)=>{
res.send("  Welocme to library")
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
