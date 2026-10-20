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
    title: 'TIMER GUI',
    blurb:
      'The analysis software for the EIS-TIMER transient-grating beamline at FERMI. One window replaces the MATLAB scan script, the pump-timing script and the fitting notebook: same numbers, plus propagated error bars, live shot statistics, an automatic ROI finder for pump timing, and 1 to 3 frequency fits of the acoustic response.',
    tags: ['Python', 'Tkinter', 'Matplotlib', 'HDF5', 'FEL data'],
    kind: 'lab',
    url: 'https://github.com/D3nFaina/timer-gui',
    linkLabel: 'GitHub',
  },
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
    title: 'Bitcoin Cycle Planner',
    blurb:
      'A desktop app that turns a halving-cycle strategy and live market data into a concrete plan: a buy ladder against the power-law floor, monthly buys with a Fear & Greed boost, an exit schedule, backtests over past cycles and next-cycle scenarios. It ships with daily, weekly and monthly Bitcoin price history since 2011 as CSV.',
    tags: ['Python', 'PyQt6', 'pyqtgraph', 'Data'],
    kind: 'script',
    url: 'https://github.com/D3nFaina/btc-cycle-planner',
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
