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

  availableMoves = ['up', 'right', 'down', 'left']
  availableMoves = avoidWalls(availableMoves, head, board)
  availableMoves = avoidSelf(availableMoves, head, you.body)
  // availableMoves = avoidOtherSnakes(availableMoves, head, board.snakes)

  console.log('availableMoves', availableMoves)
  console.log('availableMoves[0]', availableMoves[0])

  // Response data
  const data = {
    move: availableMoves[0]
  }

  return response.json(data)
})

const avoidOtherSnakes = (availableMoves, position, snakes) => {
  console.log('snakes', snakes)
  snakes.forEach(function (snake) {
    console.log('snake body', snake.body)
  })
  let possiblePosition = position
  console.log('availableMoves', availableMoves)
  availableMoves = availableMoves.filter(function (move) {
    if (move === 'up') {
      possiblePosition = { x: x, y: y - 1 }
    } else if (move === 'down') {
      possiblePosition = { x: x, y: y + 1 }
    } else if (move === 'right') {
      possiblePosition = { x: x + 1, y: y }
    } else if (move === 'left') {
      possiblePosition = { x: x - 1, y: y }
    }
    snakes.forEach(function (snake) {
      console.log('snake body', snake.body)
    })
  })
}

const avoidSelf = (availableMoves, position, body) => {
  let x = position['x']
  let y = position['y']

  let possiblePosition = position
  availableMoves = availableMoves.filter(function (move) {
    if (move === 'up') {
      possiblePosition = { x: x, y: y - 1 }
    } else if (move === 'down') {
      possiblePosition = { x: x, y: y + 1 }
    } else if (move === 'right') {
      possiblePosition = { x: x + 1, y: y }
    } else if (move === 'left') {
      possiblePosition = { x: x - 1, y: y }
    }
    return body.find(function (element) {
      return element.x === possiblePosition.x && element.y === possiblePosition.y
    }) === undefined
  })

  console.log('after', availableMoves)
  return availableMoves
}

const avoidWalls = (availableMoves, position, board) => {
  let x = position['x']
  let y = position['y']

  // leftWall = when x is 0
  if (x === 0) {
    console.log('hitting x === 0)')
    availableMoves = availableMoves.filter(value => value !== 'left')
  }
  // rightWall = when x is board.width - 1
  if (x === board.width - 1) {
    console.log('hitting x === board.width - 1)')
    availableMoves = availableMoves.filter(value => value !== 'right')
  }
  // topWall = when y is 0
  if (y === 0) {
    console.log('hitting y === 0)')
    availableMoves = availableMoves.filter(value => value !== 'up')
  }
  // bottomWall = when y is board.height - 1
  if (y === board.height - 1) {
    console.log('hitting y === board.height - 1)')
    availableMoves = availableMoves.filter(value => value !== 'down')
  }

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
