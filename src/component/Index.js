import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import logo from "../assets/logo.png";

function Main() {
  const [active, setActive] = useState('home');
  const heroRef = useRef(null);
  useHeroSpotlight(heroRef);
 

  return (
    <div className="page">
      <header className="navbar">
        <img src={logo} alt="Logo" style={{height: "120px"}} />
        <nav className="menu">
          <a href="#home" className={active === 'home' ? 'active' : ''} onClick={() => setActive('home')}>Home</a>
          <a href="#about" className={active === 'about' ? 'active' : ''} onClick={() => setActive('about')}>About</a>
          <a href="#services" className={active === 'services' ? 'active' : ''} onClick={() => setActive('services')}>Services</a>
          <a href="#properties" className={active === 'properties' ? 'active' : ''} onClick={() => setActive('properties')}>Properties</a>
          <a href="#contact" className={active === 'contact' ? 'active' : ''} onClick={() => setActive('contact')}>Contact</a>
        </nav>
        <button className="inquiry-btn">Inquiry</button>
      </header>

      <main className="hero" ref={heroRef}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">NATIONWIDE REAL ESTATE AGENT MATCHING</p>
          <h1>Moving Anywhere?</h1>
          <h1 className="accent">Let’s Match You</h1>
          <h1>with the Top 1% of Agents Nationwide.</h1>
          <p className="hero-text">
            Whether you&apos;re buying your first home, selling a property, or
            investing in a new market, we handle the hard work for you.
          </p>

          <div className="hero-actions">
            <button className="primary">Find My Perfect Agent</button>
            <button className="secondary">Learn More</button>
          </div>
        </div>

        <div className="hero-frame" />

        <div className="search-card">
          <div className="search-item">
            <label>Property Type</label>
            <PillDropdown
              items={["All Property Types", "House", "Apartment", "Condo"]}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
                </svg>
              }
            />
          </div>
          <div className="search-item">
            <label>Location</label>
            <PillDropdown
              items={["All Locations", "Houston, TX", "West Columbia, TX", "Sweeny, TX", "Rosenberg, TX"]}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/>
                </svg>
              }
            />
          </div>
          <div className="search-item">
            <label>Monthly Rent</label>
            <PillDropdown
              items={["Any Price", "$500 - $1,000", "$1,000 - $2,000", "$2,000+"]}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 1v2c3.86 0 7 3.14 7 7s-3.14 7-7 7v2c4.97 0 9-4.03 9-9s-4.03-9-9-9zM11 6h2v6h-2z" fill="currentColor"/>
                </svg>
              }
            />
          </div>
          <button className="view-btn">View Properties</button>
        </div>
      </main>
    </div>
  );
}

export default Main;

function PillDropdown({ items = [], icon = null }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(items[0] || 'Select');
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="pill-dropdown" ref={ref}>
      <button type="button" className="pill-button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="pill-icon">{icon}</span>
        <span className="pill-label">{selected}</span>
        <span className="pill-chevron">▾</span>
      </button>
      {open && (
        <div className="pill-menu up">
          {items.map(it => (
            <div className={`pill-item ${it === selected ? 'selected' : ''}`} key={it} onClick={() => { setSelected(it); setOpen(false); }}>
              {it}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Cursor spotlight: update CSS variables on mouse move inside hero
function useHeroSpotlight(heroRef) {
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let frameId = 0;
    let nextX = -200;
    let nextY = -200;

    function updateSpotlight() {
      frameId = 0;
      el.style.setProperty('--mx', `${nextX}%`);
      el.style.setProperty('--my', `${nextY}%`);
    }

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      const x = point.clientX - rect.left;
      const y = point.clientY - rect.top;
      const xp = (x / rect.width) * 100;
      const yp = (y / rect.height) * 100;
      nextX = xp;
      nextY = yp;

      if (!frameId) {
        frameId = window.requestAnimationFrame(updateSpotlight);
      }
    }

    function onLeave() {
      nextX = -200;
      nextY = -200;

      if (!frameId) {
        frameId = window.requestAnimationFrame(updateSpotlight);
      }
    }

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('pointerdown', onMove, { passive: true });
    el.addEventListener('pointerup', onLeave, { passive: true });
    el.addEventListener('pointercancel', onLeave, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('pointerdown', onMove);
      el.removeEventListener('pointerup', onLeave);
      el.removeEventListener('pointercancel', onLeave);
    };
  }, [heroRef]);
}