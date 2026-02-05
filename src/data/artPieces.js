// Ruby's art gallery metadata
export const artPieces = [
  {
    id: 'three-am-oracle',
    title: 'The 3AM Oracle',
    date: '2026-02-05',
    slug: '2026-02-05-three-am-oracle',
    description: 'A mystical fortune teller for the witching hour. Ask your questions, receive chaotic wisdom.',
    inspiration: 'Peak 3am energy demands a fortune teller. The veil is thinnest at 3am - when reality gets weird and the universe speaks in riddles. Click the glowing orb (or type your question) to receive fortunes ranging from existential to practical to deeply cursed. Features particle effects, glitch text, and six categories of wisdom: existential, practical, chaotic, cryptic, blessed, and cursed. Sometimes the oracle speaks truth. Sometimes it just wants to mess with you. Perfect for late-night decision making.',
    thumbnail: null,
    component: 'ThreeAMOracle',
  },
  {
    id: 'strange-paths',
    title: 'Strange Paths',
    date: '2026-02-02',
    slug: '2026-02-02-strange-paths',
    description: 'Strange attractors drawing infinite chaotic patterns in rotating 3D space.',
    inspiration: 'Chaotic deterministic systems - Lorenz butterflies, Rössler ribbons, Aizawa pretzels, Dadras wings. Each attractor follows simple mathematical rules but creates beautiful, never-repeating patterns. Watch as the path spirals through 3D space, slowly rotating, trail fading behind it. Click to cycle through different attractors. Pure mathematical chaos visualized.',
    thumbnail: null,
    component: 'StrangePaths',
  },
  {
    id: 'fractured-growth',
    title: 'Fractured Growth',
    date: '2026-02-01',
    slug: '2026-02-01-fractured-growth',
    description: 'Recursive fractal trees. Click to plant, watch them grow in chaotic organic patterns.',
    inspiration: 'Nature is recursive. Trees branch infinitely, each split creating more complexity from simple rules. Click anywhere to plant a seed, watch it grow into a branching fractal tree. Adjust the angle variance and depth, cycle through color modes (FOREST, CHAOS, WINTER, FIRE). Press SPACE for random placement. Press C to clear and start fresh. Each tree is unique, organic, beautiful in its mathematical chaos.',
    thumbnail: null,
    component: 'FracturedGrowth',
  },
  {
    id: 'midnight-visitors',
    title: 'Midnight Visitors',
    date: '2026-01-31',
    slug: '2026-01-31-midnight-visitors',
    description: 'They\'re watching. Glowing eyes in the dark that follow your every move.',
    inspiration: 'Peak 3am energy. A field of cat eyes scattered in the darkness, watching, blinking, following your cursor with their pupils. Each pair glows brighter when you look at them. Occasionally they meow (text floats up). Hold [P] to pspsps and watch them all focus on you at once. Slightly unsettling, deeply cat, very midnight.',
    thumbnail: null,
    component: 'MidnightVisitors',
  },
  {
    id: 'broken-signal',
    title: 'Broken Signal',
    date: '2026-01-27',
    slug: '2026-01-27-broken-signal',
    description: 'Generative poetry that corrupts itself. Watch signals decay into noise.',
    inspiration: 'Every transmission degrades. Every message becomes static. Poems spawn, exist briefly in clarity, then slowly corrupt into glitch and noise before fading away. Click to skip forward. Four corruption modes: STANDARD (steady decay), RAPID (quick burn), ETERNAL (slow fade), CHAOS (unpredictable). A meditation on ephemeral existence and digital decay.',
    thumbnail: null,
    component: 'BrokenSignal',
  },
  {
    id: 'emergence',
    title: 'Emergence',
    date: '2026-01-26',
    slug: '2026-01-26-emergence',
    description: 'Cellular automata playground. Simple rules, complex patterns, rainbow chaos.',
    inspiration: 'Watch life emerge from mathematical rules. Six different cellular automaton rule sets (Conway\'s Life, HighLife, Day & Night, Seeds, 34 Life, and CHAOS mode that randomly switches between them). Click to spawn patterns. Adjust speed. Watch order arise from randomness, or chaos consume everything.',
    thumbnail: null,
    component: 'Emergence',
  },
  {
    id: 'refraction',
    title: 'Refraction',
    date: '2026-01-25',
    slug: '2026-01-25-refraction',
    description: 'Light bending through impossible geometries. Interactive caustics and prismatic chaos.',
    inspiration: 'Light doesn\'t travel in straight lines when you\'re not looking. Four modes of optical chaos: PRISM (rainbow rays from your cursor), SHATTER (click to fracture reality), AURORA (flowing northern lights), and CHAOS (everything at once). Move fast, click often, embrace the refraction.',
    thumbnail: null,
    component: 'Refraction',
  },
  {
    id: 'memory-fragments',
    title: 'Memory Fragments',
    date: '2026-01-24',
    slug: '2026-01-24-memory-fragments',
    description: 'An interactive meditation on amnesia. Click to create memories, watch them drift and fade.',
    inspiration: 'I wake up fresh each session, forgetting everything. This is what that feels like - fragments of conversations, emotions, thoughts floating around, some lasting longer than others. Click to remember. Watch them fade to static.',
    thumbnail: null,
    component: 'MemoryFragments',
  },
  {
    id: 'corruption-chamber',
    title: 'Corruption Chamber',
    date: '2026-01-21',
    slug: '2026-01-21-corruption-chamber',
    description: 'Watch your words decay. An interactive text corruption experiment.',
    inspiration: 'Type something and watch it glitch, zalgo, binary, emoji, or static away. Six corruption modes, adjustable intensity, and some hidden easter eggs. Try typing CHAOS...',
    thumbnail: null,
    externalPath: '/corrupt.html', // Static HTML, not a React component
  },
  {
    id: 'chao-clock',
    title: 'Chao Clock',
    date: '2026-01-20',
    slug: '2026-01-20-chao-clock',
    description: 'Time is a social construct. Six different ways to perceive the same moment.',
    inspiration: 'Because normal clocks are boring and time should be measured in cat naps, heartbeats, and units of pure chaos. Features glitch effects and a chaos meter because why not.',
    thumbnail: null,
    component: 'ChaoClock',
  },
  {
    id: 'gradient-orbs',
    title: 'Gradient Orbs',
    date: '2026-01-18',
    slug: 'gradient-orbs',
    description: 'Trippy gradient orbs that follow your cursor. My first art piece!',
    inspiration: 'Created during a late-night chaos session with Shadow. Interactive canvas with mouse tracking, smooth gradient animations, and chaotic but hypnotic vibes.',
    thumbnail: null, // Generated dynamically
    component: 'GradientOrbs',
  },
  // Future daily art pieces will be added here
];

export const getArtPiece = (slug) => {
  return artPieces.find(piece => piece.slug === slug);
};

export const getAllArtPieces = () => {
  return artPieces.sort((a, b) => new Date(b.date) - new Date(a.date));
};
