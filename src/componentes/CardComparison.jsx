function ComparisonItem({ title, value, correct }) {
  return (
    <div
      className={`
        flex flex-col justify-center items-center
        rounded-xl shadow
        px-3 py-2
        min-w-[70px] max-w-[90px]
        border-2
        ${correct ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"}
        transition-all
      `}
    >
      <span className={`font-bold text-xs mb-1 ${correct ? "text-green-700" : "text-red-700"}`}>{title}</span>
      <span className={`text-base font-semibold ${correct ? "text-green-900" : "text-red-900"}`}>{value}</span>
    </div>
  )
}

export default function CardComparison({ selectedCard, chosenCard }) {
  const compareProperty = (prop) => {
    if (typeof selectedCard[prop] === "number" && typeof chosenCard[prop] === "number") {
      const isCorrect = selectedCard[prop] === chosenCard[prop]
      return { correct: isCorrect }
    }
    return { correct: selectedCard[prop] === chosenCard[prop] }
  }

  return (
    <div className="flex flex-row justify-center items-center gap-4 w-full px-2 py-1">
      <ComparisonItem title="Calidad" value={selectedCard.rareza} {...compareProperty("rareza")} />
      <ComparisonItem title="Tipo" value={selectedCard.tipo} {...compareProperty("tipo")} />
      <ComparisonItem title="Elixir" value={selectedCard.elixir} {...compareProperty("elixir")} />
      <ComparisonItem title="Arena" value={selectedCard.arena} {...compareProperty("arena")} />
      <ComparisonItem title="Año" value={selectedCard.año_lanzamiento} {...compareProperty("año_lanzamiento")} />
    </div>
  )
}

