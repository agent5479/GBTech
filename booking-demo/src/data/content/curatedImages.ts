import type { SiteImage } from './imageManifest';
import { imageManifest } from './imageManifest';

/** Filter out non-photo assets grabbed from page HTML. */
function isPhoto(img: SiteImage): boolean {
  const src = img.src.toLowerCase();
  return (
    !src.includes('favicon') &&
    !src.includes('site.css') &&
    !src.includes('static.css') &&
    !src.includes('.js') &&
    !src.includes('1759124179740') &&
    /\.(jpe?g|png|webp|gif)$/i.test(src)
  );
}

function uniqueByBasename(images: SiteImage[]): SiteImage[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    const base = img.src.replace(/^\d+-/, '').split('/').pop() ?? img.src;
    if (seen.has(base)) return false;
    seen.add(base);
    return true;
  });
}

export function curatedPageImages(page: keyof typeof imageManifest.pages): SiteImage[] {
  return uniqueByBasename((imageManifest.pages[page] ?? []).filter(isPhoto));
}

export const curatedImages = {
  logo: imageManifest.logo,
  home: {
    hero: '/images/home/02-SLC_gardens_02.png',
    kai: '/images/home/08-IMG_20240504_143922.jpg',
    courses: '/images/home/16-2O3A1101_1_.jpg',
    events: '/images/home/18-IMG_5163.jpeg',
    foodStall: '/images/home/14-IMG_20240504_104258.jpg',
  },
  events: {
    hero: '/images/events/07-20250322_164612_Original.jpeg',
    gallery: curatedPageImages('events').filter((i) => i.src.includes('2025')),
  },
  courses: {
    hero: '/images/courses/01-Short_Course-2.png',
    earthBuilding: '/images/courses/05-DSCN8341.JPG',
    permaculture: '/images/courses/09-Permaculutre_design_2.jpg',
    organic: '/images/courses/13-IMG-0567.jpg',
    fullCourse: '/images/courses/19-Sustainable_Living_Course.jpg',
    dayModules: '/images/courses/23-Field_Trip.jpg',
    tutors: {
      sol: '/images/courses/25-Sol.jpg',
      robina: '/images/courses/27-Robina.jpg',
      kerryn: '/images/courses/29-Kerryn.jpg',
      rita: '/images/courses/31-Rita.jpg',
    },
  },
  rentals: {
    workshop: curatedPageImages('rentals').find((i) => i.src.includes('Workshop') || i.src.includes('workshop'))?.src
      ?? curatedPageImages('rentals')[0]?.src,
    appleCrusher: curatedPageImages('rentals').find((i) => i.src.toLowerCase().includes('crusher'))?.src,
    applePress: curatedPageImages('rentals').find((i) => i.src.toLowerCase().includes('press'))?.src,
    juicer: curatedPageImages('rentals').find((i) => i.src.toLowerCase().includes('juicer'))?.src,
  },
  compost: curatedPageImages('compost'),
  kaiResilience: curatedPageImages('kaiResilience'),
  team: curatedPageImages('team'),
  about: curatedPageImages('about'),
  contact: {
    hero: '/images/contact/01-picking_food_garden.jpg',
  },
  sponsors: {
    healthPost: '/images/home/42-Health_Post_Logo.png',
    sollys: '/images/home/26-Sollys_Logo.png',
    tdc: '/images/home/24-Logo_TDC.png',
    trashPalace: '/images/home/40-Logo_Trash_Palace.png',
    msd: '/images/home/48-Logo_MSD.png',
    helpingHands: curatedPageImages('compost').find((i) => i.src.toLowerCase().includes('helping'))?.src,
  },
} as const;
