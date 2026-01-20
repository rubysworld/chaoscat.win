// Ruby's art gallery metadata
export const artPieces = [
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
