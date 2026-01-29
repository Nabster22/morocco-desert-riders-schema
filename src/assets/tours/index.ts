// Tour images mapping
import saharaDesertTour from './sahara-desert-tour.jpg';
import aitBenhaddou from './ait-benhaddou.jpg';
import atlasMountains from './atlas-mountains.jpg';
import draaValley from './draa-valley.jpg';
import fesMedina from './fes-medina.jpg';
import luxuryGlamping from './luxury-glamping.jpg';
import grandMoroccoCircuit from './grand-morocco-circuit.jpg';
import marrakechFesTour from './marrakech-fes-tour.jpg';
import merzougaSunrise from './merzouga-sunrise.jpg';
import quadAdventure from './quad-adventure.jpg';
import roseValley from './rose-valley.jpg';
import todraGorge from './todra-gorge.jpg';
import dakhlaLagoon from './dakhla-lagoon.jpg';
import camelSunset from './camel-sunset.jpg';
import sandboarding from './sandboarding.jpg';
import stargazing from './stargazing.jpg';

// Map tour names/keywords to images
export const tourImageMap: Record<string, string> = {
  // By tour name keywords
  'sahara': saharaDesertTour,
  '3-day': saharaDesertTour,
  'ait benhaddou': aitBenhaddou,
  'ouarzazate': aitBenhaddou,
  'atlas': atlasMountains,
  'mountain': atlasMountains,
  'draa': draaValley,
  'valley': draaValley,
  'fes': fesMedina,
  'medina': fesMedina,
  'glamping': luxuryGlamping,
  'luxury': luxuryGlamping,
  'camp': luxuryGlamping,
  'grand': grandMoroccoCircuit,
  'circuit': grandMoroccoCircuit,
  'marrakech to fes': marrakechFesTour,
  'todra': todraGorge,
  'gorge': todraGorge,
  'merzouga': merzougaSunrise,
  'sunrise': merzougaSunrise,
  'quad': quadAdventure,
  'atv': quadAdventure,
  'rose': roseValley,
  'dakhla': dakhlaLagoon,
  'kitesurf': dakhlaLagoon,
  'lagoon': dakhlaLagoon,
  'camel': camelSunset,
  'trek': camelSunset,
  'sandboard': sandboarding,
  'sand board': sandboarding,
  'star': stargazing,
  'astronomy': stargazing,
  'night': stargazing,
};

// Category-based fallbacks
export const categoryImageMap: Record<string, string> = {
  'Desert Safari': saharaDesertTour,
  'Cultural Tours': fesMedina,
  'Adventure': quadAdventure,
  'Luxury': luxuryGlamping,
  'Water Sports': dakhlaLagoon,
};

// City-based fallbacks
export const cityImageMap: Record<string, string> = {
  'Marrakech': saharaDesertTour,
  'Fes': fesMedina,
  'Ouarzazate': aitBenhaddou,
  'Merzouga': merzougaSunrise,
  'Dakhla': dakhlaLagoon,
  'Zagora': draaValley,
};

// Default fallback images
export const defaultTourImages = [
  saharaDesertTour,
  camelSunset,
  luxuryGlamping,
  merzougaSunrise,
  atlasMountains,
];

/**
 * Get the best matching image for a tour based on its name, category, and city
 */
export function getTourImage(
  tourName: string,
  categoryName?: string,
  cityName?: string
): string {
  const nameLower = tourName.toLowerCase();
  
  // First, try to match by tour name keywords
  for (const [keyword, image] of Object.entries(tourImageMap)) {
    if (nameLower.includes(keyword)) {
      return image;
    }
  }
  
  // Then try category
  if (categoryName && categoryImageMap[categoryName]) {
    return categoryImageMap[categoryName];
  }
  
  // Then try city
  if (cityName && cityImageMap[cityName]) {
    return cityImageMap[cityName];
  }
  
  // Return a random default image
  return defaultTourImages[Math.floor(Math.random() * defaultTourImages.length)];
}

/**
 * Get multiple images for a tour gallery
 */
export function getTourGalleryImages(
  tourName: string,
  categoryName?: string,
  cityName?: string
): string[] {
  const mainImage = getTourImage(tourName, categoryName, cityName);
  
  // Return a set of images for the gallery
  const allImages = [
    saharaDesertTour,
    aitBenhaddou,
    atlasMountains,
    draaValley,
    fesMedina,
    luxuryGlamping,
    grandMoroccoCircuit,
    marrakechFesTour,
    merzougaSunrise,
    quadAdventure,
    roseValley,
    todraGorge,
    dakhlaLagoon,
    camelSunset,
    sandboarding,
    stargazing,
  ];
  
  // Start with the main image and add 4 more unique ones
  const gallery = [mainImage];
  const remaining = allImages.filter(img => img !== mainImage);
  
  for (let i = 0; i < 4 && i < remaining.length; i++) {
    gallery.push(remaining[i]);
  }
  
  return gallery;
}

export {
  saharaDesertTour,
  aitBenhaddou,
  atlasMountains,
  draaValley,
  fesMedina,
  luxuryGlamping,
  grandMoroccoCircuit,
  marrakechFesTour,
  merzougaSunrise,
  quadAdventure,
  roseValley,
  todraGorge,
  dakhlaLagoon,
  camelSunset,
  sandboarding,
  stargazing,
};
