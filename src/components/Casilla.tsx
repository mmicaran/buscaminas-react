import { MouseEvent } from "react"
import { ICasilla } from "../types.d"
import { estados, valoresColor, valores } from "../utils/buscaminasLogica"

interface CasillaProps {
  casilla: ICasilla
  actaulizarTablero: (type: string, casilla: ICasilla, filas: number, columnas: number) => void
  estado: number
  jugando: boolean
  numFilas: number
  numColumnas: number
}

export const Casilla = ({ casilla, actaulizarTablero, jugando, numFilas, numColumnas, estado }: CasillaProps) => {
  let className = "w-6 h-6 border font-bold border-gray-700 hover:bg-gray-700"
  if (casilla.destapada) className += " bg-gray-800"

  if (casilla.valor !== "M" && casilla.valor !== "") {
    const valor = valores.findIndex(valor => valor === casilla.valor)
    className += ` ${valoresColor[valor]}`
  }

  const handleClickCasilla = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if ((!jugando && estado !== estados.jugando) || casilla.destapada) return

    actaulizarTablero(event.type, casilla, numFilas, numColumnas)
  }

  return (
    <button
      className={className}
      onClick={handleClickCasilla}
      onContextMenu={handleClickCasilla}
    >
      {
        casilla.destapada && (casilla.valor === "M" ? "💣" : casilla.valor) 
        ||
        casilla.bandera && "🚩"
      }
    </button>
  )
}