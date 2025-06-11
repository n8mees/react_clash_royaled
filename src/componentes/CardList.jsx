import Fondo from "../img/fondo-azul-cr.jpg";

export default function CardList({ cards, onSelectCard }) {
  return (
    <div
      style={{ backgroundImage: `url(${Fondo})` }}
      className="h-96 overflow-auto bg-cover bg-center"
    >
      <div className="flex flex-col gap-2 mt-2 w-full">
        {cards.map((card) => (
          <div
            key={card.nombre}
            onClick={() => onSelectCard(card)}
            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer bg-gradient-to-r from-blue-100 to-yellow-50 hover:bg-yellow-100 hover:scale-[1.03] shadow transition-all border border-yellow-100"
          >
            <img
              src={card.imagen || "/placeholder.svg"}
              alt={card.nombre}
              className="w-14 h-14 object-contain rounded-lg border-2 border-blue-200 shadow"
            />
            <span className="font-bold text-lg text-gray-700">{card.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

