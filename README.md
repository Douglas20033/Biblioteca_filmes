# DGFLIX

DGFLIX é um catálogo de filmes e séries construído como projeto de portfólio. A ideia por trás dele é simples: mostrar como dá para montar uma experiência parecida com a de um serviço de streaming — catálogo, destaques, busca, sidebars de recomendação e uma página de detalhes — usando apenas HTML, CSS e JavaScript puro, sem framework nenhum, e com dados reais de filmes e séries.

## O que o site faz

Ao entrar no DGFLIX, você encontra uma página inicial com os títulos em alta da semana, uma faixa de destaques com carrossel e duas colunas laterais com sugestões. A partir do menu dá para navegar entre três seções — Filmes, Séries e Lançamentos — cada uma puxando um recorte diferente do catálogo: os filmes mais populares, as séries mais populares e o que está em cartaz nos cinemas do Brasil.

Clicando em qualquer pôster, abre uma janela com mais informações sobre aquele título: sinopse, nota, ano, duração (ou número de temporadas, no caso das séries) e os gêneros. Também tem um campo de busca que filtra os títulos já carregados na tela pelo nome.

## De onde vêm os dados

Todo o conteúdo — pôsteres, notas, sinopses, datas de lançamento — vem da API pública do [TMDB](https://www.themoviedb.org/) (The Movie Database). O site faz as chamadas diretamente do navegador, então não existe um servidor por trás guardando ou processando nada: é só HTML, CSS e um arquivo JavaScript conversando com a API.

## Tecnologias usadas

| Tecnologia | Para que serve |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Visual, layout responsivo e o estilo escuro inspirado em serviços de streaming |
| JavaScript puro | Busca os dados na TMDB, monta os cards na tela e controla o modal de detalhes |
| Font Awesome | Ícones do cabeçalho |

Não tem build, não tem instalação de dependências e não tem back-end. É um site estático de verdade.

## Como rodar localmente

1. Clone o repositório
2. Abra o arquivo `index.html` no navegador

Se quiser rodar com um servidor local (recomendado, porque alguns navegadores bloqueiam certas requisições em arquivos abertos direto do disco), qualquer servidor estático simples resolve, por exemplo:

```bash
python -m http.server 5500
```

e depois acessar `http://localhost:5500`.

## Sobre a chave da API

O arquivo `javascript.js` contém uma chave de API da TMDB. Ela fica visível no código porque o projeto roda inteiramente no navegador, sem servidor próprio — não existe um jeito de escondê-la nesse tipo de arquitetura. Para uma aplicação de estudo e portfólio isso não é um problema: a chave da TMDB é gratuita e de baixo risco. Se você for reaproveitar essa estrutura para um projeto com uma API paga ou que exponha dados sensíveis, aí sim vale a pena colocar essa chave atrás de um servidor.

## Responsividade

O layout foi pensado para funcionar tanto no computador quanto no celular. Em telas grandes, as duas colunas laterais ficam visíveis ao lado do catálogo; conforme a tela diminui, elas somem e o catálogo assume a largura toda, com os cards se reorganizando para continuar confortáveis de ver e tocar.

## Autor

Projeto desenvolvido por Douglas Campos.
- [GitHub](https://github.com/Douglas20033)
- [LinkedIn](https://www.linkedin.com/in/douglas-campos-66157b337/)
