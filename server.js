import fetchDetails from './getData.js';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import getDetails from './scraper.js';
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
    username : String
})


const User = mongoose.model("User", userSchema);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.get('/scrape',async (req,res) => {
    try {
        const data = await fetchDetails();
        res.json(data);
        
    }
    catch (err) {
        console.error("Error in /scrape route:", err);
        res.status(500).json({ error: "Failed to fetch details" });
    }
});

app.post('/addUser', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const userDetails = await getDetails(username); // Wait for the async function to resolve
        if (userDetails === null) {
            return res.status(400).json({ error: "Username does not exist" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({ username });
        await newUser.save();
        res.status(201).json({ message: "User added successfully." });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: "Failed to add user" });
    }
});




app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.delete('/clearUsers', async (req, res) => {
    try {
        console.log("Clear users endpoint hit");
        await User.deleteMany({});
        res.json({ message: "All users deleted successfully" });
    } catch (err) {
        console.error("Error clearing users:", err);
        res.status(500).json({ error: "Failed to clear users" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));