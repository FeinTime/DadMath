// Game Logic: Math Adventure Quest and Leaderboard

let correctCount = 0;
let totalCount = 0;
let startTime; // To track the start time of the game
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Load leaderboard from local storage

// Function to generate a random math question
function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let questionText;
    let correctAnswer;

    switch (operation) {
        case "+":
            questionText = `What is ${num1} + ${num2}?`;
            correctAnswer = num1 + num2;
            break;
        case "-":
            questionText = `What is ${num1} - ${num2}?`;
            correctAnswer = num1 - num2;
            break;
        case "*":
            questionText = `What is ${num1} × ${num2}?`;
            correctAnswer = num1 * num2;
            break;
    }

    const answers = [correctAnswer];
    while (answers.length < 4) {
        const randomAnswer = Math.floor(Math.random() * 40) - 10;
        if (!answers.includes(randomAnswer)) {
            answers.push(randomAnswer);
        }
    }

    answers.sort(() => Math.random() - 0.5);

    return {
        question: questionText,
        answers: answers,
        correctAnswer: answers.indexOf(correctAnswer),
    };
}

function showQuestion() {
    const question = generateQuestion();
    document.getElementById("question").innerText = question.question;
    question.answers.forEach((answer, index) => {
        const btn = document.getElementById(`answer${index + 1}`);
        btn.innerText = answer;
        btn.className = "answer-btn"; // Reset styles
        btn.onclick = () => handleAnswer(index, question.correctAnswer, btn);
    });
}

function handleAnswer(index, correctIndex, btn) {
    if (index === correctIndex) {
        correctCount++;
        btn.classList.add("correct");
    } else {
        correctCount = Math.max(correctCount - 1, 0);
        btn.classList.add("incorrect");
    }

    updateProgress();

    setTimeout(() => {
        if (correctCount < 10) {
            showQuestion();
        } else {
            completeGame();
        }
    }, 1000); // Automatically move to the next question
}

function updateProgress() {
    const progress = (correctCount / 10) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("score").innerText = `Score: ${correctCount}/10`;
}

function completeGame() {
    const endTime = Date.now();
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds
    const username = prompt("Congratulations! Enter your name to save your score:");

    if (username) {
        saveToLeaderboard(username, elapsedTime);
    }
    resetGame();
}

function saveToLeaderboard(username, time) {
    leaderboard.push({ username, time });
    leaderboard.sort((a, b) => a.time - b.time); // Sort by time
    leaderboard = leaderboard.slice(0, 5); // Keep only the top 5
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); // Save to local storage
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        leaderboardList.innerHTML += `<li>${index + 1}. ${entry.username} - ${entry.time}s</li>`;
    });
}

function resetGame() {
    correctCount = 0;
    totalCount = 0;
    updateProgress();
    startGame();
}

// Sidebar toggle for mobile view
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("minimized");
}

// Start the game
function startGame() {
    startTime = Date.now(); // Record the start time
    showQuestion();
}

// Initialize the game
startGame();
displayLeaderboard();

// Community Section: Allow users to post questions and answers

document.addEventListener("DOMContentLoaded", loadQuestions);
document.getElementById("submitQuestion").addEventListener("click", submitQuestion);

function submitQuestion() {
    const questionInput = document.getElementById("questionInput");
    const questionText = questionInput.value.trim();

    if (questionText) {
        const question = {
            text: questionText,
            answers: [],
            id: Date.now(), // Unique ID based on timestamp
        };

        // Store question in localStorage
        let questions = JSON.parse(localStorage.getItem("questions")) || [];
        questions.push(question);
        localStorage.setItem("questions", JSON.stringify(questions));

        // Reset input field
        questionInput.value = "";

        // Reload questions
        loadQuestions();
    } else {
        alert("Please enter a question before submitting!");
    }
}

function loadQuestions() {
    const questionsContainer = document.getElementById("questionsContainer");
    questionsContainer.innerHTML = ""; // Clear existing questions

    let questions = JSON.parse(localStorage.getItem("questions")) || [];

    // Display each question
    questions.forEach(question => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const questionText = document.createElement("p");
        questionText.innerHTML = `<strong>Q:</strong> ${question.text}`;
        questionDiv.appendChild(questionText);

        // Display answers
        const answersDiv = document.createElement("div");
        answersDiv.classList.add("answers");
        question.answers.forEach((answer, index) => {
            const answerPara = document.createElement("p");
            answerPara.innerHTML = `<strong>A${index + 1}:</strong> ${answer}`;
            answersDiv.appendChild(answerPara);
        });

        // Add a button to add an answer
        const answerInput = document.createElement("textarea");
        answerInput.placeholder = "Your answer here...";
        questionDiv.appendChild(answerInput);

        const submitAnswerButton = document.createElement("button");
        submitAnswerButton.textContent = "Submit Answer";
        submitAnswerButton.addEventListener("click", () => submitAnswer(question.id, answerInput.value.trim()));
        questionDiv.appendChild(submitAnswerButton);

        questionDiv.appendChild(answersDiv);
        questionsContainer.appendChild(questionDiv);
    });
}

function submitAnswer(questionId, answerText) {
    if (answerText) {
        let questions = JSON.parse(localStorage.getItem("questions")) || [];

        // Find the question by ID and add the answer
        const question = questions.find(q => q.id === questionId);
        if (question) {
            question.answers.push(answerText);

            // Save the updated questions array to localStorage
            localStorage.setItem("questions", JSON.stringify(questions));

            // Reload the questions to show the new answer
            loadQuestions();
        }
    } else {
        alert("Please enter an answer before submitting!");
    }
}
