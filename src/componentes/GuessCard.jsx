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
      <div className="flex flex-col items-center bg-white bg-opacity-95 rounded-3xl shadow-2xl p-6 w-full max-w-3xl border-4 border-yellow-400">
        <div className="flex flex-row justify-center gap-8 w-full">
          <CardComparison selectedCard={card} chosenCard={chosenCard} />
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar cada imagen de intento
function AttemptImage({ card, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition-all duration-200 ${isActive ? "scale-125 border-4 border-yellow-400 shadow-2xl ring-4 ring-blue-400 z-30 bg-white" : "opacity-90"} rounded-xl hover:scale-110`}
      title={card.nombre}
      style={{ background: "none" }}
    >
      <img
        src={card.imagen || "/placeholder.svg"}
        alt={card.nombre}
        className={`w-20 h-20 object-contain rounded-xl border-2 border-blue-200 shadow ${isActive ? "w-28 h-28" : ""}`}
        style={{ background: "none" }}
      />
    </button>
  )
}

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

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  const getFilterOptions = (key) => {
    let options = cards.map(card => card[key])
      .filter(Boolean)
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
    <div className="w-[95%] max-w-7xl mx-auto bg-gradient-to-br from-yellow-200 via-yellow-100 to-orange-100 rounded-[2.5rem] shadow-2xl p-10 border-8 border-yellow-400 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "url('/img/bg-crown.png') center/30% no-repeat", opacity: 0.07 }} />
      <div className="flex flex-row gap-12 relative z-10">
        {/* Filtros y CardList a la izquierda */}
        <div className="flex-1 flex flex-col bg-white bg-opacity-90 rounded-3xl p-8 shadow-xl border-4 border-yellow-300 max-w-xs min-w-[220px]">
          {/* Botón para abrir filtros */}
          <button
            className="mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold shadow hover:scale-105 transition"
            onClick={() => setShowFilters(true)}
          >
            Filtros
          </button>
          {/* Popup de filtros */}
          <FiltersPopup
            open={showFilters}
            onClose={() => setShowFilters(false)}
            filters={FILTERS}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            getFilterOptions={getFilterOptions}
          />
          {/* Barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar carta"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 p-2 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold"
          />
          {/* CardList compacta, cuadrícula más grande y separada */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full"> {/* Aumenta el ancho máximo */}
              <div className="grid grid-cols-5 gap-x-4 gap-y-6 justify-items-center py-2">
                {filteredCards.length === 0 ? (
                  <p className="text-gray-500 text-center col-span-5">No hay cartas.</p>
                ) : (
                  filteredCards.map(card => (
                    <div
                      key={card.nombre}
                      className="cursor-pointer hover:scale-110 transition"
                      onClick={() => selectCard(card)}
                    >
                      <img
                        src={card.imagen || "/placeholder.svg"}
                        alt={card.nombre}
                        className="w-14 h-14 object-contain rounded-lg border-2 border-blue-200 shadow"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Columna principal de juego */}
        <div className="flex-1 flex flex-col items-center">
          {/* 1. Arriba: Lista de intentos */}
          <Pistas selectedCards={selectedCards} chosenCard={chosenCard} />
          {/* 2. En medio: Detalle de atributos */}
          <div className="text-center mb-4">
            <span className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-xl text-2xl border-4 border-blue-300">
              Intentos: {selectedCards.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-8 justify-center items-center">
            {selectedCards.length > 0 && (
            <div className="flex justify-center w-full mb-8">
              <AttemptDetails card={selectedCards[activeAttempt]} chosenCard={chosenCard} />
            </div>
          )}
            {selectedCards.length === 0 ? (
              <p className="text-gray-500 text-center m-auto">Aún no has hecho intentos.</p>
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
          {/* 2. En medio: Detalle de atributos */}
          
          {/* 3. Abajo: (Ya NO hay imagen grande aquí) */}
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

