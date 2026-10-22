// Gestor que sabe em que ecrã estamos (início, execução ou resultado)
let gestor;

// Imagem do logótipo
let logo;

// Tartaruga ativa no turno
let tartarugaAtual = null;

// Gestor do microfone (calibração, volume e histerese)
let microfone;


// -----------------------------------------------------
// CONFIGURAÇÕES DO CANVAS
// -----------------------------------------------------

// Dimensões do protótipo do Figma
const LARGURA = 1280;
const ALTURA = 720;

// Informações obrigatórias do enunciado
const TEMA = "Sea Turtle Protection";
const AUTOR = "Ana Matos · 33138 · ECGM";

// Cor principal dos ecrãs
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
  gestor = new GestorEstado();
  microfone = new GestorMicrofone();
}


// -----------------------------------------------------
// DRAW
// Executa continuamente e desenha só o ecrã atual
// -----------------------------------------------------

function draw() {
  microfone.atualizar(); // lê o volume em todos os frames

  if (gestor.e(ESTADO_INICIO)) {
    desenhaInicio();
  } else if (gestor.e(ESTADO_EXECUCAO)) {
    desenhaJogo();
  } else if (gestor.e(ESTADO_RESULTADO)) {
    desenhaResultado();
  }
}


// -----------------------------------------------------
// ECRÃ INICIAL
// -----------------------------------------------------

function desenhaInicio() {

  // Fundo
  background(COR_FUNDO);
  textStyle(NORMAL); // evita herdar o negrito de outro ecrã

  // ---------------------------
  // Logótipo
  // ---------------------------
  imageMode(CENTER);
  image(logo, width / 2, 100, 100, 100);
  imageMode(CORNER); // volta ao normal para não afetar outras imagens

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
    microfone.mensagem(),
    170,
    450
  );

  // ---------------------------
  // Barra de calibração (enche durante os 3 segundos)
  // ---------------------------
  fill(230);
  rect(170, 480, 900, 20, 10);

  fill(230, 180, 0);
  rect(170, 480, 900 * microfone.progresso(), 20, 10);

  // ---------------------------
  // Ícone temporário do microfone
  // ---------------------------
  fill(245, 225, 180);
  ellipse(1090, 490, 35, 35);

  // ---------------------------
  // Botão "Começar Turno"
  // ---------------------------
  // O botão só fica amarelo depois de o microfone estar calibrado
  if (microfone.estaCalibrado()) {
    fill(230, 180, 0);
  } else {
    fill(200);
  }
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

  // Barra de volume do microfone (Canto Superior Direito)
  const barraX = width - 260;
  const barraL = 180;

  fill(200, 230, 210);
  rect(barraX, 15, barraL, 20, 10);
  fill(120, 180, 140);
  rect(barraX, 15, barraL * microfone.volumeNormalizado(), 20, 10);

  // Linhas min / máx (posições reais, calculadas na calibração)
  const xMin = barraX + barraL * microfone.minNormalizado();
  const xMax = barraX + barraL * microfone.maxNormalizado();
  stroke(80);
  strokeWeight(2);
  line(xMin, 15, xMin, 35);
  line(xMax, 15, xMax, 35);

  noStroke();
  fill(100);
  textSize(11);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  text("min", xMin, 37);
  text("máx", xMax, 37);

  // -----------------------------------------------------
  // 2. TEXTOS DE ESTADO E PACIENTE
  // -----------------------------------------------------
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Tartaruga 2 de 7", 50, 70);

  textAlign(RIGHT, TOP);
  if (microfone.estaAFalar()) {
    text("Tartaruga calma  🔊", width - 50, 70);
  } else {
    text("Tartaruga assustada!", width - 50, 70);
  }

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

  // Barril de Lixo Vermelho (Direita)
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
  // A pinça só é usada se já existir (evita erros enquanto o pinca.js não está pronto)
  // -----------------------------------------------------
  if (typeof pinca !== "undefined" && pinca) {
    pinca.atualizar();
    pinca.desenhar();
  }

  desenhaRodape();
}


// -----------------------------------------------------
// ECRÃ DE RESULTADOS
// -----------------------------------------------------

function desenhaResultado() {
  background(COR_FUNDO);
  textStyle(NORMAL);
  desenhaRodape();
}


// -----------------------------------------------------
// INTERAÇÃO DO RATO (Cliques)
// -----------------------------------------------------

function mousePressed() {
  if (gestor.e(ESTADO_INICIO)) {

    // Clique na caixa de calibração: liga o microfone e começa a calibrar
    if (mouseX >= 150 && mouseX <= 1130 && mouseY >= 430 && mouseY <= 540) {
      microfone.iniciar();
    }

    let botaoX = width / 2 - 150;
    let botaoY = 590;
    let botaoLargura = 300;
    let botaoAltura = 60;

    if (
      microfone.estaCalibrado() &&   // só começa depois da calibração
      mouseX >= botaoX &&
      mouseX <= botaoX + botaoLargura &&
      mouseY >= botaoY &&
      mouseY <= botaoY + botaoAltura
    ) {
      gestor.muda(ESTADO_EXECUCAO);

      // Gera uma das 7 espécies de tartaruga ao acaso quando o jogo começa
      tartarugaAtual = new Tartaruga();
    }
  }
}


// -----------------------------------------------------
// INTERAÇÃO DO TECLADO
// -----------------------------------------------------

// Provisório: a barra de espaços termina o turno (só para testar a navegação)
function keyPressed() {
  if (gestor.e(ESTADO_EXECUCAO) && key === " ") {
    gestor.muda(ESTADO_RESULTADO);
  }
}


// -----------------------------------------------------
// RODAPÉ OBRIGATÓRIO
// -----------------------------------------------------

function desenhaRodape() {

  const margem = 20;

  fill(0);
  noStroke();
  textStyle(NORMAL);
  textSize(16);

  // Nome do tema
  textAlign(LEFT, BOTTOM);
  text(TEMA, margem, height - margem);

  // Dados da aluna
  textAlign(RIGHT, BOTTOM);
  text(AUTOR, width - margem, height - margem);
}