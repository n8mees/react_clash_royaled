"use client"

import { useState, useEffect } from "react"
import CardList from "./CardList"
import CardComparison from "./CardComparison"
import WinScreen from "./WinScreen"
import Pistas from "./pistas"

const FILTERS = [
  { label: "Calidad", key: "rareza" },
  { label: "Tipo", key: "tipo" },
  { label: "Elixir", key: "elixir" },
  { label: "Arena", key: "arena" },
  { label: "Año", key: "año_lanzamiento" }
]

// Popup para filtros
function FiltersPopup({ open, onClose, filters, activeFilters, setActiveFilters, getFilterOptions }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] relative">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-red-500 font-bold"
          onClick={onClose}
        >×</button>
        <h2 className="text-xl font-bold mb-4 text-yellow-700">Filtros</h2>
        <div className="flex flex-col gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <span className="font-semibold text-yellow-700 w-20">{filter.label}:</span>
              <select
                className="px-2 py-1 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold flex-1"
                value={activeFilters[filter.key] || ""}
                onChange={e => {
                  const value = e.target.value
                  setActiveFilters(prev => ({
                    ...prev,
                    [filter.key]: value
                  }))
                }}
              >
                <option value="">Todos</option>
                {getFilterOptions(filter.key).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {activeFilters[filter.key] && (
                <button
                  className="ml-1 px-2 py-1 rounded bg-red-400 text-white hover:bg-red-600 font-bold"
                  onClick={() => {
                    setActiveFilters(prev => {
                      const updated = { ...prev }
                      delete updated[filter.key]
                      return updated
                    })
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {Object.keys(activeFilters).length > 0 && (
          <button
            className="mt-6 px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-600 font-bold"
            onClick={() => setActiveFilters({})}
          >
            Limpiar todos
          </button>
        )}
      </div>
    </div>
  )
}

// Componente para mostrar los atributos de un intento (solo atributos)
function AttemptDetails({ card, chosenCard }) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row justify-center gap-6 w-full mt-8">
        <CardComparison selectedCard={card} chosenCard={chosenCard} />
      </div>
    </div>
  )
}

// Componente para mostrar cada imagen de intento
function AttemptImage({ card, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition-all duration-200 flex items-center justify-center ${isActive ? "shadow-2xl z-30 bg-white scale-125 px-6" : "opacity-90 px-2"} rounded-xl hover:scale-110`}
      title={card.nombre}
      style={{ background: "none", margin: "0 4px" }}
    >
      <img
        src={card.imagen || "/placeholder.svg"}
        alt={card.nombre}
        className={` ${isActive ? "w-20 h-20" : "w-12 h-12"}`}
        style={{ background: "none" }}
      />
    </button>
  )
}

// --- Popup de lista de cartas (comentado, se usará más adelante) ---
// function CardListPopup({ open, onClose, cards, onSelectCard, search, setSearch, filters, activeFilters, setActiveFilters, getFilterOptions }) {
//   if (!open) return null
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col relative">
//         <button
//           className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-red-500 font-bold"
//           onClick={onClose}
//         >×</button>
//         <h2 className="text-xl font-bold mb-4 text-yellow-700">Lista de Cartas</h2>
//         {/* Buscador */}
//         <input
//           type="text"
//           placeholder="Buscar carta por nombre..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="w-full mb-3 p-2 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold text-base"
//         />
//         {/* Filtros */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {filters.map((filter) => (
//             <select
//               key={filter.key}
//               className="px-2 py-1 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold"
//               value={activeFilters[filter.key] || ""}
//               onChange={e => {
//                 const value = e.target.value
//                 setActiveFilters(prev => ({
//                   ...prev,
//                   [filter.key]: value
//                 }))
//               }}
//             >
//               <option value="">{filter.label}</option>
//               {getFilterOptions(filter.key).map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//           ))}
//           {/* Botón limpiar filtros */}
//           {Object.keys(activeFilters).length > 0 && (
//             <button
//               className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-600 font-bold"
//               onClick={() => setActiveFilters({})}
//             >
//               Limpiar
//             </button>
//           )}
//         </div>
//         {/* Lista de cartas */}
//         <div className="flex-1 overflow-y-auto">
//           <CardList
//             cards={cards}
//             onSelectCard={onSelectCard}
//             className="flex flex-col gap-2"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

export default function Game({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [search, setSearch] = useState("")
  const [chosenCard, setChosenCard] = useState(null)
  const [selectedCards, setSelectedCards] = useState([])
  const [win, setWin] = useState(false)
  const [showWinPopup, setShowWinPopup] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [activeAttempt, setActiveAttempt] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showCardList, setShowCardList] = useState(false)

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  const getFilterOptions = (key) => {
    let options = cards.map(card => card[key])
      .filter(opt => opt !== undefined && opt !== null) // Permite 0
      .map(opt => {
        if (key === "año_lanzamiento") return Number(opt)
        return opt
      });
    options = [...new Set(options)];
    if (["elixir", "año_lanzamiento", "arena"].includes(key)) {
      return options
        .map(opt => isNaN(Number(opt)) ? opt : Number(opt))
        .sort((a, b) => a - b)
        .map(opt => String(opt));
    }
    return options.sort((a, b) => String(a).localeCompare(String(b)));
  }

  let filteredCards = cards
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) {
      filteredCards = filteredCards.filter(card => String(card[key]) === String(value))
    }
  })
  filteredCards = filteredCards.filter((card) =>
    card.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  const selectRandomCard = () => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)]
    console.log("Carta a adivinar:", randomCard) // <-- Agregado para debug
    setChosenCard(randomCard)
  }

  const selectCard = (card) => {
    setSearch("")
    setSelectedCards((prev) => [card, ...prev])
    setCards((prev) => prev.filter((c) => c.nombre !== card.nombre))
    setActiveAttempt(0)

    if (card.nombre === chosenCard?.nombre) {
      setWin(true)
      setShowWinPopup(true)
    }
  }

  const resetGame = () => {
    setCards(initialCards)
    setChosenCard(null)
    setSelectedCards([])
    setSearch("")
    setWin(false)
    setShowWinPopup(false)
    setActiveFilters({})
    setActiveAttempt(0)
  }

  if (!chosenCard) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4">
        <h2 className="text-3xl font-extrabold text-yellow-600 mb-2 drop-shadow">¡Bienvenido a Clash Royale Guess!</h2>
        <button
          onClick={selectRandomCard}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 px-6 rounded-2xl font-bold text-xl shadow-lg hover:scale-105 transition"
        >
          Comenzar
        </button>
      </div>
    )
  }

  return (
    <div className=" w-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 flex items-center justify-center py-2 px-1 md:py-8 md:px-2">
      <div className="w-full max-w-6xl h-[90vh] bg-white bg-opacity-80 rounded-2xl md:rounded-[2.5rem] shadow-2xl border-4 md:border-8 border-yellow-300 flex flex-row gap-0 p-0 overflow-hidden">
        {/* Contenedor Izquierdo: CardList (60%) */}
        <div className="flex flex-col justify-start items-center w-[60%] h-full border-r-2 border-yellow-200 bg-white bg-opacity-90 p-4 md:p-8">
          {/* Buscador */}
          <div className="w-full max-w-lg mb-4">
            <input
              type="text"
              placeholder="Buscar carta por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold text-lg"
            />
          </div>
          {/* Lista de cartas */}
          <div className="w-full h-96 max-w-lg flex-1 overflow-y-auto rounded-2xl bg-white bg-opacity-90 shadow-lg border border-yellow-200 p-2 min-h-0">
            <CardList
              cards={filteredCards}
              onSelectCard={selectCard}
              className="flex flex-col gap-2"
            />
          </div>
        </div>
        {/* Contenedor Derecho: Pistas acertadas + Intentos (40%) */}
        <div className="flex flex-col justify-start items-center w-[40%] h-full bg-white bg-opacity-90 p-4 md:p-8">
          {/* Pistas acertadas */}
          <div className="w-full flex flex-col items-center mb-6">
            <div className="bg-white bg-opacity-95 border-4 border-yellow-400 rounded-2xl shadow-xl px-4 py-4 md:px-8 md:py-6 flex flex-col items-center max-w-md w-full">
              <h3 className="text-xl md:text-2xl font-extrabold text-yellow-600 mb-3 tracking-wide drop-shadow">🎯 Pistas Acertadas</h3>
              <Pistas selectedCards={selectedCards} chosenCard={chosenCard} />
            </div>
          </div>
          {/* Info de intentos */}
          <div className="w-full flex flex-col items-center mt-4 flex-1">
            <div className="text-center mb-4">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white font-extrabold px-8 md:px-10 py-3 md:py-4 rounded-full shadow-2xl text-2xl md:text-3xl border-4 border-white tracking-wider drop-shadow-lg uppercase">
                Intentos: <span className="text-yellow-300">{selectedCards.length}</span>
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-4 w-full">
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center mb-2">
                {selectedCards.length === 0 ? (
                  <p className="text-gray-400 text-center m-auto text-base">Aún no has hecho intentos.</p>
                ) : (
                  selectedCards.map((card, idx) => (
                    <AttemptImage
                      key={idx}
                      card={card}
                      isActive={activeAttempt === idx}
                      onClick={() => setActiveAttempt(idx)}
                    />
                  ))
                )}
              </div>
              {selectedCards.length > 0 && (
                <div className="flex justify-center w-full">
                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-xs">
                      <AttemptDetails card={selectedCards[activeAttempt]} chosenCard={chosenCard} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Popup de WinScreen controlado */}
      {showWinPopup && (
        <WinScreen
          chosenCard={chosenCard}
          onReset={resetGame}
          onClose={() => setShowWinPopup(false)}
        />
      )}
    </div>
  )
}

