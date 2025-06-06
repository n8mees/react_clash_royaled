import { useEffect, useState } from "react";
import { fetchCartas } from "./api";
import "../style/style.css";

function App() {
  const [cartas, setCartas] = useState([]);
  const [search, setSearch] = useState("");
  const [azar] = useState(Math.floor(Math.random() * 117));
  const [cartaElegida, setcartaElegida] = useState(null);
  const [seleccionada, setSeleccionada] = useState([]);
  const [win, setWin] = useState(false);
  const [xd, setXd] = useState(false);
  function CartaRandom() {
    setcartaElegida(cartas[azar]);
  }
  useEffect(() => {
    // Llamar a la API para obtener las cartas
    fetchCartas().then(setCartas);
    
  }, []);

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
          setSeleccionada("");
        } else {
          console.log("fallaste");
          setSeleccionada((seleccionada) => [...seleccionada, value]);
          EliminarCarta(nombre);
        }
      }
    });
  }

  if (xd) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column ",
          alignItems: "center",
          justifyContent: "center",
          height: "80%",
          backgroundColor: "rgba(255,255,255,0.75)",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "50px", marginBottom: "20px" }}>
          ¡Gracias por jugar!
        </h1>
        <p style={{ fontSize: "20px", color: "#444" }}>
          Ojalá hayas disfrutado el juego.
        </p>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5u1pQVUjtpCtXjwR4GxL7-oogxjs8yopiJQ&s"
          alt="Gracias por jugar"
          style={{ width: "180px", height: "180px", marginTop: "12px" }}
        />
        <h6 style={{ color: "#555", marginTop: "20px" }}>
          {" "}
          Para volver a jugar, recarga la página
        </h6>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "20px" }}>
          Juego creado por:{" "}
          <a
            href="https://wa.me/56989572805"
            style={{ color: "rgb(78, 143, 185)" }}
            target="_blank"
            rel="noreferrer"
          >
            Peladio Carrión
          </a>
        </p>
      </div>
    );
  }

  function EliminarCarta(nombre) {
    setCartas((prevSeleccionadas) =>
      prevSeleccionadas.filter((carta) => carta.nombre !== nombre)
    );
  }

  function compararCartas(carta1, carta2) {
    const propiedadesNumericas = ["elixir", "arena", "año_lanzamiento"];
    const propiedades = ["nombre", "tipo", "rareza"];
    const resultadoComparacion = {};

    propiedades.forEach((prop) => {
      resultadoComparacion[prop] = carta1[prop] === carta2[prop];
    });
    propiedadesNumericas.forEach((prop) => {
      if (carta1[prop] === carta2[prop]) {
        resultadoComparacion[prop] = { correcto: true };
      } else {
        resultadoComparacion[prop] = {
          correcto: false,
          sugerencia: carta1[prop] > carta2[prop] ? "↓↓" : "↑↑",
        };
      }
    });

    return resultadoComparacion;
  }

  return (
    <div
      style={{
        width: "80%",
        backgroundColor: "rgba(255,255,255,0.8)",
        overflow: "auto",
        border: "2px solid black",
        borderRadius: "20px",
        margin: "30px",
      }}
    >
      {cartaElegida ? (
        !win && (
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
        )
      ) : (
        <button
          onClick={() => CartaRandom()}
          style={{ width: "120px", marginTop: "10px" }}
        >
          Adivinar carta
        </button>
      )}

      {!win && search && (
        <ul
          className="flex flex-row flex-wrap justify-center h-[270px] mt-10 mb-10 overflow-auto rounded-3xl bg-yellow-300
        border-black border-2 mx-10"
        >
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

      {seleccionada.length > 0
        ? seleccionada
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
                    <p className=" text-white text-xl font-bold">
                      {card.nombre}
                    </p>
                    <img className="img" src={card.imagen} alt={card.nombre} />
                  </div>

                  <div
                    className="busqueda"
                    style={{
                      backgroundColor: resultado.rareza ? "green" : "red",
                    }}
                  >
                    <p className="mb-3 text-white text-xl font-bold">Calidad</p>
                    <p className="text-white text-xl font-bold">
                      {card.rareza}
                    </p>
                  </div>
                  <div
                    className="busqueda"
                    style={{
                      backgroundColor: resultado.tipo ? "green" : "red",
                    }}
                  >
                    <p className="mb-3 text-white text-xl font-bold">Tipo</p>
                    <p className="text-white text-xl font-bold">{card.tipo}</p>
                  </div>
                  {["elixir", "arena", "año_lanzamiento"].map((prop) => (
                    <div
                      className="busqueda"
                      style={{
                        backgroundColor: resultado[prop]?.correcto
                          ? "green"
                          : "red",
                      }}
                    >
                      <p className="mb-3 text-white text-xl font-bold">
                        {prop[0].toUpperCase() + prop.slice(1)}
                      </p>
                      <p className="text-white text-xl font-bold">
                        {card[prop]}
                      </p>
                      {!resultado[prop]?.correcto && (
                        <p className="text-white text-sm">
                          {resultado[prop]?.sugerencia}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
        : !win && <p className="text-xl my-5">No hay cartas seleccionadas</p>}
      {win && (
        <div className="mb-20">
          <p>‎</p>
          <p style={{ fontSize: "28px" }}> Felicidades, has ganado </p>
          {cartaElegida && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap", // Permitir que se ajusten si el espacio es limitado
                }}
              >
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title" style={{ marginBottom: "0px" }}>
                    {cartaElegida.nombre}
                  </p>
                  <img
                    style={{ marginBottom: "3px" }}
                    className="img"
                    src={cartaElegida.imagen}
                    alt={cartaElegida.nombre}
                  />
                </div>
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title">Elixir</p>
                  <p className="title">{cartaElegida.elixir}</p>
                </div>
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title">Calidad</p>
                  <p className="title">{cartaElegida.rareza}</p>
                </div>
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title">Tipo</p>
                  <p className="title">{cartaElegida.tipo}</p>
                </div>
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title">Arena</p>
                  <p className="title">{cartaElegida.arena}</p>
                </div>
                <div className="busqueda" style={{ backgroundColor: "green" }}>
                  <p className="title">Año lanzamiento</p>
                  <p className="title">{cartaElegida.año_lanzamiento}</p>
                </div>
              </div>
            </div>
          )}
          <h1 style={{ fontSize: "22px" }}>Adivinaste la carta</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="https://i.ytimg.com/vi/ATCpoqYsqjE/maxresdefault.jpg"
              alt="you won meme"
              style={{ width: "200px", height: "auto" }}
            />
          </div>
          <b>¿Deseas jugar otra vez?</b>
          <p></p>
          <button onClick={() => window.location.reload()}>Si</button>
          <button onClick={() => setXd(true)}>No</button>
        </div>
      )}
    </div>
  );
}

export default App;
