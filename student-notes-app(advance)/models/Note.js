const mongoose = require("mongoose"); // we are importing a library mongoose that helps us talk to mongodb easily , it provides us the tools to create schemas and models .

// Define the schema (the structure of a note) how the note will look like 
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // title must be provided
  },
  content: {
    type: String,
    required: true,  // note content must be provided
  },
  createdAt: {//this field stores the date and time the note was created at .
    type: Date,
    default: Date.now, // auto sets the current date
  },

   
   tags: { // this is our new feature the tag feature .
    type: [String],
    default: []
    } ,

  user: { // here we have added this so only a particular user can see their own notes.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}


});

// Create the model (represents the "notes" collection in MongoDB)
const Note = mongoose.model("Note", noteSchema);

module.exports = Note;