import { useEffect, useState } from "react";
import axios from "axios";
import "../style/style.css";

function App() {
  const [cartas, setCartas] = useState([]);
  const [search, setSearch] = useState("");

  const [azar] = useState(Math.floor(Math.random() * 117));

  const [cartaElegida, setcartaElegida] = useState(null);

  function CartaRandom() {
    setcartaElegida(cartas[azar]);
  }
  console,log('ocuapar variables de entorno y wea')
  useEffect(() => {
    // Llamar a la API para obtener las cartas
    axios
      .get("https://render-clash-royaled.onrender.com/Carta") // Cambia esta URL por tu endpoint
      .then((response) => {
        setCartas(response.data);
        // Asume que 'Cartas' está en la respuesta
      })
      .catch((error) => {
        console.error("Error al obtener las cartas:", error);
      });
  }, []);

  const [seleccionada, setSeleccionada] = useState([]);

  const [win, setWin] = useState(false);

  const filteredCards = cartas.filter((card) =>
    card.nombre.toLowerCase().includes(search.toLowerCase())
  );

  function CartaSeleccionada(nombre) {
    setSearch("");
    cartas.forEach((value) => {
      if (value.nombre === nombre) {
        if (value.nombre === cartaElegida.nombre) {
          console.log("acertaste");
          setSeleccionada((seleccionada) => [...seleccionada, value]);
          EliminarCarta(nombre);
          setWin(true);
          setSeleccionada('')
        } else {
          console.log("fallaste");
          setSeleccionada((seleccionada) => [...seleccionada, value]);
          EliminarCarta(nombre);
        }
      }
    });
  }

  function EliminarCarta(nombre) {
    setCartas((prevSeleccionadas) =>
      prevSeleccionadas.filter((carta) => carta.nombre !== nombre)
    );
  }

  function compararCartas(carta1, carta2) {
    const propiedades = [
      "nombre",
      "elixir",
      "tipo",
      "arena",
      "año_lanzamiento",
      "rareza",
    ];
    const resultadoComparacion = {};

    propiedades.forEach((prop) => {
      resultadoComparacion[prop] = carta1[prop] === carta2[prop];
    });

    return resultadoComparacion;
  }

  return (
    <div style={{ width: "80%", backgroundColor:"rgba(255,255,255,0.8)", overflow:"auto" }}>
      {cartaElegida ? (
        <div>
          <h1 className="text-xl my-5">Filtro de Cartas</h1>
      <input
        type="text"
        placeholder="Busca una carta"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-16 border-2 border-black w-80 rounded-3xl text-center"
      />
        </div>
      ) : (
        <button onClick={() => CartaRandom()}>Adivinar carta</button>
      )}

      
      {search && (
        <ul className="flex flex-row flex-wrap justify-center h-[270px] mt-10 mb-10 overflow-auto rounded-3xl bg-yellow-300
        border-black border-2 mx-10">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div
                onClick={() => CartaSeleccionada(card.nombre)}
                className="flex justify-around items-center flex-row"
              >
                <div className="busqueda  hover:bg-gray-50">
                  <img className="img" src={card.imagen} />
                  <p style={{ flex: "50%" }}>{card.nombre}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </ul>
      )}

      {seleccionada.length > 0 ? (
        seleccionada
          .slice()
          .reverse()
          .map((card) => {
            // Comparar propiedades con la carta elegida
            const resultado = compararCartas(card, cartaElegida);
            return (
              <div
              className="mb-10 mt-10"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap", // Permitir que se ajusten si el espacio es limitado
                }}
              >
                <div
                  className="busqueda"
                  style={{
                    backgroundColor: resultado.nombre ? "green" : "red",
                  }}
                >
                  <p className=" text-white text-xl font-bold">{card.nombre}</p>
                  <img className="img" src={card.imagen} alt={card.nombre} />
                </div>
                <div
                  className="busqueda"
                  style={{
                    backgroundColor: resultado.elixir ? "green" : "red",
                  }}
                >
                  <p className="mb-3 text-white text-xl font-bold">Elixir</p>
                  <p className="text-white text-xl font-bold">{card.elixir}</p>
                </div>
                <div
                  className="busqueda"
                  style={{
                    backgroundColor: resultado.rareza ? "green" : "red",
                  }}
                >
                  <p className="mb-3 text-white text-xl font-bold">Calidad</p>
                  <p className="text-white text-xl font-bold">{card.rareza}</p>
                </div>
                <div
                  className="busqueda"
                  style={{ backgroundColor: resultado.tipo ? "green" : "red" }}
                >
                  <p className="mb-3 text-white text-xl font-bold">Tipo</p>
                  <p className="text-white text-xl font-bold">{card.tipo}</p>
                </div>
                <div
                  className="busqueda"
                  style={{ backgroundColor: resultado.arena ? "green" : "red" }}
                >
                  <p className="mb-3 text-white text-xl font-bold">Arena</p>
                  <p className="text-white text-xl font-bold">{card.arena}</p>
                </div>
                <div
                  className="busqueda"
                  style={{
                    backgroundColor: resultado.año_lanzamiento
                      ? "green"
                      : "red",
                  }}
                >
                  <p className="mb-3 text-white text-xl font-bold">Año lanzamiento</p>
                  <p className="text-white text-xl font-bold">{card.año_lanzamiento}</p>
                </div>
              </div>
            );
          })
      ) : (
        <p className="text-xl my-5">No hay cartas seleccionadas</p>
      )}
      {win && <div className="mb-20">
        {cartaElegida && 
          <div>
            <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap", // Permitir que se ajusten si el espacio es limitado
                }}
              >
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">{cartaElegida.nombre}</p>
                  <img className="img" src={cartaElegida.imagen} alt={cartaElegida.nombre} />
                </div>
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">Elixir</p>
                  <p className="title">{cartaElegida.elixir}</p>
                </div>
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">Calidad</p>
                  <p className="title">{cartaElegida.rareza}</p>
                </div>
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">Tipo</p>
                  <p className="title">{cartaElegida.tipo}</p>
                </div>
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">Arena</p>
                  <p className="title">{cartaElegida.arena}</p>
                </div>
                <div
                  className="busqueda"
                  style={{backgroundColor: "green"}}
                >
                  <p className="title">Año lanzamiento</p>
                  <p className="title">{cartaElegida.año_lanzamiento}</p>
                </div>
              </div>
          </div>
        }
        <h1>Has ganado, adivinaste la carta</h1>
        <p>¿deseas jugar otra vez?</p>
        <button onClick={() => window.location.reload()}>Si</button>
        </div>}
    </div>
  );
}

export default App;
