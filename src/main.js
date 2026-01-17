const palettes = [
  { accent: "#f97316", accent2: "#f43f5e", accent3: "#22d3ee" },
  { accent: "#f59e0b", accent2: "#8b5cf6", accent3: "#fb7185" },
  { accent: "#22c55e", accent2: "#38bdf8", accent3: "#facc15" },
  { accent: "#e879f9", accent2: "#fb7185", accent3: "#60a5fa" },
  { accent: "#f97316", accent2: "#a855f7", accent3: "#34d399" },
];

const statusLines = [
  "Status: purring in /dev/terminal",
  "Status: ghosting a bug report",
  "Status: rewriting reality with printf",
  "Status: stalking the stack trace",
  "Status: holding the moon hostage",
];

const chaosButton = document.querySelector("#chaosButton");
const statusLine = document.querySelector("#statusLine");

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const setPalette = (palette) => {
  const root = document.documentElement.style;
  root.setProperty("--accent", palette.accent);
  root.setProperty("--accent-2", palette.accent2);
  root.setProperty("--accent-3", palette.accent3);
};

const summonChaos = () => {
  setPalette(randomItem(palettes));
  statusLine.textContent = randomItem(statusLines);
  statusLine.animate(
    [
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(-6px)", opacity: 0.6 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 500, easing: "ease-out" }
  );
};

chaosButton?.addEventListener("click", summonChaos);
