import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import sneakerBone from "@/assets/sneaker-bone.png";
import sneakerOnyx from "@/assets/sneaker-onyx.png";
import sneakerSage from "@/assets/sneaker-sage.png";
import sneakerClay from "@/assets/sneaker-clay.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AETHER — Performance, Refined" },
      {
        name: "description",
        content:
          "AETHER 01: a luxury performance sneaker engineered in four signature colorways. Discover the silhouette redefining premium sportswear.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

const COLORS = [
  { id: "bone", name: "Bone", hex: "#EFEAE2", img: sneakerBone },
  { id: "onyx", name: "Onyx", hex: "#1A1A1A", img: sneakerOnyx },
  { id: "sage", name: "Sage", hex: "#B6BFA8", img: sneakerSage },
  { id: "clay", name: "Clay", hex: "#C98A6B", img: sneakerClay },
];

function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const slides = Array.from(stage.querySelectorAll<HTMLElement>(".slide"));
    const dots = Array.from(document.querySelectorAll<HTMLElement>(".swatch"));
    const labelEl = document.querySelector<HTMLElement>(".color-label");
    const counterEl = document.querySelector<HTMLElement>(".counter-current");

    let current = 0;
    let dragging = false;
    let startX = 0;
    let deltaX = 0;
    let rotation = 0;
    let rotationStart = 0;

    const apply = (i: number, animated = true) => {
      current = (i + COLORS.length) % COLORS.length;
      indexRef.current = current;
      slides.forEach((s, idx) => {
        s.classList.toggle("is-active", idx === current);
      });
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === current));
      if (labelEl) labelEl.textContent = COLORS[current].name.toUpperCase();
      if (counterEl) counterEl.textContent = String(current + 1).padStart(2, "0");
      if (animated) {
        rotation = 0;
        slides[current].style.setProperty("--rot", "0deg");
      }
    };

    // Idle gentle float rotation
    let raf = 0;
    let t0 = performance.now();
    const tick = (now: number) => {
      const dt = (now - t0) / 1000;
      t0 = now;
      if (!dragging) {
        rotation += dt * 18; // 18 deg/sec - slow cinematic spin
        const active = slides[current];
        if (active) active.style.setProperty("--rot", `${rotation}deg`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      deltaX = 0;
      rotationStart = rotation;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      // While dragging, allow manual spin
      rotation = rotationStart + deltaX * 0.6;
      const active = slides[current];
      if (active) active.style.setProperty("--rot", `${rotation}deg`);
      // Parallax color preview
      stage.style.setProperty("--drag", String(deltaX));
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.releasePointerCapture(e.pointerId);
      stage.classList.remove("is-dragging");
      stage.style.setProperty("--drag", "0");
      const threshold = 80;
      if (deltaX < -threshold) apply(current + 1);
      else if (deltaX > threshold) apply(current - 1);
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    dots.forEach((d, idx) => d.addEventListener("click", () => apply(idx)));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") apply(current + 1);
      if (e.key === "ArrowLeft") apply(current - 1);
    };
    window.addEventListener("keydown", onKey);

    apply(0, false);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <style>{css}</style>

      <div className="page">
        <header className="nav">
          <a href="#" className="brand">AETHER</a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#">Shop</a>
            <a href="#">Collection</a>
            <a href="#">Journal</a>
            <a href="#">Stockists</a>
          </nav>
          <div className="nav-meta">
            <a href="#">Account</a>
            <a href="#">Bag · 0</a>
          </div>
        </header>

        <main className="hero">
          <div className="hero-grid">
            <aside className="hero-left">
              <span className="eyebrow">Series 01 — Spring Edition</span>
              <h1 className="headline">
                Engineered<br/>
                for stillness<br/>
                <em>and motion.</em>
              </h1>
              <p className="lede">
                The AETHER 01 is our quietest performance silhouette — hand-finished
                in Italy, weighted to disappear, designed to outlast the season.
              </p>
              <a className="cta" href="#">
                <span>Discover the silhouette</span>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
                  <path d="M0 5h20M16 1l4 4-4 4" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </a>
            </aside>

            <section className="hero-stage-wrap" aria-label="Featured product">
              <div className="stage-frame">
                <div className="stage-bg" aria-hidden="true">
                  <div className="halo" />
                  <div className="ring" />
                  <span className="vmark vmark-tl">N° 01</span>
                  <span className="vmark vmark-br">AE / 2026</span>
                </div>

                <div ref={stageRef} className="stage" role="region" aria-roledescription="carousel">
                  {COLORS.map((c, idx) => (
                    <figure
                      key={c.id}
                      className={"slide" + (idx === 0 ? " is-active" : "")}
                      style={{ ["--rot" as string]: "0deg" } as React.CSSProperties}
                    >
                      <img
                        src={c.img}
                        alt={`AETHER 01 in ${c.name}`}
                        draggable={false}
                        loading={idx === 0 ? "eager" : "lazy"}
                        width={1280}
                        height={1280}
                      />
                    </figure>
                  ))}
                  <div className="reflection" aria-hidden="true" />
                </div>
              </div>

              <div className="stage-foot">
                <div className="foot-left">
                  <span className="counter"><span className="counter-current">01</span><span className="counter-total">/0{COLORS.length}</span></span>
                  <span className="color-label">BONE</span>
                </div>
                <div className="swatches" role="tablist" aria-label="Colorways">
                  {COLORS.map((c, idx) => (
                    <button
                      key={c.id}
                      className={"swatch" + (idx === 0 ? " is-active" : "")}
                      style={{ ["--c" as string]: c.hex } as React.CSSProperties}
                      aria-label={c.name}
                    />
                  ))}
                </div>
                <div className="foot-right">
                  <span className="hint">Drag · Swipe · ←/→</span>
                </div>
              </div>
            </section>
          </div>

          <div className="hero-baseline">
            <span>AETHER 01 — Lightweight Performance Trainer</span>
            <span>€ 320</span>
            <span>Limited release · 480 pairs</span>
          </div>
        </main>

        <section className="strip">
          <div><strong>0.18 kg</strong><span>per shoe</span></div>
          <div><strong>Italian</strong><span>hand finishing</span></div>
          <div><strong>Carbon-light</strong><span>midsole plate</span></div>
          <div><strong>Made to last</strong><span>5 year guarantee</span></div>
        </section>

        <footer className="footer">
          <span>© 2026 AETHER ATELIER</span>
          <span>Milan · Tokyo · New York</span>
          <span>Privacy · Terms</span>
        </footer>
      </div>
    </>
  );
}

