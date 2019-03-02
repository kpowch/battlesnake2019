const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#bf42f4',
    headtype: 'silly',
    tailType: 'round-bum'
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  const board = request.body.board

  const you = request.body.you
  const head = you.body[0]
  console.log('head', head)

  let availableMoves = ['up', 'left', 'down', 'right']
  console.log("head['x']", head['x'])
  console.log("head['y']", head['y'])

  availableMoves = examineWall(availableMoves, head)
  console.log('examineWall', examineWall(availableMoves, head))

  console.log('availableMoves', availableMoves)

  // Response data
  const data = {
    move: availableMoves[0]
  }

  return response.json(data)
})

const examineWall = (availableMoves, position) => {
  console.log('position[x]', position['x'])
  console.log('position[y]', position['y'])

  // leftWall = when x is 0
  if (position['x'] === 0) {
    console.log("hitting position['x'] === 0)")
    availableMoves = availableMoves.filter(value => value !== 'left')
  }
  // rightWall = when x is board.width
  if (position['x'] === board.width) {
    console.log("hitting position['x'] === board.width)")
    availableMoves = availableMoves.filter(value => value !== 'right')
  }
  // topWall = when y is 0
  if (position['y'] === 0) {
    console.log("hitting position['y'] === 0)")
    availableMoves = availableMoves.filter(value => value !== 'up')
  }
  // bottomWall = when y is board.height
  if (position['y'] === board.height) {
    console.log("hitting position['y'] === board.height)")
    availableMoves = availableMoves.filter(value => value !== 'down')
  }
  console.log('here', availableMoves)
  return availableMoves
}

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({})
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
