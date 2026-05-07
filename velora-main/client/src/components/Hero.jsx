// src/components/Hero.jsx
import heroImage from "../assets/hero/hero.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <img src={heroImage} alt="Velora Luxury" />
      <div className="hero-overlay">
        <div className="hero-divider"></div>
        <h1>VELORA</h1>
        <div className="hero-divider"></div>
        <p>Obsidian Luxury • Cinematic Beauty • Ritual Skincare</p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '2rem', padding: '12px 40px', fontSize: '0.9rem' }}
          onClick={() => window.location.href = '/women'}
        >
          Explore Collection
        </button>
      </div>
    </section>
  );
};

export default Hero;