const css = `
:root {
  --bg: #fbfaf7;
  --ink: #111111;
  --ink-soft: #5a5a55;
  --line: rgba(17,17,17,0.08);
  --panel: #f1ede5;
  --panel-2: #e8e2d6;
  --serif: 'Cormorant Garamond', 'Times New Roman', serif;
  --sans: 'Inter', system-ui, -apple-system, 'Helvetica Neue', sans-serif;
}
.page { background: var(--bg); color: var(--ink); font-family: var(--sans); min-height: 100vh; overflow-x: hidden; }
.page * { box-sizing: border-box; }

/* NAV */
.nav { position: fixed; inset: 0 0 auto 0; z-index: 50; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding: 22px 40px; backdrop-filter: blur(8px); background: rgba(251,250,247,0.6); }
.brand { font-family: var(--serif); font-size: 20px; letter-spacing: 0.32em; font-weight: 500; color: var(--ink); text-decoration: none; }
.nav-links { display: flex; gap: 38px; justify-content: center; }
.nav-links a, .nav-meta a { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink); text-decoration: none;
  position: relative; transition: opacity .3s; }
.nav-links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px; background: var(--ink);
  transform: scaleX(0); transform-origin: right; transition: transform .5s cubic-bezier(.7,0,.2,1); }
.nav-links a:hover::after { transform: scaleX(1); transform-origin: left; }
.nav-meta { display: flex; gap: 26px; justify-content: flex-end; }

/* HERO */
.hero { min-height: 100vh; padding: 110px 40px 40px; display: flex; flex-direction: column; }
.hero-grid { flex: 1; display: grid; grid-template-columns: minmax(280px, 0.85fr) 1.6fr; gap: 60px; align-items: center; }

.hero-left { animation: rise 1.1s cubic-bezier(.2,.8,.2,1) both; }
.eyebrow { font-size: 10.5px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-soft); display: inline-block; margin-bottom: 28px; }
.headline { font-family: var(--serif); font-weight: 400; font-size: clamp(40px, 5.4vw, 78px);
  line-height: 0.98; letter-spacing: -0.01em; margin: 0 0 28px; }
.headline em { font-style: italic; color: var(--ink-soft); }
.lede { max-width: 360px; font-size: 14.5px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 36px; font-weight: 300; }
.cta { display: inline-flex; align-items: center; gap: 14px; font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase;
  color: var(--ink); text-decoration: none; padding: 4px 0; border-bottom: 1px solid var(--ink); transition: gap .4s ease; }
.cta:hover { gap: 22px; }
.cta svg { transition: transform .4s ease; }
.cta:hover svg { transform: translateX(4px); }

/* STAGE */
.hero-stage-wrap { display: flex; flex-direction: column; gap: 28px; animation: fadeUp 1.3s .2s cubic-bezier(.2,.8,.2,1) both; }
.stage-frame { position: relative; aspect-ratio: 16 / 11; border-radius: 4px; overflow: hidden; isolation: isolate;
  background: linear-gradient(165deg, #f4f0e8 0%, #ece6da 60%, #e2dccd 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,.9) inset,
    0 60px 80px -60px rgba(60,40,20,.18),
    0 1px 2px rgba(0,0,0,.04);
}
.stage-bg { position: absolute; inset: 0; }
.halo { position: absolute; left: 50%; top: 52%; width: 70%; aspect-ratio: 1; transform: translate(-50%,-50%);
  background: radial-gradient(circle at 50% 45%, rgba(255,255,255,.95), rgba(255,255,255,0) 62%);
  filter: blur(2px); }
.ring { position: absolute; left: 50%; top: 54%; width: 58%; aspect-ratio: 1; transform: translate(-50%,-50%);
  border: 1px solid rgba(0,0,0,0.06); border-radius: 50%; }
.ring::after { content: ''; position: absolute; inset: 8%; border: 1px dashed rgba(0,0,0,0.05); border-radius: 50%; }
.vmark { position: absolute; font-size: 10px; letter-spacing: 0.32em; color: rgba(0,0,0,0.35); text-transform: uppercase; }
.vmark-tl { top: 22px; left: 26px; }
.vmark-br { bottom: 22px; right: 26px; }

.stage { position: absolute; inset: 0; touch-action: pan-y; cursor: grab; user-select: none; }
.stage.is-dragging { cursor: grabbing; }
.slide { position: absolute; inset: 0; margin: 0; display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: scale(.96); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
.slide.is-active { opacity: 1; transform: scale(1); pointer-events: auto; }
.slide img { width: 78%; max-width: 760px; height: auto; object-fit: contain;
  transform: rotate(var(--rot, 0deg));
  filter: drop-shadow(0 30px 30px rgba(60,40,20,.22)) drop-shadow(0 6px 8px rgba(0,0,0,.08));
  transition: transform .15s linear;
  will-change: transform;
}
.reflection { position: absolute; left: 8%; right: 8%; bottom: 6%; height: 18px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,.18), rgba(0,0,0,0) 70%);
  filter: blur(4px); pointer-events: none; }

/* FOOT */
.stage-foot { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; }
.foot-left { display: flex; align-items: center; gap: 18px; }
.counter { font-size: 10px; letter-spacing: 0.28em; color: var(--ink-soft); }
.counter-current { color: var(--ink); }
.color-label { font-family: var(--serif); font-style: italic; font-size: 18px; color: var(--ink); transition: opacity .3s; }
.swatches { display: flex; gap: 14px; justify-content: center; }
.swatch { width: 28px; height: 28px; border-radius: 50%; background: var(--c); border: 1px solid rgba(0,0,0,0.08);
  cursor: pointer; padding: 0; position: relative; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
.swatch::after { content: ''; position: absolute; inset: -6px; border: 1px solid var(--ink); border-radius: 50%;
  opacity: 0; transform: scale(.8); transition: all .4s cubic-bezier(.2,.8,.2,1); }
.swatch:hover { transform: scale(1.08); }
.swatch.is-active::after { opacity: 1; transform: scale(1); }
.foot-right { text-align: right; }
.hint { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--ink-soft); }

/* BASELINE */
.hero-baseline { display: flex; justify-content: space-between; gap: 24px; padding-top: 36px; margin-top: 28px;
  border-top: 1px solid var(--line); font-size: 10.5px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-soft); }

/* STRIP */
.strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; padding: 0 40px; background: var(--line); border-block: 1px solid var(--line); }
.strip > div { background: var(--bg); padding: 56px 24px; display: flex; flex-direction: column; gap: 8px; }
.strip strong { font-family: var(--serif); font-weight: 400; font-size: 32px; letter-spacing: -0.01em; }
.strip span { font-size: 10.5px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-soft); }

/* FOOTER */
.footer { display: flex; justify-content: space-between; padding: 40px; font-size: 10.5px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ink-soft); }

/* ANIMATIONS */
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

/* RESPONSIVE */
@media (max-width: 1100px) {
  .hero-grid { grid-template-columns: 1fr; gap: 30px; }
  .hero { padding-top: 100px; }
  .hero-left { order: 2; text-align: center; }
  .hero-left .lede { margin-left: auto; margin-right: auto; }
  .hero-stage-wrap { order: 1; }
}
@media (max-width: 760px) {
  .nav { grid-template-columns: 1fr 1fr; padding: 18px 22px; }
  .nav-links { display: none; }
  .nav-meta { gap: 18px; }
  .hero { padding: 90px 22px 30px; }
  .stage-frame { aspect-ratio: 4 / 5; }
  .slide img { width: 86%; }
  .vmark-tl, .vmark-br { font-size: 9px; }
  .hero-baseline { flex-direction: column; gap: 8px; text-align: left; }
  .strip { grid-template-columns: 1fr 1fr; padding: 0 22px; }
  .strip > div { padding: 36px 16px; }
  .strip strong { font-size: 24px; }
  .footer { padding: 30px 22px; flex-direction: column; gap: 8px; }
  .stage-foot { grid-template-columns: 1fr; text-align: center; }
  .foot-left, .foot-right { justify-content: center; text-align: center; }
  .foot-left { justify-content: center; }
}
@media (min-width: 1600px) {
  .hero { padding: 130px 80px 60px; }
  .nav { padding: 28px 80px; }
  .strip { padding: 0 80px; }
  .footer { padding: 50px 80px; }
}
`;
