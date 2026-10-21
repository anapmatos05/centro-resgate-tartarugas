// =====================================================
// Centro de Resgate de Tartarugas
// Tema: Sea Turtle Protection
// Aluna: Ana Matos (33138)
// =====================================================


// -----------------------------------------------------
// VARIÁVEIS GLOBAIS
// -----------------------------------------------------

// Estado atual do jogo
let estado = "inicio";

// Imagem do logótipo
let logo;

let tartarugaAtual = null; // Variável global para guardar a tartaruga ativa no turno



// -----------------------------------------------------
// CONFIGURAÇÕES DO CANVAS
// -----------------------------------------------------

// Dimensões do protótipo do Figma
const LARGURA = 1280;
const ALTURA = 720;

// Informações obrigatórias do enunciado
const TEMA = "Sea Turtle Protection";
const AUTOR = "Ana Matos · 33138 · ECGM";

// Cor principal do ecrã inicial
const COR_FUNDO = [175, 200, 192];


// -----------------------------------------------------
// PRELOAD
// Carrega imagens e sons antes do jogo arrancar
// -----------------------------------------------------

function preload() {
  logo = loadImage("assets/imagens/logotartaruga.png");
}


// -----------------------------------------------------
// SETUP
// Executa apenas uma vez
// -----------------------------------------------------

function setup() {
  createCanvas(LARGURA, ALTURA);
}


// -----------------------------------------------------
// DRAW
// Executa continuamente
// -----------------------------------------------------

function draw() {
  if (estado === "inicio") {
    desenhaInicio();
  } else if (estado === "execucao") {
    desenhaJogo();
  } else if (estado === "resultado") {
    desenhaResultado();
  }
}


// -----------------------------------------------------
// ECRÃ INICIAL
// -----------------------------------------------------

function desenhaInicio() {

  // Fundo
  background(COR_FUNDO);

  // ---------------------------
  // Logótipo
  // ---------------------------
  imageMode(CENTER);
  image(logo, width / 2, 100, 100, 100);

  // ---------------------------
  // Título
  // ---------------------------
  fill(60, 120, 90);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(42);

  text(
    "Centro de Resgate de Tartarugas",
    width / 2,
    180
  );

  // ---------------------------
  // Cartão Objetivo
  // ---------------------------
  fill(255);
  rect(150, 220, 470, 170, 20);

  fill(80, 140, 90);
  textAlign(LEFT, TOP);
  textSize(18);

  text("Objetivo", 170, 240);

  fill(50);
  textSize(16);

  text(
    "Salva o máximo de tartarugas em 2 minutos,\n" +
    "sem perderes as 3 vidas do centro.\n" +
    "+100 por tartaruga salva\n" +
    "+10 por lixo no barril",
    170,
    280
  );

  // ---------------------------
  // Cartão Como Jogar
  // ---------------------------
  fill(255);
  rect(660, 220, 470, 170, 20);

  fill(80, 140, 90);
  textSize(18);

  text("Como jogar", 680, 240);

  fill(50);
  textSize(16);

  text(
    "Rato: leva o lixo até ao barril.\n" +
    "Voz: fala para acalmar a tartaruga.\n" +
    "Sem saúde, perdes uma vida.",
    680,
    280
  );

  // ---------------------------
  // Caixa de calibração
  // ---------------------------
  fill(255);
  rect(150, 430, 980, 110, 20);

  fill(80, 140, 90);
  textSize(18);

  text(
    "Calibração do microfone (3 s em silêncio)",
    170,
    450
  );

  // ---------------------------
  // Barra de calibração
  // (temporária)
  // ---------------------------
  fill(230);
  rect(170, 480, 900, 20, 10);

  fill(230, 180, 0);
  rect(170, 480, 450, 20, 10);

  // ---------------------------
  // Ícone temporário do microfone
  // ---------------------------
  fill(245, 225, 180);
  ellipse(1090, 490, 35, 35);

  // ---------------------------
  // Botão "Começar Turno"
  // ---------------------------
  fill(230, 180, 0);
  rect(width / 2 - 150, 590, 300, 60, 20);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);

  text(
    "Começar turno",
    width / 2,
    620
  );

  // Rodapé obrigatório
  desenhaRodape();
}


// -----------------------------------------------------
// ECRÃ DE JOGO
// -----------------------------------------------------

function desenhaJogo() {
  background(COR_FUNDO);
  
  // Teste visual temporário
  fill(40, 70, 60);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Ecrã de Jogo a funcionar!", width / 2, height / 2);

  desenhaRodape();
}


// -----------------------------------------------------
// ECRÃ DE RESULTADOS
// -----------------------------------------------------

function desenhaResultado() {
  background(COR_FUNDO);
  desenhaRodape();
}


