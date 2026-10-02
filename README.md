# Portfólio Livro — Maximilliano Cramer

## Executar

Extraia a pasta e abra index.html no navegador, ou abra a pasta no VS Code e use Live Server. Sem dependências ou instalação. Os scripts clássicos são carregados com defer, na ordem de suas dependências, para funcionar também abrindo o arquivo diretamente.

## Experiência atual

- Capa com imagem lunar e monograma MC vetorial.
- Volume I: quatro páginas pessoais, da curiosidade ao início na tecnologia.
- Volume II: três histórias curtas, Ayumi, Axis Transporte e Carmen Tarot.
- Acesso direto aos trabalhos pela capa.
- Seletor de volumes e índice; navegação por botões e teclado.
- Duas páginas no computador, uma no celular.
- Folha com frente e verso em 3D; preferência por movimento reduzido respeitada.
- O conteúdo permanece legível sem JavaScript.

## Arquitetura CSS

As folhas são carregadas na ordem abaixo. Evite colocar regras responsivas nas folhas dos componentes; centralize-as em responsive.css.

| Arquivo            | Responsabilidade                                      |
| ------------------ | ----------------------------------------------------- |
| css/global.css     | Fonte local, variáveis, base e acessibilidade global  |
| css/layout.css     | Cabeçalho, marca e rodapé                             |
| css/cover.css      | Capa e acesso aos volumes                             |
| css/book.css       | Páginas, tipografia narrativa e detalhes dos projetos |
| css/projects.css   | Capturas clicáveis dos sites                          |
| css/controls.css   | Controles, seleção de volumes e índice                |
| css/animations.css | Camadas e faces da folha em 3D                        |
| css/responsive.css | Media queries e movimento reduzido                    |

## Arquitetura JavaScript

| Arquivo          | Responsabilidade                                              |
| ---------------- | ------------------------------------------------------------- |
| js/pagination.js | Estado da paginação e fronteiras de cada volume               |
| js/animations.js | Animação da capa, frente/verso e cancelamento                 |
| js/book.js       | Inicialização, controles, teclado, foco e seleção dos volumes |

O namespace PortfolioBook liga os módulos sem dependências globais avulsas. O modelo de paginação não depende do DOM. O controlador deriva os volumes dos atributos das páginas. Páginas de volumes diferentes nunca aparecem juntas, mesmo quando um volume tem uma quantidade ímpar.

## Conteúdo e novos projetos

Os textos ficam nos artigos em index.html. Cada página possui data-volume, data-volume-label, data-local-page e um título com ID único. Para adicionar páginas:

1. Insira o artigo junto das outras páginas do seu volume.
2. Atualize seus atributos, título, referência aria-labelledby e número impresso.
3. Atualize o índice: data-go-page é a posição global da página, começando em zero.
4. Se mudar a quantidade de páginas do Volume I, ajuste data-volume-start do seletor do Volume II. Para um novo volume, adicione seu botão de seleção, use um novo data-volume e informe seu nome em data-volume-label.

Os relatos pessoais foram adaptados do que você contou. Foram retiradas as explicações da atmosfera visual e a referência ao humor. O recomeço é descrito como renascimento.

Os relatos de Ayumi e Axis Transporte são resumos iniciais baseados no trabalho descrito anteriormente. Revise-os e acrescente imagens reais e decisões específicas de cada projeto na próxima etapa. Não foram inventados resultados de vendas, depoimentos ou métricas. O endereço do Ayumi é o que você já forneceu; não foi possível confirmar sua disponibilidade nesta execução. O link da Axis Transporte foi atualizado para https://maximillianocramer-dev.github.io/Axis-Transporte-Portfolio/. O nome, a estrutura e a identificação como projeto conceitual foram conferidos no HTML publicado.

## Identidade

