document.addEventListener('DOMContentLoaded', () => {
    const finalScoreElement = document.getElementById('finalscore');
    const username = document.getElementById('username');
    const saveScoreBtn = document.getElementById('Savescorebtn');

    const mostRecentScore = localStorage.getItem('mostRecentScore');
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const MAX_HIGH_SCORES = 5;

    if (mostRecentScore !== null) {
        finalScoreElement.innerText = `Your Final Score: ${mostRecentScore}`;
    } else {
        finalScoreElement.innerText = 'No score available';
    }

    username.addEventListener('keyup', () => {
        saveScoreBtn.disabled = !username.value;
    });

    const saveHighScore = (e) => {
        e.preventDefault();

        const score = {
            score: mostRecentScore,
            name: username.value
        };

        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(MAX_HIGH_SCORES);

        localStorage.setItem('highScores', JSON.stringify(highScores));

        // Show the "Saved" message
        saveScoreBtn.innerText = "Saved!";

        // Wait for a second and then redirect to highscore page
        setTimeout(() => {
            window.location.assign('highscore.html'); // Ensure this path is correct
        }, 1000);
    };

    document.getElementById('saveScoreForm').addEventListener('submit', saveHighScore);
});
