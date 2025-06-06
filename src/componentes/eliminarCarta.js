export const EliminarCarta = (cartas, nombre) => {
    return cartas.filter((carta) => carta.nombre !== nombre);
  };