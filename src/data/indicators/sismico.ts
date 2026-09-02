import type { RiskIndicator } from '~/lib/indicators/types';

export const sismico: RiskIndicator = {
  id: 'sismico',
  kind: 'risk',
  label: 'Riesgo sísmico',
  group: 'seguridad-riesgos',
  unit: 'aceleración sísmica básica (g)',
  summary: 'Peligrosidad sísmica del municipio según la norma sismorresistente NCSE-02.',
  source: {
    organism: 'IGN',
    dataset: 'Norma de Construcción Sismorresistente NCSE-02 — mapa de peligrosidad',
    url: 'https://www.ign.es/web/ign/portal/sis-catalogo-terremotos',
    period: 'NCSE-02 (vigente)',
  },
  aggregation: 'municipal',
  levelNote:
    'La NCSE-02 asigna la aceleración sísmica básica por municipio: el valor corresponde al municipio completo, no a esta sección concreta.',
  method:
    'Se clasifica el municipio por su aceleración sísmica básica (ab/g) según la NCSE-02: bajo si es inferior a 0,04 g, medio entre 0,04 y 0,08 g, y alto a partir de 0,08 g. Es una clasificación normativa, por eso se muestra como badge y no como porcentaje.',
  levels: [
    {
      id: 'bajo',
      label: 'Bajo',
      tone: 'good',
      description: 'Aceleración sísmica básica inferior a 0,04 g. No exige aplicar la norma.',
      penalty: 0,
    },
    {
      id: 'medio',
      label: 'Medio',
      tone: 'mid',
      description: 'Aceleración sísmica básica entre 0,04 g y 0,08 g.',
      penalty: 3,
    },
    {
      id: 'alto',
      label: 'Alto',
      tone: 'bad',
      description:
        'Aceleración sísmica básica igual o superior a 0,08 g. Exige diseño sismorresistente.',
      penalty: 8,
    },
  ],
  affinity: { category: 'seguridad' },
};
