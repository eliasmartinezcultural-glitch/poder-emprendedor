# Fábrica Ocarina — Mini webs comerciales

## Estado

**V1 funcional bloqueada:** rama `v1-funcional-bloqueada`.

**V2.1 Excellence:** `main` — fábrica activa y profundizada sin servidor, sin base de datos y preparada para GitHub Pages.

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
