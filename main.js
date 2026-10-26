// Regras do turno (ajusta aqui para equilibrar o jogo)
const TEMPO_TURNO = 120000;   // Duração total do turno: 2 minutos (em milissegundos)
const VIDAS_INICIAIS = 3;     // Vidas totais do centro de resgate
const DESCIDA_SAUDE = 8;      // Saúde perdida por segundo quando a tartaruga NÃO está calma

// Curiosidades educativas para mostrar no ecrã final (escolhida ao acaso)
const CURIOSIDADES = [
  "Só 7 das mais de 300 espécies de tartarugas vivem no mar.",
  "Um saco de plástico pode ser confundido com uma medusa e engolido por uma tartaruga.",
  "As sete espécies de tartarugas-marinhas estão todas ameaçadas de extinção.",
  "Reduzir o plástico e pôr o lixo no sítio certo ajuda a proteger os oceanos.",
  "Redes e linhas de pesca abandonadas podem prender e ferir as tartarugas."
];

// Configuração dos botões do ecrã de resultados
const BTN_REPETIR = { x: 141, y: 525, w: 498, h: 72, texto: "Voltar a jogar" };
const BTN_INICIO = { x: 663, y: 525, w: 498, h: 72, texto: "Regressar ao início" };


// -----------------------------------------------------
// VARIÁVEIS GLOBAIS
// -----------------------------------------------------

// Gestor de estados: sabe exatamente em que ecrã estamos (início, execução ou resultado)
let gestor;

// Imagem do logótipo oficial do centro
let logo;

// Imagem da pinça veterinária (controlada pelo rato)
let imgPinca;

// Tartaruga que está atualmente a ser tratada no centro
let tartarugaAtual = null;

// Gestor do microfone (trata da calibração, leitura de volume e histerese)
let microfone;

// Pinça usada pelo jogador
let pinca;

// Lista com os resíduos de lixo que estão em cima da tartaruga atual
let lixos = [];

let somLixo; // Som de recolha de lixo (quando largado no barril)

// Variáveis de estado do turno atual
let pontos = 0;
let vidas = VIDAS_INICIAIS;
let salvas = 0;               // Contador de tartarugas salvas com sucesso
let lixoRecolhido = 0;        // Contador de lixo levado para o barril
let inicioTurno = 0;          // Regista o momento exato em que o turno começou (millis)

// Gestão do Passaporte das 7 Tartarugas (sequência baralhada por turno)
let listaEspecies = [];
let indiceMissao = 0;

// Sistema de mensagens curtas no ecrã (ex.: "Tartaruga salva!")
let mensagem = "";
let mensagemFim = 0;
let mensagemCor = [255, 255, 255];

// Curiosidade selecionada aleatoriamente para o ecrã final
let curiosidade = "";

// NOVO: evita pousar a pinça logo a seguir a pegar nela (o mesmo clique faz press + release)
let pegouAgora = false;

let mostrarFicha = false;     // Começa fechada (só abre nos primeiros 10s ou ao clicar no botão)
let tempoFichaInicio = 0;     // Guarda o momento em que a ficha apareceu
const DURACAO_FICHA = 5000;  // 5 segundos em milissegundos
// Objeto que define o botão da ficha no ecrã
const BTN_FICHA = { x: 50, y: 110, w: 120, h: 35, texto: "📋 Ver Ficha" };

// -----------------------------------------------------
// CONFIGURAÇÕES DO CANVAS
// -----------------------------------------------------

// Dimensões padrão baseadas no protótipo do Figma
const LARGURA = 1280;
const ALTURA = 720;

// Coordenadas da zona do barril de lixo (usada para detetar colisões)
const BARRIL = { x: LARGURA - 205, y: ALTURA - 200, w: 80, h: 90 };

// Coordenadas do suporte da pinça
const SUPORTE_APOIO = { x: 160, y: 250, w: 90, h: 180 };

// Caminho do ficheiro de imagem da pinça
const CAMINHO_PINCA = "assets/imagens/pinca.png";

// Informações obrigatórias exigidas pelo enunciado
const TEMA = "Sea Turtle Protection";
const AUTOR = "Ana Matos · 33138 · ECGM";

// Cor de fundo principal dos ecrãs do jogo
const COR_FUNDO = [175, 200, 192];


// -----------------------------------------------------
// PRELOAD
// Carrega imagens e recursos antes de o jogo arrancar
// -----------------------------------------------------

