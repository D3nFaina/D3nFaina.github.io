// CV timeline, interests and travels.

export const experience = [
  { when: '2024 – now', role: 'Advanced Postdoctoral Researcher', org: 'Institute of Applied Physics, University of Bern', detail: 'Group of Prof. Andrea Cannizzo' },
  { when: '2021 – 2024', role: 'Junior Postdoctoral Researcher', org: 'Elettra Sincrotrone Trieste', detail: 'With Dr. Filippo Bencivenga, FERMI free-electron laser' },
  { when: 'Research stay', role: 'Visiting researcher (2 months)', org: 'Massachusetts Institute of Technology', detail: 'Group of Prof. Keith A. Nelson, optical Faraday-rotation measurements' },
];

export const education = [
  { when: '2017 – 2020', role: 'PhD in Physics', org: 'University of Trieste & Elettra Sincrotrone Trieste', detail: 'Advisor: Dr. Claudio Masciovecchio' },
  { when: '2015 – 2017', role: 'MSc in Condensed Matter Physics', org: 'University of Trieste & Kyoto Institute of Technology', detail: 'Advisor: Prof. Fulvio Parmigiani; host in Kyoto: Prof. Giuseppe Pezzotti' },
  { when: '2012 – 2015', role: 'BSc in Physics', org: 'University of Trieste', detail: 'Advisor: Prof. Fulvio Parmigiani' },
];

export const service = [
  '<a href="https://data.snf.ch/grants/grant/10007385">SNSF COST project 10007385</a> (CHF 398,800, 2026–2029) on deep- and extreme-UV four-wave mixing in carbonaceous nanomaterials, won together with Prof. Andrea Cannizzo',
  'Member of COST Action CA22148 (nonlinear EUV to hard X-ray techniques) since its start',
  'Shift leader and lead data analyst, X-ray transient grating long-term proposal, European XFEL (FXE & MID)',
  'Coordinator of experimental campaigns at SACLA and LCLS',
  'Open-source analysis code shared with collaborators and students',
];

// Interests: replace with your own. `emoji` is optional.
// `img` (in public/interests/) replaces the emoji with a picture.
export const interests: { title: string; emoji?: string; img?: string; text: string; link?: { href: string; label: string } }[] = [
  { title: 'Code', img: '/interests/code.jpg', text: 'I enjoy building small tools: analysis pipelines, data viewers, and the occasional side project on GitHub.' },
  { title: 'Photography', img: '/interests/photography.jpg', text: 'Mostly landscapes from trips and beamtimes in places I would never have seen otherwise.' },
  {
    title: 'Finance', img: '/interests/finance.jpg',
    text: 'Markets are another noisy time series, so I treat them like data: long-run returns, cycles and the odd backtest. My Bitcoin Cycle Planner turns a halving-cycle strategy into a concrete buy and exit plan, and comes with price history since 2011.',
    link: { href: 'https://github.com/D3nFaina/btc-cycle-planner', label: 'Bitcoin Cycle Planner on GitHub' },
  },
  { title: 'Food', img: '/interests/food.jpg', text: 'Italian by birth, so this one is not optional.' },
];

// Countries you have visited, spelled as in the world map data (e.g. 'United States of America').
// The Travels page counts them and shades them on the map.
export const countriesVisited = [
  'Italy', 'Switzerland', 'Japan', 'Germany', 'United States of America',
  'China', 'Spain', 'Morocco', 'Philippines', 'Vietnam', 'Portugal', 'United Arab Emirates',
];

// Trips and beamtimes still to come: shown in violet on the Travels map and in its Upcoming box.
// `country` uses the world map names; move an entry into `places` once it has happened.
export const upcoming: { name: string; country: string; lat: number; lng: number; when: string; kind: 'beamtime' | 'travel'; note: string; link?: string }[] = [
  { name: 'SACLA, Harima', country: 'Japan', lat: 34.95, lng: 134.43, when: 'February 2027', kind: 'beamtime', note: 'Hard-XFEL pump, UV probe: how ionized water and cysteine respond in the first 200 fs', link: '/notes/sacla-2027-cysteine/' },
  { name: 'Thailand', country: 'Thailand', lat: 13.75, lng: 100.5, when: 'March 2027', kind: 'travel', note: 'Holiday' },
  { name: 'PAL-XFEL, Pohang', country: 'South Korea', lat: 36.01, lng: 129.32, when: 'May 2027', kind: 'beamtime', note: 'Commissioning a dedicated X-ray transient grating chamber at the oxygen K edge', link: '/notes/pal-xfel-2027-xtg/' },
];

type Photo = { src: string; caption: string };

