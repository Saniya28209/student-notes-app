const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// Show all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.render('tags', { tags });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Add tag
router.post('/', async (req, res) => {
    try {
        const newTag = new Tag({ name: req.body.name });
        await newTag.save();
        res.redirect('/tags');
    } catch (err) {
        res.status(500).send("Error creating tag");
    }
});

// Delete tag
router.delete('/:id', async (req, res) => {
    try {
        await Tag.findByIdAndDelete(req.params.id);
        res.redirect('/tags');
    } catch (err) {
        res.status(500).send("Error deleting tag");
    }
});

module.exports = router;
