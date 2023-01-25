var express = require('express');
var jquery = require('jquery');
var app = express();
const bodyParser = require('body-parser');
const { reset } = require('nodemon');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({extended : true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//middleware
app.use('/public', express.static('public'));

var db;
MongoClient.connect('mongodb+srv://lovelykitty0520:ysn09016@cluster0.ay4i2wd.mongodb.net/?retryWrites=true&w=majority',
    function(error, client) {
        // error가 발생했을 떄의 출력
        if(error) return console.log(error)

        // todoapp이라는 database에 연결 요청
        db = client.db('todoapp');
        // 데이터 저장
        // db.collection('post').insertOne({name:'현서', age:20, _id: 100}, function(error, result){
        //     console.log('save success!');
        // });

        // 연결 완료 메세지 출력
        app.listen(3000, function(){
            console.log('Connected, 3000 port!');
    });
})

//로그인
app.get('/app/login', function(req, res) { 
    res.render('')
});

//메인
app.get('/app/main', function(req, res) { 
    res.render('')
});

//회원가입
app.get('/app/users', function(req, res) { 
    res.render('')
});

//질문게시판
app.get('/app/questions', function(req, res){
    res.render('')
});

//스펙게시판
app.get('/app/quals', function(req, res) { 
    res.render('')
});

//후기게시판
app.get('/app/reviews', function(req, res) { 
    res.render('')
});

// 회원인증기능
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret: "비밀코드", resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// 아이디 및 비밀번호가 맞으면 로그인 성공페이지로 보내주어야 함.
// local 방식으로 회원인지 인증
app.post('/login', passport.authenticate('local', {
    // 로그인을 실패하면 해당 경로로 이동
    failureRedirect: '/fail'
}), function(req, res){
    res.redirect('/main');
});

app.get('/mypage', 로그인여부판단,function(req, res){
    console.log(req.user);
    res.render('mypage.ejs', {user: req.user})
});

function 로그인여부판단(req, res, next){
    if(req.user){
        next()
    } else {
        res.send('로그인을 하지 않으셨습니다.')
    };
};

passport.use(new LocalStrategy({

    usernameField: 'id',
    passwordField: 'password',
    session: true, // session에 저장할 것인지
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (error, result) {
      if (error) return done(error)
  
      if (!result) return done(null, false, { message: '존재하지 않는 아이디입니다.' })
      if (입력한비번 == result.password) { //입력한 비번과 결과 비밀번호 비교
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호가 틀렸습니다.' })
      }
    })
  }));

//id를 이용해서 세션을 저장시키는 코드 (로그인 성공시 사용)
passport.serializeUser(function(user, done) {
    done(null, user.id)
});

//나중에 사용 (마이페이지 접속시 사용)
passport.deserializeUser(function(아이디, done){
    //db에서 위에 있는 user.id로 유저를 찾은 뒤 유저 정보를 사용
    db.collection('login').findOne({id: 아이디}, function(error, result){
        done(null, result)
    });
});

app.post('/register', function (req, res) {
    db.collection('login').insertOne({ id: req.body.id, password: req.body.password }, function (error, result) {
      res.redirect('/')
    });
});


