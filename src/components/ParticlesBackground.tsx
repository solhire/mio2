import { useCallback, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    console.log('ParticlesBackground mounted');
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="fixed inset-0 -z-10"
      options={{
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
              value_area: 800
            }
          },
          color: {
            value: ["rgba(247, 147, 26, 0.5)", "rgba(255, 255, 255, 0.2)"]
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
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
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
              speed: 3
            },
            push: {
              particles_nb: 4
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
      }}
    />
  );
};

export default ParticlesBackground; 