function preload() {
  logo = loadImage("assets/imagens/logotartaruga.png");
  imgPinca = loadImage(CAMINHO_PINCA);
  somLixo = loadSound("assets/sons/lixo.mp3");
}


// -----------------------------------------------------
// SETUP
// Executa apenas uma vez no arranque da aplicação
// -----------------------------------------------------

function setup() {
  createCanvas(LARGURA, ALTURA);
  gestor = new GestorEstado();
  microfone = new GestorMicrofone();
  pinca = new Pinca();
}


// -----------------------------------------------------
// DRAW
// Executa continuamente em cada frame e desenha o ecrã ativo
// -----------------------------------------------------

function draw() {
  microfone.atualizar(); // Lê o volume do microfone em todos os frames

  if (gestor.e(ESTADO_INICIO)) {
    desenhaInicio();
  } else if (gestor.e(ESTADO_EXECUCAO)) {
    atualizaJogo();   // Gere o tempo limite, a saúde e as vidas
    desenhaJogo();
  } else if (gestor.e(ESTADO_RESULTADO)) {
    desenhaResultado();
  }
}


// -----------------------------------------------------
// ECRÃ INICIAL
// -----------------------------------------------------

function desenhaInicio() {
  background(COR_FUNDO);
  textStyle(NORMAL); // Evita herdar o negrito de outros ecrãs
  cursor(ARROW);     // Cursor normal do rato (no jogo é substituído pela pinça)

  // Logótipo centralizado no topo
  imageMode(CENTER);
  image(logo, width / 2, 100, 100, 100);
  imageMode(CORNER); // Restaura o modo normal de imagem

  // Título principal
  fill(60, 120, 90);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(42);
  text("Centro de Resgate de Tartarugas", width / 2, 180);

  // Cartão com os Objetivos do Jogo
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
    170, 280
  );

  // Cartão de Como Jogar
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
    680, 280
  );

  // Caixa interativa de calibração do microfone
  fill(255);
  rect(150, 430, 980, 110, 20);
  fill(80, 140, 90);
  textSize(18);
  text(microfone.mensagem(), 170, 450);

  // Barra de progresso da calibração (enche durante os 3 segundos)
  fill(230);
  rect(170, 480, 900, 20, 10);
  fill(230, 180, 0);
  rect(170, 480, 900 * microfone.progresso(), 20, 10);

  // Ícone decorativo do microfone
  fill(245, 225, 180);
  ellipse(1090, 490, 35, 35);

  // Botão "Começar turno" (só fica ativo/amarelo após calibrar o microfone)
  if (microfone.estaCalibrado()) {
    fill(230, 180, 0);
  } else {
    fill(200);
  }
  rect(width / 2 - 150, 590, 300, 60, 20);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Começar turno", width / 2, 620);

  desenhaRodape();
}


// -----------------------------------------------------
// ECRÃ DE JOGO (EXECUÇÃO)
// -----------------------------------------------------

