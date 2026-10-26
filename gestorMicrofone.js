// --Ajustes do microfone
const MIC_GANHO = 1.0;             // multiplica o volume lido. Microfone fraco? Experimenta 2 ou 3.
const DURACAO_CALIBRACAO = 3000;   // 3 segundos, em milissegundos
const IGNORAR_INICIO = 500;        // ignora o 1.º meio segundo (o microfone ainda está a "acordar")
const MARGEM_MIN = 0.01;           // limite mínimo = ruído da sala + esta margem
const MARGEM_MAX = 0.03;           // limite máximo = ruído da sala + esta margem
const TEMPO_MANTER = 400;          // ms que a "calma" se mantém depois de a voz baixar (entre palavras)
const LIBERTACAO = 0.95;           // quanto mais perto de 1, mais devagar o volume desce

// true = mostra no ecrã os valores do microfone (útil para ajustar). Põe false no fim.
const MIC_DEBUG = true;

// Estados possíveis do microfone
const MIC_PARADO = "parado";           // ainda não foi ligado
const MIC_CALIBRANDO = "calibrando";   // a medir o ruído da sala
const MIC_PRONTO = "pronto";           // calibrado e a funcionar

class GestorMicrofone {
  constructor() {
    this.mic = null;
    this.estado = MIC_PARADO;
    this.erro = false;         // true se a calibração não ouviu nada

    this.volume = 0;           // volume atual (sobe depressa, desce devagar)
    this.base = 0;             // ruído típico da sala (mediana da calibração)
    this.ruidoPico = 0;        // ruído mais forte da sala (percentil 90)
    this.min = 0;              // limite mínimo (histerese)
    this.max = 0;              // limite máximo (histerese)
    this.aFalar = false;       // true quando o jogador está a falar

    this.inicioCalibracao = 0;
    this.amostras = [];        // níveis medidos durante a calibração
    this.ultimoSom = 0;        // última vez que se ouviu voz (para o tempo de manter)
  }

  // Liga o microfone e começa a calibração (ou recalibra).
  // Tem de ser chamado depois de um clique (regra do navegador).
  iniciar() {
    if (this.estado === MIC_CALIBRANDO) return;   // já está a calibrar

    // Cria o microfone na 1.ª vez, ou de novo se a última tentativa falhou
    if (!this.mic || this.erro) {
      if (this.mic) this.mic.stop();
      userStartAudio();           // pede ao navegador permissão para o áudio
      this.mic = new p5.AudioIn();
      this.mic.start();
    }

    this.erro = false;
    this.aFalar = false;
    this.volume = 0;
    this.amostras = [];
    this.estado = MIC_CALIBRANDO;
    this.inicioCalibracao = millis();
  }

  // Chamado em cada draw(): lê o volume e atualiza o estado
  atualizar() {
    if (!this.mic) return;

    // Lê o volume (com o ganho) e aplica "ataque rápido, descida lenta":
    // sons curtos são apanhados logo, e o volume não cai entre palavras.
    const nivel = this.mic.getLevel() * MIC_GANHO;
    if (nivel > this.volume) {
      this.volume = nivel;
    } else {
      this.volume = this.volume * LIBERTACAO + nivel * (1 - LIBERTACAO);
    }

    if (this.estado === MIC_CALIBRANDO) {
      const decorrido = millis() - this.inicioCalibracao;

      // Só guarda amostras depois do 1.º meio segundo
      if (decorrido > IGNORAR_INICIO) {
        this.amostras.push(nivel);
      }
      if (decorrido >= DURACAO_CALIBRACAO) {
        this.terminaCalibracao();
      }
    } else if (this.estado === MIC_PRONTO) {
      this.atualizaHisterese();
    }
  }

  // HISTERESE: dois limites em vez de um
  atualizaHisterese() {
    if (this.volume > this.max) {
      this.aFalar = true;                 // passou o máximo: liga
      this.ultimoSom = millis();
    } else if (this.volume > this.min) {
      // entre o mínimo e o máximo: mantém o estado em que estava
      if (this.aFalar) this.ultimoSom = millis();
    } else if (this.aFalar && millis() - this.ultimoSom > TEMPO_MANTER) {
      this.aFalar = false;                // abaixo do mínimo há algum tempo: desliga
    }
  }

  // Calcula o ruído da sala e os dois limites
  terminaCalibracao() {
    // Se o microfone nunca captou nada, algo está mal (permissão, dispositivo...)
    const ouviuAlgo = this.amostras.some(n => n > 0);
    if (!ouviuAlgo) {
      this.erro = true;
      this.estado = MIC_PARADO;
      return;
    }

    // Ordena as amostras: a mediana é o ruído típico, o percentil 90 é o ruído mais forte.
    // Usar o percentil evita limites demasiado baixos se a sala tiver ruídos pontuais.
    const ordenadas = [...this.amostras].sort((a, b) => a - b);
    this.base = ordenadas[floor(ordenadas.length * 0.5)];
    this.ruidoPico = ordenadas[floor(ordenadas.length * 0.9)];

    this.min = this.ruidoPico + MARGEM_MIN;
    this.max = this.ruidoPico + MARGEM_MAX;
    this.estado = MIC_PRONTO;
  }

  // Funções que o main.js usa para desenhar 

  // Progresso da calibração, de 0 a 1 (para a barra amarela)
  progresso() {
    if (this.estado === MIC_PARADO) return 0;
    if (this.estado === MIC_PRONTO) return 1;
    return constrain((millis() - this.inicioCalibracao) / DURACAO_CALIBRACAO, 0, 1);
  }

  estaCalibrado() {
    return this.estado === MIC_PRONTO;
  }

  estaAFalar() {
    return this.aFalar;
  }

  // Texto para mostrar na caixa de calibração do ecrã de início
  mensagem() {
    if (this.erro) {
      return "Não ouvi nada! Verifica o microfone e clica aqui para tentar de novo";
    }
    if (this.estado === MIC_PARADO) {
      return "Clica nesta caixa para ligar o microfone (3 s em silêncio)";
    }
    if (this.estado === MIC_CALIBRANDO) {
      return "A calibrar... fica em silêncio";
    }
    return "Microfone calibrado! (clica aqui para recalibrar)";
  }

  // Escreve no ecrã os valores reais do microfone (só para ajustar e testar)
  desenhaDebug(x, y, cor) {
    if (!this.mic) return;
    push();
    fill(cor);
    noStroke();
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(14);
    text(
      "Volume: " + nf(this.volume, 1, 3) +
      "  |  ruído: " + nf(this.ruidoPico, 1, 3) +
      "  |  mín: " + nf(this.min, 1, 3) +
      "  |  máx: " + nf(this.max, 1, 3) +
      "  |  a falar: " + (this.aFalar ? "SIM" : "não"),
      x, y
    );
    pop();
  }

  // Escala usada para desenhar a barra de volume (0 a 1)
  escala() {
    // Garante um valor mínimo de segurança para evitar divisões por zero ou valores absurdos
    let referencia = (this.max > 0.001) ? this.max : 0.05;
    return this.estado === MIC_PRONTO ? referencia * 1.5 : 0.1;
  }

  volumeNormalizado() {
    return constrain(this.volume / this.escala(), 0, 1);
  }

  minNormalizado() {
    return constrain(this.min / this.escala(), 0, 1);
  }

  maxNormalizado() {
    return constrain(this.max / this.escala(), 0, 1);
  }
}