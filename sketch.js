let startButton, nextButton, backButton, retryButton, homeButton;
let currentScene = "start";
let fadeAlpha = 0;
let characterY = 600;
let clouds = [];
let dialogueStep = 0;
let dialogueList = [];

let score = 0;
let gameOver = false;

let mirror, lightX, flowerX;

function setup() {
  createCanvas(800, 500);
  createStartButton();
  createNavButtons();

  for (let i = 0; i < 6; i++) {
    clouds.push({ x: random(width), y: random(20, 100), size: random(60, 100), speed: random(0.3, 0.6) });
  }
}

function draw() {
  clear();
  if (currentScene === "start") {
    drawStartScreen();
    animateButton();
  } else if (currentScene === "transition") {
    drawStartScreen();
    fadeToNextScene("field");
  } else if (currentScene === "field") {
    drawFieldScene();
    nextButton.show();
    backButton.hide();
  } else if (currentScene === "cityTransition") {
    drawFieldScene();
    fadeToNextScene("city");
  } else if (currentScene === "city") {
    drawCityScene();
    nextButton.hide();
    backButton.show();
  } else if (currentScene === "final") {
    drawFinalMessage();
  } else if (currentScene === "game") {
    drawBeeGame();
  } else if (currentScene === "gameOver") {
    drawGameOver();
  }
}

// TELA INICIAL
function drawStartScreen() {
  background(135, 206, 235);
  drawSun();
  drawClouds();
  fill(60, 179, 113);
  noStroke();
  rect(0, height - 100, width, 100);

  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0, 100);
  strokeWeight(3);
  textSize(42);
  textFont('Georgia');
  text("🌸Semeando Cidades, Colhendo Futuro🌸", width / 2, height / 2 - 40);
}

// BOTÕES
function createStartButton() {
  startButton = createButton('🌿 COMEÇAR 🌿');
  styleButton(startButton);
  startButton.position(width / 2 - 100, height / 2 + 60);
  startButton.mousePressed(() => {
    currentScene = "transition";
    startButton.hide();
  });
}

function createNavButtons() {
  nextButton = createButton("➜");
  styleButton(nextButton);
  nextButton.position(width - 70, height - 50);
  nextButton.mousePressed(() => {
    if (currentScene === "field") {
      currentScene = "cityTransition";
      // Quando mudar para a cidade, começar o diálogo da cidade no índice 1 para não repetir a primeira fala
      dialogueStep = 1; 
    }
  });
  nextButton.hide();

  backButton = createButton("⬅");
  styleButton(backButton);
  backButton.position(width - 120, height - 50);
  backButton.mousePressed(() => {
    if (currentScene === "city") {
      currentScene = "field";
      dialogueStep = 0;
    }
  });
  backButton.hide();
}

function styleButton(btn) {
  btn.style('font-size', '22px');
  btn.style('padding', '10px 20px');
  btn.style('border-radius', '15px');
  btn.style('border', 'none');
  btn.style('background', 'linear-gradient(90deg, #70c1b3, #b2dbbf)');
  btn.style('color', '#fff');
  btn.style('font-family', 'Georgia');
  btn.style('cursor', 'pointer');
}

function animateButton() {
  let opacity = map(sin(frameCount * 0.03), -1, 1, 0.7, 1);
  startButton.style('opacity', nf(opacity, 1, 2));
}

function fadeToNextScene(next) {
  fadeAlpha += 6;
  fill(0, fadeAlpha);
  noStroke();
  rect(0, 0, width, height);
  if (fadeAlpha >= 255) {
    currentScene = next;
    fadeAlpha = 0;
    characterY = height;
    // Só resetamos o dialogueStep aqui para field (já feito ao entrar na cidade no botão)
    if (next === "field") {
      dialogueStep = 0;
    }
  }
}

// FALAS
let fieldDialogues = [
  "Olá pessoal, tudo bem com vocês?",
  "Sou o Rodolfo, hoje irei explicar sobre as abelhas e os painéis solares!",

  "🐝 As abelhas são pequenas, mas fazem um trabalho gigante!\nSem elas, o campo para… e a cidade sente.",
  "🌼Elas abelhas ajudam a polinizar as plantações,\nque viram alimentos e flores também nas cidades!",
  "Sem as abelhas, frutas como maçãs e morangos seriam bem mais raras!",
  "🌿 O campo precisa delas para continuar forte e produtivo!"
];

// REMOVIDO o último diálogo da cidade que mencionava a quarta tela com o jogo
let cityDialogues = [
  
  "Agora irei falar sobre os painéis solares!",
  "🌆 Os painéis solares capturam a luz do sol\ne transformam em energia para nossas casas!",
  "☀️Eles funcionam melhor em dias ensolarados,\nmas também geram energia mesmo com nuvens.",
  "🏙️ Na cidade, podemos usar tetos solares\npara ter energia limpa e economizar!"
];


function drawFieldScene() {
  background(135, 206, 250);
  drawSun(); drawClouds(); drawTree(); drawBeeHive(); drawWheat(); drawCharacter();
  if (characterY > height - 180) {
    characterY -= 2;
  } else {
    handleDialogue(fieldDialogues);
  }
}

