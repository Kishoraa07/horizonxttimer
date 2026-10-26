import React, { useRef, useEffect } from 'react';

/**
 * Cosmic Starfield & Meteor Shower Canvas (Optimized for Pristine White Background)
 * Renders twinkling celestial stars, glowing HorizonXT 4-point sparks, 
 * and shooting stars with amber & cyan tails.
 */
const SakuraField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Star color palette matching HorizonXT branding on White Background:
    // Amber Gold (#F59E0B), Deep Space Navy (#0B1B3D), Electric Cyan (#00A3C4)
    const starColors = [
      'rgba(245, 158, 11, 0.85)',   // Horizon Amber Gold
      'rgba(11, 27, 61, 0.70)',     // Horizon Deep Navy
      'rgba(0, 163, 196, 0.80)',    // Horizon Cyan
      'rgba(2, 132, 199, 0.75)',    // Celestial Blue
      'rgba(217, 119, 6, 0.85)',    // Warm Amber Star
      'rgba(79, 70, 229, 0.65)',    // Indigo Point
    ];

    // --- 1. TWINKLING STARS & 4-POINT SPARKS ---
    class CosmicStar {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.size = Math.random() * 2.2 + 0.9;
        this.color = starColors[Math.floor(Math.random() * starColors.length)];
        
        // Twinkle properties
        this.baseAlpha = Math.random() * 0.4 + 0.35;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkleAngle = Math.random() * Math.PI * 2;

        // Slow drift
        this.speedY = Math.random() * 0.25 + 0.05;
        this.speedX = (Math.random() - 0.5) * 0.15;

        // 16% chance of being a prominent HorizonXT 4-point star sparkle
        this.isFourPointStar = Math.random() < 0.16;
        if (this.isFourPointStar) {
          this.size = Math.random() * 5 + 4;
        }
      }

      update() {
        this.twinkleAngle += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleAngle) * 0.35;
        this.alpha = Math.max(0.15, Math.min(0.95, this.alpha));

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.alpha;

        if (this.isFourPointStar) {
          // Draw iconic HorizonXT 4-point star
          const s = this.size;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();

          // Center spark dot
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        } else {
          // Normal circular star
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // --- 2. SHOOTING STARS / METEORS ---
    class Meteor {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width + 200;
        this.y = -50 - Math.random() * 150;
        this.length = Math.random() * 140 + 90;
        this.speed = Math.random() * 12 + 8;
        this.thickness = Math.random() * 2 + 1.2;
        this.angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2;
        this.active = false;
        this.delay = Math.floor(Math.random() * 320) + 90;
        this.age = 0;
      }

      update() {
        if (!this.active) {
          this.delay--;
          if (this.delay <= 0) {
            this.active = true;
          }
          return;
        }

        this.x -= Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.age++;

        if (this.x < -200 || this.y > height + 200 || this.age > 100) {
          this.reset();
        }
      }

      draw() {
        if (!this.active) return;

        const tailX = this.x + Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.95)');
        grad.addColorStop(0.3, 'rgba(0, 163, 196, 0.7)');
        grad.addColorStop(0.7, 'rgba(11, 27, 61, 0.25)');
        grad.addColorStop(1, 'rgba(11, 27, 61, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing head of the meteor
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.thickness * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f59e0b';
        ctx.fill();

        ctx.restore();
      }
    }

    const starCount = Math.min(80, Math.floor(window.innerWidth / 20));
    const stars = Array.from({ length: starCount }, () => new CosmicStar());
    const meteors = [new Meteor(), new Meteor(), new Meteor()];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }

      for (let j = 0; j < meteors.length; j++) {
        meteors[j].update();
        meteors[j].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};

export default SakuraField;
