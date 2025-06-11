import CardList from "./CardList"
import FiltersPopup from "./GuessCard" // O ajusta el import según tu estructura

export default function CardListPanel({
  cards,
  filteredCards,
  search,
  setSearch,
  selectCard,
  showFilters,
  setShowFilters,
  FILTERS,
  activeFilters,
  setActiveFilters,
  getFilterOptions
}) {
  return (
    <div className="flex flex-row w-full gap-8">
      {/* Izquierda: Buscador y lista de cartas */}
      <div className="flex-1 flex flex-col items-center">
        <input
          type="text"
          placeholder="Buscar carta"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 border-2 border-yellow-300 rounded focus:ring-2 focus:ring-yellow-400 bg-yellow-50 font-semibold"
        />
        <div className="w-full">
          <CardList
            cards={filteredCards}
            onCardSelect={selectCard}
          />
        </div>
      </div>
      {/* Derecha: Filtros y otros controles */}
      <div className="flex flex-col items-center min-w-[220px]">
        <button
          className="mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold shadow hover:scale-105 transition"
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </button>
        <FiltersPopup
          open={showFilters}
          onClose={() => setShowFilters(false)}
          filters={FILTERS}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          getFilterOptions={getFilterOptions}
        />
        {/* Aquí puedes agregar más controles si lo deseas */}
      </div>
    </div>
  )
}

<CardListPanel
  cards={cards}
  filteredCards={filteredCards}
  search={search}
  setSearch={setSearch}
  selectCard={selectCard}
  showFilters={showFilters}
  setShowFilters={setShowFilters}
  FILTERS={FILTERS}
  activeFilters={activeFilters}
  setActiveFilters={setActiveFilters}
  getFilterOptions={getFilterOptions}
/>