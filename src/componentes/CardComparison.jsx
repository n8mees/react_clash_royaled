function ComparisonItem({ title, value, correct, suggestion }) {
  return (
    <div className={`p-1 border-2 border-black border-solid rounded text-center text-2xl ${correct ? "bg-green-500" : "bg-red-500"}`}>
      <p className="text-white text-center font-bold text-xl">{title}</p>
      <p className="text-white text-center">{value}</p>
      {!correct && suggestion && <p className="text-white mt-10 text-center text-3xl">{suggestion}</p>}
    </div>
  )
}

export default function CardComparison({ selectedCard, chosenCard }) {
  const compareProperty = (prop) => {
    if (typeof selectedCard[prop] === "number" && typeof chosenCard[prop] === "number") {
      const isCorrect = selectedCard[prop] === chosenCard[prop]
      const suggestion = isCorrect ? undefined : selectedCard[prop] > chosenCard[prop] ? "↓↓" : "↑↑"
      return { correct: isCorrect, suggestion }
    }
    return { correct: selectedCard[prop] === chosenCard[prop] }
  }

  return (
    <div className="grid mx- grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
      <ComparisonItem value={<img className="m-5 h-15" src={selectedCard.imagen}/>}/>
      <ComparisonItem
        title="Nombre"
        value={selectedCard.nombre}
        correct={compareProperty("nombre").correct}
      />
      <ComparisonItem title="Calidad" value={selectedCard.rareza} correct={compareProperty("rareza").correct} />
      <ComparisonItem title="Tipo" value={selectedCard.tipo} correct={compareProperty("tipo").correct} />
      <ComparisonItem title="Elixir" value={selectedCard.elixir} {...compareProperty("elixir")} />
      <ComparisonItem title="Arena" value={selectedCard.arena} {...compareProperty("arena")} />
      <ComparisonItem title="Año" value={selectedCard.año_lanzamiento} {...compareProperty("año_lanzamiento")} />
    </div>
  )
}

