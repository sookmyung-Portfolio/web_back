const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 5000;


const { User } = require('./models/User'); // 1. 지난 번 만들어 두었던 User.js(스키마) 임포트


app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencode

app.use(express.json()); // application/json


// 1.
app.get('/', function (req, res) {
  res.send('hello world');
});

// 2. register api
const express = require('express');
const router = express.Router();
const {User} = require('../models/User');

router.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

module.exports = router;

app.listen(port, () => console.log(`${port}포트입니다.`));

// 몽구스 연결
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://lovelykitty0520:ysn09016@cluster0.ay4i2wd.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log(err);
  });
  