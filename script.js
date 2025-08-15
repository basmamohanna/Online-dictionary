document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const result = document.getElementById("result");
  const themeToggle = document.getElementById("theme-toggle");

  // Dark Mode State
  let isDarkMode = localStorage.getItem("darkMode") === "true";

  // Initialize Theme
  updateTheme();

  // Event Listeners
  searchBtn.addEventListener("click", fetchWord);
  searchInput.addEventListener("keyup", (e) => e.key === "Enter" && fetchWord());
  themeToggle.addEventListener("click", toggleTheme);

  // Fetch Word from API
  async function fetchWord() {
    const word = searchInput.value.trim();
    if (!word) {
      result.innerHTML = "<p>Please enter a word.</p>";
      return;
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Word not found");
      displayResult(data[0]);
    } catch (error) {
      result.innerHTML = `<p>${error.message}</p>`;
    }
  }

  // Display Results
  function displayResult(data) {
    const audioSrc = data.phonetics?.find(ph => ph.audio)?.audio;
    const firstMeaning = data.meanings[0];

    result.innerHTML = `
      <div class="word">
        <h3>${data.word}</h3>
        ${audioSrc ? `<button class="audio-btn" onclick="playAudio('${audioSrc}')">🔊</button>` : ''}
      </div>
      <div class="details">
        <p>${firstMeaning.partOfSpeech}</p>
      </div>
      <div class="meaning">
        ${firstMeaning.definitions[0].definition}
      </div>
      ${firstMeaning.definitions[0].example ? `
        <div class="example">
          ${firstMeaning.definitions[0].example}
        </div>
      ` : ''}
      ${firstMeaning.synonyms.length > 0 ? `
        <div class="synonyms">
          <strong>Synonyms:</strong> 
          ${firstMeaning.synonyms.slice(0, 5).map(syn => `<span>${syn}</span>`).join("")}
        </div>
      ` : ''}
    `;
  }

  // Play Audio
  window.playAudio = (url) => {
    new Audio(url).play().catch(e => console.error("Audio error:", e));
  };

  // Theme Toggle
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("darkMode", isDarkMode);
    updateTheme();
  }

  function updateTheme() {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  }
});
