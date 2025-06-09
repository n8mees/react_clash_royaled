import Fondo from "../img/fondo-azul-cr.jpg";

export default function CardList({ cards, onSelectCard }) {
  return (
    <div
      style={{ backgroundImage: `url(${Fondo})` }}
      className="h-72 mb-4 overflow-auto bg-cover bg-center"
    >
      <div className="flex flex-col gap-2 mt-2 w-full">
        {cards.map((card) => (
          <button
            key={card.nombre}
            onClick={() => onSelectCard(card)}
            className="flex items-center gap-4 w-full px-4 py-2 bg-blue-900 bg-opacity-60 rounded-lg shadow text-white font-bold text-left hover:bg-blue-700 transition"
          >
            <img
              src={card.imagen || "/placeholder.svg"}
              alt={card.nombre}
              className="w-14 h-14 object-contain rounded"
            />
            <span className="text-base">{card.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

