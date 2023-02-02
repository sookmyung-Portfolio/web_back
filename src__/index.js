const express = require('express'); // express 임포트
const app = express(); // app생성
const bodyParser = require('body-parser');
const port = 5000;
const { User } = require('./models/User'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencode
app.use(express.json()); // application/json

// 몽구스 연결
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
  .connect(
    'mongodb+srv://lovelykitty0520:ysn09016@cluster0.eaz2vis.mongodb.net/snowvillage',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB connected!!'))
  .catch((err) => {
    console.log(err);
  });


// 1.
app.get('/', function (req, res) {
  res.json('정상적으로 연결되었습니다.');
});

// 2. register api
// 회원가입에 필요한 정보들을 클라이언트에서 가져오면 그것들을 데이터베이스에 저장해야 함.
app.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});



// module.exports = router;
app.listen(port, () => console.log(`${port}포트입니다.`));


  