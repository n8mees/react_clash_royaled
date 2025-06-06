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

export default function Game({ initialCards }) {
  const [cards, setCards] = useState(initialCards)
  const [search, setSearch] = useState("")
  const [chosenCard, setChosenCard] = useState(null)
  const [selectedCards, setSelectedCards] = useState([])
  const [win, setWin] = useState(false)
  // Cambia a objeto para múltiples filtros
  const [activeFilters, setActiveFilters] = useState({})

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  // Obtener opciones únicas para cada filtro y ordenarlas si son numéricas
  const getFilterOptions = (key) => {
    let options = cards.map(card => card[key])
      .filter(Boolean)
      .map(opt => {
        // Normaliza años a número para evitar duplicados tipo "2025" y 2025
        if (key === "año_lanzamiento") return Number(opt)
        return opt
      });

    // Eliminar duplicados
    options = [...new Set(options)];

    // Ordenar numéricamente si el filtro es elixir, año_lanzamiento o arena
    if (["elixir", "año_lanzamiento", "arena"].includes(key)) {
      return options
        .map(opt => isNaN(Number(opt)) ? opt : Number(opt))
        .sort((a, b) => a - b)
        .map(opt => String(opt));
    }
    // Ordenar alfabéticamente para los demás
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

  const selectRandomCard = () => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)]
    setChosenCard(randomCard)
  }

  const selectCard = (card) => {
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
  }

  if (!chosenCard) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={selectRandomCard}
          className="w-full bg-blue-500 text-white py-2 px-4 h-10 rounded hover:bg-blue-600"
        >
          Comenzar
        </button>
      </div>
    )
  }

  if (win) {
    return <WinScreen chosenCard={chosenCard} onReset={resetGame} />
  }

  return (
    <div className="w-full mx-auto bg-yellow-400 rounded-lg shadow-md p-6">
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
      <CardList cards={filteredCards} onSelectCard={selectCard} />
      {selectedCards.map((card, index) => (
        <CardComparison key={index} selectedCard={card} chosenCard={chosenCard} />
      ))}
    </div>
  )
}

