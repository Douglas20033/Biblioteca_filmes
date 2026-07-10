/* ===================== CONFIG TMDB ===================== */
// Cole sua API Key (v3 auth) da TMDB aqui dentro das aspas:
const API_KEY = '261f550b677bef003e798a1075e6a2a1';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL       = 'https://image.tmdb.org/t/p/w500'; // pôsteres grandes (catálogo, carrossel)
const IMG_URL_SMALL = 'https://image.tmdb.org/t/p/w92';  // thumbs pequenas (sidebars)
const POSTER_PLACEHOLDER = 'https://via.placeholder.com/400x500/1f1f1f/888?text=Sem+Capa';

/* ===================== HELPER DE REQUISIÇÃO ===================== */
async function buscarTMDB(endpoint, params = {}) {
    const url = new URL(BASE_URL + endpoint);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', 'pt-BR');
    Object.entries(params).forEach(([chave, valor]) => url.searchParams.set(chave, valor));

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar dados da TMDB (verifique a API Key).');
    return res.json();
}

/* transforma um item da TMDB (filme ou série) no formato usado pelos cards */
function mapItem(item) {
    const titulo  = item.title || item.name || 'Sem título';
    const dataLanc = item.release_date || item.first_air_date || '';
    // media_type vem pronto no /trending; nos outros endpoints inferimos pela presença de "title" (filme) ou "name" (série)
    const tipo = item.media_type || (item.title ? 'movie' : 'tv');
    return {
        id:     item.id,
        tipo,
        titulo,
        img:    item.poster_path ? IMG_URL + item.poster_path       : POSTER_PLACEHOLDER,
        imgPeq: item.poster_path ? IMG_URL_SMALL + item.poster_path : POSTER_PLACEHOLDER,
        nota:   item.vote_average ? item.vote_average.toFixed(1) : '—',
        ano:    dataLanc ? dataLanc.slice(0, 4) : '—'
    };
}

/* ===================== FUNÇÕES QUE GERAM O HTML ===================== */
function montarCatalogo(lista) {
    const container = document.getElementById("grade-catalogo");
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="sem-resultado">Nenhum resultado encontrado.</p>';
        return;
    }

    container.innerHTML = lista.map(f => `
        <article data-id="${f.id}" data-tipo="${f.tipo}">
            <img src="${f.img}" alt="${f.titulo}" loading="lazy">
            <h3>${f.titulo}</h3>
        </article>
    `).join("");
    ativarCliqueDetalhes(container);
}

function montarCarrossel(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = lista.map(f => `
        <article data-id="${f.id}" data-tipo="${f.tipo}">
            <img src="${f.img}" alt="${f.titulo}" loading="lazy">
            <h3>${f.titulo}</h3>
        </article>
    `).join("");
    ativarCliqueDetalhes(container);
}

function montarSidebar(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = lista.map(f => `
        <div class="item-popular" data-id="${f.id}" data-tipo="${f.tipo}">
            <img src="${f.imgPeq}" alt="${f.titulo}" loading="lazy">
            <div class="item-info">
                <h4>${f.titulo}</h4>
                <div class="item-meta">
                    <span class="nota">⭐ ${f.nota}</span>
                    <span>${f.ano}</span>
                </div>
            </div>
        </div>
    `).join("");
    ativarCliqueDetalhes(container);
}

/* ===================== MODAL DE DETALHES ===================== */
function ativarCliqueDetalhes(container) {
    container.querySelectorAll('[data-id]').forEach(el => {
        el.addEventListener('click', () => abrirModal(el.dataset.id, el.dataset.tipo));
    });
}

function criarModal() {
    if (document.getElementById('modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <button class="modal-fechar" id="modal-fechar" aria-label="Fechar">&times;</button>
            <div class="modal-corpo">
                <img class="modal-poster" id="modal-poster" src="" alt="">
                <div class="modal-info">
                    <h2 id="modal-titulo"></h2>
                    <div class="modal-meta" id="modal-meta"></div>
                    <div class="modal-generos" id="modal-generos"></div>
                    <p class="modal-sinopse" id="modal-sinopse"></p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('modal-fechar').addEventListener('click', fecharModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });
}

function fecharModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('aberto');
}

async function abrirModal(id, tipo) {
    criarModal();
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('aberto');

    document.getElementById('modal-titulo').textContent = 'Carregando...';
    document.getElementById('modal-poster').src = POSTER_PLACEHOLDER;
    document.getElementById('modal-meta').innerHTML = '';
    document.getElementById('modal-generos').innerHTML = '';
    document.getElementById('modal-sinopse').textContent = '';

    try {
        const endpoint = tipo === 'tv' ? `/tv/${id}` : `/movie/${id}`;
        const d = await buscarTMDB(endpoint);

        const titulo   = d.title || d.name || 'Sem título';
        const dataLanc = d.release_date || d.first_air_date || '';
        const ano      = dataLanc ? dataLanc.slice(0, 4) : '—';
        const duracao  = tipo === 'tv'
            ? (d.number_of_seasons ? `${d.number_of_seasons} temporada${d.number_of_seasons > 1 ? 's' : ''}` : '—')
            : (d.runtime ? `${d.runtime} min` : '—');

        document.getElementById('modal-poster').src = d.poster_path ? IMG_URL + d.poster_path : POSTER_PLACEHOLDER;
        document.getElementById('modal-poster').alt = titulo;
        document.getElementById('modal-titulo').textContent = titulo;
        document.getElementById('modal-meta').innerHTML = `
            <span class="nota">⭐ ${d.vote_average ? d.vote_average.toFixed(1) : '—'}</span>
            <span>${ano}</span>
            <span>${duracao}</span>
        `;
        document.getElementById('modal-generos').innerHTML = (d.genres || [])
            .map(g => `<span class="genero-tag">${g.name}</span>`).join('');
        document.getElementById('modal-sinopse').textContent = d.overview || 'Sinopse não disponível.';

    } catch (err) {
        console.error(err);
        document.getElementById('modal-titulo').textContent = 'Erro ao carregar detalhes.';
        document.getElementById('modal-sinopse').textContent = err.message;
    }
}

