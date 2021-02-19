const express = require('express');
const bodyParser = require('body-parser');
const validator = require('./validate');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post(
    `/api/test`,
    validator({
        body: {
            author: {
                $type: `string`,
                $required: true,
                $validate: async val => {
                    if (val.length < 10) {
                        throw `Author must be atleast 10 characters long!`;
                    }
                },
            },
            content: {
                $type: `string`,
                $required: true,
            },
            action: {
                $type: `string`,
                $enum: [
                    `upvote`,
                    `downvote`,
                ],
            },
        },
        options: {
            strict: true,
        },
    }),
    async (req, res) => {
        console.log(`We made it!`);
        res.json({ owo: `uwu` });
    },
);

app.listen(3000, () => {
    console.log('owo');
});