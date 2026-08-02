import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { ThemeId, THEMES } from '../lib/theme';

interface AnimatedBackgroundProps {
  themeId?: ThemeId;
}

function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ themeId = 'indigo-modern' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeId] || THEMES['indigo-modern'];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // High density vibrant particle field
    const count = 350;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // High contrast vibrant colors based on theme
    const palette = theme.particleColors.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: theme.isDark ? 0.95 : 0.85,
      map: particleTexture,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Wireframe 3D shapes
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const wireMat1 = new THREE.MeshBasicMaterial({ color: theme.particleColors[0], wireframe: true, transparent: true, opacity: theme.isDark ? 0.35 : 0.25 });
    const wireMat2 = new THREE.MeshBasicMaterial({ color: theme.particleColors[1] || theme.particleColors[0], wireframe: true, transparent: true, opacity: theme.isDark ? 0.35 : 0.25 });
    const wireMat3 = new THREE.MeshBasicMaterial({ color: theme.particleColors[2] || theme.particleColors[0], wireframe: true, transparent: true, opacity: theme.isDark ? 0.3 : 0.22 });

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(5, 1), wireMat1);
    ico.position.set(-18, 10, -8);
    shapesGroup.add(ico);

    const torus = new THREE.Mesh(new THREE.TorusGeometry(6, 1.2, 12, 24), wireMat2);
    torus.position.set(18, -10, -10);
    shapesGroup.add(torus);

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), wireMat3);
    octa.position.set(16, 12, -8);
    shapesGroup.add(octa);

    // Mouse movement response
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      particles.rotation.y = elapsedTime * 0.04 + currentMouseX * 0.12;
      particles.rotation.x = elapsedTime * 0.02 + currentMouseY * 0.12;

      shapesGroup.rotation.y = elapsedTime * 0.02 + currentMouseX * 0.05;

      ico.rotation.x = elapsedTime * 0.25;
      ico.rotation.y = elapsedTime * 0.2;

      torus.rotation.x = elapsedTime * 0.18;
      torus.rotation.z = elapsedTime * 0.22;

      octa.rotation.y = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleTexture.dispose();
    };
  }, [themeId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft floating background gradient color blobs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -top-20 -left-20 w-[500px] h-[500px] ${theme.blobColors[0]} rounded-full blur-3xl`}
      />
      
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/3 -right-20 w-[450px] h-[450px] ${theme.blobColors[1]} rounded-full blur-3xl`}
      />

      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -40, 50, 0],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute -bottom-20 left-1/3 w-[550px] h-[550px] ${theme.blobColors[2]} rounded-full blur-3xl`}
      />

      {/* WebGL 3D Interactive Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

