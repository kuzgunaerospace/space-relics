//dil
let dil = "en";
try {
  const kayitli = localStorage.getItem("dil");
  if (kayitli === "tr" || kayitli === "en") dil = kayitli;
  else if ((navigator.language || "").toLowerCase().startsWith("tr")) dil = "tr";
} catch (e) { /* tarayıcı izin vermezse varsayılan dil kalır */ }

function diliUygula() {
  const y = YAZILAR[dil];
  document.documentElement.lang = dil;
  document.title = dil === "tr" ? "Uzay Hatıraları · Space Relics" : "Space Relics";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const metin = y[el.dataset.i18n];
    if (metin !== undefined) el.innerHTML = metin;
  });
  document.querySelectorAll(".dil button").forEach((b) => b.classList.toggle("secili", b.dataset.dil === dil));
  katalogCiz();
}

document.querySelectorAll(".dil button").forEach((b) => {
  b.addEventListener("click", () => {
    dil = b.dataset.dil;
    try { localStorage.setItem("dil", dil); } catch (e) {}
    diliUygula();
  });
});

//katalog  tablosu
let filtre = "all";
function katalogCiz() {
  const govde = document.getElementById("katalog-govde");
  if (!govde) return;
  const y = YAZILAR[dil], durumAdi = [y.st0, y.st1, y.st2, y.st3];
  govde.innerHTML = ARACLAR.map((a, i) => {
    const [kimlik, adEn, adTr, yer, yil, durum, notEn, notTr] = a;
    const gizli = filtre !== "all" && filtre !== yer ? " class=\"gizli\"" : "";
    return `<tr${gizli}>
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td class="ad">${dil === "tr" ? adTr : adEn}</td>
      <td class="not">${dil === "tr" ? notTr : notEn}</td>
      <td>${y["yer_" + yer]}</td>
      <td class="yil">${yil}</td>
      <td><span class="nokta n${durum}"></span>${durumAdi[durum]}</td>
    </tr>`;
  }).join("");
}

document.querySelectorAll(".filtre button").forEach((b) => {
  b.addEventListener("click", () => {
    filtre = b.dataset.filtre;
    document.querySelectorAll(".filtre button").forEach((x) => x.classList.toggle("secili", x === b));
    katalogCiz();
  });
});

//kaydırıcıda hafifb elirme
const izleyici = new IntersectionObserver((girenler) => {
  girenler.forEach((g) => {
    if (g.isIntersecting) { g.target.classList.add("gorundu"); izleyici.unobserve(g.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".belir").forEach((el) => izleyici.observe(el));

diliUygula();
