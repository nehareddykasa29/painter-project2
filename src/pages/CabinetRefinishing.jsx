import React, { useEffect } from 'react';
import InteriorPainting from './InteriorPainting';

const CabinetRefinishing = () => {
  useEffect(() => {
    document.title = 'Cabinet Refinishing & Repainting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Cabinet refinishing and repainting by The Painter Guys Pros. Modernize your kitchen or bath with flawless finishes.'
    );
  }, []);

  return (
    <InteriorPainting
      heroTitle="Cabinet Refinishing & Repainting"
      heroSubtitle="Modernize your kitchen or bath with flawless cabinet refinishing and repainting."
      heroImageSrc="/assets/kitchencabinets.png"
    />
  );
};

export default CabinetRefinishing;