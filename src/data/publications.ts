// Selected publications (the full list lives on ORCID). Add new papers at the top. `first: true` marks first-author papers.
// Your own name is highlighted automatically wherever "Fainozzi" appears.

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  first?: boolean;
  status?: string; // e.g. 'submitted', 'preprint'
};

export const publications: Publication[] = [
  {
    title: 'Ultrafast electron-lattice coupling in cobalt films probed by nanoscale extreme ultraviolet transient gratings',
    authors: 'Kurdi, G., Fainozzi, D., Foglia, L., Khatu, N., Laterza, S., Mincigrucci, R., … Masciovecchio, C., & Bencivenga, F.',
    venue: 'Physical Review B 114',
    year: 2026,
    doi: '10.1103/j1rk-j6rt',
  },
  {
    title: 'Thermoelastic dynamics of a nanoscale metallic film: role of bilayer coupling revealed by extreme ultraviolet transient gratings',
    authors: 'Krstulović, M., Pelli-Cresi, J. S., Fainozzi, D., Foglia, L., Griesi, A., … Wehinger, B., & Bencivenga, F.',
    venue: 'Journal of Applied Physics 140, 065102',
    year: 2026,
    doi: '10.1063/5.0340562',
  },
  {
    title: 'Spin waves excited by hard X-ray transient gratings',
    authors: 'Miedaner, P. R., Maznev, A. A., Biednov, M., … Fainozzi, D., … Cannizzo, A., Milne, C., Nelson, K. A., & Svetina, C.',
    venue: 'Physical Review Letters',
    year: 2026,
    doi: '10.1103/zybx-dqfc',
  },
  {
    title: 'Time-domain extreme-ultraviolet diffuse scattering spectroscopy of nanoscale surface phonons',
    authors: 'Capotondi, F., Maznev, A. A., Bencivenga, F., Bonetti, S., Engel, D., Fainozzi, D., … & Trigo, M.',
    venue: 'Physical Review Letters 135, 266101',
    year: 2025,
    doi: '10.1103/dq8w-62bm',
  },
  {
    title: 'All hard X-ray transient grating spectroscopy',
    authors: 'Ferrari, E., Ueda, H., Fainozzi, D., Osaka, T., Bencivenga, F., … & Svetina, C.',
    venue: 'Communications Physics 8',
    year: 2025,
    doi: '10.1038/s42005-025-02178-y',
  },
  {
    title: 'Nanoscale polarization transient gratings',
    authors: 'Foglia, L., Wehinger, B., Perosa, G., Mincigrucci, R., … Fainozzi, D., … Masciovecchio, C., Bonetti, S., & Bencivenga, F.',
    venue: 'Nature Communications 15',
    year: 2024,
    doi: '10.1038/s41467-024-54799-6',
  },
  {
    title: 'X-ray circular dichroism measured by cross-polarization X-ray transient grating',
    authors: 'Rouxel, J. R., Mincigrucci, R., Fainozzi, D., & Masciovecchio, C.',
    venue: 'Journal of Physics B: Atomic, Molecular and Optical Physics',
    year: 2024,
    doi: '10.1088/1361-6455/ad6b62',
  },
  {
    title: 'Protocols for X-ray transient grating pump/optical probe experiments at X-ray free electron lasers',
    authors: 'Fainozzi, D., Cucini, R., Vila-Comamala, J., Lima, F., … & Svetina, C.',
    venue: 'Journal of Physics B: Atomic, Molecular and Optical Physics',
    year: 2024,
    doi: '10.1088/1361-6455/ad717f',
    first: true,
  },
  {
    title: 'Excitation and detection of coherent nanoscale spin waves via extreme ultraviolet transient gratings',
    authors: 'Miedaner, P. R., Berndt, N., Deschamps, J., Fainozzi, D., … & Maznev, A. A.',
    venue: 'Science Advances 10(36), eadp6015',
    year: 2024,
    doi: '10.1126/sciadv.adp6015',
  },
  {
    title: 'A high-efficiency programmable modulator for extreme ultraviolet light with nanometre feature size based on an electronic phase transition',
    authors: 'Vaskivskyi, I., Mraz, A., Venturini, R., … Fainozzi, D., Bencivenga, F., Masciovecchio, C., & Mihailovic, D.',
    venue: 'Nature Photonics',
    year: 2024,
    doi: '10.1038/s41566-024-01389-z',
  },
  {
    title: 'A new framework for soft X-ray transient gratings',
    authors: 'Foglia, L., Mincigrucci, R., Döring, F., Fainozzi, D., Mamyrbayev, T., Masciovecchio, C., & Bencivenga, F.',
    venue: 'Journal of Physics B: Atomic, Molecular and Optical Physics',
    year: 2024,
    doi: '10.1088/1361-6455/ad4fd0',
  },
  {
    title: 'Temperature effects on the nanoscale thermoelastic response of a SiO₂ membrane',
    authors: 'Fainozzi, D., Caporaletti, F., Capotondi, F., De Angelis, D., … Bencivenga, F., & Baldi, G.',
    venue: 'APL Materials 12(5)',
    year: 2024,
    doi: '10.1063/5.0201769',
    first: true,
  },
  {
    title: 'The effect of echoes interference on phonon attenuation in a nanophononic membrane',
    authors: 'Hadi, M., Luo, H., Pailhès, S., Tanguy, A., … Fainozzi, D., … & Giordano, V. M.',
    venue: 'Nature Communications 15, 1317',
    year: 2024,
    doi: '10.1038/s41467-024-45571-x',
  },
  {
    title: 'Stimulated Brillouin scattering in the time domain at 1 nm⁻¹ wave vector',
    authors: 'Fainozzi, D., Foglia, L., Khatu, N. N., Masciovecchio, C., Mincigrucci, R., Paltanin, E., & Bencivenga, F.',
    venue: 'Physical Review Letters 132, 033802',
    year: 2024,
    doi: '10.1103/PhysRevLett.132.033802',
    first: true,
  },
  {
    title: 'BGO relaxation dynamics probed with heterodyne detected optical transient gratings',
    authors: 'Fainozzi, D., Catalini, S., Torre, R., Masciovecchio, C., & Svetina, C.',
    venue: 'arXiv:2309.02308',
    year: 2023,
    doi: '10.48550/arXiv.2309.02308',
    first: true,
    status: 'preprint',
  },
  {
    title: 'Three-dimensional coherent diffraction snapshot imaging using extreme-ultraviolet radiation from a free electron laser',
    authors: 'Fainozzi, D., Ippoliti, M., Bille, F., De Angelis, D., … Bencivenga, F., & Capotondi, F.',
    venue: 'Optica 10(8), 1053–1058',
    year: 2023,
    doi: '10.1364/OPTICA.492730',
    first: true,
  },
  {
    title: 'Extreme ultraviolet transient gratings: a tool for nanoscale photoacoustics',
    authors: 'Foglia, L., Mincigrucci, R., Maznev, A. A., Baldi, G., … Fainozzi, D., … & Bencivenga, F.',
    venue: 'Photoacoustics 29, 100453',
    year: 2023,
    doi: '10.1016/j.pacs.2023.100453',
  },
  {
    title: 'Element- and enantiomer-selective visualization of molecular motion in real-time',
    authors: 'Mincigrucci, R., Rouxel, J. R., Rossi, B., … Fainozzi, D., … Chergui, M., & Masciovecchio, C.',
    venue: 'Nature Communications 14, 386',
    year: 2023,
    doi: '10.1038/s41467-023-36047-5',
  },
  {
    title: 'Hard X-ray transient grating spectroscopy on bismuth germanate',
    authors: 'Rouxel, J. R., Fainozzi, D., Mankowsky, R., Rösner, B., … & Svetina, C.',
    venue: 'Nature Photonics 15, 499–503',
    year: 2021,
    doi: '10.1038/s41566-021-00797-9',
  },
];

// Talks, posters and invited seminars. Fill in as you like.
export const talks: { year: number; title: string; event: string; place: string; kind: 'invited' | 'contributed' | 'poster' }[] = [
  { year: 2025, title: 'Your talk title here', event: 'Conference or seminar name', place: 'City', kind: 'invited' },
];
