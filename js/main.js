// Quiz data - 100 vragen over computerwetenschappen
const questions = [
  {
    question: "Wat betekent HTML?", answers: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], correctAnswer: 0
  },
  {
    question: "Welke programmeertaal wordt vooral gebruikt voor webanimaties?", answers: ["Python", "Java", "JavaScript", "C++"], correctAnswer: 2
  },
  {
    question: "Hoe sluit je een HTML-tag?", answers: ["<tag>", "</tag>", "{tag}", "[tag]"], correctAnswer: 1
  },
  {
    question: "Welke kleur krijg je met RGB(255, 0, 0)?", answers: ["Groen", "Blauw", "Rood", "Geel"], correctAnswer: 2
  },
  {
    question: "Hoe begin je een regel code in Python?", answers: ["Met een puntkomma (;)", "Met een hashtag (#)", "Direct met de code", "Met een dubbele punt (:)"], correctAnswer: 2
  },
  {
    question: "Wat is een variabele?", answers: ["Een vaste waarde", "Een stuk tekst", "Een opslagplaats voor data", "Een wiskundige formule"], correctAnswer: 2
  },
  {
    question: "Hoe maak je een commentaar in JavaScript?", answers: ["// Dit is een commentaar", "<!-- Dit is een commentaar -->", "# Dit is een commentaar", "/* Dit is een commentaar */"], correctAnswer: 0
  },
  {
    question: "Wat doet de functie `print()` in Python?", answers: ["Leest input", "Slaat data op", "Toont tekst op het scherm", "Rekent een som uit"], correctAnswer: 2
  },
  {
    question: "Welke tag gebruik je voor een paragraaf in HTML?", answers: ["<p>", "<h1>", "<div>", "<span>"], correctAnswer: 0
  },
  {
    question: "Hoe heet een fout in de code?", answers: ["Bug", "Feature", "Glitch", "Error"], correctAnswer: 0
  },
  {
    question: "Wat betekent 'WWW' in een URL?", answers: ["World Wide Web", "Web World Wide", "World Web Wide", "Wide Web World"],
    correctAnswer: 0
  },
  {
    question: "Hoe voeg je een afbeelding toe in HTML?", answers: ["<img>", "<image>", "<picture>", "<photo>"],
    correctAnswer: 0
  },
  {
    question: "Wat is de eenvoudigste manier om een lijst te maken in HTML?", answers: ["<list>", "<ul> of <ol>", "<dl>", "<li>"], correctAnswer: 1
  },
  {
    question: "Hoe sla je een bestand op in een teksteditor?", answers: ["Ctrl + C", "Ctrl + S", "Ctrl + V", "Ctrl + X"], correctAnswer: 1
  },
  {
    question: "Wat is de standaard extensie voor een HTML-bestand?", answers: [".txt", ".html", ".doc", ".css"], correctAnswer: 1
  },
  {
    question: "Hoe heet een website-startpagina?", answers: ["Index", "Main", "Home", "Start"], correctAnswer: 0
  },
  {
    question: "Wat is een browser?", answers: ["Een zoekmachine", "Een programma om websites te bekijken", "Een tekstverwerker", "Een game"], correctAnswer: 1
  },
  {
    question: "Welke toets gebruik je om code in te springen?", answers: ["Tab", "Enter", "Shift", "Ctrl"], correctAnswer: 0
  },
  {
    question: "Hoe maak je een link in HTML?", answers: ["<a href='...'>", "<link>", "<url>", "<web>"], correctAnswer: 0
  },
  {
    question: "Wat is een bestandsformaat voor afbeeldingen?", answers: [".mp3", ".jpg", ".txt", ".html"], correctAnswer: 1
  }
];

