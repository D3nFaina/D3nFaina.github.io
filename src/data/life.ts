// CV timeline, interests and travels.

export const experience = [
  { when: '2024 – now', role: 'Advanced Postdoctoral Researcher', org: 'Institute of Applied Physics, University of Bern', detail: 'Group of Prof. Andrea Cannizzo' },
  { when: '2021 – 2024', role: 'Junior Postdoctoral Researcher', org: 'Elettra Sincrotrone Trieste', detail: 'With Dr. Filippo Bencivenga, FERMI free-electron laser' },
  { when: 'Research stay', role: 'Visiting researcher (2 months)', org: 'Massachusetts Institute of Technology', detail: 'Group of Prof. Keith A. Nelson, optical Faraday-rotation measurements' },
];

export const education = [
  { when: '2017 – 2020', role: 'PhD in Physics', org: 'University of Trieste & Elettra Sincrotrone Trieste', detail: 'Advisor: Dr. Claudio Masciovecchio' },
  { when: '2015 – 2017', role: 'MSc in Condensed Matter Physics', org: 'University of Trieste & Kyoto Institute of Technology', detail: 'Advisor: Prof. Fulvio Parmigiani' },
  { when: '2012 – 2015', role: 'BSc in Physics', org: 'University of Trieste', detail: 'Advisor: Prof. Fulvio Parmigiani' },
];

export const service = [
  'Member of COST Action CA22148 (nonlinear EUV to hard X-ray techniques) since its start',
  'Shift leader and lead data analyst, X-ray transient grating long-term proposal, European XFEL (FXE & MID)',
  'Coordinator of experimental campaigns at SACLA and LCLS',
  'Open-source analysis code shared with collaborators and students',
];

// Interests: replace with your own. `emoji` is optional.
export const interests = [
  { title: 'Mountains', emoji: '🏔️', text: 'Living in Bern means the Alps are a train ride away. Hiking, ski touring, and a lot of fondue afterwards.' },
  { title: 'Code', emoji: '💻', text: 'I enjoy building small tools: analysis pipelines, data viewers, and the occasional side project on GitHub.' },
  { title: 'Photography', emoji: '📷', text: 'Mostly landscapes from trips and beamtimes in places I would never have seen otherwise.' },
  { title: 'Food', emoji: '🍝', text: 'Italian by birth, so this one is not optional.' },
];

// Countries you have visited, spelled as in the world map data (e.g. 'United States of America').
// The Travels page counts them and shades them on the map.
export const countriesVisited = [
  'Italy', 'Switzerland', 'Japan', 'Germany', 'United States of America',
  'China', 'Spain', 'Morocco', 'Philippines', 'Vietnam', 'Portugal',
];

type Photo = { src: string; caption: string };

// Places on the map. kind: 'lived' | 'science' | 'travel'.
// Trips come from the folder names in Drive (Website_images/Travels); photos live in public/travels/.
export const places: { name: string; country: string; lat: number; lng: number; kind: 'lived' | 'science' | 'travel'; note: string; year?: string; photos?: Photo[] }[] = [
  { name: 'Trieste', country: 'Italy', lat: 45.65, lng: 13.78, kind: 'lived', note: 'Studies, PhD and FERMI', year: '2012 – 2024' },
  { name: 'Bern', country: 'Switzerland', lat: 46.95, lng: 7.45, kind: 'lived', note: 'University of Bern', year: '2024 – now' },
  { name: 'Kyoto', country: 'Japan', lat: 35.01, lng: 135.77, kind: 'lived', note: 'Master thesis at Kyoto Institute of Technology, and back in Japan in 2024, 2025 and 2026', year: '2017' },
  { name: 'Villigen', country: 'Switzerland', lat: 47.54, lng: 8.22, kind: 'science', note: 'SwissFEL, Paul Scherrer Institute' },
  { name: 'Hamburg', country: 'Germany', lat: 53.59, lng: 9.83, kind: 'science', note: 'European XFEL beamtimes' },
  { name: 'Harima', country: 'Japan', lat: 34.95, lng: 134.43, kind: 'science', note: 'SACLA beamtimes' },
  { name: 'Cambridge, MA', country: 'USA', lat: 42.36, lng: -71.09, kind: 'science', note: 'Research stays at MIT with Keith Nelson', year: '2022 · 2023' },
  { name: 'Menlo Park', country: 'USA', lat: 37.42, lng: -122.2, kind: 'science', note: 'LCLS at SLAC' },
  {
    name: 'Shanghai', country: 'China', lat: 31.23, lng: 121.47, kind: 'travel', note: 'Skyscrapers, classical gardens and water towns', year: '2019 · 2026',
    photos: [
      { src: '/travels/china-shanghai-bund.jpg', caption: 'Pudong from the Bund' },
      { src: '/travels/china-yu-garden.jpg', caption: 'Yu Garden' },
      { src: '/travels/china-water-town.jpg', caption: 'A water town near Shanghai' },
      { src: '/travels/china-pagoda.jpg', caption: 'Pagoda' },
      { src: '/travels/china-shanghai-tower.jpg', caption: 'Shanghai Tower at night' },
    ],
  },
  {
    name: 'Marrakech & the Atlas', country: 'Morocco', lat: 31.63, lng: -8.0, kind: 'travel', note: 'Gardens, kasbahs and the edge of the desert', year: '2019',
    photos: [
      { src: '/travels/morocco-ait-benhaddou.jpg', caption: 'Aït Benhaddou' },
      { src: '/travels/morocco-oasis.jpg', caption: 'Oasis valley' },
      { src: '/travels/morocco-majorelle.jpg', caption: 'Jardin Majorelle, Marrakech' },
      { src: '/travels/morocco-cedar.jpg', caption: 'Carved cedar' },
    ],
  },
  {
    name: 'California, Nevada & Utah', country: 'USA', lat: 36.17, lng: -115.14, kind: 'travel', note: 'A road trip through the American Southwest', year: '2019',
    photos: [
      { src: '/travels/usa-santa-monica.jpg', caption: 'Santa Monica Pier' },
      { src: '/travels/usa-grand-canyon.jpg', caption: 'Grand Canyon' },
      { src: '/travels/usa-las-vegas.jpg', caption: 'Las Vegas' },
    ],
  },
  {
    name: 'Madeira', country: 'Portugal', lat: 32.75, lng: -16.95, kind: 'travel', note: 'Levadas, cliffs and the wild north coast', year: '2026',
    photos: [
      { src: '/travels/madeira-north-coast.jpg', caption: 'The north coast' },
      { src: '/travels/madeira-seixal.jpg', caption: 'Black-pebble beach at Seixal' },
      { src: '/travels/madeira-bananas.jpg', caption: 'Bananas, of course' },
      { src: '/travels/madeira-bolo-do-caco.jpg', caption: 'Bolo do caco at the Risco waterfall' },
    ],
  },
  { name: 'Spain', country: 'Spain', lat: 40.42, lng: -3.7, kind: 'travel', note: 'Trip to Spain', year: '2023' },
  { name: 'Vietnam', country: 'Vietnam', lat: 16.05, lng: 108.2, kind: 'travel', note: 'Trip to Vietnam', year: '2024' },
  { name: 'Philippines', country: 'Philippines', lat: 11.5, lng: 123.0, kind: 'travel', note: 'Trip to the Philippines', year: '2025' },
];
