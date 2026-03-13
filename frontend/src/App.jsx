import { useEffect, useState} from 'react'
import './App.css'

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  return (
    <div>
      <h1>Pokéshop </h1>
      {cards.map((card) => (
        <div key={card.id}>
          <h2>{card.name}</h2>
          <p>{card.setName} — {card.rarity}</p>
          <p>Condition: {card.condition}</p>
          <p>Price: ${card.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App