function desenhaJogo() {
  background(COR_FUNDO);

  // ALTERADO: gestão do cursor.
  // - Rato sobre o botão da ficha: cursor normal (mão) para poderes clicar
  // - Pinça pousada: cursor normal (mão se estiver sobre o tabuleiro, seta no resto)
  // - Pinça na mão: o cursor do sistema desaparece (a pinça faz de cursor)
  const sobreBotaoFicha = ratoDentro(BTN_FICHA);
  if (sobreBotaoFicha) {
    cursor(HAND);
  } else if (pinca.pousada) {
    cursor(ratoNoSuporte() ? HAND : ARROW);
  } else {
    noCursor();
  }

  // 1. BARRA SUPERIOR BRANCA (Interface do Utilizador / HUD)
  fill(255);
  noStroke();
  rect(0, 0, width, 50);

  // Relógio com o tempo restante e pontuação atual
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(18);
  textStyle(BOLD);
  const restante = max(0, TEMPO_TURNO - (millis() - inicioTurno));
  text("Tempo " + formataTempo(restante), 40, 25);
  text("Pontos " + pontos, 250, 25);

  // Indicador de vidas (vermelhas para vidas ativas, cinzentas para as perdidas)
  // Indicador de vidas com corações
  textSize(22);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < VIDAS_INICIAIS; i++) {
    let xPos = width / 2 - 30 + i * 30;
    let yPos = 25;
    
    if (i < vidas) {
      text("❤️", xPos, yPos); // Vida ativa
    } else {
      text("🤍", xPos, yPos); 
    }
  }
  // Barra de volume do microfone (canto superior direito)
  const barraX = width - 260;
  const barraL = 180;

  fill(200, 230, 210);
  rect(barraX, 15, barraL, 20, 10);
  fill(120, 180, 140);
  rect(barraX, 15, barraL * microfone.volumeNormalizado(), 20, 10);

  // Linhas indicadoras dos limiares mínimo e máximo da histerese
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

  // 2. TEXTOS DE ESTADO DA TARTARUGA E PACIENTE
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Tartarugas salvas: " + salvas, 50, 70);

  textAlign(RIGHT, TOP);
  if (microfone.estaAFalar()) {
    text("Tartaruga calma  🔊", width - 50, 70);
  } else {
    text("Tartaruga assustada!", width - 50, 70);
  }

  // 3. BARRA DE SAÚDE DA TARTARUGA (CENTRAL)
  if (tartarugaAtual) {
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(16);
    text("Saúde", width / 2, 105);

    // Contorno exterior da barra de saúde
    fill(40, 70, 70);
    rect(width / 2 - 150, 110, 300, 26, 14);

    // Preenchimento dinâmico (verde normal, vermelho se estiver quase a esgotar)
    const fracao = tartarugaAtual.saude / tartarugaAtual.saudeMaxima;
    if (fracao < 0.3) {
      fill(230, 90, 80);
    } else {
      fill(140, 210, 160);
    }
    let larguraSaude = map(tartarugaAtual.saude, 0, tartarugaAtual.saudeMaxima, 0, 292);
    rect(width / 2 - 146, 114, larguraSaude, 18, 10);
  }

  // 4. ELEMENTOS VISUAIS DO CENÁRIO
  // Tabuleiro cinzento de apoio à esquerda
  fill(210, 218, 215);
  stroke(170, 180, 175);
  strokeWeight(3);
  rect(160, 250, 90, 180, 15);
  noStroke();

  // Desenha a tartaruga ativa no centro do ecrã
  if (tartarugaAtual) {
    tartarugaAtual.desenhar(width / 2, height / 2 + 30);
  }

  // Barril de recolha de lixo vermelho (à direita)
  fill(200, 70, 70);
  rect(width - 200, height - 200, 70, 90, 10);
  fill(230, 90, 90);
  rect(width - 205, height - 190, 80, 12, 4);
  rect(width - 205, height - 130, 80, 12, 4);

  // Rótulo identificativo "Lixo" no barril
  fill(255);
  rect(width - 190, height - 165, 50, 20, 4);
  fill(50);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Lixo", width - 165, height - 155);

  // 5. LIXO, PINÇA E MENSAGENS DE FEEDBACK
  for (const l of lixos) {
    l.desenhar();
  }

  // A pinça segue o rato (se não estiver pousada) e é desenhada por cima dos elementos
  pinca.atualizar();
  // ALTERADO: esconde a pinça enquanto o rato está no botão da ficha (para se ver o cursor).
  // Se a pinça estiver pousada no tabuleiro, desenha-se sempre.
  if (pinca.pousada || !sobreBotaoFicha) {
    pinca.desenhar();
  }

  // Mensagem temporária no ecrã (ex.: quando salva ou perde uma tartaruga)
  if (millis() < mensagemFim) {
    fill(mensagemCor);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(28);
    text(mensagem, width / 2, 170);
  }

  // Botão para ver a ficha médica do paciente
  desenhaBotaoPequeno(BTN_FICHA);

  // Ficha de Paciente (aparece automaticamente nos primeiros 10 segundos ou quando clicas no botão)
  let tempoPassado = millis() - tempoFichaInicio;
  if (tempoPassado < DURACAO_FICHA || mostrarFicha) {
    if (tartarugaAtual) {
      let fichaX = width - 400; // Posição horizontal (centrada)
      let fichaY = 120; // Posição vertical
      let fichaW = 380;              // Largura da ficha
      let fichaH = 150;              // Altura da ficha

      fill(255, 245);
      noStroke();
      rect(fichaX, fichaY, fichaW, fichaH, 20);

      fill(60, 120, 90);
      textStyle(BOLD);
      textSize(18);
      textAlign(CENTER, TOP);
      text("Ficha de Paciente: Tartaruga-" + tartarugaAtual.especie, fichaX + fichaW / 2, fichaY + 20);

      fill(40);
      textStyle(NORMAL);
      textSize(15);
      textAlign(LEFT, TOP);
      let infoTexto = obtemInfoCientifica(tartarugaAtual.especie);
      text(infoTexto, fichaX + 30, fichaY + 60, fichaW - 60, fichaH - 80);
    }
  }

  desenhaRodape();
}


