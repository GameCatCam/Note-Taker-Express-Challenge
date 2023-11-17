const notes = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils')

// GET /api/notes (reads json and returns all saved notes)
notes.get('/', (req, res) => 
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
)

// POST /api/notes (recieves note from app, adds it to JSON, then sends it back to app)
notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        }

        readAndAppend(newNote, './db/db.json')

        const response = {
            status: 'success',
            body: newNote,
        }

        console.log(response)
        res.json(response)
    } else {
        res.json('Error in creating Note...')
    }
})

// DELETE /api/notes/:id (recieves notes id, and deletes it)
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const newDb = json.filter((note) => note.id !== noteId)

            writeToFile('./db/db.json', newDb)

            console.log(`Note ${noteId} has been deleted!`)
            res.json(`Note ${noteId} has been deleted!`)
        })
})

module.exports = notes