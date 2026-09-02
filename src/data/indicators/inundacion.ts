import type { RiskIndicator } from '~/lib/indicators/types';

/** Dato binario/categórico: no se expresa en %, se muestra como badge. */
export const inundacion: RiskIndicator = {
  id: 'inundacion',
  kind: 'risk',
  label: 'Riesgo de inundación',
  group: 'seguridad-riesgos',
  unit: 'zona inundable (sí / no)',
  summary: 'Si la parcela cae dentro de una zona inundable cartografiada.',
  source: {
    organism: 'MITECO',
    dataset: 'SNCZI — Sistema Nacional de Cartografía de Zonas Inundables',
    url: 'https://www.miteco.gob.es/es/agua/temas/gestion-de-los-riesgos-de-inundacion/snczi.html',
    period: '2024',
  },
  aggregation: 'parcela',
  method:
    'Se comprueba si el polígono de la parcela intersecta con las manchas de inundación del SNCZI para los periodos de retorno de 100 y 500 años. Es un dato binario por parcela: no tiene sentido expresarlo como porcentaje respecto a una media nacional.',
  levels: [
    {
      id: 'fuera',
      label: 'Fuera de zona inundable',
      tone: 'good',
      description: 'La parcela no intersecta con ninguna mancha de inundación cartografiada.',
      penalty: 0,
    },
    {
      id: 'periodo-500',
      label: 'Dentro de zona inundable (T=500 años)',
      tone: 'mid',
      description:
        'Afectada sólo por la avenida de baja probabilidad (periodo de retorno de 500 años).',
      penalty: 4,
    },
    {
      id: 'periodo-100',
      label: 'Dentro de zona inundable (T=100 años)',
      tone: 'bad',
      description:
        'Afectada por la avenida de probabilidad media (periodo de retorno de 100 años). Puede condicionar el seguro y la hipoteca.',
      penalty: 10,
    },
  ],
  affinity: { category: 'seguridad' },
};
