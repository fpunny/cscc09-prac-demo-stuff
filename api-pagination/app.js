const express = require('express');
const bodyParser = require('body-parser');
const Nedb = require('nedb');
const app = express();

// ENVIRONMENT VARIABLES
const ORIGIN = 'http://localhost:3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const itemsDB = new Nedb({ filename: 'items.db', autoload: true });
let cache = [];

function getAllItems(_then, _catch) {
    if (!cache) {
        itemsDB.find({}, { _id: true, author: false, content: false }, (err, _items) => {
            if (err) {
                _catch(err);
            }
            
            cache = _items.map(({ _id }) => _id);
            _then(cache);
        });
    } else {
        _then(cache);
    }
}

app.get('/api/items', async (req, res) => {
    getAllItems(
        items => {
            const [ first, next ] = items.slice(0, 2);
            itemsDB.findOne({ _id: first }, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.write(`No >:c`);
                    return res.end();
                }

                res.json(Object.assign(
                    { data },
                    next && {
                        next: `${ORIGIN}/api/items/${next}`,
                    },
                ));
            });
        },
        err => {
            console.error(err);
            res.status(500);
            res.write(`No >:c`);
            return res.end();
        }
    );
});

app.post('/api/items', async (req, res) => {
    itemsDB.insert(req.body, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500);
            res.write(`No >:c`);
            return res.end();
        }

        getAllItems(
            items => {
                const prev = items[items.length - 1];
                items.push(data._id);

                res.json(Object.assign(
                    { data },
                    prev && {
                        prev: `${ORIGIN}/api/items/${prev}`,
                    },
                ));
            },
            err => {
                console.error(err);
                res.status(500);
                res.write(`No >:c`);
                return res.end();
            },
        );
    });
});

app.get('/api/items/:id', async (req, res) => {
    itemsDB.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            console.error(err);
            res.status(404);
            res.write(`No >:c`);
            return res.end();
        }

        getAllItems(
            items => {
                const index = items.indexOf(data._id);
                const prev = items[index - 1];
                const next = items[index + 1];

                res.json(Object.assign(
                    { data },
                    prev && {
                        prev: `${ORIGIN}/api/items/${prev}`,
                    },
                    next && {
                        next: `${ORIGIN}/api/items/${next}`,
                    },
                ));
            },
            err => {
                console.error(err);
                res.status(404);
                res.write(`No >:c`);
                return res.end();
            }
        );
    });
});

app.listen(3000, () => {
    console.log(`server is running owo`);
});
