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

const users = [
  {
    username: 'root',
    password: 'root'
  },
  {
    username: 'toto',
    password: 'toto'
  }
]

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
    accountName: 'Compte Courant',
    accountID: '1991561',
    total: '200'
  },
  {
    userID: 'root',
    accountName: 'PEL',
    accountID: '2233456',
    total: '5467'
  },
  {
    userID: 'root',
    accountName: 'Compte Professionnel',
    accountID: '345871',
    total: '4593'
  },
  {
    userID: 'root',
    accountName: 'Compte Epargne',
    accountID: '786512',
    total: '37622'
  }
]

const operations = [
  {
    accountID: '15646564',
    operationID: '5461',
    userID: 'root',
    operationName: 'anniversaire',
    type: 'deposit',
    amount: '300'
  },
  {
    accountID: '1991561',
    operationID: '18486545',
    userID: 'root',
    operationName: 'essence',
    type: 'withdraw',
    amount: '65'
  },
  {
    accountID: '1991561',
    operationID: '48576545',
    userID: 'root',
    operationName: 'peage',
    type: 'withdraw',
    amount: '15'
  },
  {
    accountID: '1991561',
    operationID: '68576854',
    userID: 'root',
    operationName: 'Loyer',
    type: 'withdraw',
    amount: '750'
  },
  {
    accountID: '1991561',
    operationID: '24975649',
    userID: 'root',
    operationName: 'Salaire',
    type: 'deposit',
    amount: '2500'
  },
  {
    accountID: '5615615',
    operationID: '54561',
    userID: 'toto',
    operationName: 'anniversaire toto',
    type: 'deposit',
    amount: '60'
  }
]

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

app.post('/api/operationList', (req, res) => {
  console.log('Operation of User : ' + req.body.userID)
  var jsonOperations = []

  operations.forEach(element => {
    if (element.userID === req.body.userID) {
      jsonOperations.push({
        operationID: element.operationID,
        operationName: element.operationName,
        accountID: element.accountID,
        type: element.type,
        amount: element.amount,
        userID: element.userID
      })
    }
  })
  console.log(jsonOperations)
  res.json(jsonOperations)
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

app.post('/api/deleteAccount', (req, res) => {
  console.log('Delete account with ID: ' + req.body.idToRemove)
  for (var i = accounts.length - 1; i >= 0; i--) {
    if (accounts[i].accountID === req.body.idToRemove) {
      console.log('We found an account with id: ' + req.body.idToRemove + ' at index: ' + i)
      accounts.splice(i, 1)
      console.log('account ' + req.body.idToRemove + ' deleted !')
    }
  }
})

app.post('/api/createAccount', (req, res) => {
  console.log('Accounts Of (creation): ' + req.body.Name)
  var userAccounts = []

  accounts.forEach(element => {
    if (element.userID === req.body.User) {
      userAccounts.push({
        userID: element.userID,
        accountName: element.accountName,
        accountID: element.accountID,
        total: element.total
      })
    }
  })
  console.log(userAccounts)
  const errorName = userAccounts.find(u => u.accountName === req.body.Name)

  if (!errorName) {
    do {
      var generatedID = Math.round(Math.random() * 1000000000)
    } while (accounts.find(u => u.accountID === generatedID))
    accounts.push({
      userID: req.body.User,
      accountName: req.body.Name,
      accountID: generatedID,
      total: '0'
    })
    res.json({
      message: 'success'
    })
  } else {
    res.json({
      message: 'error'
    })
  }
})

app.post('/api/addOperation', (req, res) => {
  console.log('Adding Operation: ')
  var error = false
  for (var i = accounts.length - 1; i >= 0; i--) {
    if (accounts[i].accountID === req.body.accountID) {
      console.log('Account: ' + req.body.accountID + ' found')
      console.log('Account amount: ' + accounts[i].total)
      console.log('Request amount: ' + req.body.amount)
      if (req.body.type === 'withdraw') {
        if (parseInt(accounts[i].total, 10) < parseInt(req.body.amount, 10)) {
          console.log('error: Not enought money')
          error = true
        } else {
          console.log('ancien :' + accounts[i].total)
          accounts[i].total = parseInt(accounts[i].total, 10) - parseInt(req.body.amount, 10)
          console.log('nouveau :' + accounts[i].total)
        }
      } else if (req.body.type === 'deposit') {
        console.log('ancien deposit :' + accounts[i].total)
        accounts[i].total = parseInt(accounts[i].total, 10) + parseInt(req.body.amount, 10)
        console.log('nouveau deposit :' + accounts[i].total)
      }
    }
  }
  if (!error) {
    do {
      var generatedID = Math.round(Math.random() * 1000000000)
    } while (operations.find(u => u.operationID === generatedID))
    operations.push({
      accountID: req.body.accountID,
      operationID: generatedID,
      userID: req.body.userID,
      operationName: req.body.operationName,
      type: req.body.type,
      amount: req.body.amount
    })
    res.json({
      message: 'success',
      operationID: generatedID
    })
  } else {
    res.json({
      message: 'error'
    })
  }
})
