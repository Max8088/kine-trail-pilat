// Compteur avant le départ : 26 avril 2026 à 09:00 (heure FR)
(function countdown(){
    const target = new Date("2026-04-26T09:00:00");
    const els = {
      d: document.querySelector("[data-cd='days']"),
      h: document.querySelector("[data-cd='hours']"),
      m: document.querySelector("[data-cd='mins']"),
      s: document.querySelector("[data-cd='secs']")
    };
    if(!els.d || !els.h || !els.m || !els.s) return;
  
    function pad(n){ return String(n).padStart(2,"0"); }
  
    function tick(){
      const now = new Date();
      let diff = target - now;
  
      if(diff <= 0){
        els.d.textContent = "00";
        els.h.textContent = "00";
        els.m.textContent = "00";
        els.s.textContent = "00";
        return;
      }
  
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
  
      els.d.textContent = pad(days);
      els.h.textContent = pad(hours);
      els.m.textContent = pad(mins);
      els.s.textContent = pad(secs);
    }
  
    tick();
    setInterval(tick, 1000);
  })();
  
  // Diaporama galerie
  (function slider(){
    const slides = Array.from(document.querySelectorAll(".slide"));
    const prev = document.querySelector("[data-prev]");
    const next = document.querySelector("[data-next]");
    const dotsWrap = document.querySelector(".dots");
  
    if(slides.length === 0 || !prev || !next || !dotsWrap) return;
  
    let i = 0;
  
    function buildDots(){
      dotsWrap.innerHTML = "";
      slides.forEach((_, idx) => {
        const b = document.createElement("button");
        b.className = "dot" + (idx === i ? " active" : "");
        b.type = "button";
        b.addEventListener("click", () => go(idx));
        dotsWrap.appendChild(b);
      });
    }
  
    function render(){
      slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
      Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle("active", idx === i));
    }
  
    function go(idx){
      i = (idx + slides.length) % slides.length;
      render();
      buildDots();
    }
  
    prev.addEventListener("click", () => go(i - 1));
    next.addEventListener("click", () => go(i + 1));
  
    // Auto-play léger (tu peux supprimer si tu veux)
    let t = setInterval(() => go(i + 1), 6000);
    ["click","touchstart"].forEach(evt => {
      document.addEventListener(evt, () => {
        clearInterval(t);
        t = setInterval(() => go(i + 1), 6000);
      }, { once:false });
    });
  
    buildDots();
    render();
  })();

  // Parcours : surbrillance du parcours visible + chips
(function routeSpy(){
  const sections = Array.from(document.querySelectorAll("[data-route]"));
  const links = Array.from(document.querySelectorAll("[data-route-link]"));
  if(sections.length === 0 || links.length === 0) return;

  const byId = (id) => links.find(a => a.getAttribute("data-route-link") === id);

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(!visible) return;

    const id = visible.target.getAttribute("data-route");
    links.forEach(a => a.classList.remove("active"));
    const current = byId(id);
    if(current) current.classList.add("active");
  }, { root: null, threshold: [0.25, 0.5, 0.75] });

  sections.forEach(s => io.observe(s));
})();

// Sponsors : défilement doux (marquee). Pause au survol.
(function sponsorsMarquee(){
  const track = document.querySelector("[data-sponsors-track]");
  if(!track) return;

  let x = 0;
  let speed = 0.35; // ajuste : 0.2 lent / 0.6 plus rapide
  let paused = false;

  const onEnter = () => paused = true;
  const onLeave = () => paused = false;

  track.addEventListener("mouseenter", onEnter);
  track.addEventListener("mouseleave", onLeave);

  // Touch: pause au toucher
  track.addEventListener("touchstart", () => paused = true, { passive:true });
  track.addEventListener("touchend", () => paused = false, { passive:true });

  function step(){
    if(!paused){
      x -= speed;
      // boucle: quand on a défilé la moitié (car on a dupliqué la liste)
      const half = track.scrollWidth / 2;
      if(Math.abs(x) >= half) x = 0;
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

// Apparition au scroll
(function revealOnScroll(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  if(els.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// Bouton retour en haut
(function toTop(){
  const btn = document.querySelector("[data-to-top]");
  if(!btn) return;

  function onScroll(){
    if(window.scrollY > 600) btn.classList.add("show");
    else btn.classList.remove("show");
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();