# Zonia — análisis de zonas para decidir dónde vivir

Demo web del reto de Ibercaja: una herramienta para consultar y comparar datos de zonas de España
(seguridad, renta, servicios, entorno y riesgos naturales) antes de comprar una vivienda, con la
fuente y el método de cálculo siempre a la vista.

Astro 5 (salida estática) + Tailwind 4 + islas React + Leaflet. **Todos los datos de zona son
simulados**: las fuentes indicadas son las que alimentarían la versión real.

## Poner en marcha

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # typecheck (astro check)
npm run build      # genera dist/
npm run preview    # sirve dist/ en local
```

Para Netlify: `npm run build` y arrastrar la carpeta `dist/` al panel de despliegue.

## Cómo está organizado

```
src/
  config/site.ts            Nombre del producto, claim y navegación. Punto único de branding.
  styles/global.css         Tokens de marca (@theme) y estilos base.
  lib/
    indicators/types.ts     Contratos: IndicatorDef, ZoneValue, Zone.
    indicators/compute.ts   Índices, inversión, percentiles, tope y avisos de nivel.
    affinity/profile.ts     Tipos y opciones del formulario.
    affinity/score.ts       Algoritmo de afinidad y su desglose explicable.
    search/zone-search.ts   Autocompletado por nombre, municipio, calle o código postal.
    format.ts               Formato numérico en español.
  data/
    indicators/             Un fichero por indicador + index.ts (registro).
    zones/                  Un fichero por zona + index.ts (registro y validación).
  components/
    ui/                     Badge, Chip y tonos semánticos.
    kpi/                    KpiCard, CompareCard, IndexBar, SourceDetails.
    profile/                Formulario en 4 pasos y ranking de resultados.
    analyzer/               Buscador, cabecera de zona y toggle de comparación.
    map/ZoneMap.tsx         Mapa Leaflet (carga dinámica, apto para render en servidor).
  pages/                    index, perfil, analizar, metodologia.
```

La interfaz se genera a partir de los registros de `src/data/`: no hay listas de indicadores
escritas a mano en los componentes.

## Añadir una zona nueva

1. Crea `src/data/zones/<provincia>/<zona>.ts` exportando un objeto `Zone`. Lo más cómodo es copiar
   uno existente (`src/data/zones/aragon/huesca.ts` para un municipio,
   `src/data/zones/zaragoza/delicias.ts` para una sección censal).
2. Rellena identidad (`id`, `name`, `municipality`, `province`, `level`, `center`), los `aliases`
   con los que se podrá buscar (calles, barrios, códigos postales) y los 12 valores en `values`.
3. Impórtala y añádela al array `ZONES` de `src/data/zones/index.ts`.

Si falta algún indicador, **el build falla** con un mensaje que dice qué zona y qué indicador. Si la
fuente realmente no publica el dato para esa zona, decláralo en `unavailable` con el motivo: se
mostrará en la ficha como «No disponible» junto a la explicación.

## Añadir un indicador nuevo

1. Crea `src/data/indicators/<indicador>.ts` exportando un `IndexIndicator`, `RiskIndicator` o
   `DescriptiveIndicator` (según se muestre como % vs media nacional, como badge de riesgo o como
   dato descriptivo). Declara fuente, nivel de agregación, método y, si procede, `levelNote`.
2. Añádelo a `INDICATORS` en `src/data/indicators/index.ts`.
3. Añade su valor en cada zona.

Ficha, comparador, ranking de afinidad, pie de página y página de metodología lo recogen solos.

## Reglas de presentación

- Los indicadores comparables se muestran como **% respecto a la media nacional ponderada por
  población** (100 = España).
- Los datos «malos si suben» se **invierten y renombran en positivo** (criminalidad → seguridad),
  de forma que más alto siempre es mejor.
- Lo categórico o binario se muestra como **badge de riesgo**, nunca como porcentaje.
- Lo descriptivo (densidad, demografía) se muestra sin dirección buena o mala.
- El índice se **limita a 200** al mostrarlo, para que los cocientes de distancia no distorsionen la
  lectura. El valor absoluto nunca se altera.
- Cuando un dato se muestra sobre un ámbito más fino que el suyo se avisa con una etiqueta
  (*Dato municipal*, *Estación meteorológica más cercana*, *Nivel de parcela*).
