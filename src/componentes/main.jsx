import { useEffect, useState } from "react";
// import { fetchCartas } from "./api";
import cartasData from "./CR-cards.json";
import { compararCartas } from "./compararCartas";
import { EliminarCarta } from "./eliminarCarta";
import "../style/style.css";

function App() {
  const [cartas, setCartas] = useState([]);
  const [search, setSearch] = useState("");
  const [cartaElegida, setCartaElegida] = useState(null);
  const [win, setWin] = useState(false);

  useEffect(() => {
    setCartas(cartasData);
  }, []);

  const CartaRandom = () => {
    const azar = Math.floor(Math.random() * cartas.length);
    setCartaElegida(cartas[azar]);
  };

  const CartaSeleccionada = (nombre) => {
    setSearch("");
    const carta = cartas.find((c) => c.nombre === nombre);
    if (!carta) return;

    setSeleccionada((prev) => [...prev, carta]);
    setCartas(EliminarCarta(cartas, nombre));

    if (carta.nombre === cartaElegida?.nombre) {
      setWin(true);
    }
  };

  return (
    <div className="game-container">
      {cartaElegida ? (
        !win && (
          <div>
            <h1>Filtro de Cartas</h1>
            <input
              type="text"
              placeholder="Busca una carta"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )
      ) : (
        <button onClick={CartaRandom}>Adivinar carta</button>
      )}

      {!win && search && (
        <ul>
          {cartas
            .filter((card) =>
              card.nombre.toLowerCase().includes(search.toLowerCase())
            )
            .map((card) => (
              <li key={card.nombre} onClick={() => CartaSeleccionada(card.nombre)}>
                <img src={card.imagen} alt={card.nombre} />
                <p>{card.nombre}</p>
              </li>
            ))}
        </ul>
      )}

      {win && <h1>¡Felicidades, has ganado!</h1>}
    </div>
  );
}

export default App;