function drawCityScene() {
  background(200, 225, 255);
  drawSun(); drawClouds();
  for (let i = 0; i < width; i += 80) {
    fill(100 + i % 3 * 20);
    rect(i, height - 300, 60, 300);
    fill(255, 255, 0, 80);
    for (let y = height - 290; y < height; y += 30) {
      rect(i + 10, y, 10, 10);
      rect(i + 30, y, 10, 10);
    }
  }
  for (let i = 50; i < width; i += 150) {
    fill(139, 69, 19); rect(i, height - 120, 10, 30);
    fill(34, 139, 34); ellipse(i + 5, height - 130, 40, 40);
  }
  fill(60); rect(0, height - 100, width, 100);
  drawCharacter();

  if (characterY > height - 180) {
    characterY -= 2;
  } else {
    handleDialogue(cityDialogues);
  }
}

function drawFinalMessage() {
  background(250, 240, 200);
  textAlign(CENTER, CENTER);
  textSize(28);
  textFont('Georgia');
  fill(0);
  text("🐝 Ok, agora que você sabe sobre os painéis solares,\nque tal um jogo sobre eles?", width/2, height/2);
  textSize(18);
  text("(Pressione ESPAÇO para começar)", width/2, height/2 + 80);
}

// JOGO: DESVIO SOLAR
function startGame() {
  mirror = { x: width / 2, y: height - 100 };
  flowerX = random(50, width - 50);
  score = 0;
  gameOver = false;
  currentScene = "game";
}

function drawBeeGame() {
  background(200, 240, 255);
  drawSun(); drawClouds();

  fill(255, 100, 150);
  ellipse(flowerX, 50, 30, 30);

  stroke(255, 255, 100);
  strokeWeight(2);
  line(80, 80, mirror.x, mirror.y);
  lightX = mirror.x + (mirror.x - 80);
  line(mirror.x, mirror.y, lightX, 50);

  noStroke();
  fill(180);
  rect(mirror.x - 20, mirror.y, 40, 10);

  if (keyIsDown(LEFT_ARROW)) mirror.x -= 5;
  if (keyIsDown(RIGHT_ARROW)) mirror.x += 5;
  mirror.x = constrain(mirror.x, 40, width - 40);

  fill(0);
  textSize(18);
  text(`☀️ Energia solar coletada: ${score}`, 20, 20);

  if (abs(lightX - flowerX) < 20) {
    score++;
    flowerX = random(50, width - 50);
  }

  if (score >= 10) {
    currentScene = "gameOver";
  }
}

function drawGameOver() {
  background(50, 20, 20);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(36);
  text("☀️ Fim de Jogo ☀️", width / 2, height / 2 - 40);
  textSize(20);
  text(`Energia coletada: ${score}`, width / 2, height / 2);

  // Evita criar botões múltiplas vezes
  if (!retryButton) {
    retryButton = createButton("🔄 Jogar Novamente");
    styleButton(retryButton);
    retryButton.position(width / 2 - 110, height / 2 + 60);
    retryButton.mousePressed(() => {
      retryButton.remove();
      homeButton?.remove();
      retryButton = null;
      homeButton = null;
      startGame();
    });
  }
}

// VISUAIS
function drawWheat() {
  for (let x = 0; x < width; x += 10) {
    let h = random(60, 100);
    stroke(218, 165, 32);
    strokeWeight(2);
    line(x, height, x, height - h);
  }
  fill(255, 228, 181);
  noStroke();
  rect(0, height - 100, width, 100);
}

function drawTree() {
  fill(101, 67, 33);
  rect(100, height - 200, 30, 150);
  fill(34, 139, 34);
  ellipse(115, height - 220, 100, 100);
}

function drawBeeHive() {
  fill(255, 204, 0);
  stroke(0);
  ellipse(115, height - 170, 30, 40);
  fill(0);
  ellipse(115, height - 165, 8, 10);
}

function drawSun() {
  fill(255, 204, 0);
  noStroke();
  ellipse(80, 80, 100, 100);
}

function drawClouds() {
  noStroke();
  fill(255, 240);
  for (let c of clouds) {
    ellipse(c.x, c.y, c.size, c.size * 0.6);
    ellipse(c.x + 30, c.y + 10, c.size * 0.8, c.size * 0.5);
    ellipse(c.x - 30, c.y + 10, c.size * 0.8, c.size * 0.5);
    c.x += c.speed;
    if (c.x > width + 60) c.x = -60;
  }
}

function drawCharacter() {
  push();
  translate(width / 2, characterY);
  stroke(0); strokeWeight(1.5);
  fill(255, 220, 180); ellipse(0, 0, 50, 50);
  fill(0); ellipse(-10, -5, 6, 6); ellipse(10, -5, 6, 6);
  fill(80, 140, 220); rect(-15, 25, 30, 50, 10);
  stroke(0); line(-15, 30, -30, 50); line(15, 30, 30, 50);
  line(-10, 75, -10, 100); line(10, 75, 10, 100);
  pop();
}

// DIÁLOGOS
function handleDialogue(messages) {
  dialogueList = messages;
  if (dialogueStep < dialogueList.length) {
    drawBubble(dialogueList[dialogueStep], -160);
  }
}

function drawBubble(texto, offsetY) {
  fill(255);
  stroke(0);
  strokeWeight(1.5);
  rect(width / 2 - 250, characterY + offsetY, 500, 80, 20);
  fill(0); noStroke();
  textSize(16);
  textAlign(CENTER);
  textFont('Georgia');
  text(texto, width / 2, characterY + offsetY + 40);
}

// CONTROLE DE TECLAS
function keyPressed() {
  if (key === ' ') {
    if (currentScene === "city" || currentScene === "field") {
      if (dialogueStep < dialogueList.length - 1) {
        dialogueStep++;
      } else if (currentScene === "city") {
        currentScene = "final";
        setTimeout(() => {
          startGame();
        }, 2000);
      }
    }
  }
}
