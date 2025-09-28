import React, { useEffect } from 'react';
import ExteriorPainting from './ExteriorPainting';

const PowerWashing = () => {
  useEffect(() => {
    document.title = 'Power Washing | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Professional power washing for homes and businesses. Clean, prep, and restore with The Painter Guys Pros.'
    );
  }, []);

  // Reuse the ExteriorPainting component for a consistent look-and-feel
  return (
    <ExteriorPainting
      heroTitle="Power Washing & Surface Prep"
      heroSubtitle="Clean, prep, and restore your property’s surfaces for a flawless finish."
      heroImageSrc="/assets/powerwash-and-surfaceprep.png"
    />
  );
};

export default PowerWashing;