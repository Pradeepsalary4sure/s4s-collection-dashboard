import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    hue: Math.random() > 0.5 ? 142 : 160,
  };
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const particlesRef = useRef([]);
  const blobsRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      // Reinitialize particles safely
      const count = Math.min(Math.floor((w * h) / 15000), 60);
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push(createParticle(w, h));
      }
      particlesRef.current = newParticles;

      // Blobs
      blobsRef.current = [
        { x: w * 0.2, y: h * 0.3, rx: w * 0.3, ry: h * 0.25, dx: 0.15, dy: 0.1, color1: "rgba(16, 185, 129,", color2: "rgba(5, 150, 105," },
        { x: w * 0.8, y: h * 0.7, rx: w * 0.25, ry: h * 0.35, dx: -0.1, dy: -0.08, color1: "rgba(59, 130, 246,", color2: "rgba(99, 102, 241," },
        { x: w * 0.5, y: h * 0.15, rx: w * 0.2, ry: h * 0.15, dx: 0.08, dy: 0.12, color1: "rgba(168, 85, 247,", color2: "rgba(236, 72, 153," },
      ];
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const isDark = theme === "dark";

      // Draw gradient blobs
      blobsRef.current.forEach((blob) => {
        blob.x += blob.dx;
        blob.y += blob.dy;

        if (blob.x < -blob.rx || blob.x > w + blob.rx) blob.dx *= -1;
        if (blob.y < -blob.ry || blob.y > h + blob.ry) blob.dy *= -1;

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, Math.max(blob.rx, blob.ry));
        gradient.addColorStop(0, `${blob.color1}${isDark ? "0.12" : "0.06"})`);
        gradient.addColorStop(0.5, `${blob.color2}${isDark ? "0.08" : "0.04"})`);
        gradient.addColorStop(1, `${blob.color1}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(blob.x, blob.y, blob.rx, blob.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating particles
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const opacity = isDark ? p.opacity * 0.8 : p.opacity * 0.4;
        ctx.fillStyle = `hsla(${p.hue}, 70%, ${isDark ? "60%" : "50%"}, ${opacity})`;
        ctx.fill();

        // Glow for dark mode
        if (isDark && p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${opacity * 0.15})`;
          ctx.fill();
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: theme === "dark" ? "#050b08" : "#f0faf4" }}
    />
  );
}
