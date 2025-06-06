import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import CardList from "./CardList"
import WinScreen from "./WinScreen"

const socket = io("http://localhost:3001") // Cambia por tu backend

export default function OnlineGuessCard({ initialCards }) {
  const [room, setRoom] = useState("")
  const [inRoom, setInRoom] = useState(false)
  const [cards, setCards] = useState(initialCards)
  const [myCard, setMyCard] = useState(null)
  const [opponentCard, setOpponentCard] = useState(null)
  const [guess, setGuess] = useState("")
  const [win, setWin] = useState(false)
  const [opponentWin, setOpponentWin] = useState(false)

  // Unirse a la sala
  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", room)
      setInRoom(true)
    }
  }

  // Elegir carta y avisar al servidor
  const chooseCard = (card) => {
    setMyCard(card)
    socket.emit("choose_card", { room, card })
  }

  // Escuchar eventos del servidor
  useEffect(() => {
    socket.on("opponent_card_chosen", (card) => {
      setOpponentCard(card)
    })
    socket.on("opponent_guessed", (result) => {
      if (result) setOpponentWin(true)
    })
    socket.on("reset", () => {
      setMyCard(null)
      setOpponentCard(null)
      setWin(false)
      setOpponentWin(false)
    })
    return () => {
      socket.off("opponent_card_chosen")
      socket.off("opponent_guessed")
      socket.off("reset")
    }
  }, [room])

  // Adivinar carta del oponente
  const guessCard = (card) => {
    socket.emit("guess_card", { room, guess: card.nombre })
    if (card.nombre === opponentCard?.nombre) setWin(true)
  }

  // Resetear juego
  const resetGame = () => {
    socket.emit("reset", room)
    setMyCard(null)
    setOpponentCard(null)
    setWin(false)
    setOpponentWin(false)
  }

  // UI
  if (!inRoom) {
    return (
      <div>
        <input value={room} onChange={e => setRoom(e.target.value)} placeholder="Código de sala" />
        <button onClick={joinRoom}>Unirse</button>
      </div>
    )
  }

  if (!myCard) {
    return (
      <div>
        <h2>Elige tu carta secreta</h2>
        <CardList cards={cards} onSelectCard={chooseCard} />
      </div>
    )
  }

  if (!opponentCard) {
    return <div>Esperando a que el oponente elija su carta...</div>
  }

  if (win) {
    return <WinScreen chosenCard={opponentCard} onReset={resetGame} />
  }

  if (opponentWin) {
    return <div>¡El oponente adivinó tu carta!</div>
  }

  return (
    <div>
      <h2>Adivina la carta del oponente</h2>
      <CardList cards={cards} onSelectCard={guessCard} />
      <button onClick={resetGame}>Reiniciar</button>
    </div>
  )
}