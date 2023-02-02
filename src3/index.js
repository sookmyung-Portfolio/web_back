const express = require("express");
const mongoose = require("mongoose");
const server = express(); //이후 app으로 바꾸어도 상관없음

const authRouter = require("./auth.js");

const dbUrl = "mongodb+srv://lovelykitty0520:ysn09016@cluster0.ay4i2wd.mongodb.net/?retryWrites=true&w=majority"
//배포할 시, 주석 처리할 부분
const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
}

server.listen(3001, () => {
    console.log("Express server listen at 3001");
});

mongoose.connect(dbUrl, {
    // dbName: 'snowvillage',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (error) => {
    if (error) {
        console.log('데이터베이스 연결에 실패하였습니다', error);
    } else {
        console.log('데이터베이스 연결에 성공하였습니다.');
    }
})

//미들웨어를 express에 적용
server.use(express.json());

//auth 요청이 들어오면 authRouter로 라우팅
server.use("/auth", authRouter);