// -----------------------------------------------------
// INTERAÇÃO DO RATO (Cliques)
// -----------------------------------------------------

function mousePressed() {
  if (estado === "inicio") {
    let botaoX = width / 2 - 150;
    let botaoY = 590;
    let botaoLargura = 300;
    let botaoAltura = 60;

    if (
      mouseX >= botaoX &&
      mouseX <= botaoX + botaoLargura &&
      mouseY >= botaoY &&
      mouseY <= botaoY + botaoAltura
    ) {
      estado = "execucao"; 
      
      // Gera uma das 7 espécies de tartaruga ao acaso quando o jogo começa
      tartarugaAtual = new Tartaruga(); 
    }
  }
}



// -----------------------------------------------------
// RODAPÉ OBRIGATÓRIO
// -----------------------------------------------------

function desenhaRodape() {

  const margem = 20;

  fill(0);
  noStroke();
  textSize(16);

  // Nome do tema
  textAlign(LEFT, BOTTOM);
  text(TEMA, margem, height - margem);

  // Dados da aluna
  textAlign(RIGHT, BOTTOM);
  text(AUTOR, width - margem, height - margem);
}
// Variável global para guardar a tartaruga ativa no turno

// Quando o jogo começa, criamos a primeira tartaruga
function iniciarTurnoJogo() {
  tartarugaAtual = new Tartaruga();
}

function desenhaJogo() {
  background(COR_FUNDO);

  // -----------------------------------------------------
  // 1. BARRA SUPERIOR BRANCA (UI)
  // -----------------------------------------------------
  fill(255);
  noStroke();
  rect(0, 0, width, 50);

  // Tempo
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(18);
  textStyle(BOLD);
  text("Tempo 01:12", 40, 25);

  // Vidas (Corações Vermelhos)
  fill(230, 60, 60);
  ellipse(width / 2 - 25, 25, 20, 20);
  ellipse(width / 2, 25, 20, 20);
  ellipse(width / 2 + 25, 25, 20, 20);

  // Barra de Calibração / Microfone (Canto Superior Direito)
  fill(200, 230, 210);
  rect(width - 260, 15, 180, 20, 10);
  fill(120, 180, 140);
  rect(width - 260, 15, 120, 20, 10);
  
  // Linhas min / máx
  stroke(80);
  strokeWeight(2);
  line(width - 210, 15, width - 210, 35);
  line(width - 120, 15, width - 120, 35);
  
  noStroke();
  fill(100);
  textSize(11);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  text("min", width - 210, 37);
  text("máx", width - 120, 37);

  // -----------------------------------------------------
  // 2. TEXTOS DE ESTADO E PACIENTE
  // -----------------------------------------------------
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Tartaruga 2 de 7", 50, 70);

  textAlign(RIGHT, TOP);
  text("Tartaruga calma  🔊", width - 50, 70);

  // -----------------------------------------------------
  // 3. BARRA DE SAÚDE CENTRADA
  // -----------------------------------------------------
  if (tartarugaAtual) {
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text("Saúde", width / 2, 105);

    // Contorno escuro da barra
    fill(40, 70, 70);
    rect(width / 2 - 150, 110, 300, 26, 14);

    // Preenchimento de Saúde Verde
    fill(140, 210, 160);
    let larguraSaude = map(tartarugaAtual.saude, 0, tartarugaAtual.saudeMaxima, 0, 292);
    rect(width / 2 - 146, 114, larguraSaude, 18, 10);
  }

  // -----------------------------------------------------
  // 4. ELEMENTOS DO CENÁRIO (Tabuleiro, Tartaruga e Barril)
  // -----------------------------------------------------
  
  // Tabuleiro Cinzento da Pinça (Esquerda)
  fill(210, 218, 215);
  stroke(170, 180, 175);
  strokeWeight(3);
  rect(160, 250, 90, 180, 15);
  noStroke();

  // Desenhar a Tartaruga no Centro
  if (tartarugaAtual) {
    tartarugaAtual.desenhar(width / 2, height / 2 + 30);
  }

  // Barril de Lixo Vermelho (Direita) - Ilustrado com P5
  fill(200, 70, 70);
  rect(width - 200, height - 200, 70, 90, 10);
  fill(230, 90, 90);
  rect(width - 205, height - 190, 80, 12, 4);
  rect(width - 205, height - 130, 80, 12, 4);
  
  // Rótulo "Lixo" no Barril
  fill(255);
  rect(width - 190, height - 165, 50, 20, 4);
  fill(50);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Lixo", width - 165, height - 155);

  // -----------------------------------------------------
  // 5. PINÇA E RODAPÉ
  // -----------------------------------------------------
  if (pinca) {
    pinca.atualizar();
    pinca.desenhar();
  }

  desenhaRodape();
}