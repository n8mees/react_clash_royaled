import Fondo from "../img/fondo-azul-cr.jpg";

export default function CardList({ cards, onSelectCard }) {
  return (
    <div
      style={{ backgroundImage: `url(${Fondo})` }}
      className="h-72 mb-4 overflow-auto bg-cover bg-center"
    >
      <div className="grid mt-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.nombre}
            onClick={() => onSelectCard(card)}
            className="flex flex-col items-center h-[140px] w-32 py-2"
          >
            <img
              src={card.imagen || "/placeholder.svg"}
              alt={card.nombre}
              className="w-24 h-20 object-contain"
            />
            <span className="text-xs text-white text-center font-bold line-clamp-2">
              {card.nombre}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

