const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events

const engine = Engine.create()

const custWidth = window.innerWidth
const custHeight = window.innerHeight

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: custWidth,
    height: custHeight,
    wireframes: false,
    background: 'skyblue'
  }
})

const topWall = Bodies.rectangle(custWidth/2, 0, custWidth, 20, { isStatic: true, density: 10000 })
const leftWall = Bodies.rectangle(0, custHeight/2, 20, custHeight, { isStatic: true, density: 10000 })
const rightWall = Bodies.rectangle(custWidth, custHeight/2, 20, custHeight, { isStatic: true, density: 10000 })
const bottomWall = Bodies.rectangle(custWidth/2, custHeight, custWidth, 20, { isStatic: true, density: 10000, restitution: 0 })

const ball = Bodies.circle(custWidth/2, custHeight/2, 30, { restitution: 1, id: 'ball' })
ball.render.sprite.texture = './football.png'
ball.render.sprite.xScale = .07
ball.render.sprite.yScale = .07

const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: Matter.Mouse.create(render.canvas)
})
let score = 0
let highscore = 0

const onClick = () => {
  if (mouseConstraint.body === ball) {
    const xForce = mouseConstraint.mouse.position.x - ball.position.x > 0 ? -Math.random() * 0.05 : Math.random() * 0.05
    Body.applyForce(ball, ball.position, {x: xForce, y: -0.2})
    score += 1
    document.getElementById('score').innerText = score
    if (highscore <= score) {
      highscore = score
      document.getElementById('highscore').innerText = highscore
    }
  }
}

const collision = () => {
  const col = Matter.SAT.collides(ball, bottomWall)
  if (col.collided) {
    score = 0
    document.getElementById('score').innerText = score
    document.getElementById('highscore').innerText = highscore
  }

}

window.addEventListener('resize', () => window.location.reload())

Events.on(engine, 'tick', collision)

Events.on(mouseConstraint, 'mousedown', onClick)

World.add(engine.world, [topWall, leftWall, rightWall, bottomWall, ball])

engine.world.gravity.y = 1.3
Engine.run(engine)
Render.run(render)