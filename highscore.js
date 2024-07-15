document.addEventListener('DOMContentLoaded', () => {
    const highScoreList = document.getElementById('highScoreList');
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    console.log('High scores:', highScores); // Add console log here

    highScoreList.innerHTML = highScores
        .map(score => `<li class="high-score">${score.name} - ${score.score}</li>`)
        .join('');
});
