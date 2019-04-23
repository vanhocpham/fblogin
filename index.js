const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const http = require('http')
const FacebookChatApi = require('facebook-chat-api')
const CookieFacebook = require('./cookieFacebook')
const ConvertCookieToObject = require('./cookie')
const fs = require('fs')
const server = http.createServer(app)
const config = require('./config/config')

app.set('port', 9999);
app.use( bodyParser.json( { "limit": "500MB", "extended": true } ) );
app.use( bodyParser.urlencoded( { "limit": "500MB", "extended": true } ) );
app.use(logger('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Running')
})

//listen a port
server.listen(9999, () => {
  console.log(`Api server running on localhost:9999`)
});
// function global get api facebook
let api = null
let loginCookie = data => {
  return new Promise((resolve, res) => {
    FacebookChatApi({appState: data.cookie}, (err, api) => {
      if (err) {
        console.log(err)
        return
      } else {
        resolve(api)
      }
    })
  })
}
// pre process with cookie facebook

const result = ConvertCookieToObject(config.COOKIE)[0]
const defineAgainCookie = CookieFacebook(
  result.fr,
  result.datr,
  result.c_user,
  result.xs
)
// login facebook with cookie to get data
api = loginCookie({cookie: defineAgainCookie}, err => {
  if (err) console.error()
})




module.exports = app
