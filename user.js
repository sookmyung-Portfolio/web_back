var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

//회원가입처리
passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    passReqToCallback: true
  }, function (req, email, pw, done) {
    console.log('local-join');
  }))

  router.post('/join', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true
  }));

  passport.use('local-join', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    passReqToCallback: true
  }, function (req, email, pw, done) {
    var sql = 'select * from test where email =?';
    var query = client.query(sql, [email], function (err, datas) {
      if (err) return done(err);
      if (datas.length) {
        console.log('existed user');
        return done(null, false, {
          message: 'your email is already used'
        });
      } else {
        var sql = 'insert into test(email, pw) values(?,?)';
        var query = client.query(sql, [email, pw], function (err, datas) {
          if (err) return done(err);
          return done(null, {
            'email': email,
            'id': datas.insertId
          })
        });
      }
    })
  }))

  router.get('/join', function (req, res, next) {
    var msg;
    var errMsg = req.flash('error');
    if (errMsg) {
      msg = errMsg;
    }
    res.render('join', {
      title: 'join',
      message: msg
    });
  });

  passport.serializeUser(function (user, done) {
    console.log('passport session save: ', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    console.log('passport session get id: ', id);
  
    done(null, id);
  });

  router.get('/main', function (req, res, next) {
    var id = req.user;
    res.render('index', {
      title: 'index',
      id
    });
  });

// 로그인 처리
router.get('/', function (req, res, next) {
    var msg;
    var errMsg = req.flash('error');
    if (errMsg) {
      msg = errMsg;
    }
    res.render('login', {
      title: 'login',
      message: msg
    });
  });
  
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/main',
    failureRedirect: '/',
    failureFlash: true
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pw',
    passReqToCallback: true
  }, function (req, email, pw, done) {
    console.log(req);
    var sql = 'select * from test where email =? and pw=?';
    client.query(sql, [email, pw], function (err, datas) {
      if (err) return done(err);
      if (datas.length) {
        return done(null, {
          id: email
        });
      } else {
        return done(null, false, {
          message: '아이디 혹은 비밀번호가 틀립니다.'
        })
      }
    })
  }));

  //로그아웃처리
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });