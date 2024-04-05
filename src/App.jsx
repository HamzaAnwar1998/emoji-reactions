import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  // states
  const [loading, setLoading] = useState(true);
  const [emojis, setEmojis] = useState([]);
  const [error, setError] = useState(null);

  // fetch emojis
  useEffect(() => {
    const axiosConfig = {
      headers: {
        "X-Api-Key": "rSn9QzTwFZmUlbOTdeHprw==vzogjdyBVluAxAUU",
      },
    };
    axios
      .get(
        `https://api.api-ninjas.com/v1/emoji?group=smileys_emotion`,
        axiosConfig
      )
      .then((res) => {
        setEmojis(res.data.slice(0, 9));
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setEmojis([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ref
  const emojiContainer = useRef(null);

  // emoji click
  const handleEmojiClick = (e, emoji) => {
    // create elemnet to hold emoji
    const emojiEl = document.createElement("div");
    emojiEl.classList.add("emoji-animate");
    emojiEl.innerHTML = emoji.character;

    // append element in the emoji container
    emojiContainer.current.appendChild(emojiEl);

    // get dynamic positions
    const { height, left } = e.target.getBoundingClientRect();
    const { bottom, top, width } = emojiContainer.current.getBoundingClientRect();

    // animation 🍃
    const animation = emojiEl.animate(
      [
        { opacity: 1, transform: `translate(${left}px, ${bottom}px)` },
        {
          opacity: 0,
          transform: `translate(${width / 2}px, ${top - height}px)`,
        },
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(.47,.48,.44,.86)",
      }
    );

    // remove element once has finished animating
    animation.onfinish = () => emojiEl.remove();
  };

  return (
    <>
      <div className="emoji-container" ref={emojiContainer}></div>
      <div className="emoji-list">
        {loading ? (
          <h5>Loading...</h5>
        ) : (
          <>
            {error ? (
              <h5>Could not fetch emojis</h5>
            ) : (
              <>
                {emojis.length > 0 ? (
                  <ul>
                    {emojis.map((emoji, index) => (
                      <li key={index}>
                        <button
                          aria-label={emoji.name}
                          onClick={(e) => handleEmojiClick(e, emoji)}
                        >
                          {emoji.character}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h5>No emojis found</h5>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