// Places on the map. kind: 'lived' | 'science' | 'travel'.
// Trips come from the folder names in Drive (Website_images/Travels). `album` names a set in photos.json
// (every photo of that trip, in public/travels/full and /thumb); `photos` are the captioned favourites.
export const places: { name: string; country: string; lat: number; lng: number; kind: 'lived' | 'science' | 'travel'; note: string; year?: string; album?: string; photos?: Photo[] }[] = [
  { name: 'Trieste', country: 'Italy', lat: 45.65, lng: 13.78, kind: 'lived', note: 'Studies, PhD and FERMI', year: '2012 – 2024' },
  { name: 'Bern', country: 'Switzerland', lat: 46.95, lng: 7.45, kind: 'lived', note: 'University of Bern', year: '2024 – now' },
  { name: 'Kyoto', country: 'Japan', lat: 35.01, lng: 135.77, kind: 'lived', note: 'Master thesis at Kyoto Institute of Technology, and back in Japan in 2024, 2025 and 2026', year: '2017' },
  { name: 'Villigen', country: 'Switzerland', lat: 47.54, lng: 8.22, kind: 'science', note: 'SwissFEL, Paul Scherrer Institute' },
  { name: 'Hamburg', country: 'Germany', lat: 53.59, lng: 9.83, kind: 'science', note: 'European XFEL beamtimes' },
  { name: 'Harima', country: 'Japan', lat: 34.95, lng: 134.43, kind: 'science', note: 'SACLA beamtimes' },
  { name: 'Cambridge, MA', country: 'USA', lat: 42.36, lng: -71.09, kind: 'science', note: 'Research stays at MIT with Keith Nelson', year: '2022 · 2023' },
  { name: 'Menlo Park', country: 'USA', lat: 37.42, lng: -122.2, kind: 'science', note: 'LCLS at SLAC' },
  {
    name: 'Shanghai', album: 'china-2019', country: 'China', lat: 31.23, lng: 121.47, kind: 'travel', note: 'Skyscrapers, classical gardens and water towns', year: '2019 · 2026',
    photos: [
      { src: '/travels/full/20190701_151331.jpg', caption: 'Pudong from the Bund' },
      { src: '/travels/full/20190704_144048.jpg', caption: 'Yu Garden' },
      { src: '/travels/full/20190706_135347.jpg', caption: 'A water town near Shanghai' },
      { src: '/travels/full/20190707_133535.jpg', caption: 'Pagoda' },
      { src: '/travels/full/20190704_200047.jpg', caption: 'Shanghai Tower at night' },
    ],
  },
  {
    name: 'Marrakech & the Atlas', album: 'morocco-2019', country: 'Morocco', lat: 31.63, lng: -8.0, kind: 'travel', note: 'Gardens, kasbahs and the edge of the desert', year: '2019',
    photos: [
      { src: '/travels/full/20190730_132103.jpg', caption: 'Aït Benhaddou' },
      { src: '/travels/full/20190731_121845.jpg', caption: 'Oasis valley' },
      { src: '/travels/full/20190729_173252.jpg', caption: 'Jardin Majorelle, Marrakech' },
      { src: '/travels/full/20190802_122553.jpg', caption: 'Carved cedar' },
    ],
  },
  {
    name: 'California, Nevada & Utah', album: 'usa-2019', country: 'USA', lat: 36.17, lng: -115.14, kind: 'travel', note: 'A road trip through the American Southwest', year: '2019',
    photos: [
      { src: '/travels/full/20190808_111442.jpg', caption: 'Santa Monica Pier' },
      { src: '/travels/full/20190812_100820.jpg', caption: 'Grand Canyon' },
      { src: '/travels/full/20190814_184109.jpg', caption: 'Las Vegas' },
    ],
  },
  {
    name: 'Madeira', album: 'madeira-2026', country: 'Portugal', lat: 32.75, lng: -16.95, kind: 'travel', note: 'Levadas, cliffs and the wild north coast', year: '2026',
    photos: [
      { src: '/travels/full/20261002_141021.jpg', caption: 'The north coast' },
      { src: '/travels/full/20261003_134317.jpg', caption: 'Black-pebble beach at Seixal' },
      { src: '/travels/full/20261002_110658.jpg', caption: 'Bananas, of course' },
      { src: '/travels/full/20261004_140037.jpg', caption: 'Bolo do caco at the Risco waterfall' },
    ],
  },
  {
    name: 'Abu Dhabi & Dubai', album: 'uae-2026', country: 'United Arab Emirates', lat: 24.41, lng: 54.47, kind: 'travel', note: 'The Sheikh Zayed Grand Mosque and the Dubai skyline', year: '2026',
    photos: [
      { src: '/travels/full/20260429_100335.jpg', caption: 'Sheikh Zayed Grand Mosque' },
      { src: '/travels/full/20260429_095052.jpg', caption: 'The mosque colonnade' },
      { src: '/travels/full/20260430_100823.jpg', caption: 'Dubai Marina from the beach' },
    ],
  },
  { name: 'Spain', country: 'Spain', lat: 40.42, lng: -3.7, kind: 'travel', note: 'Trip to Spain', year: '2023' },
  { name: 'Vietnam', country: 'Vietnam', lat: 16.05, lng: 108.2, kind: 'travel', note: 'Trip to Vietnam', year: '2024' },
  { name: 'Philippines', country: 'Philippines', lat: 11.5, lng: 123.0, kind: 'travel', note: 'Trip to the Philippines', year: '2025' },
];
