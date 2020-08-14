// DOM Selectors
const word = document.getElementById("word");
const playBtn = document.getElementById("play-again");
const wrongLettersField = document.getElementById("wrong-letters");
const wrongContainer = document.querySelector(".wrong-container");
const resultText = document.querySelector(".modal-text");
const modal = document.getElementById("modal-container");
const notification = document.getElementById("notification");

const personPart = document.querySelectorAll(".person-part");

const correctLetters = [];
const wrongLetters = [];

let randomWord;

window.addEventListener("load", () => {
  fetch(`https://random-word-api.herokuapp.com/word?number=1`)
    .then((res) => res.json())
    .then((data) => {
      randomWord = data[0];
      displayWord();
    });
});

// Display hidden word
const displayWord = () => {
  word.innerHTML = `
        ${randomWord
          .split("")
          .map(
            (letter) =>
              `
            <span class="word-letter">
                ${correctLetters.includes(letter) ? letter : ""}
            </span>
            `
          )
          .join("")}
    `;
  const innerWord = word.innerText.replace(/\n/g, "");

  console.log(randomWord);

  if (innerWord === randomWord) {
    getText("Congratulations! You won", "flex");
  }
};

// Text for modal
const getText = (text, displayType) => {
  resultText.innerText = text;
  modal.style.display = displayType;
};

// Display wrong Letters
const displayWrongLetters = () => {
  if (wrongLetters.length > 0) {
    wrongContainer.style.display = "flex";
  }
  wrongLettersField.innerHTML = `
            ${
              wrongLetters.length > 0 ? "<h2 class='wrong-text'>Wrong</h2>" : ""
            }
            ${wrongLetters.map(
              (letter) => `<span class="letter">${letter}</span>`
            )}
        `;

  personPart.forEach((part, index) => {
    const error = wrongLetters.length;

    if (index < error) {
      part.style.display = "flex";
    } else {
      part.style.display = "none";
    }
  });

  if (wrongLetters.length === personPart.length) {
    getText("Sorry, You Lost. But maybe try again.", "flex");
  }
};

const showNotification = (time = 2000) => {
  notification.classList.add("show-notification");

  setTimeout(() => {
    notification.classList.remove("show-notification");
  }, time);
};

// Play again button - reload page
playBtn.addEventListener("click", () => {
  location.reload();
});

// Recognize keyboard input
window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (randomWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        displayWrongLetters();
      } else {
        showNotification();
      }
    }
  }
});
