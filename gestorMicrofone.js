// Estados possíveis do microfone
const MIC_PARADO = "parado";           // ainda não foi ligado
const MIC_CALIBRANDO = "calibrando";   // a medir o ruído da sala
const MIC_PRONTO = "pronto";           // calibrado e a funcionar

// Valores que podes ajustar depois de testares na tua sala
const DURACAO_CALIBRACAO = 3000;   // 3 segundos, em milissegundos
const MARGEM_MIN = 0.02;           // limite mínimo = ruído de base + esta margem
const MARGEM_MAX = 0.06;           // limite máximo = ruído de base + esta margem

class GestorMicrofone {
  constructor() {
    this.mic = null;
    this.estado = MIC_PARADO;

    this.volume = 0;           // volume atual (suavizado)
    this.base = 0;             // ruído médio da sala, medido na calibração
    this.min = 0;              // limite mínimo (histerese)
    this.max = 0;              // limite máximo (histerese)
    this.aFalar = false;       // true quando o jogador está a falar

    this.inicioCalibracao = 0;
    this.somaNiveis = 0;       // para calcular a média durante a calibração
    this.numAmostras = 0;
  }

  // Liga o microfone e começa a calibração.
  // Tem de ser chamado depois de um clique (regra do navegador).
  iniciar() {
    if (this.estado !== MIC_PARADO) return;   // só liga uma vez

    userStartAudio();           // pede ao navegador permissão para o áudio
    this.mic = new p5.AudioIn();
    this.mic.start();

    this.estado = MIC_CALIBRANDO;
    this.inicioCalibracao = millis();
    this.somaNiveis = 0;
    this.numAmostras = 0;
  }

  // Chamado em cada draw(): lê o volume e atualiza o estado
  atualizar() {
    if (this.estado === MIC_PARADO) return;

    // Lê o volume e suaviza, para a barra não tremer
    const nivel = this.mic.getLevel();
    this.volume = lerp(this.volume, nivel, 0.2);

    if (this.estado === MIC_CALIBRANDO) {
      // Durante a calibração, vamos somando o que o microfone ouve
      this.somaNiveis += nivel;
      this.numAmostras++;

      if (millis() - this.inicioCalibracao >= DURACAO_CALIBRACAO) {
        this.terminaCalibracao();
      }
    } else if (this.estado === MIC_PRONTO) {
      // HISTERESE: dois limites em vez de um
      if (this.volume > this.max) {
        this.aFalar = true;     // passou o máximo: liga
      } else if (this.volume < this.min) {
        this.aFalar = false;    // caiu abaixo do mínimo: desliga
      }
      // entre o mínimo e o máximo mantém o estado em que estava
    }
  }

  // Calcula o ruído de base e os dois limites
  terminaCalibracao() {
    this.base = this.somaNiveis / max(1, this.numAmostras);
    this.min = this.base + MARGEM_MIN;
    this.max = this.base + MARGEM_MAX;
    this.estado = MIC_PRONTO;
  }

  // ---------- Funções que o main.js usa para desenhar ----------

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
    if (this.estado === MIC_PARADO) {
      return "Clica nesta caixa para ligar o microfone (3 s em silêncio)";
    }
    if (this.estado === MIC_CALIBRANDO) {
      return "A calibrar... fica em silêncio";
    }
    return "Microfone calibrado!";
  }

  // Escala usada para desenhar a barra de volume (0 a 1)
  escala() {
    return this.estado === MIC_PRONTO ? this.max * 1.5 : 0.1;
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