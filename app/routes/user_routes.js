let ObjectID = require('mongodb').ObjectID;
let bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator/check');

module.exports = function(app, db) {
    app.get('/users', (req, res) => {
        db.collection('users').find().toArray(function(err, results) {
            if (err) {
                res.send({'error': 'an error occured when adding a user'});
            } else {
                res.send(results)
            }
        });
    });

    app.post('/users', [
        check('email', 'please use a valid email address').isEmail(),
        // check('email', 'this email already exists in our database. Please try again with a new email')
        check('password', 'you password is invalid. It must be at least 6 characters and include at least one number and one letter').isLength({min: 6}).matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
        check('name', 'you must include your name and it can only contain alpha-numeric characters').exists().isAlpha()
    ], (req, res) => {
        let email = req.body.email;
        let name = req.body.name;
        let password = bcrypt.hashSync(req.body.password, saltRounds);
        const user = {name: req.body.name, email: email, password: password};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        db.collection('users').insert(user, (err, result) => {
            if (err) {
                res.send({'error': 'an error occured when adding a user'});
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('users').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    app.put('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const user = { text: req.body.body, title: req.body.title };
        db.collection('users').update(details, user, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(user);
            }
        });
    });

    app.delete('/users/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('users').remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('User ' + id + ' deleted!');
            }
        });
    });
};
