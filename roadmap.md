🗺️ Roadmap: App estilo Obsidian (Mobile + Web)

**Progresso atual:** ✅ Setup concluído ✅ FileSystem rodando ✅ Markdown e Wikilinks funcionando ✅ UX e Modo Edição criados ✅ Layout responsivo ajustado.

Fase 4: Inteligência das Notas (Parcialmente Concluída)

Para o Graph View funcionar em todo seu potencial, o app precisa ler metadados detalhados.
- [x] Indexação básica (Regex para links implementada).
- [ ] Extração de Metadados: Melhorar o frontmatter das notas (tags, data de criação, etc) usando pacotes como `gray-matter`.

Fase 5: O Modo Grafo (Graph View) -> PRÓXIMO PASSO 🚀

Renderizar bolinhas conectadas parece fácil, mas exige muita performance no Mobile.

    Escolha da Tecnologia Visual:

        Opção A (Recomendada pela Performance): @shopify/react-native-skia. É uma engine de desenho 2D absurdamente rápida que funciona no Expo (Mobile e Web).

        Opção B (Mais fácil, menos performance): react-native-svg.

    Cálculo da Física (Force-Directed Graph):

        Instalar a biblioteca d3-force. Ela roda em JavaScript puro e calcula a posição de nós (notas) para que eles se repilam e as linhas (links) ajam como molas.

    Implementação:

        Passar os Nodes e Edges (da Fase 4) para o d3-force.

        Usar o resultado (coordenadas X e Y) para desenhar círculos e linhas usando o Skia ou SVG.

    Interatividade:

        Usar react-native-gesture-handler para permitir Pan (arrastar a tela) e Zoom (pinça) no grafo. Ao clicar numa bolinha, navegar para a nota correspondente.

💡 Dicas de Ouro para a sua Stack

    Não use WebViews para o Grafo se puder evitar: A tentação de usar uma biblioteca web pronta (como vis.js ou cytoscape) dentro de uma WebView no mobile é grande, mas a performance cai muito e a comunicação via postMessage é chata. Vá de Skia + d3-force.

    uniwind na Web: O uniwind compila os estilos para CSS real na Web. Aproveite as Media Queries nativas dele (breakpoints) para esconder a sidebar em celulares e mostrá-la lado a lado em telas grandes.

    Comece Mockando os Dados: Antes de sofrer com o Sistema de Arquivos (Fase 2), pule para a Fase 3 e 4 criando 5 arquivos .md fixos no seu código (em formato de string). Construa o Markdown e o Grafo primeiro. Só quando estiver bonito, vá brigar com o FileSystem.

Quer começar por qual parte? Posso te mandar exemplos de código de como estruturar o Setup Inicial do uniwind, como fazer a Regex para ler os [[links]] ou como montar a física do Grafo com D3.