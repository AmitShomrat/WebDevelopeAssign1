const express = require('express');
const mongojs = require("mongojs");

//If you use the shared mongodb server:
const db = mongojs(
    'mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024',
);

//If you use your own local mongodb server:
// const db = mongojs(
//     'mongodb://127.0.0.1:27017/exercise6',
//     ['tasks']
// );

//Edit this line to point to your specific collection!
const myCollection = db.collection('Amit');

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// Serve static files from the 'static' directory
app.use(express.static('static'));


// POST request to add new task to the file
app.post('/register', (req, res) => {
    myCollection.findOne({email: req.body.email}, (err, doc) => {
        if (err) {
            res.status(500).end("Internal Server Error");
        }
        if(doc){
            res.status(400).end("Email is already registered");
            return
        }
        //Email doesn't exist
        const newUser = {
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'phone_number': req.body.phone_number,
            'email': req.body.email,
            'password': req.body.password
        }

        myCollection.insert(newUser, (err, doc)=>{
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(201).json(doc);
            }
        })
    })
});

















// GET route to fetch all tasks from the “tasks.json” file
app.get('/tasks', (req, res) => {
    myCollection.find((err,docs)=>{
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(docs);
        }
    })
});

// GET route to fetch a specific single task from the file by task ID
app.get('/tasks/:id', (req, res) => {
    const taskId = mongojs.ObjectId(req.params.id);
    myCollection.findOne({_id:taskId}, (err, doc) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        }
    });

});
// PUT request to update a given task (name, is_done)
app.put('/tasks/:id', (req, res) => {
    const taskId = mongojs.ObjectId(req.params.id);
    updated_name = req.body.name && req.body.name.trim().length > 0 ? req.body.name.trim() : null;
    updated_is_done = req.body.is_done !== undefined ? Boolean(req.body.is_done) : null;

    myCollection.findOne({_id:taskId}, (err, doc) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (doc) {
                if (updated_name)
                    doc.name = updated_name

                if (updated_is_done !== null)
                    doc.is_done = updated_is_done

                myCollection.save(doc)
                res.status(201).json(doc);

            } else {
                res.status(404).json({ error: 'Task not found' });
            }
        }
    });

});

// DELETE request to delete a specific task
app.delete('/tasks/:id', (req, res) => {
    const taskId = mongojs.ObjectId(req.params.id);
    myCollection.remove({_id:taskId}, true,(err, doc) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({msg:"Successfully deleted"});
        }
    });

});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
