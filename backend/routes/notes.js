import express from "express";
import Note from "../models/Note.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 }); // Newest first
        res.json(notes);
    } catch (error) {
        console.error("Fetch Notes Error:", error.message);
        res.status(500).json({ message: "Server error fetching notes" });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const note = await Note.create({
            title,
            description,
            user: req.user
        });

        res.status(201).json(note);
    } catch (error) {
        console.error("Create Note Error:", error.message);
        res.status(500).json({ message: "Server error creating note" });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });

        if (!note) {
            return res.status(404).json({ message: "Note not found or you're not authorized to delete it" });
        }

        res.json({ message: "Note deleted" });
    } catch (error) {
        console.error("Delete Note Error:", error.message);
        res.status(500).json({ message: "Server error deleting note" });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const { title, description } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            { title, description },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found or you're not authorized to edit it" });
        }

        res.json(note);
    } catch (error) {
        console.error("Update Note Error:", error.message);
        res.status(500).json({ message: "Server error updating note" });
    }
});

export default router;
