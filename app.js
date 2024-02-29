let inputPalette = ["-", "-", "-", "-", "-"];

document.addEventListener("DOMContentLoaded", () => {
  debugger;
  const generateButton = document.getElementById("generate");
  generateButton.addEventListener("click", generate);

  generate();
  //   generateButton.click();

  const locks = document.querySelectorAll(".lock");
  locks.forEach((lock, index) =>
    lock.addEventListener("click", (e) => handleLock(e, index)),
  );

  const cards = document.querySelectorAll(".color-card");
  cards.forEach((card, index) =>
  card.addEventListener("click", (e) => handleCard(e, index)),
  );
});

function generate() {
  let json_data = {
    adjacency: [
      1, 75, 33, 45, 31, 75, 1, 58, 51, 77, 33, 58, 1, 0, 0, 45, 51, 0, 1, 0,
      31, 77, 0, 0, 1,
    ],
    mode: "transformer",
    num_colors: 5,
    num_results: 1,
    palette: inputPalette,
  };

  fetch("https://api.huemint.com/color", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(json_data),
  })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      let palette = data.results[0].palette;
      let colorDivs = document.querySelectorAll(".color");
      colorDivs.forEach((div, index) => {
        div.parentElement.dataset.value = palette[index];
        div.style.backgroundColor = palette[index];
      });
    });
}

function handleLock(e, lockNumber) {
  let locked = e.currentTarget;
  if (locked.dataset.locked === "false") {
    inputPalette[lockNumber] = locked.parentElement.dataset.value;
    locked.dataset.locked = "true";
  } else if (locked.dataset.locked === "true") {
    inputPalette[lockNumber] = "-";
    locked.dataset.locked = "false";
  }
}

function handleCard(e, index) {
  var copyText = e.currentTarget;
  const colorCopyed = copyText.getAttribute('data-value');
  
  navigator.clipboard.writeText(colorCopyed);
  
  const notificationDiv = document.createElement("div");
  notificationDiv.textContent = "Copied the color: " + colorCopyed;
  notificationDiv.classList.add("notification");
  
  document.body.appendChild(notificationDiv);
  
  setTimeout(function() {
      document.body.removeChild(notificationDiv);
  }, 4000); 
}

function handleShortcut(event) {
  if (event.key === "n" || event.key === "N" ) {
      event.preventDefault();
      generate();
  }
}
document.addEventListener("keydown", handleShortcut);