// Game state
let game = {
  currentQuestionIndex: 0,
  score: 0,
  lives: 3,
  timer: null,
  timePerQuestion: 10,
  timeLeft: 10,
  usedQuestions: [],
  powerups: {
    double: { available: true, used: false },    
    fiftyfifty: { available: true, used: false }, 
    heal: { available: true, used: false }         
  },
  achievements: {
    streak3: false, streak5: false, streak10: false, streak15: false, streak25: false,
    noPowerups: false, allCorrect: false, zeroCorrect: false
  },
  correctStreak: 0,
  questionsWithoutPowerups: 0,
  gameMode: 'timed'
};

// DOM elements
const elements = {
  quizContainer: document.querySelector('#quizContainer'),
  questionElement: document.querySelector('#question'),
  answersContainer: document.querySelector('#answers'),
  livesElement: document.querySelector('#lives'),
  scoreElement: document.querySelector('#score'),
  timerElement: document.querySelector('#timer'),
  progressElement: document.querySelector('#progress'),
  nextBtn: document.querySelector('#nextBtn'),
  gameOverElement: document.querySelector('#gameOver'),
  finalScoreElement: document.querySelector('#finalScore'),
  highscoreDisplay: document.querySelector('#highscoreDisplay'),
  modeToggle: document.querySelector('#modeToggle'),
  powerupContainer: document.querySelector('#powerupContainer'),
  newGameBtn: document.querySelector('#newGameBtn'),
  highScoresBtn: document.querySelector('#highScoresBtn'),
  saveBtn: document.querySelector('#saveBtn'),
  loadBtn: document.querySelector('#loadBtn'),
  restartBtn: document.querySelector('#restartBtn'),
  themeToggle: document.querySelector('#themeToggle')
};

// Initialize the game
function initGame() {
  game = {
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    timer: null,
    timePerQuestion: 10,
    timeLeft: 10,
    usedQuestions: [],
    powerups: {
      double: { available: true, used: false },
      fiftyfifty: { available: true, used: false },
      heal: { available: true, used: false }
    },
    achievements: JSON.parse(JSON.stringify(game.achievements)), // Clone achievements
    correctStreak: 0,
    questionsWithoutPowerups: 0,
    gameMode: game.gameMode
  };
  
  updateGameInfo();
  showQuestion();
  elements.timerElement.style.display = game.gameMode === 'timed' ? 'block' : 'none';
  elements.quizContainer.classList.remove('hidden');
  elements.gameOverElement.classList.add('hidden');
}

