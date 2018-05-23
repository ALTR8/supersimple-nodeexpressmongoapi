let ObjectID = require('mongodb').ObjectID;
let bcrypt = require('bcrypt');
const saltRounds = 10;

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

    app.post('/users', (req, res) => {
        const password = bcrypt.hashSync(req.body.password, saltRounds);
        console.log(password);
        const user = {name: req.body.name, email: req.body.email, password: password};
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
