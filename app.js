
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const Sentiment = require('sentiment');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Ensure that your pusher credential are properly set in the .env file  
// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID,
//     key: process.env.PUSHER_APP_KEY,
//     secret: process.env.PUSHER_APP_SECRET,
//     cluster: process.env.PUSHER_APP_CLUSTER,
//     encrypted: true
// });
const  id = '644206'
const keys = '401ca4c46fe7f220bc60'
const secret = '849299f9b2a6502d55d9'
const cluster = 'ap1'
const pusher = new Pusher({
    appId: id,
    key: keys,
    secret: secret,
    cluster: cluster,
    encrypted: false
});

app.set('port', 3000);

app.post('/messages', (req, res) => {
    const sentiment = new Sentiment();
    const sentimentScore = sentiment.analyze(req.body.text).score;
    const payload = {
        text: req.body.text,
        username: req.body.username,
        time: req.body.time,
        sentiment: sentimentScore
    }
    pusher.trigger('chat', 'message', payload);
    res.send(payload)
})
app.listen(app.get('port'), () => {
    console.log("Listening on " + app.get('port'));
})