/* ===== shared-bg.js =====
 * Injects top menu, draws a static grid, and aligns a content wrapper
 * to the left/right edges under Home & Photography menu items.
 */
(function () {
  // Inject shared CSS (menu, hero, base)
  const css = `
    :root{ --cmu-red:#C41230; --ink:#000; --grid:#DBD5D5; }
    *{ box-sizing:border-box }
    html,body{ margin:0; padding:0; height:100%; width:100%;
               background:#fff; font-family:'Ubuntu Mono', monospace; color:var(--ink); }

    /* fixed, click-through grid behind everything */
    #grid{ position:fixed; inset:0; z-index:0; display:block; pointer-events:none; }

    /* top menu */
    .menu{ position:sticky; top:0; display:flex; justify-content:center; gap:250px;
           padding:22px 16px 18px; background:transparent; z-index:2; font-size:1.3rem; }
    .menu a{ color:var(--ink); text-decoration:none; transition:color .2s ease; }
    .menu a:hover{ color:var(--cmu-red); }
    .menu .active{ color:var(--cmu-red); font-weight:700; }

    /* hero (you can override per page) */
    .page-hero{ position:absolute; top:65px; left:47%; transform:translateX(-50%);
                text-align:center; z-index:2; }
    .page-hero h1{ margin:0 0 6px; font-size:2.8rem; font-weight:700; }
    .caret{ display:inline-block; width:5px; height:1.1em; background:var(--ink);
            margin-left:4px; animation:blink 1s step-start infinite; vertical-align:text-bottom; }
    @keyframes blink{ 50%{opacity:0} }

    @media (max-width:900px){ .menu{ gap:48px; } }
  `;
  if (!document.getElementById("shared-bg-css")) {
    const style = document.createElement("style");
    style.id = "shared-bg-css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectMenu(active = "") {
    let nav = document.querySelector("nav.menu");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "menu";
      nav.innerHTML = `
        <a id="nav-home" href="index.html">Home</a>
        <a id="nav-about" href="about.html">About</a>
        <a id="nav-resume" href="resume/Vaibhav_Parekh_Resume.pdf" target="_blank">Resume</a>
        <a id="nav-projects" href="projects.html">Projects</a>
        <a id="nav-photography" href="photography.html">Photography</a>
      `;
      document.body.prepend(nav);
    }
    if (active) {
      const id = `nav-${active}`;
      const el = document.getElementById(id);
      if (el) {
        document.querySelectorAll(".menu a").forEach(a => a.classList.remove("active"));
        el.classList.add("active");
      }
    }
  }

  function drawStaticGrid({ gridCols = 100, color = "#DBD5D5" } = {}) {
    let canvas = document.getElementById("grid");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "grid";
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cellSize = canvas.width / gridCols;
    const gridRows = Math.floor(canvas.height / cellSize);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i=0; i<=gridCols; i++) {
      const x = i * cellSize;
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
    }
    for (let j=0; j<=gridRows; j++) {
      const y = j * cellSize;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
    }
  }

  // Align any wrapper (e.g., '.projects-wrap', '.photos-wrap') to menu edges
  function alignWrapperToMenu(selector) {
    const wrap = document.querySelector(selector);
    const home = document.querySelector('#nav-home');
    const photo = document.querySelector('#nav-photography');
    if (!wrap || !home || !photo) return;

    const rectHome  = home.getBoundingClientRect();
    const rectPhoto = photo.getBoundingClientRect();
    const leftPad  = Math.max(0, rectHome.left + window.scrollX);
    const rightPad = Math.max(0, (window.innerWidth - rectPhoto.right) + window.scrollX);
    wrap.style.paddingLeft  = Math.round(leftPad)  + 'px';
    wrap.style.paddingRight = Math.round(rightPad) + 'px';
  }

  window.sharedBG = { injectMenu, drawStaticGrid, alignWrapperToMenu };
})();