// -----------------------------------------------------
// ECRÃ DE RESULTADOS (FIM DE TURNO)
// -----------------------------------------------------

function desenhaResultado() {
  background(COR_FUNDO);
  textStyle(NORMAL);
  cursor(ARROW);

  // Título principal de conclusão
  fill(60, 120, 90);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(56);
  text("Turno concluído", width / 2, 120);

  // Cartão com as estatísticas finais do turno
  desenhaCartao(141, 200, 498, 290, "Resultado final",
    "Pontos: " + pontos + "\n" +
    "Tartarugas salvas: " + salvas + "\n" +
    "Lixo recolhido: " + lixoRecolhido + "\n" +
    "Vidas perdidas: " + (VIDAS_INICIAIS - vidas));

  // Cartão com a curiosidade educativa escolhida aleatoriamente
  desenhaCartao(663, 200, 498, 290, "Sabias que?", curiosidade);

  // Botões de navegação final
  desenhaBotao(BTN_REPETIR);
  desenhaBotao(BTN_INICIO);

  desenhaRodape();
}


// -----------------------------------------------------
// INTERAÇÃO DO RATO (Cliques)
// -----------------------------------------------------

function mousePressed() {
  if (gestor.e(ESTADO_INICIO)) {
    // Clica na caixa de calibração para ligar o microfone
    if (mouseX >= 150 && mouseX <= 1130 && mouseY >= 430 && mouseY <= 540) {
      microfone.iniciar();
    }

    let botaoX = width / 2 - 150;
    let botaoY = 590;
    let botaoLargura = 300;
    let botaoAltura = 60;

    // Só inicia o turno se o microfone já estiver totalmente calibrado
    if (
      microfone.estaCalibrado() &&
      mouseX >= botaoX &&
      mouseX <= botaoX + botaoLargura &&
      mouseY >= botaoY &&
      mouseY <= botaoY + botaoAltura
    ) {
      gestor.muda(ESTADO_EXECUCAO);
      iniciaTurno();
    }
  } else if (gestor.e(ESTADO_EXECUCAO)) {
    // ALTERADO: três situações possíveis
    if (ratoDentro(BTN_FICHA)) {
      // 1) Clique no botão da ficha: alterna entre mostrar/esconder
      mostrarFicha = !mostrarFicha;
    } else if (pinca.pousada) {
      // 2) Pinça pousada: só pega nela se o clique for em cima do tabuleiro
      if (ratoNoSuporte()) {
        pinca.pegarDoSuporte(mouseX, mouseY);
        pegouAgora = true; // o "soltar" deste mesmo clique não deve voltar a pousá-la
      }
    } else {
      // 3) Pinça na mão: tenta agarrar o lixo
      pinca.apanhar(lixos);
    }
  } else if (gestor.e(ESTADO_RESULTADO)) {
    // Navegação nos botões do ecrã final
    if (ratoDentro(BTN_REPETIR)) {
      gestor.muda(ESTADO_EXECUCAO);
      iniciaTurno();
    } else if (ratoDentro(BTN_INICIO)) {
      gestor.muda(ESTADO_INICIO);
    }
  }
}

