function ComparisonItem({ title, value, correct }) {
  return (
    <div
      className={`flex flex-col justify-center items-center border-2 border-black border-solid rounded-full text-center text-2xl relative mx-auto`}
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: correct ? "#22c55e" : "#ef4444", // verde si es correcto, rojo si es incorrecto
        margin: "0 12px"
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-20 rounded-full">
        <p className="text-white text-center font-bold text-base drop-shadow">{title}</p>
        <p className="text-white text-center drop-shadow text-lg">{value}</p>
      </div>
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
    <div className="flex flex-row justify-center items-center gap-6 w-full">
      <ComparisonItem title="Calidad" value={selectedCard.rareza} {...compareProperty("rareza")} />
      <ComparisonItem title="Tipo" value={selectedCard.tipo} {...compareProperty("tipo")} />
      <ComparisonItem title="Elixir" value={selectedCard.elixir} {...compareProperty("elixir")} />
      <ComparisonItem title="Arena" value={selectedCard.arena} {...compareProperty("arena")} />
      <ComparisonItem title="Año" value={selectedCard.año_lanzamiento} {...compareProperty("año_lanzamiento")} />
    </div>
  )
}

