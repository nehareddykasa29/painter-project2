import React, { useEffect } from 'react';
import ExteriorPainting from './ExteriorPainting';

const StuccoRepair = () => {
  useEffect(() => {
    document.title = 'Stucco Repair and Painting | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Expert stucco repair and painting for homes and businesses. Restore and beautify with The Painter Guys Pros.'
    );
  }, []);

  return (
    <ExteriorPainting
      heroTitle="Stucco Repair & Painting"
      heroSubtitle="Restore, repair, and refresh your stucco surfaces for lasting beauty and protection."
      heroImageSrc="/assets/staircasecleanandpaint.png"
    />
  );
};

export default StuccoRepair;