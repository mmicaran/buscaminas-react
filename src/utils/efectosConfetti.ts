
import confetti from 'canvas-confetti'

const fuegosArtificiales = () => {
  const duration = 4 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } })
  }, 250)
}

const explosion = () => {
  const scalar = 2;
  const boom = confetti.shapeFromText({ text: '💥', scalar })
  const fuego = confetti.shapeFromText({ text: '🔥', scalar })

  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.80,
    startVelocity: 40,
    scalar
  }

  function shoot() {      
    confetti({
      ...defaults,
      particleCount: 20,
      shapes: [boom],
    })

    confetti({
      ...defaults,
      particleCount: 20,
      shapes: [fuego],
    })
  }    
  setTimeout(shoot, 0)
  setTimeout(shoot, 100)
}

export { fuegosArtificiales, explosion }