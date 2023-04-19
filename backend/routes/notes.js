const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route-01 get all the notes Login Required...
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured!");
  }
});

// Route-02 Add a new note using post Login Required...
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title!").isLength({ min: 3 }),
    body("description", "Enter a valid description!").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if there are error return Bad request and error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
      const note = new Note({ title, description, tag, user: req.user.id });
      const savednotes = await note.save();
      res.json(savednotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured!");
    }
  }
);

// Route-03 update an existing note using post Login Required...
router.post(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid title!").isLength({ min: 3 }),
    body("description", "Enter a valid description!").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if there are error return Bad request and error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    try {
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not found");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured!");
    }
  }
);

// Route-04 delete an existing note using post Login Required...
router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not found");
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  try {
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted.", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured!");
  }
});

module.exports = router;