// Show a random question
function showQuestion() {
  clearInterval(game.timer);
  game.timeLeft = game.timePerQuestion;
  updateTimerDisplay();
  
  if (game.gameMode === 'timed') {
    game.timer = setInterval(() => {
      game.timeLeft--;
      updateTimerDisplay();
      
      if (game.timeLeft <= 0) {
        clearInterval(game.timer);
        handleAnswer(-1);
      }
    }, 1000);
  }
  
  const availableQuestions = questions.filter((_, i) => !game.usedQuestions.includes(i));
  
  if (availableQuestions.length === 0) {
    endGame(true);
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const questionObj = availableQuestions[randomIndex];
  game.currentQuestionIndex = questions.indexOf(questionObj);
  game.usedQuestions.push(game.currentQuestionIndex);
  
  elements.questionElement.textContent = questionObj.question;
  elements.answersContainer.innerHTML = '';
  
  for (let i = 0; i < questionObj.answers.length; i++) {
    const answer = questionObj.answers[i];
    const button = document.createElement('button');
    button.textContent = answer;
    button.className = 'answer-btn';
    button.dataset.index = i;
    button.addEventListener('click', () => handleAnswer(i));
    elements.answersContainer.appendChild(button);
  }
  
  elements.progressElement.textContent = `Vraag ${game.usedQuestions.length}/${questions.length}`;
  elements.nextBtn.classList.add('hidden');
  resetPowerupButtons();
}

// Handle answer selection
function handleAnswer(selectedIndex) {
  clearInterval(game.timer);
  const questionObj = questions[game.currentQuestionIndex];
  const isCorrect = selectedIndex === questionObj.correctAnswer;
  
  const answerButtons = document.querySelectorAll('.answer-btn');
  for (let i = 0; i < answerButtons.length; i++) {
    const button = answerButtons[i];
    button.disabled = true;
    if (i === questionObj.correctAnswer) button.classList.add('correct');
    else if (i === selectedIndex) button.classList.add('wrong');
  }
  
  if (isCorrect) {
    let points = 1;
    game.correctStreak++;
    game.questionsWithoutPowerups++;
    
    if (game.powerups.double.used) {
      points *= 2;
      game.powerups.double.used = false;
    }
    
    if (game.powerups.heal.used && game.lives < 3) {
      game.lives++;
      game.powerups.heal.used = false;
      updateLivesDisplay();
    }
    
    game.score += points;
    updateScoreDisplay();
    checkAchievements();
  } else {
    game.lives--;
    game.correctStreak = 0;
    game.questionsWithoutPowerups = 0;
    updateLivesDisplay();
    
    if (game.lives <= 0) {
      endGame(false);
      return;
    }
  }
  
  elements.nextBtn.classList.remove('hidden');
}

// Update game info
function updateGameInfo() {
  updateScoreDisplay();
  updateLivesDisplay();
  updateTimerDisplay();
}

function updateScoreDisplay() {
  elements.scoreElement.textContent = `Score: ${game.score}`;
}

function updateLivesDisplay() {
  const filledHeart = '&#x2764; &#xFE0F; '; 
  const emptyHeart = '&#x2661;';          
  
  elements.livesElement.innerHTML = 
    filledHeart.repeat(game.lives) + 
    emptyHeart.repeat(3 - game.lives);
}

function updateTimerDisplay() {
  if (game.gameMode === 'timed') {
    elements.timerElement.textContent = `Tijd: ${game.timeLeft}s`;
    elements.timerElement.style.color = game.timeLeft < 5 ? 'red' : '';
  }
}

// Powerup functions
function usePowerup(type) {
  if (!game.powerups[type].available || game.powerups[type].used) return;
  
  game.powerups[type].used = true;
  document.querySelector(`.powerup-btn[data-powerup="${type}"]`).disabled = true;
  
  if (type === 'fiftyfifty') {
    const questionObj = questions[game.currentQuestionIndex];
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== questionObj.correctAnswer);
    const toRemove = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const answerButtons = document.querySelectorAll('.answer-btn');
    for (let i = 0; i < answerButtons.length; i++) {
      const button = answerButtons[i];
      if (toRemove.includes(i)) button.style.visibility = 'hidden';
    }
  }
}

function resetPowerupButtons() {
  const powerupButtons = document.querySelectorAll('.powerup-btn');
  for (let i = 0; i < powerupButtons.length; i++) {
    const btn = powerupButtons[i];
    const type = btn.dataset.powerup;
    btn.disabled = !game.powerups[type].available || game.powerups[type].used;
    btn.style.visibility = 'visible';
  }
}

// Check achievements
function checkAchievements() {
  const streaks = [3, 5, 10, 15, 25];
  for (let i = 0; i < streaks.length; i++) {
    const s = streaks[i];
    if (game.correctStreak >= s && !game.achievements[`streak${s}`]) {
      game.achievements[`streak${s}`] = true;
      showAchievement(`${s} vragen op rij goed!`);
      if (s === 10) restorePowerup();
    }
  }
  
  if (game.questionsWithoutPowerups >= 25 && !game.achievements.noPowerups) {
    game.achievements.noPowerups = true;
    showAchievement("25 vragen zonder powerups!");
  }
}

function restorePowerup() {
  for (const type in game.powerups) {
    if (!game.powerups[type].available) {
      game.powerups[type].available = true;
      document.querySelector(`.powerup-btn[data-powerup="${type}"]`).disabled = false;
      break;
    }
  }
}

