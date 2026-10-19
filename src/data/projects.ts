// Side projects and code. `url` is optional (leave it out for private repos).
// kind: 'lab' (instrument / analysis software), 'app' (apps and tools), 'script' (small scripts).

export type SideProject = {
  title: string;
  blurb: string;
  tags: string[];
  kind: 'lab' | 'app' | 'script';
  url?: string;
  linkLabel?: string;
  status?: string;
};

export const sideProjects: SideProject[] = [
  {
    title: 'Transient-absorption acquisition suite',
    blurb:
      'The PyQt5 control software for our transient-absorption setup in Bern: Glaz line cameras, PI delay stage, Thorlabs shutters, and 2D-angle and polarization scans. It has live plotting, shot-to-shot stability diagnostics, HDF5 output, and a hardware-free simulation mode for testing changes before a measurement campaign.',
    tags: ['Python', 'PyQt5', 'pyqtgraph', 'Instrument control'],
    kind: 'lab',
    status: 'Private repository',
  },
  {
    title: 'All-X-ray transient grating analysis',
    blurb:
      'The analysis pipeline for the SACLA campaign that demonstrated all hard X-ray transient gratings, from raw detector frames to the figures published in Communications Physics.',
    tags: ['Python', 'NumPy', 'XFEL data'],
    kind: 'lab',
    url: 'https://github.com/D3nFaina/DataAnalysis',
    linkLabel: 'GitHub',
  },
  {
    title: 'Beam and grating simulations',
    blurb:
      'Gaussian-beam propagation through gratings and samples, used to design transient-grating geometries and to model CCD data.',
    tags: ['Python', 'Optics', 'Simulation'],
    kind: 'script',
    url: 'https://github.com/D3nFaina/DataAnalysis',
    linkLabel: 'GitHub',
  },
  {
    title: 'Running progress tracker',
    blurb: 'A small notebook that turns my runs into pace and distance trends over time.',
    tags: ['Python', 'Jupyter', 'pandas'],
    kind: 'script',
    url: 'https://github.com/D3nFaina/Random',
    linkLabel: 'GitHub',
  },
  {
    title: 'Interview training',
    blurb: 'Classic algorithm problems solved in Python and C++, first my way and then improved.',
    tags: ['Python', 'C++', 'Algorithms'],
    kind: 'script',
    url: 'https://github.com/D3nFaina/Training4inteviews',
    linkLabel: 'GitHub',
  },
];
