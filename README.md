# Fábrica Ocarina — Mini webs comerciales

## Estado

**V1 funcional bloqueada:** rama `v1-funcional-bloqueada`.

**V2.1 Excellence funcional:** rama `v2.1-functional-locked` — estructura funcional congelada como respaldo.

**V2.2 Product layer:** `main` — misma interacción y arquitectura de producción, con personalización profunda y salida final más profesional.

## Qué hace ahora

La fábrica funciona como una línea de producción:

**Biblioteca → Nuevo negocio → Ficha maestra → Oferta → Marca → Vista → Control → Exportación**

Incluye:

- biblioteca de negocios con búsqueda y orden
- creación, edición, duplicación y eliminación
- guardado local automático
- migración básica desde la primera estructura local
- ficha maestra reutilizable
- ofertas sugeridas según rubro
- catálogo de productos/servicios
- compresión de fotografías en el navegador
- cinco personalidades visuales
- sistema visual aplicado también a la exportación
- vista previa escritorio/celular
- indicador de preparación de cada negocio
- control de calidad previo a la entrega
- exportación de una mini-web HTML independiente
- resumen de negocio copiable para WhatsApp
- funcionamiento sin servidor ni base de datos
- compatibilidad con GitHub Pages

## Arquitectura de producto

La fábrica está pensada como herramienta interna de producción de Elías/Ocarina.

**El cliente no necesita conocer la fábrica.**

La fábrica debe permitir:

1. cargar datos una sola vez;
2. convertirlos en una página comercial;
3. revisar visualmente;
4. detectar faltantes;
5. exportar;
6. duplicar el sistema para el siguiente negocio.

## Regla de excelencia

**Mucho sistema por detrás. Muy poco que aprender por delante.**

No se agregan funciones solo para hacerla más grande. Cada capa debe reducir tiempo de producción, errores o dependencia técnica.

## Próxima evolución

La siguiente capa estratégica no es agregar más botones. Es convertir la fábrica en un **motor de plantillas y entrega**:

- composiciones específicas por rubro sin duplicar código;
- biblioteca visual reutilizable;
- variantes de portada/oferta;
- control de contenido más estricto;
- paquete de entrega consistente;
- preparación para una futura publicación automatizada, sin depender de Vercel.

La rama `v1-funcional-bloqueada` no se modifica.


## Capa de producto V2.2

La estructura de producción permanece bloqueada. La evolución ocurre en la capa de resultado:

- perfiles de producción por rubro
- preparación automática de estructura, tono, CTA y composición según sector
- texto base comercial sugerido por rubro
- personalidad de marca por negocio
- frase de marca
- composición de catálogo: tarjetas, destacada o editorial
- portada fotográfica, minimal o inmersiva
- visibilidad configurable de precios, Instagram, ubicación y horarios
- cierre personalizado
- preview y exportación sincronizados
- responsive mobile-first
- misma información maestra alimentando preview y producto final

### Regla

**Frente simple. Fondo potente.**

### Capa de fábrica por sector

La fábrica ya no parte de una página genérica. Cada negocio puede entrar por un **perfil de producción**:

- Panadería
- Gastronomía
- Peluquería
- Fotografía
- Artesanía
- Productor
- Profesor
- Servicios
- Tienda

El perfil prepara automáticamente una base de trabajo: personalidad visual, composición, portada, CTA, frase comercial, descripción sugerida y tres ofertas iniciales.

Esto no cambia el flujo principal. El operador sigue trabajando con cinco pasos:

**Negocio → Oferta → Marca → Vista → Entrega**

La diferencia está en que la fábrica hace más trabajo por detrás.

### Criterio de producto

El objetivo no es que cada mini-web tenga infinitas opciones. El objetivo es que **cada nueva mini-web salga distinta sin que Elías tenga que diseñar desde cero**.

La fábrica debe convertir experiencia acumulada en presets reutilizables:

**rubro → lógica comercial → preset visual → contenido base → personalización → QA → entrega**

La siguiente profundidad será ampliar la biblioteca de perfiles y crear variantes internas de cada perfil sin modificar la interacción principal.

El operador no debe aprender diseño web. Selecciona opciones, carga contenido y entrega una pieza consistente.


## V2.3 · Fábrica de perfiles

La capa de producto incorpora una biblioteca interna de perfiles comerciales. Cada rubro puede definir personalidad visual, composición, portada, CTA, frase, descripción y ofertas iniciales. Además, cada rubro puede tener variantes comerciales sin cambiar el flujo de cinco pasos.

También se incorporó un respaldo local de la fábrica mediante JSON: **RESPALDAR → archivo → IMPORTAR**. Esto protege la biblioteca de negocios sin servidor ni base de datos y mantiene el proyecto compatible con GitHub Pages.

### Principio de escalabilidad

**Un solo flujo de producción + muchos presets internos.**

El objetivo es que agregar un nuevo rubro o variante aumente la capacidad de fabricación, no la complejidad de uso.