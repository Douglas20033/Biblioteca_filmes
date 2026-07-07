/* ===================== DADOS ===================== */

// Catálogo principal (grade do meio)
const catalogo = [
    { titulo: "Interestelar", img: "https://picsum.photos/400/500?random=1" },
    { titulo: "A Origem",     img: "https://picsum.photos/400/500?random=2" },
    { titulo: "Matrix",       img: "https://picsum.photos/400/500?random=3" },
    { titulo: "Duna",         img: "https://picsum.photos/400/500?random=4" },
    { titulo: "Coringa",      img: "https://picsum.photos/400/500?random=5" },
    { titulo: "Parasita",     img: "https://picsum.photos/400/500?random=6" }
];

// Faixa de destaques (carrossel)
const destaques = [
    { titulo: "Interestelar", img: "https://picsum.photos/300/450?random=10" },
    { titulo: "A Origem",     img: "https://picsum.photos/300/450?random=11" },
    { titulo: "Matrix",       img: "https://picsum.photos/300/450?random=12" },
    { titulo: "Coringa",      img: "https://picsum.photos/300/450?random=13" },
    { titulo: "Parasita",     img: "https://picsum.photos/300/450?random=14" },
    { titulo: "Pulp Fiction", img: "https://picsum.photos/300/450?random=15" },
    { titulo: "Whiplash",     img: "https://picsum.photos/300/450?random=16" },
    { titulo: "Duna",         img: "https://picsum.photos/300/450?random=17" }
];

// Sidebar esquerda (Mais Populares)
const maisPopulares = [
    { titulo: "Interestelar",      nota: 8.6, ano: 2014, img: "https://picsum.photos/50/70?random=101" },
    { titulo: "A Origem",          nota: 8.8, ano: 2010, img: "https://picsum.photos/50/70?random=102" },
    { titulo: "Matrix",            nota: 8.7, ano: 1999, img: "https://picsum.photos/50/70?random=103" },
    { titulo: "Clube da Luta",     nota: 8.8, ano: 1999, img: "https://picsum.photos/50/70?random=104" },
    { titulo: "O Poderoso Chefão", nota: 9.2, ano: 1972, img: "https://picsum.photos/50/70?random=105" }
];

// Sidebar direita (Recomendados)
const recomendados = [
    { titulo: "Pulp Fiction",   nota: 8.9, ano: 1994, img: "https://picsum.photos/50/70?random=201" },
    { titulo: "Cidade de Deus", nota: 8.6, ano: 2002, img: "https://picsum.photos/50/70?random=202" },
    { titulo: "Parasita",       nota: 8.5, ano: 2019, img: "https://picsum.photos/50/70?random=203" },
    { titulo: "Coringa",        nota: 8.4, ano: 2019, img: "https://picsum.photos/50/70?random=204" },
    { titulo: "Whiplash",       nota: 8.5, ano: 2014, img: "https://picsum.photos/50/70?random=205" }
];

/* ===================== FUNÇÕES QUE GERAM O HTML ===================== */

// Monta a grade do catálogo (também usada pela busca)
function montarCatalogo(lista) {
    const container = document.getElementById("grade-catalogo");
    if (!container) return;
    container.innerHTML = lista.map(f => `
        <article>
            <img src="${f.img}" alt="${f.titulo}">
            <h3>${f.titulo}</h3>
        </article>
    `).join("");
}

// Monta o carrossel de destaques
function montarCarrossel(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = lista.map(f => `
        <article>
            <img src="${f.img}" alt="${f.titulo}">
            <h3>${f.titulo}</h3>
        </article>
    `).join("");
}

// Monta uma sidebar
function montarSidebar(lista, id) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = lista.map(f => `
        <div class="item-popular">
            <img src="${f.img}" alt="${f.titulo}">
            <div class="item-info">
                <h4>${f.titulo}</h4>
                <div class="item-meta">
                    <span class="nota">⭐ ${f.nota}</span>
                    <span>${f.ano}</span>
                </div>
            </div>
        </div>
    `).join("");
}

/* ===================== EXECUÇÃO ===================== */

montarCatalogo(catalogo);
montarCarrossel(destaques, "carrossel-destaques");
montarSidebar(maisPopulares, "sidebar-populares");
montarSidebar(recomendados, "sidebar-recomendados");

/* ===================== BUSCA ===================== */

const campoBusca = document.getElementById("campo-busca");
if (campoBusca) {
    campoBusca.addEventListener("input", () => {
        const termo = campoBusca.value.toLowerCase();
        const filtrados = catalogo.filter(f =>
            f.titulo.toLowerCase().includes(termo)
        );
        montarCatalogo(filtrados);
    });
}