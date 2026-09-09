# CoVigilant — GEA Soluciones IT

Plataforma web para la gestión de servicios de seguridad electrónica
(CCTV, redes, soporte técnico y desarrollo web), desarrollada por el
Grupo GEA — Análisis y Desarrollo de Software, ficha 3235891, SENA.

## Evidencia

**GA7-220501096-AA4-EV03** — Componente front-end del proyecto formativo.
Codificación del módulo **Órdenes de Trabajo** (rutas y agenda de servicios
técnicos), incluyendo su ciclo de vida de estados y su relación con el
módulo de Facturación.

## Trazabilidad con artefactos previos

| Artefacto (evidencia anterior) | Elemento reutilizado en este módulo |
|---|---|
| Diagrama de clases — `GA4-220501095-AA2-EV04` | Clase `OrdenTrabajo`: atributo `estado`, métodos `cambiarEstado()`, `calcularCosto()`, `generarFactura()`, `notificarCambioEstado()` |
| Módulos codificados y probados — `GA7-220501096-AA3-EV02` | Reglas de validación de formularios (fechas futuras, campos numéricos, longitud mínima de texto) |
| Diseño del sitio (Figma) — `GA6-220501096-AA3-EV02` | Estructura visual del panel administrativo y paleta de colores |
| Diagramas de actividades y HU — `GA2-220501093-AA1-EV04` | Flujo: recepción de solicitud → asignación de técnico → ejecución → cierre → factura |

## Estructura del proyecto

```
Proyecto_CoVigilant_v1.2/
├── index.html      # Sitio público + panel administrativo (SPA sin backend)
├── style.css       # Hoja de estilos (incluye badges de estado del módulo nuevo)
├── script.js       # Lógica de la aplicación, comentada con JSDoc
├── img/            # Imágenes usadas por la interfaz
└── .gitattributes
```

## Cómo ejecutar el proyecto

Este es un proyecto de front-end estático (HTML, CSS y JavaScript puro),
sin dependencias de instalación ni backend:

1. Descargue o clone el repositorio.
2. Abra el archivo `index.html` directamente en el navegador (doble clic), o
3. Si prefiere usar un servidor local (recomendado para evitar
   restricciones de rutas de imágenes en algunos navegadores):
   - Con la extensión **Live Server** de VS Code: clic derecho sobre
     `index.html` → *Open with Live Server*.
   - O con Python: `python -m http.server 8000` y luego abrir
     `http://localhost:8000` en el navegador.

## Módulo de Órdenes de Trabajo — Resumen funcional

- **Crear orden**: formulario modal con los campos Fecha, Cliente, Técnico
  asignado, Ruta/Dirección, Tipo de servicio y Estado.
- **Cambiar estado** (🔄): avanza la orden en la secuencia
  `Pendiente → En Proceso → Cerrada → Pendiente`.
- **Generar factura** (🧾): solo habilitado cuando la orden está en estado
  `Cerrada`; calcula un costo según el tipo de servicio y crea
  automáticamente el registro correspondiente en el módulo de Facturación.
- **Editar / Eliminar**: gestión estándar del registro.

Todas las funciones del módulo están documentadas con comentarios
`JSDoc` en `script.js`, en la sección
`SECCIÓN 3.1: CICLO DE VIDA DE LA ORDEN DE TRABAJO`.

## Control de versiones

El proyecto se gestiona con Git y su historial se encuentra publicado en
GitHub. Ver el archivo `enlace_repositorio.txt` incluido en la carpeta
comprimida de entrega.

## Autores — Grupo GEA

- Gabriela Andreina Sarria Robaina
- Esteban Velásquez Gómez
- Anderson Tovar Coronado

Instructor: Ing. Fernando Forero Gómez — Centro de Servicios Financieros,
Regional Distrito Capital, SENA.
