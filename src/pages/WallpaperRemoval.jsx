import React, { useEffect } from 'react';
import InteriorPainting from './InteriorPainting';

const WallpaperRemoval = () => {
  useEffect(() => {
    document.title = 'Wallpaper Removal | The Painter Guys Pros';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Wallpaper removal and wall prep by The Painter Guys Pros. Smooth, paint-ready surfaces guaranteed.'
    );
  }, []);

  return (
    <InteriorPainting
      heroTitle="Wallpaper Removal"
      heroSubtitle="Remove old wallpaper and prep your walls for a flawless new finish."
      heroImageSrc="/assets/wallpainting.png"
      galleryService="interior"
      galleryCategory="Wallpaper Removal"
    />
  );
};

export default WallpaperRemoval;