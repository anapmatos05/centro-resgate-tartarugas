// =====================================================
// Centro de Resgate de Tartarugas
// tartaruga.js - Classe responsável pelas 7 espécies
// =====================================================

class Tartaruga {
  constructor() {
    // Lista das 7 espécies marinhas definidas para o projeto
    const especiesDisponiveis = [
      "Verde", 
      "Comum", 
      "Oliva", 
      "Australiana", 
      "Couro", 
      "Pente", 
      "Kemp"
    ];
    
    // Escolhe uma espécie aleatoriamente ao iniciar o turno
    this.especie = random(especiesDisponiveis);
    
    // Inicializa os atributos únicos de cada espécie (saúde, lixo, cores e tamanho)
    this.inicializarEspecie();
  }

  // Atribui características visuais e biológicas com base na espécie
  inicializarEspecie() {
    switch (this.especie) {
      case "Verde":
        this.saude = 100;
        this.qtdLixo = 1;
        this.corCasco = color(90, 160, 110);
        this.corBase = color(110, 190, 130);
        this.escala = 1.0;
        break;
        
      case "Comum":
        this.saude = 150;
        this.qtdLixo = 3;
        this.corCasco = color(150, 100, 60);
        this.corBase = color(190, 130, 80);
        this.escala = 1.1;
        break;
        
      case "Oliva":
        this.saude = 60;
        this.qtdLixo = 1;
        this.corCasco = color(130, 130, 90);
        this.corBase = color(160, 160, 110);
        this.escala = 0.85;
        break;

      case "Couro":
        this.saude = 120;
        this.qtdLixo = 4;
        this.corCasco = color(50, 60, 70); // Mais escura e distinta
        this.corBase = color(80, 90, 100);
        this.escala = 1.25;
        break;

      case "Pente":
        this.saude = 70;
        this.qtdLixo = 2;
        this.corCasco = color(170, 110, 60); // Tons amarelados/castanhos
        this.corBase = color(200, 140, 80);
        this.escala = 0.9;
        break;

      case "Australiana":
        this.saude = 100;
        this.qtdLixo = 2;
        this.corCasco = color(80, 140, 130);
        this.corBase = color(100, 170, 150);
        this.escala = 1.0;
        break;

      case "Kemp":
        this.saude = 50;
        this.qtdLixo = 1;
        this.corCasco = color(140, 90, 90);
        this.corBase = color(170, 110, 110);
        this.escala = 0.8;
        break;
    }
  }

  // Método responsável por desenhar a tartaruga vetorizada no ecrã
  desenhar(x, y) {
    push();
    translate(x, y);
    scale(this.escala); // Altera o tamanho consoante a espécie

    noStroke();

    // -----------------------------------------------------
    // 1. Barbatanas Traseiras
    // -----------------------------------------------------
    fill(this.corBase);
    // Esquerda
    ellipse(-60, 70, 45, 80);
    // Direita
    ellipse(60, 70, 45, 80);

    // -----------------------------------------------------
    // 2. Barbatanas Dianteiras (Maiores)
    // -----------------------------------------------------
    // Esquerda
    push();
    translate(-110, -10);
    rotate(QUARTER_PI / 2);
    ellipse(0, 0, 110, 50);
    pop();

    // Direita
    push();
    translate(110, -10);
    rotate(-QUARTER_PI / 2);
    ellipse(0, 0, 110, 50);
    pop();

    // -----------------------------------------------------
    // 3. Cabeça e Pescoço
    // -----------------------------------------------------
    fill(this.corBase);
    ellipse(0, -110, 45, 60); // Cabeça
    // Olhinhos
    fill(30);
    ellipse(-10, -120, 6, 6);
    ellipse(10, -120, 6, 6);

    // -----------------------------------------------------
    // 4. Casco Principal (Redondo e Estilizado)
    // -----------------------------------------------------
    fill(this.corCasco);
    ellipse(0, 0, 180, 200);

    // Borda do Casco (contorno interno para dar profundidade)
    noFill();
    stroke(this.corBase);
    strokeWeight(4);
    ellipse(0, 0, 160, 180);

    // -----------------------------------------------------
    // 5. Padrão Geométrico do Casco (Hexágonos simulados)
    // -----------------------------------------------------
    fill(this.corBase);
    noStroke();
    // Hexágono central
    ellipse(0, 0, 50, 50);
    // Hexágonos à volta
    ellipse(0, -55, 40, 40);
    ellipse(0, 55, 40, 40);
    ellipse(-50, -25, 40, 40);
    ellipse(50, -25, 40, 40);
    ellipse(-50, 25, 40, 40);
    ellipse(50, 25, 40, 40);

    pop(); // Restaura as definições originais do canvas

    // -----------------------------------------------------
    // 6. Texto Informativo da Espécie e Saúde
    // -----------------------------------------------------
    fill(40, 70, 60);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Espécie: " + this.especie + " (Saúde: " + this.saude + ")", x, y - 160);
  }
}