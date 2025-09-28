import React, { useEffect } from 'react';
import ExteriorPainting from './ExteriorPainting';

const DeckFence = () => {
  useEffect(() => {
    document.title = 'Deck & Fence Services | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Deck and fence painting, staining, and restoration by The Painter Guys Pros. Protect and beautify your outdoor spaces.'
    );
  }, []);

  return (
    <ExteriorPainting
      heroTitle="Deck & Fence Services"
      heroSubtitle="Stain, seal, and protect your deck and fence for years of beauty and durability."
      heroImageSrc="/assets/deck-and-fence-finishing.png"
    />
  );
};

export default DeckFence;