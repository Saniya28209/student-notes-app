// routes/noteRoutes.js 
//here we are importing the required modules .
const express = require('express');
const router = express.Router();// here we know the express is our big app but if we put everything in it , it'll get messy.
// so we assign a small subsection of express here and tell it to handle the route part .
const Note = require('../models/Note'); // here we are importing the schema of the note .
const auth = require('../middleware/auth'); // here we are importing the middleware.

//Create route
router.post('/', auth, async (req, res) => { // applying auth to all routes so that only logged in users can create, edit , view ,and delete notes.
    const { title, content, tags } = req.body;

    const tagsArray = tags 
        ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

    await Note.create({ title, content, tags: tagsArray , user: req.session.userId }); // creates new note with tags and also with user so that only a particular user can see their notes .

    // res.redirect('/'); // earlier we used this but for toast animation we'lluse the below line.
   res.redirect('/notes?added=1');  // ✅ Toast: Note Added

});

router.get('/add', auth, (req, res) => {
    res.render('add');
});



// READ route back-end
// router.get('/', async (req, res) => {
//   try {
//     const notes = await Note.find();// the find function finds all the notes stored in mongodb .
//     res.json(notes);// we send the response as all of the notes.
//   } catch (err) { 
//     res.status(500).json({ message: err.message }); // say if we can't find a note .
//   }
// });

// READ all notes (Render Home Page) Front-end route
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.session.userId });// now only the user will see their notes that only they've created .
    let toastMessage = null;

    if (req.query.added) {
        toastMessage = "Note added successfully! ✨";
    } else if (req.query.edited) {
        toastMessage = "Note updated successfully! ✏️";
    } else if (req.query.deleted) {
        toastMessage = "Note deleted successfully! 🗑️";
    }
    res.render('home', { notes,user:req.user ? req.user.name:"User",toastMessage });  // ✅ render home.ejs instead of sending JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Show edit form
router.get("/edit/:id",auth ,async (req, res) => {
    const note = await Note.findOne({ // here we are adding this so only the particular user can edit their notes.
        _id: req.params.id,
        user: req.session.userId
    });

    if (!note) return res.send("Not allowed"); // if we can't find user then this message is sent.

    res.render("edit", { note });
});

// SEARCH notes
router.get('/search', auth, async (req, res) => {
    const query = req.query.q;// this takes input the query user has given.

    const notes = await Note.find({ // this is regex searching using mongodb
        user: req.session.userId,// only find in users note no other users note .
        $or: [ // $or here means if the title matches the query or content matches the query or tag matches the query .
            { title:    { $regex: query, $options: 'i' } },// $regex performs partial matches like if user has typed query as w so it will show work,warehouse , west or any other thing starting with w.
            { content:  { $regex: query, $options: 'i' } }, // here $options means we're performing case-insenitive matches like  home , HOME , and Home are all the same .
            { tags:     { $regex: query, $options: 'i' } }
        ]
    });

    res.render('home', { notes , user: req.user ? req.user.name :"User" ,toastMessage: null });// we are reusing the home.ejs page to show the searched content.
});

//  UPDATE note back-end route 
// router.put('/:id', async (req, res) => { 
//   try {
//     const updatedNote = await Note.findByIdAndUpdate( // in this function if we put a id it will find the note associated with it and update the contents of note
//       req.params.id, // here in the the id sent by user request is updated by the content that user sends .
//       { title: req.body.title, content: req.body.content },
//       { new: true } // returns updated document
//     );
//     if (!updatedNote) return res.status(404).json({ message: 'Note not found' }); // here this line means that if updatedNote is not true meaning that it's not found a error message is displayed that note not found. 
//     res.json(updatedNote); // now if the above case is true then the function stops at return but if it isn't then we get the updated note.
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Update route front-end
router.put('/:id', auth,async (req, res) => {
    const { title, content, tags } = req.body; // we are extracting the user input here.

    const tagsArray = tags // here we are convertings tags that came as strings  into array. 
        ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0)// map func removes extra spaces,filter removes empty entries,and split turns string into array.
        : [];

    const note = await Note.findOneAndUpdate( // for security of user.
        { _id: req.params.id, user: req.session.userId },
        { title, content, tags: tagsArray }
    );

    if (!note) return res.send("Not allowed");

    // res.redirect('/'); // earlier we used this but for toast animation below line will be used.
    res.redirect('/notes?edited=1'); // ✅ Toast: Note Edited
});
// DELETE note backend request 
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedNote = await Note.findByIdAndDelete(req.params.id); // in this function if we put a id it will find the note associated with it and delete the  note
//     if (!deletedNote) return res.status(404).json({ message: 'Note not found' });// same logic is applied here as of updated note.
//     res.json({ message: 'Note deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// DELETE - remove a note Front-end Request
router.delete('/:id',auth, async (req, res) => {
     try {
        const deleted = await Note.findOneAndDelete({ // here we've usen this so that only particular user can delete their notes.
            _id: req.params.id,
            user: req.session.userId
        });

        if (!deleted) return res.send("Not allowed");

        // res.redirect('/'); // we are changing this for toast animation.
        res.redirect('/notes?deleted=1'); // ✅ Toast: Note Deleted
    } catch (err) {
        res.status(500).send('Error deleting note');
    }
});
module.exports = router;