document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const choiceElements = Array.from(document.querySelectorAll('.choice-text'));
    const feedbackElement = document.getElementById('feedback');
    const hudQuestionElement = document.getElementById('hud-question');
    const hudScoreElement = document.getElementById('hud-score');
    const progressBar = document.querySelector('.progress');
    const loader = document.getElementById('loader');
    const game = document.getElementById('game');

    let currentQuestion = {};
    let acceptingAnswers = false;
    let score = 0;
    let questionCounter = 0;
    let availableQuestions = [];

    const CORRECT_BONUS = 10;
    const MAX_QUESTIONS = 4; // Adjusted to match the number of questions

    const progressColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    const fetchQuestions = async () => {
        try {
            loader.classList.remove('hidden'); // Show spinner
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple'); // Example endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            availableQuestions = data.results.map((questionData) => {
                // Extract question, choices, and correct answer
                const choices = [...questionData.incorrect_answers];
                const correctAnswerIndex = Math.floor(Math.random() * (choices.length + 1));
                choices.splice(correctAnswerIndex, 0, questionData.correct_answer);

                return {
                    question: questionData.question,
                    choices: choices,
                    answer: correctAnswerIndex
                };
            });
            console.log('Fetched questions:', availableQuestions);
            
            startGame();
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            loader.classList.add('hidden'); // Hide spinner
        }
    };

    const startGame = () => {
        questionCounter = 0;
        score = 0;
        startNewQuestion();
        game.classList.remove("hidden");
    };

    const startNewQuestion = () => {
        if (questionCounter >= MAX_QUESTIONS) {
            return endGame();
        }

        questionCounter++;
        const questionIndex = Math.floor(Math.random() * availableQuestions.length);
        currentQuestion = availableQuestions[questionIndex];
        questionElement.innerText = currentQuestion.question;

        currentQuestion.choices.forEach((choice, index) => {
            choiceElements[index].innerText = choice;
            choiceElements[index].parentElement.classList.remove('correct', 'incorrect');
        });

        acceptingAnswers = true;
        feedbackElement.style.display = 'none';
        updateHUD();
    };

    choiceElements.forEach(choiceElement => {
        choiceElement.addEventListener('click', e => {
            if (!acceptingAnswers) return;

            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = choiceElements.indexOf(selectedChoice);

            const isCorrect = selectedAnswer === currentQuestion.answer;
            const classToApply = isCorrect ? 'correct' : 'incorrect';

            selectedChoice.parentElement.classList.add(classToApply);

            feedbackElement.style.display = 'block';
            feedbackElement.className = `feedback ${classToApply}`;
            feedbackElement.innerText = isCorrect ? 'Correct!' : 'Incorrect!';

            if (isCorrect) {
                score += CORRECT_BONUS;
                hudScoreElement.innerText = `Score: ${score}`;
            }

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                startNewQuestion();
            }, 1000);
        });
    });

    const updateHUD = () => {
        hudQuestionElement.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
        const progress = (questionCounter / MAX_QUESTIONS) * 100;

        const colorIndex = Math.floor(progress / (100 / progressColors.length));
        progressBar.style.width = `${progress}%`;
        progressBar.style.backgroundColor = progressColors[colorIndex];
    };

    const endGame = () => {
        console.log('Game ended');
        // Save score or any other final actions before redirecting
        localStorage.setItem('mostRecentScore', score);

        // Redirect to end.html
        window.location.href = 'end.html'; // Ensure this path is correct
    };

    fetchQuestions();
});
