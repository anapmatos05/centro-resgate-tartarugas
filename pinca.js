const PINCA_LARGURA = 110;     // largura com que a imagem aparece no jogo (em px)

// Onde está a PONTA da pinça dentro da imagem, em fração de 0 a 1.
// (0, 0) = canto superior esquerdo; (1, 1) = canto inferior direito.
// Exemplo: pinça na diagonal com a ponta em baixo à esquerda = (0.1, 0.95)
const PINCA_PONTA_X = 0.1;
const PINCA_PONTA_Y = 0.95;

// true = mostra um ponto vermelho na ponta, para ajustares os valores acima.
// Quando estiver certo, põe false.
const PINCA_MOSTRAR_PONTA = true;
// ------------------------------------------------------------

class Pinca {
  constructor() {
    this.x = 205;       // posição da ponta da pinça
    this.y = 340;
    this.lixo = null;   // lixo que está a ser segurado (ou null)
    this.pousada = false;
    this.largura = PINCA_LARGURA;
  }

  // Chamado em cada draw(): a ponta da pinça segue o rato
  atualizar() {
    if (!this.pousada) {
      this.x = constrain(mouseX, 0, width);
      this.y = constrain(mouseY, 50, height);
    }

    // Se estiver a segurar lixo, o lixo acompanha a ponta
    if (this.lixo) {
      this.lixo.x = this.x;
      this.lixo.y = this.y;
    }
  }

  pousarNoSuporte(suporte) {
    this.pousada = true;
    this.largura = min(PINCA_LARGURA, suporte.w * 0.8);

    const altura = this.largura * imgPinca.height / imgPinca.width;
    this.x = suporte.x + (suporte.w - this.largura) / 2 + PINCA_PONTA_X * this.largura;
    this.y = suporte.y + (suporte.h - altura) / 2 + PINCA_PONTA_Y * altura;
  }

  pegarDoSuporte(x, y) {
    this.pousada = false;
    this.largura = PINCA_LARGURA;
    this.x = constrain(x, 0, width);
    this.y = constrain(y, 50, height);
  }

  // Chamado quando se carrega no rato: tenta agarrar um lixo
  apanhar(lixos) {
    if (this.lixo) return;               // já está a segurar um
    for (const l of lixos) {
      if (l.tocadoPor(this.x, this.y)) { // colisão pinça-lixo
        this.lixo = l;
        l.apanhado = true;
        break;                           // só agarra um de cada vez
      }
    }
  }

  // Solta o lixo no suporte sem o devolver à posição de origem
  largarNoSuporte(suporte) {
    if (!this.lixo) return false;

    const xMaisProximo = constrain(this.lixo.x, suporte.x, suporte.x + suporte.w);
    const yMaisProximo = constrain(this.lixo.y, suporte.y, suporte.y + suporte.h);
    if (dist(this.lixo.x, this.lixo.y, xMaisProximo, yMaisProximo) >= this.lixo.raio) {
      return false;
    }

    this.lixo.apanhado = false;
    this.lixo = null;
    return true;
  }

  // Chamado quando se solta o rato.
  // Devolve true se o lixo foi para o barril.
  largar(barril) {
    if (!this.lixo) return false;

    const l = this.lixo;
    this.lixo = null;
    l.apanhado = false;

    if (l.noBarril(barril)) {   // colisão lixo-barril
      l.recolhido = true;
      return true;
    }
    l.volta();                  // largou fora do barril
    return false;
  }

  // Desenha a imagem da pinça com a ponta no sítio do rato
  desenhar() {
    const larg = this.largura;
    const alt = larg * imgPinca.height / imgPinca.width;   // mantém as proporções

    imageMode(CORNER);
    image(
      imgPinca,
      this.x - PINCA_PONTA_X * larg,   // desloca a imagem para a ponta ficar no rato
      this.y - PINCA_PONTA_Y * alt,
      larg,
      alt
    );

    // Ponto vermelho na ponta (só para calibrar)
    if (PINCA_MOSTRAR_PONTA) {
      fill(255, 0, 0);
      noStroke();
      ellipse(this.x, this.y, 8, 8);
    }
  }
}