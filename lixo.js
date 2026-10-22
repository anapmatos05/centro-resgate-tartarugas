class Lixo {
  // (cx, cy) é o centro da tartaruga: o lixo aparece perto dele, ao acaso
  constructor(cx, cy) {
    // Tipo de lixo sorteado ao acaso
    this.tipo = random(["saco", "rede", "toxico"]);

    // Posição aleatória em cima do corpo da tartaruga
    const angulo = random(TWO_PI);
    const distancia = random(20, 85);
    this.xOrigem = cx + cos(angulo) * distancia;
    this.yOrigem = cy + sin(angulo) * distancia;

    this.x = this.xOrigem;
    this.y = this.yOrigem;
    this.raio = 22;          // usado nas colisões

    this.apanhado = false;   // true enquanto a pinça o segura
    this.recolhido = false;  // true quando já foi para o barril
  }

  // Desenha o lixo conforme o tipo
  desenhar() {
    push();
    translate(this.x, this.y);

    // Quando está apanhado, fica um pouco maior para se notar
    if (this.apanhado) {
      scale(1.15);
    }

    if (this.tipo === "saco") {
      // Saco de plástico cinzento com duas alças
      fill(200, 205, 210);
      stroke(150, 155, 160);
      strokeWeight(2);
      rect(-16, -14, 32, 34, 6);
      noFill();
      arc(-8, -14, 14, 16, PI, TWO_PI);
      arc(8, -14, 14, 16, PI, TWO_PI);
    } else if (this.tipo === "rede") {
      // Pedaço de rede de pesca
      noFill();
      stroke(120, 90, 50);
      strokeWeight(3);
      ellipse(0, 0, 40, 40);
      line(-14, -14, 14, 14);
      line(14, -14, -14, 14);
      line(-20, 0, 20, 0);
      line(0, -20, 0, 20);
    } else {
      // Resíduo tóxico (gota amarela com símbolo de perigo)
      fill(220, 200, 60);
      stroke(150, 130, 30);
      strokeWeight(2);
      ellipse(0, 0, 40, 40);
      noStroke();
      fill(60, 50, 10);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textSize(20);
      text("!", 0, 1);
    }

    pop();
  }

  // Colisão com a ponta da pinça: está perto o suficiente para agarrar?
  tocadoPor(px, py) {
    return dist(px, py, this.x, this.y) < this.raio + 8;
  }

  // Colisão círculo-retângulo: o lixo está em cima do barril?
  noBarril(b) {
    // ponto do retângulo mais próximo do centro do lixo
    const mx = constrain(this.x, b.x, b.x + b.w);
    const my = constrain(this.y, b.y, b.y + b.h);
    return dist(this.x, this.y, mx, my) < this.raio;
  }

  // Se for largado fora do barril, volta para a tartaruga
  volta() {
    this.x = this.xOrigem;
    this.y = this.yOrigem;
  }
}