/* qual endpoint usar, conforme a página */
function carregarListaDaPagina() {
    const pagina = document.body.dataset.pagina;
    if (pagina === "filmes")      return buscarTMDB('/movie/popular').then(d => d.results.map(mapItem));
    if (pagina === "series")      return buscarTMDB('/tv/popular').then(d => d.results.map(mapItem));
    if (pagina === "lancamentos") return buscarTMDB('/movie/now_playing', { region: 'BR' }).then(d => d.results.map(mapItem));
    return buscarTMDB('/trending/all/week').then(d => d.results.map(mapItem)); // catálogo da home
}

/* sidebars "Mais Populares" e "Recomendados" — cada página busca só o tipo de conteúdo dela */
async function carregarSidebars() {
    const pagina = document.body.dataset.pagina;

    if (pagina === "series") {
        const [populares, recomendados] = await Promise.all([
            buscarTMDB('/tv/popular').then(d => d.results.map(mapItem)),
            buscarTMDB('/tv/top_rated').then(d => d.results.map(mapItem))
        ]);
        return { populares, recomendados };
    }

    if (pagina === "lancamentos") {
        const [populares, recomendados] = await Promise.all([
            buscarTMDB('/movie/now_playing', { region: 'BR' }).then(d => d.results.map(mapItem)),
            buscarTMDB('/movie/upcoming',    { region: 'BR' }).then(d => d.results.map(mapItem))
        ]);
        return { populares, recomendados };
    }

    // filmes e home
    const [populares, recomendados] = await Promise.all([
        buscarTMDB('/movie/popular').then(d => d.results.map(mapItem)),
        buscarTMDB('/movie/top_rated').then(d => d.results.map(mapItem))
    ]);
    return { populares, recomendados };
}

/* ===================== CARROSSEL INFINITO (animação manual) ===================== */
function ativarCarrossel() {
    const carrossel = document.getElementById("carrossel-destaques");
    const setaEsq   = document.getElementById("seta-esq");
    const setaDir   = document.getElementById("seta-dir");
    if (!carrossel || !carrossel.children.length) return;

    // duplica os cards pra dar continuidade ao loop
    carrossel.innerHTML += carrossel.innerHTML;

    let animando = false;

    function rolar(direcao) {
        if (animando) return;
        animando = true;

        const card = carrossel.querySelector("article");
        const gap = parseInt(getComputedStyle(carrossel).gap) || 15;
        const larguraCard = card.offsetWidth + gap;
        const cardsVisiveis = Math.max(Math.floor(carrossel.clientWidth / larguraCard), 1);
        const distancia = larguraCard * cardsVisiveis * direcao;

        const inicio = carrossel.scrollLeft;
        const duracao = 500;           // duração da animação (ms) — aumente pra deslize mais lento
        let tempoInicial = null;

        function passo(agora) {
            if (!tempoInicial) tempoInicial = agora;
            const decorrido = agora - tempoInicial;
            const progresso = Math.min(decorrido / duracao, 1);

            // suavização ease-out (rápido no começo, lento no fim)
            const suave = 1 - Math.pow(1 - progresso, 3);

            carrossel.scrollLeft = inicio + distancia * suave;

            if (progresso < 1) {
                requestAnimationFrame(passo);
            } else {
                // terminou a animação: reposiciona pro loop infinito
                const metade = carrossel.scrollWidth / 2;
                if (carrossel.scrollLeft >= metade) {
                    carrossel.scrollLeft -= metade;
                } else if (carrossel.scrollLeft < 10) {
                    carrossel.scrollLeft += metade;
                }
                animando = false;
            }
        }

        requestAnimationFrame(passo);
    }

    if (setaDir) setaDir.addEventListener("click", () => rolar(1));
    if (setaEsq) setaEsq.addEventListener("click", () => rolar(-1));
}

/* ===================== BUSCA ===================== */
let listaAtual = [];

function ativarBusca() {
    const campoBusca = document.getElementById("campo-busca");
    if (!campoBusca) return;

    campoBusca.addEventListener("input", () => {
        const termo = campoBusca.value.toLowerCase();
        const filtrados = listaAtual.filter(f =>
            f.titulo.toLowerCase().includes(termo)
        );
        montarCatalogo(filtrados);
    });
}

/* ===================== EXECUÇÃO ===================== */
async function iniciar() {
    const grade = document.getElementById("grade-catalogo");

    try {
        const [principal, sidebars] = await Promise.all([
            carregarListaDaPagina(),
            carregarSidebars()
        ]);

        listaAtual = principal;
        montarCatalogo(listaAtual);
        montarSidebar(sidebars.populares.slice(0, 5), "sidebar-populares");
        montarSidebar(sidebars.recomendados.slice(0, 5), "sidebar-recomendados");

        if (document.getElementById("carrossel-destaques")) {
            const destaquesRaw = await buscarTMDB('/trending/all/week');
            const destaques = destaquesRaw.results.map(mapItem).slice(0, 10);
            montarCarrossel(destaques, "carrossel-destaques");
            ativarCarrossel();
        }

        ativarBusca();

    } catch (err) {
        console.error(err);
        if (grade) {
            grade.innerHTML = '<p class="sem-resultado">Não foi possível carregar o catálogo. Verifique se a API Key da TMDB foi configurada corretamente em javascript.js.</p>';
        }
    }
}

iniciar();
