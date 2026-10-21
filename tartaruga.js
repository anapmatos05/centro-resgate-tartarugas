// =====================================================
// Centro de Resgate de Tartarugas
// tartaruga.js - Classe responsável pelas 7 espécies
// =====================================================

class Tartaruga {
  constructor() {
    // Lista das 7 espécies marinhas reais definidas para o jogo
    const especiesDisponiveis = [
      "Verde", 
      "Comum", 
      "Oliva", 
      "Australiana", 
      "Couro", 
      "Pente", 
      "Kemp"
    ];
    
    // Escolhe uma espécie aleatoriamente quando a tartaruga chega ao centro
    this.especie = random(especiesDisponiveis);
    
    // Inicializa os atributos específicos da espécie escolhida
    this.inicializarEspecie();
  }

  // Define a saúde, quantidade de lixo e cor de acordo com a biologia da espécie
  inicializarEspecie() {
    switch (this.especie) {
      case "Verde":
        this.saude = 100;
        this.qtdLixo = 1; // Paciente normal para aprendizagem
        this.cor = color(70, 130, 90);
        break;
        
      case "Comum":
        this.saude = 150; // Maior resistência
        this.qtdLixo = 3; // Traz mais quantidade de lixo
        this.cor = color(100, 120, 80);
        break;
        
      case "Oliva":
        this.saude = 60;  // Menor resistência à saúde
        this.qtdLixo = 1; 
        this.cor = color(120, 110, 70);
        break;

      case "Couro":
        this.saude = 120;
        this.qtdLixo = 4; // Grande e com mais lixo associado
        this.cor = color(50, 50, 60);
        break;

      case "Pente":
        this.saude = 70;  // Espécie frágil
        this.qtdLixo = 2;
        this.cor = color(140, 90, 50);
        break;

      case "Australiana":
        this.saude = 100;
        this.qtdLixo = 2;
        this.cor = color(90, 130, 110);
        break;

      case "Kemp":
        this.saude = 50;  // A mais frágil de todas
        this.qtdLixo = 1;
        this.cor = color(130, 80, 80);
        break;
    }
  }

  // Método para desenhar a tartaruga no ecrã de jogo
  desenhar(x, y) {
    fill(this.cor);
    noStroke();
    ellipse(x, y, 320, 220); // Casco principal
    
    // Cabeça da tartaruga
    ellipse(x - 170, y, 60, 40);

    // Texto informativo da espécie atual (excelente para demonstração académica)
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Espécie: " + this.especie, x, y - 130);
  }
}