document.addEventListener('DOMContentLoaded', function() {
  var score = 0;
  var clickButton = document.getElementById('clickButton');
  var scoreDisplay = document.getElementById('score');

  clickButton.addEventListener('click', function() {
    score++;
    scoreDisplay.textContent = score;
  });
});