// Executado quando o utilizador liberta o botão do rato
function mouseReleased() {
  if (!gestor.e(ESTADO_EXECUCAO)) return;

  // NOVO: se acabaste de pegar na pinça, ignora este "soltar" (é o mesmo clique)
  if (pegouAgora) {
    pegouAgora = false;
    return;
  }

  // NOVO: com a pinça pousada não há nada para largar
  if (pinca.pousada) return;

  if (pinca.largarNoSuporte(SUPORTE_APOIO)) {
    // O lixo fica pousado no suporte e continua disponível no tabuleiro.
  } else if (pinca.largar(BARRIL)) { // Se largar o lixo dentro do barril correto
    pontos += 10;
    lixoRecolhido++;

    //Toca som aqui
    if(somLixo){
      somLixo.play();
    }
    verificaTartarugaSalva();
  } else if (!pinca.lixo && ratoNoSuporte()) {
    // Mãos vazias e rato sobre o tabuleiro: pousa a pinça
    pinca.pousarNoSuporte(SUPORTE_APOIO);
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

  // Nome do tema do projeto no canto inferior esquerdo
  textAlign(LEFT, BOTTOM);
  text(TEMA, margem, height - margem);

  // Dados da aluna no canto inferior direito
  textAlign(RIGHT, BOTTOM);
  text(AUTOR, width - margem, height - margem);
}


// -----------------------------------------------------
// LÓGICA DO TURNO (PASSAPORTE DAS 7 ESPÉCIES)
// -----------------------------------------------------

// Inicia um turno novo: põe tudo a zero e baralha as 7 espécies para criar a progressão
function iniciaTurno() {
  pontos = 0;
  vidas = VIDAS_INICIAIS;
  salvas = 0;
  lixoRecolhido = 0;

  // NOVO: a pinça começa sempre pousada no tabuleiro, sem lixo
  pegouAgora = false;
  pinca.lixo = null;
  pinca.pousarNoSuporte(SUPORTE_APOIO);

  // Lista com as 7 espécies marinhas baralhadas ao acaso em cada nova partida
  const especiesDisponiveis = ["Verde", "Comum", "Oliva", "Pente", "Couro", "Australiana", "Kemp"];
  listaEspecies = shuffle(especiesDisponiveis);
  indiceMissao = 0;

  mensagem = "";
  mensagemFim = 0;
  inicioTurno = millis();
  novaTartaruga();
}

// Cria uma nova tartaruga com base na sequência baralhada do passaporte
function novaTartaruga() {
  pinca.lixo = null; // Garante que a pinça não leva lixo pendurado de arrasto

  // Se completar as 7 espécies durante o turno, termina com sucesso
  if (indiceMissao >= listaEspecies.length) {
    terminaTurno();
    return;
  }

  // Instancia a nova tartaruga através do índice atual da lista de missões
  tartarugaAtual = new Tartaruga(indiceMissao);
  indiceMissao++;

  // Ativa a ficha do novo paciente
  mostrarFicha = false; // Começa fechada para o temporizador gerir
  tempoFichaInicio = millis();

  criaLixos();
}

// Gera os resíduos de lixo em cima da tartaruga conforme a exigência da espécie
function criaLixos() {
  lixos = [];
  let especieAtual = tartarugaAtual.especie;
  let qtd = tartarugaAtual.qtdLixo; // Certifica-te de que a tartaruga define a quantidade de lixo

  for (let i = 0; i < qtd; i++) {
    lixos.push(new Lixo(width / 2, height / 2 + 30, especieAtual));
  }
}

// Verifica se todo o lixo da tartaruga foi limpo; se sim, ganha bónus e passa à próxima
function verificaTartarugaSalva() {
  lixos = lixos.filter(l => !l.recolhido);

  if (lixos.length === 0) {
    const ganho = pontosDaEspecie(tartarugaAtual);
    pontos += ganho;
    salvas++;
    mostraMensagem("Tartaruga salva! +" + ganho, [40, 120, 70]);
    novaTartaruga();
  }
}

// Atualização contínua do jogo (tempo decorrido e perda de saúde se estiver assustada)
function atualizaJogo() {
  const decorrido = millis() - inicioTurno;

  // Verifica se o tempo de 2 minutos esgotou
  if (decorrido >= TEMPO_TURNO) {
    terminaTurno();
    return;
  }

  // A saúde só desce se a tartaruga estiver assustada (jogador em silêncio)
  if (!microfone.estaAFalar()) {
    const dificuldade = 1 + decorrido / TEMPO_TURNO;
    const segundos = min(deltaTime, 100) / 1000; // Evita saltos se o separador ficar inativo
    tartarugaAtual.saude -= DESCIDA_SAUDE * dificuldade * segundos;
  }

  // Se a saúde chegar a zero, a tartaruga morre e o centro perde uma vida
  if (tartarugaAtual.saude <= 0) {
    tartarugaAtual.saude = 0;
    vidas--;
    mostraMensagem("Tartaruga perdida!", [200, 60, 60]);

    if (vidas <= 0) {
      terminaTurno(); // Fim do jogo se esgotar as vidas
    } else {
      novaTartaruga(); // Chega um novo paciente ao hospital
    }
  }
}

// Encerra o turno e transita para o ecrã de resultados
function terminaTurno() {
  pinca.lixo = null;
  curiosidade = random(CURIOSIDADES); // Escolhe uma curiosidade aleatória para o fim
  gestor.muda(ESTADO_RESULTADO);
}

// Atribui pontuação diferenciada (espécies criticamente ameaçadas dão mais pontos)
function pontosDaEspecie(t) {
  if (t.especie === "Pente" || t.especie === "Kemp") {
    return 200;
  }
  return 100;
}

// Ativa uma mensagem flutuante temporária no ecrã (dura 1.5 segundos)
function mostraMensagem(texto, cor) {
  mensagem = texto;
  mensagemCor = cor;
  mensagemFim = millis() + 1500;
}

// Converte milissegundos num formato legível de relógio "mm:ss"
function formataTempo(ms) {
  const totalSeg = ceil(ms / 1000);
  const m = floor(totalSeg / 60);
  const seg = totalSeg % 60;
  return nf(m, 2) + ":" + nf(seg, 2);
}


// ---------------------- FUNÇÕES AUXILIARES DOS ECRÃS ----------------------

// Devolve a informação científica para a ficha de paciente
function obtemInfoCientifica(especie) {
  switch (especie) {
    case "Verde":
      return "• Dieta: Herbívora (prados marinhos)\n• Ameaça: Ingestão de plástico flutuante\n• Dificuldade: 1 lixo (Estável)";
    case "Comum":
      return "• Dieta: Carnívora (crustáceos e moluscos)\n• Ameaça: Redes e anzóis de pesca\n• Dificuldade: 3 lixos (Exigente)";
    case "Oliva":
      return "• Dieta: Omnívora (águas abertas)\n• Ameaça: Redes de emalhar abandonadas\n• Dificuldade: 1 lixo (Frágil)";
    case "Pente":
      return "• Dieta: Recifes de coral (esponjas)\n• Ameaça: Poluição de recifes\n• Dificuldade: 2 lixos (Bónus duplo!)";
    case "Couro":
      return "• Dieta: Pelágica (especializada em alforrecas)\n• Ameaça: Confunde sacos com presas\n• Dificuldade: 4 lixos (Muito alta)";
    case "Australiana":
      return "• Dieta: Águas costeiras rasas\n• Ameaça: Tráfego marítimo e lixo costeiro\n• Dificuldade: 2 lixos (Moderada)";
    case "Kemp":
      return "• Dieta: Marisco e caranguejos\n• Ameaça: Criticamente ameaçada de extinção\n• Dificuldade: 1 lixo crítico (Bónus duplo!)";
    default:
      return "Espécie sob proteção prioritária do centro.";
  }
}s

// Desenha o botão pequeno da ficha
function desenhaBotaoPequeno(b) {
  if (ratoDentro(b)) {
    fill(240, 200, 50);
  } else {
    fill(255);
  }
  stroke(120, 150, 140);
  strokeWeight(2);
  rect(b.x, b.y, b.w, b.h, 10);

  fill(40);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(b.texto, b.x + b.w / 2, b.y + b.h / 2);
}

// Desenha caixas de cartões informativos com título e corpo de texto formatado
function desenhaCartao(x, y, w, h, titulo, corpo) {
  fill(255);
  noStroke();
  rect(x, y, w, h, 28);

  fill(60, 120, 90);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(26);
  text(titulo, x + 24, y + 22);

  fill(40, 55, 80);
  textStyle(NORMAL);
  textSize(24);
  text(corpo, x + 24, y + 70, w - 48, h - 90);
}

// Desenha botões interativos (muda de cor ao passar o rato por cima)
function desenhaBotao(b) {
  if (ratoDentro(b)) {
    fill(255, 200, 40);
  } else {
    fill(230, 180, 0);
  }
  noStroke();
  rect(b.x, b.y, b.w, b.h, 30);

  fill(20);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(26);
  text(b.texto, b.x + b.w / 2, b.y + b.h / 2);
}

// Função auxiliar que valida se o cursor do rato se encontra dentro de um botão
function ratoDentro(b) {
  return mouseX > b.x && mouseX < b.x + b.w &&
         mouseY > b.y && mouseY < b.y + b.h;
}

// NOVO: verifica se o rato está por cima do tabuleiro cinzento onde a pinça pousa
function ratoNoSuporte() {
  return mouseX >= SUPORTE_APOIO.x && mouseX <= SUPORTE_APOIO.x + SUPORTE_APOIO.w &&
         mouseY >= SUPORTE_APOIO.y && mouseY <= SUPORTE_APOIO.y + SUPORTE_APOIO.h;
}