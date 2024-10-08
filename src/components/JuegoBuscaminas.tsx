import { useEffect, useState } from "react"

import { ICasilla, IMina } from "../types.d"
import { Casilla } from "./Casilla"
import { generarTableroNuevo, destaparCeldas, comprobarVictoria, estados, destaparMinas } from "../utils/buscaminasLogica"
import { fuegosArtificiales, explosion } from "../utils/efectosConfetti"


export const JuegoBuscaminas = () => {
  const [numMinas, setNumMinas] = useState(8)
  const [contadorMinas, setContadorMinas] = useState(8)
  const [filas, setFilas] = useState(10)
  const [columnas, setColumnas] = useState(10)
  const [temporizador, setTemporizador] = useState(0)
  const [tablero, setTablero] = useState<ICasilla[][]>([])
  const [minas, setMinas] = useState<IMina[]>([])
  const [jugando, setJugando] = useState(false)
  const [estado, setEstado] = useState(estados.inicio)

  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => { }, 1000)
    if (jugando) {
      interval = setInterval(() => {
        setTemporizador((prev) => prev + 1)
      }, 1000)
    } else if (!jugando) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [jugando])


  const actualizarTablero = (type: string, casilla: ICasilla, filas: number, columnas: number) => {
    const tableroActualizado = [...tablero]
    if (!jugando) {
      setJugando(true)
    }
    if (type === 'contextmenu') {
      casilla.bandera = !casilla.bandera
      tableroActualizado[casilla.x][casilla.y] = casilla
      if (casilla.bandera) setContadorMinas(contadorMinas - 1)
      else setContadorMinas(contadorMinas + 1)
      setTablero(tableroActualizado)
    }
    else if (type === 'click' && !casilla.bandera) {
      casilla.destapada = true
      tableroActualizado[casilla.x][casilla.y] = casilla
      setTablero(tableroActualizado)
      if (casilla.valor === 'M') {
        casilla.valor = "💥"
        destaparMinas(tableroActualizado, minas)
        setEstado(estados.perdiste)
      }
      else if (casilla.valor === '') {
        destaparCeldas(casilla, tableroActualizado, filas, columnas)
      }
    }
  }


  const reiniciarJuego = (filasN: number, columnasN: number, numMinasN: number) => {
    const { tableroCompleto, arrayMinas } = generarTableroNuevo(filasN, columnasN, numMinasN)
    setNumMinas(numMinasN)
    setContadorMinas(numMinasN)
    setColumnas(columnasN)
    setFilas(filasN)
    setMinas(arrayMinas)
    setTablero(tableroCompleto)
    setTemporizador(0)
    setEstado(estados.jugando)
  }

  const hanleClickReiniciar = () => {
    setJugando(false)
    reiniciarJuego(filas, columnas, numMinas)
  }



  useEffect(() => {
    if (estado === estados.inicio && !jugando) {
      reiniciarJuego(10, 10, 10)
    }
    else if (estado === estados.jugando && jugando) {
      const resultado = comprobarVictoria(tablero, minas)
      setEstado(resultado)
    }
    else if (estado === estados.ganaste) {
      setJugando(false)
      destaparMinas(tablero, minas)
      fuegosArtificiales()
    }
    else if (estado === estados.perdiste) {
      setJugando(false)
      explosion()
    }
  }, [estado, jugando, tablero, minas])

  const hanleClickDestapar = () => {
    const tableroActualizado = [...tablero]
    tableroActualizado.flat().forEach(casilla => {
      casilla.destapada = true
      casilla.bandera = false
    })
    setTablero(tableroActualizado)
  }

  return (
    <>
      <div className="self-start">
        <h1 className="w-max text-5xl font-extrabold text-center py-10">
          BUSCAMINAS 💣
        </h1>        
        <div className="flex flex-col">
          <label htmlFor="filas" className="text-lg font-semibold mb-1">Filas</label>
          <input type="number" id="filas" value={filas} onChange={(e) => setFilas(parseInt(e.target.value))} className="input-custom" />
          <label htmlFor="columnas" className="text-lg font-semibold mb-1">Columnas</label>
          <input type="number" id="columnas" value={columnas} onChange={(e) => setColumnas(parseInt(e.target.value))} className="input-custom" />
          <label htmlFor="minas" className="text-lg font-semibold mb-1">Numero de minas</label>
          <input type="number" id="minas" value={numMinas} onChange={(e) => setNumMinas(parseInt(e.target.value))} className="input-custom" />          
          <button className="btn-primary my-2" onClick={hanleClickReiniciar}>Aplicar y Reiniciar</button>
          <button className="btn-primary my-2" onClick={hanleClickDestapar}>Mostrar solución</button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-fit bg-gray-900 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between p-2 mb-4">
            <div className="flex flex-col items-center">
              <p className="h1">Minas</p>
              <p className="h1">{contadorMinas}</p>
            </div>
            {
              (estado === estados.jugando && jugando) && (<p className="text-5xl pb-1">🤓</p>)
              ||
              estado === estados.perdiste && (<p className="text-5xl pb-1">😵</p>)
              ||
              estado === estados.ganaste && (<p className="text-5xl pb-1">🥳</p>)
              ||
              (<p className="text-5xl pb-1">🙂</p>)
            }
            <div className="flex flex-col items-center">
              <p className="h1">Tiempo</p>
              <p className="h1">{temporizador}s</p>
            </div>
          </div>
          <div>
            {
              tablero.map((fila, i) => (
                <div key={i} className="flex">
                  {
                    fila.map((casilla) => (
                      <Casilla key={casilla.num} casilla={casilla} actaulizarTablero={actualizarTablero} numFilas={filas} numColumnas={columnas} jugando={jugando} estado={estado} />
                    ))
                  }
                </div>
              ))
            }
            {
              estado === estados.perdiste && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-700 bg-opacity-70 rounded-xl px-14 py-10 flex flex-col items-center justify-center">
                    <p className="text-3xl text-white font-extrabold mb-2">¡BOOM!</p>
                    <p className="text-5xl">💥</p>
                    <p className="text-white font-bold mt-4">Has perdido</p>
                    <p className="text-white mb-4">Minas marcadas {numMinas - contadorMinas}</p>
                    <button className="btn-danger" onClick={hanleClickReiniciar}>Volver a jugar</button>
                  </div>
                </div>
              )
            }
            {
              estado === estados.ganaste && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                  <div className="bg-gray-700 bg-opacity-70 rounded-xl px-14 py-10 flex flex-col items-center justify-center">
                    <p className="text-3xl text-white font-extrabold mb-2">¡HAS GANADO!</p>
                    <p className="text-5xl">🎉</p>
                    <p className="text-white font-semibold mt-4">Completado en </p>
                    <p className="text-white font-semibold">{temporizador}s</p>
                    <p className="text-3xl text-yellow-600 font-extrabold mb-4">¡Nuevo record!</p>
                    <button className="btn-success" onClick={hanleClickReiniciar}>Volver a jugar</button>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}