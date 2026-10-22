class Pinca {
  constructor() {
    // Posição inicial: em cima do tabuleiro da esquerda
    this.x = 205;
    this.y = 340;
    this.lixo = null;   // lixo que está a ser segurado (ou null)
  }

  // Chamado em cada draw(): a pinça segue o rato
  atualizar() {
    this.x = constrain(mouseX, 0, width);
    this.y = constrain(mouseY, 50, height);

    // Se estiver a segurar lixo, o lixo acompanha a pinça
    if (this.lixo) {
      this.lixo.x = this.x;
      this.lixo.y = this.y;
    }
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

  // Desenha a pinça (duas hastes que fecham quando segura lixo)
  desenhar() {
    push();
    translate(this.x, this.y);
    rotate(-0.6);               // inclinada, como no Figma

    const a = this.lixo ? 2 : 8;  // abertura: fechada com lixo, aberta sem lixo
    const comprimento = 95;

    strokeCap(ROUND);
    strokeWeight(7);

    // Hastes azul-claras
    stroke(205, 228, 238);
    line(-a, 0, -a * 2, -comprimento);
    line(a, 0, a * 2, -comprimento);

    // Pontas laranja
    stroke(240, 180, 80);
    line(-a, 0, -a * 1.15, -16);
    line(a, 0, a * 1.15, -16);

    pop();
  }
}