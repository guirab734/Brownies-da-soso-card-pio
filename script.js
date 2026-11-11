const reais = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------------- filtros do cardápio ---------------- */

const grade = document.querySelector("[data-grade]");
const filtros = document.querySelectorAll(".filtro");

filtros.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtros.forEach((b) => b.classList.toggle("ativo", b === botao));
    const alvo = botao.dataset.filtro;

    grade.querySelectorAll(".peca").forEach((peca) => {
      const mostra = alvo === "tudo" || peca.dataset.cat === alvo;
      peca.style.display = mostra ? "" : "none";
    });
  });
});

/* ---------------- caixa de pedido ---------------- */

const CHAVE = "soso:caixa";
const lista = document.querySelector("[data-lista]");
const contador = document.querySelector("[data-qtd]");
const total = document.querySelector("[data-total]");
const toast = document.querySelector("[data-toast]");

let caixa = carregar();

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return [];
  }
}

function guardar() {
  localStorage.setItem(CHAVE, JSON.stringify(caixa));
}

let tempoToast;
function avisar(texto) {
  toast.textContent = texto;
  toast.classList.add("aparece");
  clearTimeout(tempoToast);
  tempoToast = setTimeout(() => toast.classList.remove("aparece"), 2200);
}

function desenhar() {
  lista.innerHTML = "";

  if (!caixa.length) {
    lista.innerHTML = '<li class="caixa-vazia">Nada escolhido ainda.</li>';
    contador.textContent = "vazia";
    total.textContent = reais(0);
    return;
  }

  caixa.forEach((item, i) => {
    const li = document.createElement("li");

    const nome = document.createElement("span");
    nome.innerHTML = `<b class="item-qtd">${item.qtd}×</b> ${item.nome}`;

    const fim = document.createElement("span");
    fim.style.display = "flex";
    fim.style.gap = "0.7rem";
    fim.style.alignItems = "center";

    const valor = document.createElement("span");
    valor.textContent = reais(item.preco * item.qtd);

    const tirar = document.createElement("button");
    tirar.type = "button";
    tirar.textContent = "×";
    tirar.setAttribute("aria-label", `Remover ${item.nome}`);
    tirar.addEventListener("click", () => {
      if (caixa[i].qtd > 1) caixa[i].qtd -= 1;
      else caixa.splice(i, 1);
      guardar();
      desenhar();
    });

    fim.append(valor, tirar);
    li.append(nome, fim);
    lista.append(li);
  });

  const pecas = caixa.reduce((s, i) => s + i.qtd, 0);
  contador.textContent = pecas === 1 ? "1 item" : `${pecas} itens`;
  total.textContent = reais(caixa.reduce((s, i) => s + i.preco * i.qtd, 0));
}

document.querySelectorAll(".add").forEach((botao) => {
  botao.addEventListener("click", () => {
    const peca = botao.closest(".peca");
    const nome = peca.dataset.nome;
    const preco = Number(peca.dataset.preco);

    const existente = caixa.find((i) => i.nome === nome);
    if (existente) existente.qtd += 1;
    else caixa.push({ nome, preco, qtd: 1 });

    guardar();
    desenhar();
    avisar(`${nome} na caixa`);
  });
});

desenhar();

/* ---------------- números que contam ao aparecer ---------------- */

const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-conta]").forEach((el) => {
  const destino = Number(el.dataset.conta);

  if (parado) {
    el.textContent = destino;
    return;
  }

  const observador = new IntersectionObserver(
    ([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();

      const duracao = 1200;
      const inicio = performance.now();

      const passo = (agora) => {
        const t = Math.min((agora - inicio) / duracao, 1);
        el.textContent = Math.round(destino * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(passo);
      };

      requestAnimationFrame(passo);
    },
    { threshold: 0.6 },
  );

  observador.observe(el);
});

/* ---------------- formulário ---------------- */

const form = document.querySelector("[data-form]");
const aviso = document.querySelector("[data-aviso]");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = new FormData(form);
  const nome = (dados.get("nome") || "").toString().trim();
  const data = dados.get("data");
  const fone = (dados.get("fone") || "").toString().trim();

  if (!nome || !data || !fone) {
    aviso.dataset.erro = "";
    aviso.textContent = "Preencha nome, data e WhatsApp para a gente responder.";
    return;
  }

  if (!caixa.length) {
    aviso.dataset.erro = "";
    aviso.textContent = "Escolha ao menos um item no cardápio antes de fechar.";
    return;
  }

  delete aviso.dataset.erro;
  const pecas = caixa.reduce((s, i) => s + i.qtd, 0);
  const soma = caixa.reduce((s, i) => s + i.preco * i.qtd, 0);
  aviso.textContent = `Resumo pronto, ${nome.split(" ")[0]}: ${pecas} ${
    pecas === 1 ? "item" : "itens"
  }, ${reais(soma)}. É só enviar pelo WhatsApp.`;
  avisar("Resumo montado");
});

/* ---------------- topo que reage ao scroll ---------------- */

const topo = document.querySelector(".topo");
let ultimo = 0;

addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    topo.style.transform = y > 400 && y > ultimo ? "translateY(-100%)" : "translateY(0)";
    topo.style.transition = "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
    ultimo = y;
  },
  { passive: true },
);

document.querySelector("[data-ano]").textContent = new Date().getFullYear();
