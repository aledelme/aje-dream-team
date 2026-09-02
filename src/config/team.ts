/**
 * El equipo.
 *
 * PARA AÑADIR A ALGUIEN: añade un objeto a esta lista. El orden es el mismo en
 * el que aparecen de izquierda a derecha en la foto de la página `/equipo`.
 */
export interface TeamMember {
  name: string;
  /** Rol dentro del equipo, en clave medieval como en la foto. */
  role: string;
  /** Qué hace ese rol en la práctica. */
  blurb: string;
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Alejandro Del Medico',
    role: 'Arquitecto',
    blurb: 'Levanta los planos: modelo de datos, indicadores y estructura del producto.',
    linkedin: 'https://www.linkedin.com/in/alejandrodelmedico',
  },
  {
    name: 'Alexandru Barbalata',
    role: 'Juglar',
    blurb: 'Pone voz al proyecto: cómo se cuenta, cómo se presenta y cómo se entiende.',
    linkedin: 'https://www.linkedin.com/in/alexandru-barbalata-571531181',
  },
  {
    name: 'Guillermo Gimeno',
    role: 'Conquistador',
    blurb: 'Abre camino: negocio, alianzas y la conversación con quien decide.',
    linkedin: 'https://www.linkedin.com/in/guillermo-gimeno-cps',
  },
  {
    name: 'Laia Guerrero',
    role: 'Forjadora',
    blurb: 'Da forma a lo que se construye: de la idea al producto que funciona.',
    linkedin: 'https://www.linkedin.com/in/laia-guerrero-torrente-taburete-social',
  },
];
