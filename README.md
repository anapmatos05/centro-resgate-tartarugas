# centro-resgate-tartarugas
# Diário de Desenvolvimento — Ocean Rescue Hospital

**Nome:** Ana Matos | **Número:** 33138 | **Curso:** ECGM  
**Unidade Curricular:** Sistemas Multimédia (2026/2027)  
**Tema Atribuído:** Sea Turtle Protection (Sustentabilidade e Ambiente)  

---

### Sessão 1 — 06 de Outubro de 2026
* **Objetivo:** Definição do conceito, mecânicas do jogo, estrutura base em p5.js e prototipagem inicial no Figma.
* **Atividades realizadas:**
  * Definição da ideia central do jogo: um hospital de resgate veterinário onde o jogador tem de retirar lixo marinho do corpo de 7 espécies de tartarugas marinhas protegidas.
  * Criação do protótipo de baixa/média fidelidade (ecrãs de Início, Execução e Resultados).
  * Configuração do repositório Git no GitHub e estrutura inicial de pastas (`assets/imagens`, `assets/sons`).
  * Implementação da máquina de estados (`GestorEstado`) para controlar a transição entre os 3 ecrãs obrigatórios (`ESTADO_INICIO`, `ESTADO_EXECUCAO`, `ESTADO_RESULTADO`).
* **Problemas:**
  * Transição de ecrãs a herdar estilos de texto (negritos e alinhamentos trocados entre estados).
* **Solução:**
  * Adicionada a reposição explícita de `textStyle(NORMAL)` e `textAlign()` no início da função de cada ecrã.
---

### Sessão 2 — 11 de Outubro de 2026
* **Objetivo:** Entrega da Proposta/Relatório de 2 páginas e mecânicas base de áudio e controlo.
* **Atividades realizadas:**
  * Finalização do relatório preliminar entregue a 12 de outubro com os objetivos, protótipo e URL do repositório Git.
  * Implementação da classe `GestorMicrofone` com entrada de áudio do utilizador (`p5.AudioIn`).
  * Programação do sistema de calibração (temporizador de 3 segundos com barra de progresso visual).
  * Implementação da histerese com 2 limiares (`min` e `max`) para evitar oscilações no estado da tartaruga (calma vs. assustada).
* **Problemas:**
  * O microfone registava picos de ruído ambiente que descalibravam a deteção da voz.
* **Solução:**
  * Adicionado um algoritmo de média móvel para suavizar o volume normalizado antes de comparar com os limiares de histerese.
* **Uso de IA:**
  * Esclarecimento matemático sobre a lógica da histerese aplicada a entradas continuas de áudio.

---

### Sessão 3 — 17 de Outubro de 2026
* **Objetivo:** Lógica da Pinça veterinária, deteção de colisões e recolha de lixo marinho.
* **Atividades realizadas:**
  * Implementação da classe `Pinca` controlada pelo rato e da classe `Lixo` com posições aleatórias sobre a carapaça da tartaruga.
  * Criação do suporte/tabuleiro cinzento para pousar e pegar na pinça com gestão rigorosa de cliques (`mousePressed` e `mouseReleased`).
  * Programação da colisão e acoplamento entre a pinça e as peças de lixo e entre a pinça e a zona do barril de lixo.
  * Implementação do sistema de Passaporte das 7 Espécies (sequência aleatória baralhada a cada novo turno usando `shuffle`).
* **Problemas:**
  * Ao clicar para pegar na pinça pousada, o evento de soltar o rato (`mouseReleased`) pousava imediatamente a pinça no mesmo frame.
* **Solução:**
  * Introdução da flag booleana `pegouAgora = true` para ignorar a primeira libertação do rato logo a seguir ao clique de captura.

---

### Sessão 4 — 21 de Outubro de 2026
* **Objetivo:** Interface visual (HUD), desenho customizado de saúde e ficha de paciente.
* **Atividades realizadas:**
  * Substituição do indicador de vidas inicial (círculos vermelhos simples) por corações vectoriais desenhados em código através de curvas de Bézier (`bezierVertex`).
  * Programação da Ficha de Paciente temporária (surge automaticamente durante 5 segundos ao mudar de tartaruga ou ao clicar no botão "📋 Ver Ficha").
  * Integração da informação científica e biológica de cada espécie de tartaruga (dieta, ameaças marinhas e nível de dificuldade).
  * Adição do sistema de tempo limite (2 minutos) e contadores de pontuação (+100 por tartaruga salva, +10 por lixo descartado).
* **Problemas:**
  * A pinça sobrepunha-se visualmente aos botões da interface e da ficha de paciente, impossibilitando ver o cursor do rato.
* **Solução:**
  * Alteração dinâmica do cursor: quando o rato está sobre o botão da ficha, o cursor regressa a `HAND` e o desenho da pinça é temporariamente ocultado.

---

### Sessão 5 — 24 de Outubro de 2026
* **Objetivo:** Servidor local XAMPP, efeitos sonoros de interatividade e áudio ambiente.
* **Atividades realizadas:**
  * Migração do ambiente de execução local para um servidor web Apache local via XAMPP (`htdocs/SM/trabalho_p5/centro-resgate-tartarugas`), eliminando bloqueios de segurança de navegador (CORS / `file://`).
  * Integração do efeito sonoro de descarte no lixo (`somLixo.play()`) acionado ao largar objetos no barril.
  * Integração da música de fundo ambiente praiana (`musicaFundo.loop()`) com controlo de volume (`setVolume(0.3)`) para garantir que o ruído de fundo não interfere com a calibração ou deteção da voz no microfone.
* **Problemas:**
  * O áudio de fundo bloqueava nos navegadores devido às políticas estritas de autoplay sem interação do utilizador.
* **Solução:**
  * O arranque do ciclo de música foi associado ao arranque do turno (`iniciaTurno()`), assegurando que ocorre após um clique voluntário do utilizador no ecrã.

---

### Sessão 6 — 26 de Outubro de 2026
* **Objetivo:** Polimento final, revisão de requisitos obrigatórios, testes e documentação final.
* **Atividades realizadas:**
  * Verificação rigorosa do rodapé obrigatório no canto inferior esquerdo (*Sea Turtle Protection*) e canto inferior direito (*Ana Matos · 33138 · ECGM*).
  * Teste completo do ciclo de jogo: calibração de microfone -> jogabilidade contínua -> ecrã de resultados com curiosidade educativa aleatória -> reinício de turno.
  * Comentários detalhados ao longo de todo o código fonte `main.js`.
  * Redação final do relatório de 4 páginas e compilação do Diário de Desenvolvimento para submissão.

---

### Declaração de Utilização de Inteligência Artificial
* **Ferramentas utilizadas:** Claude / Gemini.
* **Finalidade:** Apoio no esclarecimento da matemática das curvas de Bézier para o desenho do HUD de corações, otimização de caminhos para execução no servidor local Apache/XAMPP e revisão linguística/estrutural da documentação.
* **Decisões/Alterações efetuadas pela estudante:** Toda a arquitetura do jogo, adaptação dos limiares de histerese, lógica de eventos de rato para a pinça veterinária e integração dos recursos multimédia foram testados, ajustados e validados autonomamente pela estudante.