 class Tartaruga {
  constructor(indiceEspecie) {
    const especiesDisponiveis = [
      "Verde", 
      "Comum", 
      "Oliva", 
      "Pente", 
      "Couro", 
      "Australiana",
      "Kemp"
    ];
    // Garante que o índice fica entre 0 e 6 para não dar erro
    let index = constrain(indiceEspecie, 0, especiesDisponiveis.length - 1);
    this.especie = especiesDisponiveis[index];
    this.inicializarEspecie();
  }

  inicializarEspecie() {
    switch (this.especie) {
      case "Verde":
        this.saudeMaxima = 100;
        this.saude = 100;
        this.qtdLixo = 1;
        this.corCasco = color(90, 160, 110);
        this.corBase = color(160, 215, 175);
        this.escala = 1.0;
        break;
        
      case "Comum":
        this.saudeMaxima = 150;
        this.saude = 150;
        this.qtdLixo = 3;
        this.corCasco = color(150, 100, 60);
        this.corBase = color(210, 170, 130);
        this.escala = 1.1;
        break;
        
      case "Oliva":
        this.saudeMaxima = 60;
        this.saude = 60;
        this.qtdLixo = 1;
        this.corCasco = color(130, 130, 90);
        this.corBase = color(180, 180, 140);
        this.escala = 0.85;
        break;

    case "Couro":
            this.saudeMaxima = 120;
            this.saude = 120;
            this.qtdLixo = 4;
            this.corCasco = color(60, 75, 85);
            this.corBase = color(120, 135, 145);
            this.escala = 1.25;
            break;


      case "Pente":
              this.saudeMaxima = 70;
              this.saude = 70;
              this.qtdLixo = 2;
              this.corCasco = color(170, 110, 60);
              this.corBase = color(220, 170, 120);
              this.escala = 0.9;
              break;

      case "Australiana":
        this.saudeMaxima = 100;
        this.saude = 100;
        this.qtdLixo = 2;
        this.corCasco = color(80, 140, 130);
        this.corBase = color(150, 200, 190);
        this.escala = 1.0;
        break;

        
      case "Kemp":
        this.saudeMaxima = 50;
        this.saude = 50;
        this.qtdLixo = 1;
        this.corCasco = color(140, 90, 90);
        this.corBase = color(190, 140, 140);
        this.escala = 0.8;
        break;
    }
  }

  desenhar(x, y) {
    push();
    translate(x, y);

    // -----------------------------------------------------
    // Círculo tracejado à volta (Área de calmaria)
    // -----------------------------------------------------
    stroke(80, 180, 170, 180);
    strokeWeight(2);
    drawingContext.setLineDash([8, 8]); // Efeito tracejado p5
    noFill();
    ellipse(0, 0, 380 * this.escala, 380 * this.escala);
    drawingContext.setLineDash([]); // Limpa o tracejado para o resto

    // Desenho da tartaruga
    scale(this.escala);
    noStroke();

    // 1. Barbatanas Traseiras
    fill(this.corBase);
    ellipse(-50, 65, 45, 70);
    ellipse(50, 65, 45, 70);

    // 2. Barbatanas Dianteiras
    push();
    translate(-95, -15);
    rotate(QUARTER_PI / 1.8);
    ellipse(0, 0, 100, 45);
    pop();

    push();
    translate(95, -15);
    rotate(-QUARTER_PI / 1.8);
    ellipse(0, 0, 100, 45);
    pop();

    // 3. Cabeça
    fill(this.corBase);
    ellipse(0, -95, 45, 55);
    
    // Olhos e Boca
    fill(20, 40, 30);
    ellipse(-10, -105, 5, 5);
    ellipse(10, -105, 5, 5);
    
    noFill();
    stroke(20, 40, 30);
    strokeWeight(2);
    arc(0, -95, 12, 10, 0, PI); // Sorriso
    noStroke();

    // 4. Casco
    fill(this.corCasco);
    ellipse(0, 0, 160, 175);

    // Borda interna do casco
    noFill();
    stroke(this.corBase);
    strokeWeight(4);
    ellipse(0, 0, 145, 160);

    // 5. Hexágonos internos estilo Figma
    fill(this.corBase);
    noStroke();
    ellipse(0, -5, 42, 42);
    ellipse(0, -48, 32, 32);
    ellipse(0, 38, 32, 32);
    ellipse(-38, -22, 32, 32);
    ellipse(38, -22, 32, 32);
    ellipse(-38, 15, 32, 32);
    ellipse(38, 15, 32, 32);

    pop();
  }
}