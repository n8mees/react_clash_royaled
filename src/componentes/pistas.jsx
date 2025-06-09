import React from "react"
import Especial from "../img/especial.jpg"
import Legendaria from "../img/legendaria.png"
import Comun from "../img/comun.png"
import Epica from "../img/epic.jpeg"
import Campeon from "../img/campeon.png"
import Elixir from "../img/elixirdrop.png"

// Importa tus imágenes de tipo
import EstructuraImg from "../img/estructura.png" // imagen 1
import TropaImg from "../img/Troop.png"           // imagen 2
import HechizoImg from "../img/hechizos.png"       // imagen 3

// Mapea rareza a imagen de marco (todas las claves en minúsculas)
const marcoPorRareza = {
  legendaria: Legendaria,
  epica: Epica,
  común: Comun,
  comun: Comun,
  especial: Especial,
  campeón: Campeon,
  Campeón: Campeon,
  campeon: Campeon
}

// Mapea tipo a imagen
const imagenPorTipo = {
  Estructura: EstructuraImg,
  Tropa: TropaImg,
  Hechizo: HechizoImg
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

  const rarezaAcertada = aciertos["rareza"] || "comun"
  const marcoRareza = getMarcoRareza(rarezaAcertada)
  const ultimoIntento = selectedCards[0]

  const getArrow = (attr) => {
    if (typeof chosenCard[attr] !== "number" && isNaN(Number(chosenCard[attr]))) return null
    const intento = Number(ultimoIntento[attr])
    const objetivo = Number(chosenCard[attr])
    if (intento > objetivo) return <span title="Demasiado alto" className="ml-1 text-blue-700 text-xl">←</span>
    if (intento < objetivo) return <span title="Demasiado bajo" className="ml-1 text-blue-700 text-xl">→</span>
    return null
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-2xl shadow p-4 border-2 border-yellow-300 w-[75%] mx-auto mt-4 flex flex-col items-center">
      <h4 className="text-lg font-bold text-yellow-700 mb-2">Pistas acumuladas</h4>
      {/* Marco de rareza, elixir y tipo juntos */}
      {(aciertos["rareza"] || aciertos["elixir"] !== undefined || aciertos["tipo"]) && (
        <div className="flex flex-row items-end gap-8 mb-4">
          {/* Marco de rareza a la izquierda */}
          {aciertos["rareza"] && (
            <div className="flex flex-col items-center">
              <img
                src={marcoRareza}
                alt={rarezaAcertada}
                className={`object-contain drop-shadow-lg ${
                  rarezaAcertada.toLowerCase().includes("campeon") ? "w-32 h-36" : "w-24 h-28"
                }`}
                style={{ minHeight: rarezaAcertada.toLowerCase().includes("campeon") ? 140 : 110 }}
                title={`Rareza: ${rarezaAcertada.charAt(0).toUpperCase() + rarezaAcertada.slice(1)}`}
              />
              <span className="mt-2 text-xl font-bold text-gray-700 capitalize">{rarezaAcertada}</span>
            </div>
          )}
          {/* Elixir al centro, mismo tamaño que rareza */}
          {aciertos["elixir"] !== undefined && (
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <img
                  src={Elixir}
                  alt="Elixir"
                  className="w-24 h-28 object-contain drop-shadow-xl"
                  style={{ minHeight: 110, filter: "drop-shadow(0 0 8px #b388ff)" }}
                />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-purple-900 drop-shadow-lg select-none">
                  {aciertos["elixir"]}
                </span>
              </div>
              <span className="mt-2 text-lg font-bold text-purple-800">Elixir</span>
            </div>
          )}
          {/* Tipo a la derecha, mismo tamaño que rareza */}
          {aciertos["tipo"] && (
            <div className="flex flex-col items-center">
              <img
                src={imagenPorTipo[aciertos["tipo"]]}
                alt={aciertos["tipo"]}
                className="w-24 h-28 object-contain drop-shadow-lg"
                style={{ minHeight: 110 }}
              />
              <span className="mt-2 text-xl font-bold text-gray-700 capitalize">{aciertos["tipo"]}</span>
            </div>
          )}
        </div>
      )}
      {Object.keys(aciertos).length === 0 ? (
        <p className="text-gray-500">Aún no has acertado ningún atributo.</p>
      ) : (
        <ul className="flex flex-wrap gap-3 justify-center mt-2">
          {/* Arena */}
          {aciertos["arena"] !== undefined && (
            <li className="bg-green-200 text-green-900 font-semibold px-5 py-2 rounded-xl shadow border border-green-400 text-lg flex items-center">
              Arena: <span className="font-bold ml-1">{aciertos["arena"]}</span>
            </li>
          )}
          {/* Año de lanzamiento */}
          {aciertos["año_lanzamiento"] !== undefined && (
            <li className="bg-green-200 text-green-900 font-semibold px-5 py-2 rounded-xl shadow border border-green-400 text-lg flex items-center">
              Año: <span className="font-bold ml-1">{aciertos["año_lanzamiento"]}</span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}