import React from "react"
import Especial from "../img/rara.png"
import Legendaria from "../img/legendaria.png"
import Comun from "../img/comun.png"
import Epica from "../img/epic.jpeg"
// Mapea rareza a imagen de marco (todas las claves en minúsculas)
const marcoPorRareza = {
  legendaria: Legendaria,
  épica: Epica,
  epica: Epica,
  común: Comun,
  comun: Comun,
  especial: Especial,
  campeón: Especial
}

function getMarcoRareza(rareza) {
  if (!rareza) return marcoPorRareza["comun"]
  const key = typeof rareza === "string" ? rareza.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "comun"
  return marcoPorRareza[key] || marcoPorRareza["comun"]
}

/**
 * Recibe el array de cartas seleccionadas (aciertos o intentos) y muestra
 * un resumen de los atributos que han coincidido en cada intento.
 * 
 * Props:
 * - selectedCards: array de cartas seleccionadas (intentos)
 * - chosenCard: carta objetivo (para comparar)
 */
export default function Pistas({ selectedCards = [], chosenCard }) {
  if (!chosenCard || selectedCards.length === 0) {
    return (
      <div className="bg-white bg-opacity-80 rounded-xl p-4 text-gray-500 text-center">
        No hay pistas aún.
      </div>
    )
  }

  // Recopilar los atributos acertados en todos los intentos
  const atributos = ["rareza", "tipo", "elixir", "arena", "año_lanzamiento"]
  const aciertos = {}

  selectedCards.forEach(card => {
    atributos.forEach(attr => {
      if (card[attr] === chosenCard[attr]) {
        aciertos[attr] = chosenCard[attr]
      }
    })
  })

  // Si acertó rareza, mostrar el marco correspondiente
  const rarezaAcertada = aciertos["rareza"] || "comun"
  const marcoRareza = getMarcoRareza(rarezaAcertada)

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl shadow p-4 border-2 border-yellow-300 max-w-md mx-auto mt-4 flex flex-col items-center">
      <h4 className="text-lg font-bold text-yellow-700 mb-2">Pistas acumuladas</h4>
      {/* Marco de rareza si acertó */}
      {aciertos["rareza"] && (
        <div className="mb-4 flex flex-col items-center">
          <img
            src={marcoRareza}
            alt={rarezaAcertada}
            className="w-20 h-20 object-contain"
            title={`Rareza: ${rarezaAcertada.charAt(0).toUpperCase() + rarezaAcertada.slice(1)}`}
          />
          <span className="mt-1 font-bold text-gray-700 capitalize">{rarezaAcertada}</span>
        </div>
      )}
      {Object.keys(aciertos).length === 0 ? (
        <p className="text-gray-500">Aún no has acertado ningún atributo.</p>
      ) : (
        <ul className="flex flex-wrap gap-3 justify-center">
          {atributos.map(attr => (
            attr !== "rareza" && aciertos[attr] !== undefined && (
              <li key={attr} className="bg-green-200 text-green-900 font-semibold px-4 py-2 rounded-xl shadow border border-green-400">
                {attr.charAt(0).toUpperCase() + attr.slice(1)}: <span className="font-bold">{aciertos[attr]}</span>
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  )
}