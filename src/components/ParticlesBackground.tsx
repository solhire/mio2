import { useCallback, useEffect } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

// For debugging
console.log('ParticlesBackground module loaded');

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log('ParticlesBackground init called');
    try {
      await loadSlim(engine);
      console.log('ParticlesBackground loadSlim completed');
    } catch (error) {
      console.error('ParticlesBackground init error:', error);
    }
  }, []);

  useEffect(() => {
    console.log('ParticlesBackground mounted');
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="fixed inset-0 -z-10"
      options={({
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800
            }
          },
          color: {
            value: ["rgba(0, 255, 123, 0.5)", "rgba(103, 178, 111, 0.3)"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 0.3,
              opacity_min: 0.4,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              size_min: 1,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: true,
            straight: false,
            outMode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 150,
              size: 8,
              duration: 2,
              opacity: 0.8,
              speed: 3,
              color: "rgba(0, 255, 123, 0.8)"
            },
            push: {
              count: 4
            }
          }
        },
        retina_detect: true,
        backgroundMask: {
          enable: false
        },
        background: {
          color: "transparent"
        },
        detectRetina: true
      } as any)}
    />
  );
};

export default ParticlesBackground; 