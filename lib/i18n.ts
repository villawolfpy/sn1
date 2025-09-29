export const strings = {
  en: {
    title: 'SN Reader',
    homepage: 'Homepage (All)',
    territory: 'Territory',
    enterTerritory: 'Enter territory (e.g., bitcoin, tech)',
    loadMore: 'Load More',
    openInSN: 'Open in SN',
    back: 'Back',
    noPosts: 'No posts found',
    loading: 'Loading...',
  },
  es: {
    title: 'Lector SN',
    homepage: 'Página principal (Todos)',
    territory: 'Territorio',
    enterTerritory: 'Ingresa territorio (ej., bitcoin, tech)',
    loadMore: 'Cargar Más',
    openInSN: 'Abrir en SN',
    back: 'Volver',
    noPosts: 'No se encontraron posts',
    loading: 'Cargando...',
  },
};

export type Language = 'en' | 'es';

export function getStrings(lang: Language = 'en') {
  return strings[lang];
}