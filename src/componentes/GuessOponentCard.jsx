"use client"

import { useState, useEffect } from "react"
import CardList from "./CardList"
import CardComparison from "./CardComparison"
import WinScreen from "./WinScreen"

const FILTERS = [
  { label: "Calidad", key: "rareza" },
  { label: "Tipo", key: "tipo" },
  { label: "Elixir", key: "elixir" },
  { label: "Arena", key: "arena" },
  { label: "Año", key: "año_lanzamiento" }
]

export default function GuessOponentCard({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [search, setSearch] = useState("")
  const [chosenCard, setChosenCard] = useState(null) // La carta elegida por el primer jugador
  const [selectedCards, setSelectedCards] = useState([])
  const [win, setWin] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [step, setStep] = useState(1) // 1: elegir carta, 2: adivinar

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  // Obtener opciones únicas para cada filtro y ordenarlas si son numéricas
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

  // Aplicar todos los filtros activos y búsqueda
  let filteredCards = cards
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value) {
      filteredCards = filteredCards.filter(card => String(card[key]) === String(value))
    }
  })
  filteredCards = filteredCards.filter((card) =>
    card.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  // Paso 1: Primer jugador elige la carta
  const handleChooseCard = (card) => {
    setChosenCard(card)
    setStep(2)
    setSearch("")
    setActiveFilters({})
    setSelectedCards([])
  }

  // Paso 2: Segundo jugador intenta adivinar
  const handleGuessCard = (card) => {
    setSearch("")
    setSelectedCards((prev) => [card, ...prev])
    setCards((prev) => prev.filter((c) => c.nombre !== card.nombre))

    if (card.nombre === chosenCard?.nombre) {
      setWin(true)
    }
  }

  const resetGame = () => {
    setCards(initialCards)
    setChosenCard(null)
    setSelectedCards([])
    setSearch("")
    setWin(false)
    setActiveFilters({})
    setStep(1)
  }

  // Render paso 1: elegir carta
  if (step === 1) {
    return (
      <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Jugador 1: Elige una carta para que el Jugador 2 la adivine</h2>
        {/* Filtros múltiples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((filter) => (
            <div key={filter.key} className="flex items-center gap-1">
              <span className="font-semibold">{filter.label}:</span>
              <select
                className="px-2 py-1 border rounded"
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
                  className="ml-1 px-2 py-1 rounded bg-red-400 text-white"
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
          {Object.keys(activeFilters).length > 0 && (
            <button
              className="ml-2 px-2 py-1 rounded bg-gray-400 text-white"
              onClick={() => setActiveFilters({})}
            >
              Limpiar todos
            </button>
          )}
        </div>
        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar carta"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <CardList cards={filteredCards} onSelectCard={handleChooseCard} />
      </div>
    )
  }

  // Render paso 2: adivinar carta
  if (win) {
    return <WinScreen chosenCard={chosenCard} onReset={resetGame} />
  }

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Jugador 2: ¡Adivina la carta elegida!</h2>
      {/* Filtros múltiples */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((filter) => (
          <div key={filter.key} className="flex items-center gap-1">
            <span className="font-semibold">{filter.label}:</span>
            <select
              className="px-2 py-1 border rounded"
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
                className="ml-1 px-2 py-1 rounded bg-red-400 text-white"
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
        {Object.keys(activeFilters).length > 0 && (
          <button
            className="ml-2 px-2 py-1 rounded bg-gray-400 text-white"
            onClick={() => setActiveFilters({})}
          >
            Limpiar todos
          </button>
        )}
      </div>
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar carta"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <CardList cards={filteredCards} onSelectCard={handleGuessCard} />
      {selectedCards.map((card, index) => (
        <CardComparison key={index} selectedCard={card} chosenCard={chosenCard} />
      ))}
      <button
        className="mt-4 px-4 py-2 bg-gray-300 rounded"
        onClick={resetGame}
      >
        Reiniciar juego
      </button>
    </div>
  )
}