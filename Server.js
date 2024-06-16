const express = require('express');
const mongojs = require("mongojs");

// If you use the shared MongoDB server:
const db = mongojs(
    'mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024',
);

// If you use your own local MongoDB server:
// const db = mongojs(
//     'mongodb://127.0.0.1:27017/exercise6',
//     ['tasks']
// );

// Edit this line to point to your specific collection!
const myCollection = db.collection('mitzinet_<amit_ofek>');

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// Serve static files from the 'static' directory
app.use(express.static('static'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function ServerValidation(newUser) {
    const Regex = {
        'text': /^[a-zA-Z]+$/,
        'phone_number': /^[0-9]*$/,// in addition, phone number has to contain exact 10 digits.
        'email': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };
    if (!(Regex.text).test(newUser.first_name) || !(Regex.text).test(newUser.last_name)) {
        return {
            is_Val: false,
            msg: 'Invalid name fields',
        };
    }
    if (!(Regex.phone_number).test(newUser.phone_number) || newUser.phone_number.trim().length !== 10) {
        return {
            is_Val: false,
            msg: "Invalid phone number",
        };
    }
    if (!(Regex.email).test(newUser.email)) {
        return {
            is_Val: false,
            msg: "Illegal email address",
        };
    }
    if (newUser.password.length < 8) {
        return {
            is_Val: false,
            msg: "Password must be 8 characters",
        };
    }
    if (newUser.password !== newUser.confirm_password) {
        return {
            is_Val: false,
            msg: "Passwords do not match",
        };
    }

    return {
        is_Val: true
    };
}

// POST request to register a new user
app.post('/register', (req, res) => {
    const newUser = {
        'first_name': req.body.first_name,
        'last_name': req.body.last_name,
        'phone_number': req.body.phone_number,
        'email': req.body.email.toLowerCase(),
        'password': req.body.password,
        'confirm_password': req.body.confirm_password
    };

    const ValidObject = ServerValidation(newUser);
    if (!ValidObject.is_Val) {
        return res.status(402).send({ message: ValidObject.msg });
    }

    // Check if email already exists
    myCollection.findOne({ email: req.body.email.toLowerCase() }, (err, doc) => {
        if (err) {
            return res.status(500).end("Internal Server Error");
        }
        if (doc) {
            return res.status(400).end("Email is already registered");
        }

        // Email doesn't exist, proceed with insertion
        myCollection.insert(newUser, (err, doc) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(doc);
        });
    });
});