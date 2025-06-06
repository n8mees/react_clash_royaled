// import "@fontsource/poppins/700.css";
// import "@fontsource/poppins/400.css";

export default function WinScreen({ chosenCard, onReset }) {
  return (
    <div
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-200 via-purple-100 to-yellow-100 rounded-3xl shadow-2xl p-8 text-center"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-purple-700 drop-shadow">
        ¡Felicidades, has acertado!
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-6">
        <img
          src={chosenCard.imagen || "/placeholder.svg"}
          alt={chosenCard.nombre}
          // className="w-32 h-32 rounded-xl border-4 border-yellow-400 shadow-lg bg-white object-contain"
        />
        <div className="text-left text-lg">
          <p className="font-bold text-blue-800 text-2xl mb-2">{chosenCard.nombre}</p>
          <p>
            <span className="font-semibold text-purple-600">Elixir:</span>{" "}
            <span className="text-blue-800 font-bold text-lg rounded px-2">{chosenCard.elixir}</span>
          </p>
          <p>
            <span className="font-semibold text-purple-600">Calidad:</span>{" "}
            <span className="text-blue-800 font-bold text-lg rounded px-2">{chosenCard.rareza}</span>
          </p>
          <p>
            <span className="font-semibold text-purple-600">Tipo:</span>{" "}
            <span className="text-blue-800 font-bold text-lg rounded px-2">{chosenCard.tipo}</span>
          </p>
          <p>
            <span className="font-semibold text-purple-600">Arena:</span>{" "}
            <span className="text-blue-800 font-bold text-lg rounded px-2">{chosenCard.arena}</span>
          </p>
          <p>
            <span className="font-semibold text-purple-600">Año:</span>{" "}
            <span className="text-blue-800 font-bold text-lg rounded px-2">{chosenCard.año_lanzamiento}</span>
          </p>
        </div>
      </div>
      <img
        src="https://i.ytimg.com/vi/ATCpoqYsqjE/maxresdefault.jpg"
        alt="You won meme"
        className="mx-auto mb-6 w-56 rounded-xl shadow-lg"
      />
      <p className="mb-6 text-lg text-gray-700 font-medium">¿Deseas jugar otra vez?</p>
      <div className="space-x-4">
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full font-bold shadow hover:scale-105 transition"
        >
          Sí
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-200 text-gray-700 py-2 px-6 rounded-full font-bold shadow hover:bg-gray-300 hover:scale-105 transition"
        >
          No
        </button>
      </div>
    </div>
  )
}

