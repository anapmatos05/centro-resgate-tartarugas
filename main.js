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
  // Se estivermos no ecrã inicial e clicarmos dentro da área do botão "Começar turno"
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
      estado = "execucao"; // Muda para o ecrã de jogo
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