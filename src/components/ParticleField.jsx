import React, { useRef, useEffect } from 'react';

/**
 * Cosmic Stardust & Space Dust Particle Field
 * Weightless microgravity particles with Horizon Amber Gold and Electric Cyan glints
 */
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let particles = [];
    // Space theme colors on white background: Horizon Navy, Cyan, and Amber Gold
    const colors = [
      'rgba(11, 27, 61, 0.65)',    // Horizon Deep Navy
      'rgba(245, 158, 11, 0.80)',  // Horizon Gold
      'rgba(0, 163, 196, 0.75)',   // Horizon Cyan
      'rgba(2, 132, 199, 0.65)',   // Celestial Sky Blue
      'rgba(217, 119, 6, 0.75)',   // Amber Star Spark
      'rgba(100, 116, 139, 0.45)', // Floating Stardust
    ];
    
    let mouse = { x: -1000, y: -1000 };
    let scrollY = window.scrollY;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    class Particle {
      constructor() {
        this.reset(true);
      }
      
      reset(initial = false) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20 - Math.random() * 50;
        this.size = Math.random() * 3 + 1.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.isGlow = Math.random() > 0.35;
        
        // Cosmic floating speed
        this.speedY = this.isGlow ? -(Math.random() * 0.8 + 0.2) : Math.random() * 0.9 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.8;
        
        if (this.isGlow && initial) {
          this.y = Math.random() * height;
        }

        // Weightless drift
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      }
      
      update() {
        const height = window.innerHeight;
        const width = window.innerWidth;

        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.6 + this.speedX;
        this.rotation += this.rotationSpeed;
        
        // Gentle gravitational displacement near cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 4;
          this.y += (dy / dist) * force * 2.5;
        }
        
        // Boundary wrap
        if (this.isGlow) {
          if (this.y < -30 || this.x < -30 || this.x > width + 30) this.reset();
        } else {
          if (this.y > height + 30 || this.x < -30 || this.x > width + 30) this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.isGlow) {
          // Radiant glowing cosmic point
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = this.color;
          ctx.fill();
        } else {
          // Micro stardust crystal
          ctx.rotate(this.rotation);
          ctx.beginPath();
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        
        ctx.restore();
      }
    }
    
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle());
    }
    
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ParticleField;
