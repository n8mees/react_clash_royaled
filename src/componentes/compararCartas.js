export const compararCartas = (carta1, carta2) => {
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
  };