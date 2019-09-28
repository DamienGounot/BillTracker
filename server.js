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

app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))

app.use(session({
  secret: 'blablablabla', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))
app.use(morgan('dev'))
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})

const users = [{
  username: 'root',
  password: 'root'
}]

const accounts = [
  {
    userID: 'root',
    accountName: 'Livret A',
    accountID: '15646564',
    total: '14576'
  },
  {
    userID: 'toto',
    accountName: 'PEL',
    accountID: '5615615',
    total: '54879'
  },
  {
    userID: 'root',
    accountName: 'Livret Jeune',
    accountID: '1991561',
    total: '200'
  }
]

const operations = [{
  accountID: '15646564',
  operationID: '5461',
  operationName: 'essence',
  type: 'debit',
  amount: '60'
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

app.post('/api/logout', (req, res) => {
  req.session.destroy()
  if (!req.session) {
    console.log('You are deconnected')
  }
})

app.post('/api/register', (req, res) => {
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
  if (!req.session.userId) {
    const isLoginCorrect = users.find(u => u.username === req.body.username && u.password === req.body.password)
    if (!isLoginCorrect) {
      res.json({
        status: false,
        message: 'username or password error'
      })
    } else {
      req.session.userId = 1
      console.log('UserID: ' + req.session.userId)
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

app.post('/api/accountList', (req, res) => {
  console.log('Accounts of : ' + req.body.user)
  var jsonAccounts = []

  accounts.forEach(element => {
    if (element.userID === req.body.user) {
      jsonAccounts.push({
        userID: element.userID,
        accountName: element.accountName,
        accountID: element.accountID,
        total: element.total
      })
    }
  })
  console.log(jsonAccounts)
  res.json(jsonAccounts)
})

app.post('/api/addOperation', (req, res) => {
})
