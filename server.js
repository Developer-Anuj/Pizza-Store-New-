const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));

// Define Mongoose Schema and Model
const itemSchema = new mongoose.Schema({
    name: String,  
    price: Number, 
    description: String
});

const Item = mongoose.model('Item', itemSchema);

// Routes for CRUD

// Add a new item
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        res.status(500).send({ message: 'Failed to add item', error });
    }
});

// Fetch all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch items', error });
    }
});

// Update an item by ID
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedItem);
    } catch (error) {
        res.status(500).send({ message: 'Failed to update item', error });
    }
});

// Delete an item by ID
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.send({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete item', error });
    }
});

// Delete all items
app.delete('/items', async (req, res) => {
    try {
        await Item.deleteMany();  // This deletes all documents from the collection
        res.send({ message: 'All items deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete items', error });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
});
