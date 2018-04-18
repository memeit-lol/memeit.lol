let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let MongoDBStore = require('connect-mongodb-session')(session)
let expressSanitized = require('express-sanitize-escape')
let compression = require('compression')
let cors = require('cors')

let index = require('./routes/index')
let user = require('./routes/user')
let auth = require('./routes/auth')
let feed = require('./routes/feed')
let post = require('./routes/post')
let memes = require('./routes/memes')
let images = require('./routes/images')
let mods = require('./routes/mods')

let config = require('./config')
let db = require('./db')

let app = express()

app.use(cors())
app.use(compression())
let store = new MongoDBStore({
  uri: config.mongodb,
  collection: 'sessions'
})
app.use(session({
  secret: config.session.secret,
  saveUninitialized: true,
  resave: true,
  store
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }))
app.use(expressSanitized.middleware())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(async function (req, res, next) {
  if (req.session.steemconnect) {
    res.logged = true
    let is = await db.mod.find({steem: req.session.steemconnect.name})
    if (is.length > 0) res.mod = true
    else res.mod = false
  } else {
    res.logged = false
    res.mod = false
  }
  next()
})

app.use('/', index)
app.use('/dashboard', user)
app.use('/auth', auth)
app.use('/logout', auth)
app.use('/feed', feed)
app.use('/post', post)
app.use('/post/create-post', post)
app.use('/photos/memes', memes)
app.use('/photos/images', images)
app.use('/mods', mods)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
