"use client";

import { useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
	useEffect(() => {
		initParticlesEngine(async (engine: Engine) => {
			await loadFull(engine);
		});
	}, []);

	const options: ISourceOptions = {
		fullScreen: {
			enable: false,
			zIndex: -1,
		},
		detectRetina: true,
		fpsLimit: 60,
		background: {
			color: "transparent",
		},
		particles: {
			number: {
				value: 60,
				density: { enable: true, width: 800, height: 800 },
			},
			color: { value: "#ffffff" },
			shape: { type: "circle" },
			opacity: {
				value: { min: 0.15, max: 0.3 },
				animation: { enable: false },
			},
			size: {
				value: { min: 1, max: 3 },
				animation: { enable: false },
			},
			links: {
				enable: true,
				distance: 150,
				opacity: 0.2,
				width: 1,
				color: "#ffffff",
			},
			move: {
				enable: true,
				speed: 1.2,
				direction: "none",
				random: true,
				straight: false,
				outModes: "out",
				attract: {
					enable: false,
					rotate: { x: 600, y: 1200 },
				},
			},
		},
		interactivity: {
			detectsOn: "window",
			events: {
				onHover: { enable: true, mode: "repulse" },
				onClick: { enable: false, mode: "push" },
					resize: { enable: true },
			},
			modes: {
				repulse: { distance: 100, duration: 0.4 },
				push: { quantity: 2 },
			},
		},
	};

	return (
		<Particles
			id="tsparticles"
			options={options}
			className="fixed inset-0 -z-10"
		/>
	);
}