- assets/brand/monogram.svg: nova proposta de monograma MC, com fundo transparente, aplicada ao cabeçalho.
- assets/brand/favicon.svg: versão com fundo para a aba do navegador.
- assets/images/nordic-night.webp: imagem da capa.
- assets/fonts/: fonte local e licença original.

A fonte cursiva é clássica; não representa uma escrita nórdica histórica. As referências nórdicas e noturnas estão no visual.

## Verificação

Sintaxe dos módulos, referências locais, índices e estrutura acessível verificados. O modelo de paginação foi verificado com volumes de quantidades pares e ímpares. O animador foi verificado com simulações de término, cancelamento e movimento reduzido. A aparência e o comportamento no navegador real ainda precisam ser conferidos, especialmente depois da reorganização.

## Próxima etapa

Validar a narrativa, a marca e o livro reorganizado. Inserir capturas dos sites e refinar os relatos de projeto. Depois, criar o volume de contato com canais confirmados.

Carmen Tarot foi desenvolvido para a mãe do autor, cartomante e terapeuta. A apresentação, os serviços, os depoimentos, os caminhos de contato e o crédito do desenvolvedor foram conferidos no site publicado.

As capturas dos três sites foram feitas no navegador em 1 de outubro de 2026. Ficam em assets/images/projects e usam os links públicos de cada projeto. A disposição das novas imagens dentro do livro ainda precisa de inspeção visual local.

## Padrão de código

Todos os arquivos de HTML, CSS e JavaScript usam indentação de quatro espaços e limite de linha de 100 caracteres. As configurações .editorconfig e .prettierrc.json estão incluídas para manter esse padrão no VS Code. A formatação foi feita com Prettier 3.6.2 sem adicionar dependências ao projeto.

O índice agora possui navegação, seções identificadas, títulos e listas separados por volume. Todos os botões têm type="button", o título principal tem um nome acessível completo e o contador de páginas é anunciado como status. O ponto de salto para o conteúdo principal aceita foco.

## Volume III e contato preparado

O Volume III já está disponível na seleção de volumes e no índice. Os canais ficam ocultos enquanto não forem configurados.

Quando decidir inserir contato, edite apenas js/contact-config.js. Preencha whatsapp com código do país e DDD, email com o endereço de e-mail e linkedin/github com os links completos. Mantenha vazios os canais que não quiser publicar.

js/contacts.js monta os links e css/contact.css define sua aparência. Nenhum dado de contato foi inserido nesta entrega.

## Animações da coleção

As capas se movem ao passar o mouse ou focar seus botões pelo teclado.
Clique na capa ou no botão para abrir o volume correspondente.
Não há flutuação contínua; no celular a abertura funciona por toque.

O botão “Ativar animações” permite ativar explicitamente os efeitos mesmo
quando o sistema solicita movimento reduzido. “Pausar animações” desativa
os efeitos. A escolha é lembrada quando o navegador permite armazenamento.
Sem escolha explícita, o site respeita a preferência do sistema.

## Capítulos e navegação

O Volume I tem três capítulos. Carmen Tarot, Axis Transporte e Ayumi compõem
o Volume II, com suas tecnologias. Na última página visível de cada volume,
o botão muda para “Próximo volume”. No fim do Volume III, muda para
“Voltar à coleção”. As setas do teclado acompanham essa navegação.

## Domínio, SEO e LinkedIn

Endereço principal preparado: https://maximillianocramer.com.br/
O HTML inclui URL canônica, metadados de compartilhamento e dados de autor.
robots.txt e sitemap.xml ficam na mesma pasta do index.html.
O LinkedIn está configurado no Volume III; outros contatos continuam vazios.

O domínio ainda precisa ser conectado nas configurações do GitHub Pages
e no DNS. Estes arquivos não fazem essa conexão automaticamente.
Depois da publicação, verifique o HTML renderizado na inspeção de URL do
Search Console e envie o sitemap. A leitura dos capítulos depende da
navegação do livro; sua indexação deve ser conferida nesse teste.
