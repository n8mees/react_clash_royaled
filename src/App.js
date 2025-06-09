// import './App.css';
// import Clashed_Royaled from './componentes/clashed_royaled';
// import Main from './componentes/main';
// import "./style/style.css"

// function App() {
//   return (
//     <div className="App">
//       <div className='body'>
//         <Clashed_Royaled></Clashed_Royaled>
//         {/* <Main></Main> */}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react"
// import { fetchCartas } from "./componentes/api.js"
import cartasData from "./componentes/CR-cards.json"
import GuessCardGame from "./componentes/GuessCard.jsx"
import Fondo from "./img/wallpaper.jpg";
import OnlineGuessCard from "./componentes/GuessOponentCard.jsx"
import "./style/style.css"

function App() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    setCards(cartasData)
  }, [])

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Clash Royale Card Guessing Game</h1>
      <div className="flex items-center justify-center" >
      <GuessCardGame initialCards={cards} />

      </div>
      {/* <OnlineGuessCard initialCards={cards} /> */}
    </div>
  )
}

export default App


