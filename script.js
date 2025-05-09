// Navigation Logic
document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and sections
    document.querySelectorAll(".nav-btn, .project-section").forEach((el) => {
      el.classList.remove("active");
    });

    // Add active class to clicked button and corresponding section
    button.classList.add("active");
    const projectId = button.dataset.project;
    document.getElementById(projectId).classList.add("active");
  });
});

// Standard Calculator
(function () {
  const display = document.querySelector(".display");
  const buttons = document.querySelectorAll(".calculator .btn");
  let currentValue = "0";
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if ((value >= "0" && value <= "9") || value === ".") {
        if (waitingForSecondOperand) {
          currentValue = value;
          waitingForSecondOperand = false;
        } else {
          currentValue = currentValue === "0" ? value : currentValue + value;
        }
      } else if (value === "AC") {
        currentValue = "0";
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
      } else if (value === "±") {
        currentValue = (parseFloat(currentValue) * -1).toString();
      } else if (value === "%") {
        currentValue = (parseFloat(currentValue) / 100).toString();
      } else if ("+-×÷".includes(value)) {
        operator = value;
        firstOperand = parseFloat(currentValue);
        waitingForSecondOperand = true;
      } else if (value === "=") {
        if (operator && firstOperand !== null) {
          const secondOperand = parseFloat(currentValue);
          switch (operator) {
            case "+":
              currentValue = firstOperand + secondOperand;
              break;
            case "-":
              currentValue = firstOperand - secondOperand;
              break;
            case "×":
              currentValue = firstOperand * secondOperand;
              break;
            case "÷":
              currentValue = firstOperand / secondOperand;
              break;
          }
          currentValue = currentValue.toString();
          operator = null;
          firstOperand = null;
          waitingForSecondOperand = true;
        }
      }

      display.textContent = currentValue;
    });
  });
})();

// BMI Calculator
(function () {
  const calculateBtn = document.querySelector(".calculate-btn");
  const resultDiv = document.querySelector("#bmi .result");

  calculateBtn.addEventListener("click", () => {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;

    if (weight && height) {
      const bmi = weight / (height * height);
      let category = "";

      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";

      resultDiv.innerHTML = `BMI: ${bmi.toFixed(1)} (${category})`;
    } else {
      resultDiv.textContent = "Please enter valid values";
    }
  });
})();

// Lottery Picker
// Update the Lottery Picker logic in script.js
(function () {
  const lotteryData = JSON.parse(localStorage.getItem("lotteryData")) || {
    tickets: [],
    lastWinner: null,
  };

  function generateLotteryNumber() {
    const series = ["AK", "AL", "BA", "BB", "BC"];
    const randomSeries = series[Math.floor(Math.random() * series.length)];
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${randomSeries}/${randomNumber}`;
  }

  function updateTicketsDisplay() {
    const container = document.querySelector(".tickets-container");
    container.innerHTML = lotteryData.tickets
      .map(
        (ticket) => `
            <div class="ticket-card">
                <div class="ticket-number">${ticket.number}</div>
                <div class="ticket-name">${ticket.name}</div>
            </div>
        `
      )
      .join("");

    localStorage.setItem("lotteryData", JSON.stringify(lotteryData));
  }

  document.querySelector(".add-btn").addEventListener("click", () => {
    const nameInput = document.getElementById("participant-name");
    const name = nameInput.value.trim();

    if (name) {
      const newTicket = {
        number: generateLotteryNumber(),
        name: name,
        timestamp: new Date().toISOString(),
      };

      lotteryData.tickets.push(newTicket);
      nameInput.value = "";
      updateTicketsDisplay();
    }
  });

  document.querySelector(".pick-btn").addEventListener("click", () => {
    if (lotteryData.tickets.length > 0) {
      // Animate drawing effect
      const drawAnimation = setInterval(() => {
        const tempTicket =
          lotteryData.tickets[
            Math.floor(Math.random() * lotteryData.tickets.length)
          ];
        document.querySelector(
          ".winner"
        ).textContent = `${tempTicket.number} - ${tempTicket.name}`;
      }, 50);

      // Stop animation after 2 seconds and show actual winner
      setTimeout(() => {
        clearInterval(drawAnimation);
        const winner =
          lotteryData.tickets[
            Math.floor(Math.random() * lotteryData.tickets.length)
          ];
        lotteryData.lastWinner = winner;
        document.querySelector(".winner").innerHTML = `
                    <div>🎉 Winning Ticket 🎉</div>
                    <div>${winner.number}</div>
                    <div>${winner.name}</div>
                `;
        localStorage.setItem("lotteryData", JSON.stringify(lotteryData));
      }, 2000);
    }
  });

  // Show last winner on page load
  if (lotteryData.lastWinner) {
    document.querySelector(".winner").innerHTML = `
            <div>Last Winner:</div>
            <div>${lotteryData.lastWinner.number}</div>
            <div>${lotteryData.lastWinner.name}</div>
        `;
  }

  updateTicketsDisplay();
})();

// Color Game
(function () {
  const colorDisplay = document.querySelector(".color-display");
  const colorOptions = document.querySelector(".color-options");
  const result = document.querySelector("#color .result");
  let correctColor;

  function generateRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  }

  function newGame() {
    colorOptions.innerHTML = "";
    const colors = Array.from({ length: 6 }, generateRandomColor);
    correctColor = colors[Math.floor(Math.random() * 6)];
    colorDisplay.style.backgroundColor = correctColor;

    colors.forEach((color) => {
      const div = document.createElement("div");
      div.classList.add("color-option");
      div.style.backgroundColor = color;
      div.addEventListener("click", () => {
        if (color === correctColor) {
          result.textContent = "Correct!";
          colorOptions.querySelectorAll(".color-option").forEach((opt) => {
            opt.style.opacity = 1;
            opt.style.backgroundColor = correctColor;
          });
        } else {
          result.textContent = "Try Again!";
          div.style.opacity = 0.3;
        }
      });
      colorOptions.appendChild(div);
    });
  }

  document.querySelector(".reset-btn").addEventListener("click", newGame);
  newGame();
})();
