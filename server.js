/**
 *
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'blablablabla', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

const users = [{
  username: 'root',
  password: 'root'
}]

app.get('/api/test', (req, res) => {
  console.log('ce console.log est appelé au bon moment')
  res.json([
    {
      title: 'truc',
      content: 'machin'
    }, {
      title: 'truc2',
      content: 'machin2'
    }
  ])
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

app.get('/api/logout', (req, res) => {
  if (!req.session.userId) {
    res.status(401)
    res.json({
      message: 'you are already disconnected'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'you are now disconnected'
    })
  }
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

app.post('/api/register', (req, res) => {
  console.log('req.body', req.body)
  const test = users.find(u => u.username === req.body.username)
  if (!test) {
    res.json({
      status: true
    })
  } else {
    res.json({
      status: false
    })
  }
})

app.post('/api/createuser', (req, res) => {
  console.log('req.body', req.body)
  console.log('req.query', req.query)
  users.push({
    username: req.body.username,
    password: req.body.password
  })
})

app.post('/api/login', (req, res) => {
  console.log('req.body', req.body)
  console.log('req.query', req.query)
  if (!req.session.userId) {
    const isLoginCorrect = users.find(u => u.username === req.body.username && u.password === req.body.password)
    if (!isLoginCorrect) {
      res.json({
        status: false,
        message: 'username or password error'
      })
    } else {
      req.session.userId = 1000
      res.json({
        status: true,
        message: 'connected'
      })
    }
  } else {
    res.status(401)
    res.json({
      message: 'you are already connected'
    })
  }
})
