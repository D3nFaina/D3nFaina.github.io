// Everything about you lives here. Edit freely; the whole site reads from these files.

export const profile = {
  name: 'Danny Fainozzi',
  title: 'Dr. Danny Fainozzi',
  role: 'Physicist · Ultrafast X-ray science',
  affiliation: 'Institute of Applied Physics, University of Bern',
  location: 'Bern, Switzerland',
  // Drop a square photo at public/portrait.jpg and set this to '/portrait.jpg'.
  photo: '/portrait.jpg',
  pitch:
    'I develop nonlinear X-ray spectroscopies that watch heat, sound and spin move through matter on the nanometre and femtosecond scale.',
  bio: [
    'I am a postdoctoral researcher in the group of Prof. Andrea Cannizzo at the University of Bern. My work centres on four-wave mixing with extreme-ultraviolet and X-ray free-electron lasers, in particular transient gratings: two pulses interfere inside a sample, write a nanoscale pattern of excitation, and a third pulse reads out how that pattern evolves.',
    'Over more than ten years I have proposed, built and run experiments at FERMI, SwissFEL, the European XFEL, SACLA and LCLS, and I write and share the analysis code that turns those shots into physics.',
  ],
  email: 'danny.fainozzi@gmail.com',
  links: {
    github: 'https://github.com/D3nFaina',
    orcid: 'https://orcid.org/0000-0001-7380-8324',
    scholar: 'https://scholar.google.com/citations?user=rOEzuyEAAAAJ',
    linkedin: '',
    cringedin: 'https://cringedin.link/', // shown as a crossed-out LinkedIn logo
  },
  cvPdf: '/cv.pdf', // put your CV at public/cv.pdf
};

export const stats: { value: string; label: string; note?: string }[] = [
  { value: '25+', label: 'journal articles' },
  { value: '5', label: 'X-ray FEL facilities' },
  { value: '6 nm', label: 'smallest transient grating pitch', note: '(this is a thing to be proud, right? right?)' },
  { value: '10+ yrs', label: 'at large-scale facilities' },
];

export const news = [
  { date: '2026', text: 'Spin waves excited by hard X-ray transient gratings, published in Physical Review Letters.' },
  { date: '2026', text: 'Two new EUV transient-grating papers in Physical Review B and Journal of Applied Physics.' },
  { date: '2025', text: 'All hard X-ray transient grating spectroscopy published in Communications Physics.' },
  { date: '2024', text: 'Stimulated Brillouin scattering at 1 nm⁻¹ wave vector published in Physical Review Letters.' },
  { date: '2024', text: 'Joined the University of Bern as Advanced Postdoctoral Researcher.' },
];

