import { useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// For debugging
console.log('ParticlesBackground module loaded');

const ParticlesBackground = () => {
  useEffect(() => {
    console.log('ParticlesBackground mounted');
    // initialize tsParticles engine with the slim bundle once
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).catch((err) => {
      console.error('initParticlesEngine error:', err);
    });
  }, []);

  return (
    <Particles
      id="tsparticles"
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
              width: 1000,
              height: 800
            }
          },
          color: {
            value: ["rgba(0, 255, 123, 0.5)", "rgba(103, 178, 111, 0.3)"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: { min: 0.4, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.3,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 1,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out"
            }
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble"
            },
            onClick: {
              enable: true,
              mode: "push"
            },
            resize: {
              enable: true
            }
          },
          modes: {
            bubble: {
              distance: 150,
              size: 8,
              duration: 2,
              opacity: 0.8
            },
            push: {
              quantity: 4
            }
          }
        },
        detectRetina: true,
        background: {
          color: "transparent"
        }
      })}
    />
  );
};

export default ParticlesBackground; 