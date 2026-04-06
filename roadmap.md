🗺️ Roadmap: App estilo Obsidian (Mobile + Web)
Fase 1: Setup e Fundação

O objetivo aqui é deixar a casa pronta, com navegação, estilos e estado configurados.

    Início do Projeto:

        Criar projeto com Expo (recomendo usar o Expo Router para navegação baseada em arquivos, ajuda muito na Web).

        Instalar e configurar o react-native-uniwind (criar os temas Light e Dark e os breakpoints para Mobile/Tablet/Web).

    Gerenciamento de Estado:

        Escolher uma biblioteca leve. Recomendo fortemente o Zustand ou Jotai. Você precisará de um estado global para manter a "Árvore de Notas" (quais notas existem e como se conectam).

    Layout Base (uniwind):

        Criar o layout responsivo: Na Web/Tablet, uma barra lateral fixa (Sidebar) com a lista de notas. No Mobile, um menu Drawer ou Bottom Sheet.

Fase 2: O Sistema de Arquivos (O maior desafio)

O Obsidian trabalha com arquivos locais .md. Como você tem Mobile e Web, precisará criar uma interface (Adapter), pois a API de arquivos muda completamente.

    Adapter para Mobile (iOS/Android):

        Usar expo-file-system para ler, criar, editar e listar arquivos na pasta de documentos do app.

    Adapter para Web:

        A Web não deixa você ler a pasta do usuário diretamente sem pedir permissão a cada vez (File System Access API).

        Solução inicial: Usar o localforage ou IndexedDB para simular um sistema de arquivos no navegador.

        Solução avançada (opcional): Usar a OPFS (Origin Private File System).

    Criação do Hook Universal:

        Criar um hook useFileSystem que, por debaixo dos panos, decide se usa o código do passo 1 (se for mobile) ou do passo 2 (se for web).

Fase 3: Lendo e Renderizando Markdown

O coração do app é ler o texto e mostrar formatado.

    Parser de Markdown:

        Instalar o react-native-markdown-display. Ele converte Markdown para componentes nativos do React Native.

    Customização (Wikilinks):

        O Obsidian usa [[Nome da Nota]] para links. Você precisará de uma função ou Regex antes de renderizar para converter [[Nota]] em um link clicável (ex: [Nota](app://note/Nota)) que o seu parser de markdown entenda.

    Estilização do Markdown:

        Usar o uniwind para criar as regras de CSS/Estilo do react-native-markdown-display (tamanhos de H1, H2, cores de links, modo escuro para blocos de código).

Fase 4: Inteligência das Notas (O "Cérebro")

Para o Graph View funcionar, o app precisa ler todas as notas e entender como elas se conectam.

    Extração de Metadados:

        Instalar o pacote gray-matter (funciona em JS puro) para ler o frontmatter das notas (tags, data de criação, etc).

    Indexação:

        Toda vez que o app abrir (ou uma nota for salva), rodar um script em background que lê o conteúdo das notas, busca por padrões [[...]] usando Regex, e cria uma lista de Nós (Nodes) e Arestas (Edges).

        Salvar esse índice no seu estado global (Zustand).

Fase 5: O Modo Grafo (Graph View)

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

Fase 6: Polimento e UX

    Modo Edição vs Modo Leitura:

        Criar um simples TextInput (multiline) para editar o Markdown cru. Adicionar um botão flutuante para alternar entre "Editar" e "Visualizar".

    Busca:

        Implementar uma barra de busca simples que filtra o estado global pelos títulos ou conteúdo das notas.

    Refinamento com uniwind:

        Garantir que as fontes, espaçamentos e transições de Dark/Light mode estejam fluidos.

💡 Dicas de Ouro para a sua Stack

    Não use WebViews para o Grafo se puder evitar: A tentação de usar uma biblioteca web pronta (como vis.js ou cytoscape) dentro de uma WebView no mobile é grande, mas a performance cai muito e a comunicação via postMessage é chata. Vá de Skia + d3-force.

    uniwind na Web: O uniwind compila os estilos para CSS real na Web. Aproveite as Media Queries nativas dele (breakpoints) para esconder a sidebar em celulares e mostrá-la lado a lado em telas grandes.

    Comece Mockando os Dados: Antes de sofrer com o Sistema de Arquivos (Fase 2), pule para a Fase 3 e 4 criando 5 arquivos .md fixos no seu código (em formato de string). Construa o Markdown e o Grafo primeiro. Só quando estiver bonito, vá brigar com o FileSystem.

Quer começar por qual parte? Posso te mandar exemplos de código de como estruturar o Setup Inicial do uniwind, como fazer a Regex para ler os [[links]] ou como montar a física do Grafo com D3.