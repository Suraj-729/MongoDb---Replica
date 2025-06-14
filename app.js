const express = require('express');
const app = express();
const port = 3000;

const routes = require('./route'); // Import your routes

app.use(express.json()); // Middleware for JSON parsing
app.use('/', routes);    // Use your routes

app.get('/', (req, res) => {
    res.send('Hello MongoDb Replica');
});

app.listen(port, () => {
    console.log(`Server is on th running  serverrr on the port: ${port}`);
});
