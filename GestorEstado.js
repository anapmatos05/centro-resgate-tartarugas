// =====================================================
// GestorEstado.js
// Guarda em que ecrã o jogo está e permite mudar de ecrã.
// =====================================================

// Os 3 estados obrigatórios do enunciado
const ESTADO_INICIO = "inicio";
const ESTADO_EXECUCAO = "execucao";
const ESTADO_RESULTADO = "resultado";

class GestorEstado {
  constructor() {
    // O jogo começa sempre no ecrã de início
    this.atual = ESTADO_INICIO;
  }

  // Muda para outro ecrã
  muda(novoEstado) {
    this.atual = novoEstado;
  }

  // Devolve true se estivermos neste estado (útil para perguntar "estou no ecrã X?")
  e(estado) {
    return this.atual === estado;
  }
}