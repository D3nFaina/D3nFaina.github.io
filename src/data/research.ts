// Each project is told as a short story: question → approach → result.
// `accent` picks the card colour (one of: violet, cyan, amber, rose, emerald).

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  years: string;
  facilities: string[];
  question: string;
  approach: string;
  result: string;
  papers: string[]; // DOIs, matched against publications.ts
  accent: 'violet' | 'cyan' | 'amber' | 'rose' | 'emerald';
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'xtg',
    title: 'Hard X-ray transient gratings',
    tagline: 'Bringing four-wave mixing to the hard X-ray regime',
    years: '2020 – now',
    facilities: ['SwissFEL', 'European XFEL', 'SACLA', 'LCLS'],
    question:
      'Can we write a transient grating with hard X-rays, so that nonlinear spectroscopy reaches deep inside bulk materials with element selectivity?',
    approach:
      'An X-ray pump / optical probe proof-of-principle on bismuth germanate, backed by optical transient-grating data, then all-X-ray versions at SACLA and LCLS, and experiments at the European XFEL. I prepare the setups, lead shifts, and write the analysis pipeline.',
    result:
      'The first hard X-ray transient grating, the first all-X-ray grating (Communications Physics 2025), and spin waves launched by X-ray gratings (PRL 2026). The method is now developed under a long-term proposal at the European XFEL to become a standard method at the FXE and MID beamlines. This work helped seed the COST Action CA22148 on nonlinear X-ray techniques.',
    papers: [
      '10.1038/s41566-021-00797-9',
      '10.1088/1361-6455/ad717f',
      '10.1038/s42005-025-02178-y',
      '10.1103/zybx-dqfc',
      '10.1088/1361-6455/ad6b62',
      '10.48550/arXiv.2309.02308',
    ],
    accent: 'violet',
    featured: true,
  },
  {
    slug: 'euv-tg',
    title: 'Nanoscale acoustics with EUV light',
    tagline: 'The smallest transient grating pitch recorded to date',
    years: '2017 – now',
    facilities: ['FERMI'],
    question:
      'How do sound and heat travel when the relevant length scale shrinks to a few nanometres, where continuum models start to fail?',
    approach:
      'Extreme-ultraviolet transient gratings at the TIMER endstation of the FERMI free-electron laser, which I proposed, set up, ran and analysed.',
    result:
      'Time-domain stimulated Brillouin scattering at a 1 nm⁻¹ wave vector, an equivalent grating period of 6 nm, plus nanoscale polarization gratings, surface-phonon spectroscopy by diffuse scattering, and electron-lattice coupling in metal films.',
    papers: ['10.1103/PhysRevLett.132.033802', '10.1063/5.0201769', '10.1038/s41467-024-54799-6', '10.1103/dq8w-62bm', '10.1063/5.0340562', '10.1103/j1rk-j6rt'],
    accent: 'cyan',
    featured: true,
  },
  {
    slug: 'imaging',
    title: 'Single-shot 3D imaging',
    tagline: 'Stereoscopic coherent diffraction with one FEL pulse',
    years: '2021 – 2023',
    facilities: ['FERMI'],
    question:
      'Radiation-sensitive samples are destroyed by the pulse that images them. Can one shot be enough for a 3D reconstruction?',
    approach:
      'Split a single EUV free-electron-laser pulse into two views and reconstruct the object stereoscopically from coherent diffraction.',
    result:
      'Sub-micrometre 3D resolution from a single shot, opening a route to image individual molecules, bacteria or viruses instead of averaging many copies.',
    papers: ['10.1364/OPTICA.492730'],
    accent: 'amber',
    featured: true,
  },
  {
    slug: 'spin-waves',
    title: 'Spin waves and phonons in nanostructures',
    tagline: 'Magnons, echoes and programmable EUV optics',
    years: '2022 – 2024',
    facilities: ['FERMI'],
    question:
      'What new excitations can EUV gratings launch and detect, and what limits their lifetime in engineered materials?',
    approach:
      'Collaborative EUV transient-grating campaigns on magnetic multilayers, nanophononic membranes and phase-change materials.',
    result:
      'Coherent nanoscale spin waves (supported by optical Faraday-rotation data I took during an internship in Keith Nelson\'s group at MIT), a picture of how echo interference controls phonon attenuation, and a high-efficiency programmable modulator for EUV light.',
    papers: [
      '10.1126/sciadv.adp6015',
      '10.1038/s41467-024-45571-x',
      '10.1038/s41566-024-01389-z',
    ],
    accent: 'rose',
  },
];
