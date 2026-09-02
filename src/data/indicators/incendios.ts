import type { RiskIndicator } from '~/lib/indicators/types';

export const incendios: RiskIndicator = {
  id: 'incendios',
  kind: 'risk',
  label: 'Riesgo de incendios forestales',
  group: 'seguridad-riesgos',
  unit: 'frecuencia histórica de incendios en el término municipal',
  summary:
    'Frecuencia histórica de incendios forestales registrados en el término municipal.',
  source: {
    organism: 'MITECO',
    dataset: 'EGIF — Estadística General de Incendios Forestales',
    url: 'https://www.miteco.gob.es/es/biodiversidad/temas/incendios-forestales.html',
    period: '2006-2023',
  },
  aggregation: 'municipal',
  levelNote:
    'La EGIF registra los siniestros por término municipal: el valor corresponde al municipio completo, no a esta sección concreta.',
  method:
    'Se cuentan los siniestros forestales del municipio en los últimos 18 años, se normalizan por superficie forestal y se clasifica el resultado en tres tramos de frecuencia. Se muestra como badge porque el interés práctico es el tramo de riesgo, no la cifra exacta.',
  levels: [
    {
      id: 'baja',
      label: 'Frecuencia baja',
      tone: 'good',
      description: 'Pocos siniestros registrados y escasa interfaz urbano-forestal.',
      penalty: 0,
    },
    {
      id: 'media',
      label: 'Frecuencia media',
      tone: 'mid',
      description: 'Siniestros recurrentes en el municipio, sin grandes incendios recientes.',
      penalty: 3,
    },
    {
      id: 'alta',
      label: 'Frecuencia alta',
      tone: 'bad',
      description:
        'Municipio con siniestralidad elevada y presencia de interfaz urbano-forestal.',
      penalty: 8,
    },
  ],
  affinity: { category: 'clima' },
};
