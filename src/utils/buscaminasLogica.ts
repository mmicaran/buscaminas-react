import { ICasilla, IMina } from '../types'

const valores = ['1', '2', '3', '4', '5', '6', '7', '8', '🧨']
const valoresColor = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-500', 'text-pink-500', 'text-indigo-500', 'text-gray-300']
const estados = {
  'inicio': 1,
  'jugando': 2,
  'perdiste': 0,
  'ganaste': 3
}
const casillasVecinas = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
]

const generarTableroVacio = (filas: number, columnas: number) => {
  const arrayTablero = Array<ICasilla[]>()
  let num = 1
  for (let i = 0; i < filas; i++) {
    const fila = Array<ICasilla>()
    for (let j = 0; j < columnas; j++) {
      fila.push({
        x: i,
        y: j,
        num: num,
        valor: '',
        destapada: false,
        bandera: false
      } as ICasilla)
      num++
    }
    arrayTablero.push(fila)
  }
  return arrayTablero
}

const generarMinas = (numMinas: number, filas: number, columnas: number) => {
  const arrayMinas = Array<IMina>()
  for (let i = 0; i < numMinas; i++) {
    const num = Math.floor(Math.random() * (filas * columnas)) + 1
    if (arrayMinas.some(mina => mina.num === num)) {
      i--
    } else {
      const valor = "M"
      arrayMinas.push({ num, valor })
    }
  }
  return arrayMinas.sort((a, b) => a.num - b.num)
}

const guardarMinas = (minas: IMina[], tablero: ICasilla[][]) => { 
  const tableroConMinas = [...tablero] 
  tableroConMinas.forEach(fila => {
    fila.forEach(casilla => {
      const mina = minas.find(mina => mina.num === casilla.num)
      if (mina) {
        casilla.valor = mina.valor
      }
    })
  })
  return tableroConMinas
}

const completarTablero = (minas: IMina[], tableroConMinas: ICasilla[][], filas: number, columnas: number) => {
  tableroConMinas.forEach(fila => {
    fila.forEach(casilla => {
      const mina = minas.find(mina => mina.num === casilla.num)
      if (mina) {
        casillasVecinas.forEach(casillaVecina => {
          const x = casilla.x + casillaVecina.x
          const y = casilla.y + casillaVecina.y
          if (x >= 0 && x < filas && y >= 0 && y < columnas) {
            const casillaVecina = tableroConMinas[x][y]
            if (casillaVecina.valor !== 'M') {
              const valor = valores.findIndex(valor => valor === casillaVecina.valor)
              casillaVecina.valor = valores[valor + 1]
            }
          }
        })
      }
    })
  })
  return tableroConMinas
}

const generarTableroNuevo = (filas: number, columnas: number, numMinas: number) => {
  const tableroVacio = generarTableroVacio(filas, columnas)
  const arrayMinas = generarMinas(numMinas, filas, columnas)
  const tableroConMinas = guardarMinas(arrayMinas, tableroVacio)
  const tableroCompleto = completarTablero(arrayMinas, tableroConMinas, filas, columnas)

  return {tableroCompleto, arrayMinas}
}

const destaparCeldas = (casilla: ICasilla, tableroActualizado: ICasilla[][], filas: number, columnas: number) => {  
  casillasVecinas.forEach(casillaVecina => {
    const x = casilla.x + casillaVecina.x
    const y = casilla.y + casillaVecina.y
    if (x >= 0 && x < filas && y >= 0 && y < columnas) {
      const casillaVecina = tableroActualizado[x][y]
      if (!casillaVecina.destapada && !casillaVecina.bandera) {
        casillaVecina.destapada = true
        tableroActualizado[x][y] = casillaVecina
        if (casillaVecina.valor === '') {
          destaparCeldas(casillaVecina, tableroActualizado, filas, columnas)
        }
      }
    }
  })
}

const comprobarVictoria = (tablero: ICasilla[][], minasAComprobar: IMina[]) => {
  // Comprobar si todas las celdas no destapadas son minas
  const celdasNoDestapadas = tablero.flat().filter(casilla => !casilla.destapada)
  if (celdasNoDestapadas.length === minasAComprobar.length) {
    destaparMinas(tablero, minasAComprobar)
    return estados.ganaste
  }
  
  // Comprobar si todas las minas están marcadas
  const minasEnTablero = minasAComprobar.map(mina => {
    return tablero.flat().find(casilla => casilla.num === mina.num)
  })
  const minasMarcadas = minasEnTablero.filter(casilla => casilla?.bandera)
  
  if (minasMarcadas.length === minasAComprobar.length) {
    destaparMinas(tablero, minasAComprobar)
    return estados.ganaste
  }  

  // Si no se cumple ninguna de las condiciones anteriores, el juego sigue
  return estados.jugando
}

const destaparMinas = (tablero: ICasilla[][], minas: IMina[]) => {
  tablero.flat().forEach(casilla => {
    const mina = minas.find(mina => mina.num === casilla.num)
    if (mina) {
      casilla.destapada = true
      casilla.bandera = false
    }
  })
}

export {
  generarTableroNuevo,
  destaparCeldas,
  comprobarVictoria,
  destaparMinas,
  estados,
  valores,
  valoresColor
}