function showAchievement(message) {
  const achievement = document.createElement('div');
  achievement.className = 'achievement';
  achievement.textContent = `Achievement: ${message}`;
  document.body.appendChild(achievement);
  setTimeout(() => achievement.remove(), 2000);
}

// End game
function endGame(isWin) {
  clearInterval(game.timer);
  elements.quizContainer.classList.add('hidden');
  elements.gameOverElement.classList.remove('hidden');
  elements.gameOverElement.querySelector('h2').textContent = isWin ? 'WIN!' : 'Game Over!';
  elements.finalScoreElement.textContent = game.score;
  
  // Update highscore
  const highscore = parseInt(localStorage.getItem('highscore')) || 0;
  if (game.score > highscore) {
    localStorage.setItem('highscore', game.score.toString());
  }
  elements.highscoreDisplay.textContent = Math.max(highscore, game.score);
  
  // Check for achievements
  if (isWin && !game.achievements.allCorrect) {
    game.achievements.allCorrect = true;
    showAchievement("Alle vragen correct beantwoord!");
  }
  
  if (game.score === 0 && !game.achievements.zeroCorrect) {
    game.achievements.zeroCorrect = true;
    showAchievement("Game over met 0 vragen goed!");
  }
}

// Save and load game
function saveGame() {
  const gameState = {
    currentQuestionIndex: game.currentQuestionIndex,
    score: game.score,
    lives: game.lives,
    usedQuestions: game.usedQuestions,
    powerups: game.powerups,
    achievements: game.achievements,
    correctStreak: game.correctStreak,
    questionsWithoutPowerups: game.questionsWithoutPowerups,
    gameMode: game.gameMode
  };
  localStorage.setItem('quizSave', JSON.stringify(gameState));
  alert('Spel opgeslagen!');
}

function loadGame() {
  const savedGame = localStorage.getItem('quizSave');
  if (savedGame) {
    const gameState = JSON.parse(savedGame);
    game.currentQuestionIndex = gameState.currentQuestionIndex;
    game.score = gameState.score;
    game.lives = gameState.lives;
    game.usedQuestions = gameState.usedQuestions;
    game.powerups = gameState.powerups;
    game.achievements = gameState.achievements;
    game.correctStreak = gameState.correctStreak;
    game.questionsWithoutPowerups = gameState.questionsWithoutPowerups;
    game.gameMode = gameState.gameMode;
    
    updateGameInfo();
    showQuestion();
    alert('Spel geladen!');
  } else {
    alert('Geen opgeslagen spel gevonden');
  }
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  elements.themeToggle.innerHTML = isDarkMode ? '&#x1F319;':'&#x1F31E;' ; 
}

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    elements.themeToggle.innerHTML = '&#x1F319;'; 
  } else {
    elements.themeToggle.innerHTML = '&#x1F31E;'; 
  }
}

// Toggle game mode
function toggleGameMode() {
  game.gameMode = game.gameMode === 'timed' ? 'untimed' : 'timed';
  elements.modeToggle.textContent = game.gameMode === 'timed';
  elements.timerElement.style.display = game.gameMode === 'timed' ? 'block' : 'none';
}

// Event listeners
elements.nextBtn.addEventListener('click', showQuestion);

document.querySelectorAll('.powerup-btn').forEach(btn => {
  btn.addEventListener('click', () => usePowerup(btn.dataset.powerup));
});

elements.newGameBtn.addEventListener('click', initGame);
elements.restartBtn.addEventListener('click', initGame);

elements.highScoresBtn.addEventListener('click', () => {
  const highscore = localStorage.getItem('highscore') || 0;
  alert(`Jouw hoogste score is: ${highscore}`);
});

elements.saveBtn.addEventListener('click', saveGame);
elements.loadBtn.addEventListener('click', loadGame);
elements.themeToggle.addEventListener('click', toggleTheme);
elements.modeToggle.addEventListener('click', toggleGameMode);

// Initialize
initTheme();
initGame();