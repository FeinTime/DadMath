// scripts.js

let correctCount = 0; // Number of correct answers
let totalCount = 0;   // Total number of questions answered

// Function to generate a random math question
function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ["+", "-", "*", "/"];
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
            questionText = `What is ${num1} x ${num2}?`;
            correctAnswer = num1 * num2;
            break;
        case "/":
            const dividend = num1 * num2;
            questionText = `What is ${dividend} ÷ ${num1}?`;
            correctAnswer = num2;
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
        correctAnswer: answers.indexOf(correctAnswer)
    };
}

let currentQuestion;

// Function to display the current question and answers
function showQuestion() {
    currentQuestion = generateQuestion();
    document.getElementById("question").innerText = currentQuestion.question;
    currentQuestion.answers.forEach((answer, index) => {
        document.getElementById(`answer${index + 1}`).innerText = answer;
    });
    document.getElementById("feedback").innerText = ""; // Clear feedback
    document.getElementById("next-question").style.display = "none"; // Hide next button
}

// Function to check the selected answer
function checkAnswer(answerIndex) {
    totalCount++; // Increment total questions answered
    const feedback = document.getElementById("feedback");

    if (answerIndex === currentQuestion.correctAnswer) {
        correctCount++; // Increment correct answers
        feedback.innerText = "Correct! Great job!";
    } else {
        feedback.innerText = "Oops! That's not right. Try again!";
    }

    // Update score and percentage
    const percentage = ((correctCount / totalCount) * 100).toFixed(2);
    document.getElementById("score").innerText = `Score: ${correctCount}/${totalCount} (${percentage}%)`;

    document.getElementById("next-question").style.display = "block"; // Show next button
}

// Add event listeners for answer buttons
document.getElementById("answer1").addEventListener("click", () => checkAnswer(0));
document.getElementById("answer2").addEventListener("click", () => checkAnswer(1));
document.getElementById("answer3").addEventListener("click", () => checkAnswer(2));
document.getElementById("answer4").addEventListener("click", () => checkAnswer(3));

// Function to load the next question
function nextQuestion() {
    showQuestion(); // Generate and display a new question
}

// Initialize the game
showQuestion();

// Handle "Coming Soon" for inactive links
document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
    link.addEventListener("click", (event) => {
        if (link.getAttribute("href") === "#") {
            event.preventDefault();
            alert("Coming Soon!");
        }
    });
});
