document.addEventListener('DOMContentLoaded', () => {
    const finalScoreElement = document.getElementById('finalscore');
    const usernameInput = document.getElementById('username');
    const saveScoreForm = document.getElementById('saveScoreForm');
    const saveScoreBtn = document.getElementById('saveScoreBtn');

    const mostRecentScore = localStorage.getItem('mostRecentScore');
    const MAX_HIGH_SCORES = 5;

    if (mostRecentScore !== null) {
        finalScoreElement.innerText = `Your Final Score: ${mostRecentScore}`;
    } else {
        finalScoreElement.innerText = 'No score available';
    }

    saveScoreForm.addEventListener('submit', saveHighScore);

    function saveHighScore(e) {
        e.preventDefault();

        const score = {
            score: mostRecentScore,
            name: usernameInput.value
        };

        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(score);
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, MAX_HIGH_SCORES);

        localStorage.setItem('highScores', JSON.stringify(highScores));

        console.log('Most recent score:', mostRecentScore); // Add console log here
        console.log('High scores:', highScores); // Add console log here

        // Redirect to highscore page
        window.location.href = 'highscore.html'; // Ensure this path is correct
    }
});
