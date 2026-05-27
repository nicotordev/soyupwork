# Especificación UI - Panel Admin SoyUpwork

## Objetivo

Definir un estándar visual y de interacción para páginas del panel de administración, tomando como referencia las implementaciones actuales en `sales`, `cohorts` y `users`.

## Principios de diseño

- Estilo **neobrutalista** consistente en todo el admin.
- Jerarquía clara: encabezado de página -> métricas/contexto -> toolbar -> contenido.
- Doble representación de datos: **tabla** y **tarjetas**.
- Estados explícitos: carga, vacío, filtros activos y solo lectura.
- Interfaz compacta orientada a gestión operativa.

## Layout global

### Contenedor de página

- Usar `AdminDashboardContainer` como wrapper principal.
- Incluir fondo de grilla decorativa mediante `adminGridBackgroundClass`.
- Respetar ancho máximo (`max-w-7xl`) y paddings responsivos definidos en el contenedor.

### Header superior del admin

- Usar `AdminHeader` sticky con:
  - `SidebarTrigger`.
  - Breadcrumb (`Admin > sección actual`).
  - Buscador global.
  - Botón de notificaciones.
  - Avatar de usuario (`UserButton`).
- Altura base: `h-14`.
- Borde inferior de 2px y alto contraste.

### Encabezado de página (hero de sección)

- Usar `AdminDashboardPageHeader`.
- Estructura:
  - Eyebrow con ícono + texto (`adminEyebrowClass`).
  - Título principal (grande y bold).
  - Descripción corta de propósito.
- Puede incluir `actions` cuando corresponda.
- Cierre visual con `border-b-4`.

## Sistema visual (tokens reutilizables)

### Superficies y paneles

- Panel base: `adminPanelClass`
  - Borde 2px.
  - Fondo `bg-card`.
  - Sombra brutalista offset.
  - Bordes redondeados.
- Variantes contextuales de color para KPIs (ejemplo: éxito, alerta, destructivo suave).

### Tipografía

- Encabezados: `font-heading`, peso extra bold.
- Labels/metadata: `font-mono`, uppercase, tamaños pequeños (`text-[9px]` a `text-xs`).
- Cuerpo secundario: `text-muted-foreground`.

### Controles

- Botones de estilo admin: `adminBrutalButtonClass`.
- Inputs admin: `adminInputClass`.
- Selects de filtros: `adminFilterSelectTriggerClass`.
- Badges de estado con variantes semánticas (`default`, `secondary`, `destructive`, `outline`).

## Estructura funcional recomendada por página

1. `AdminDashboardPageHeader`.
2. Bloques de contexto (stats, insights o aviso de negocio).
3. `AdminToolbar` con búsqueda, filtros y selector de vista.
4. Render condicional:
   - `EmptyState` si no hay resultados.
   - `AdminListingPanel + Table` en vista tabla.
   - `AdminCardGrid` en vista tarjetas.
5. Paginación cuando aplique (como en usuarios).

## Toolbar: comportamiento estándar

- Búsqueda por texto (`q`) con placeholder específico del dominio.
- Filtros por `Select` con opción `ALL` o equivalente por defecto.
- Contador de filtros activos.
- Badges de filtros activos con opción de remover individualmente.
- Acción de limpiar filtros (`clearParams`).
- Selector de vista tabla/tarjetas (`viewMode`).
- Resumen de resultados (`N items encontrados`).

## Patrones de datos en tabla

- Encabezados en `font-mono`, uppercase y tamaño compacto.
- Filas con borde tenue y densidad de datos alta.
- Primera columna con identificador fuerte (nombre o ID).
- Columnas secundarias con metadata en texto pequeño.
- Columna de estado con badge.
- Columna de acciones alineada a la derecha.

## Patrones de datos en tarjetas

- Cada tarjeta debe usar `adminPanelClass` + feedback hover (ligero desplazamiento/sombra).
- Cabecera de tarjeta con identidad de registro.
- Cuerpo con 2-4 atributos clave.
- Estado visible como badge.
- Footer para acciones/estado operacional (ej: "solo lectura", "sin acciones disponibles").

## Estados y feedback

### Empty state

- Debe usar `EmptyState` con:
  - Ícono contextual.
  - Título claro.
  - Descripción orientada a negocio.
  - CTA para limpiar filtros solo si hay filtros activos.

### Solo lectura

- Si el módulo no permite operaciones, expresarlo explícitamente en tabla y tarjetas.

### Carga/transición de filtros

- Usar `isPending` del hook de params para feedback en toolbar.

## Responsive

- Priorizar lectura en mobile:
  - Ocultar columnas secundarias en tabla (`md:table-cell`) cuando sea necesario.
  - Mantener acciones y estados visibles.
- En desktop:
  - Aprovechar grillas (`sm:grid-cols-3` para stats, `AdminCardGrid columns="wide"` para cards).

## Convención de copy (español)

- Eyebrow: "Panel de administración".
- Títulos cortos y orientados al dominio ("Ventas y Cobros", "Cohortes y Grupos").
- Descripciones en tono operacional.
- Labels de estado en español ("Cobrado", "Pendiente", "Finalizado").
- Mensajes vacíos accionables y claros.

## Checklist para nuevas páginas admin

- [ ] Página envuelta en `AdminDashboardContainer`.
- [ ] `AdminDashboardPageHeader` con ícono, título y descripción.
- [ ] Toolbar con búsqueda, filtros, badges activos y cambio de vista.
- [ ] Implementación de `EmptyState`.
- [ ] Vista tabla y vista tarjetas disponibles.
- [ ] Estados con `Badge` semántico.
- [ ] Estilos basados en tokens de `src/lib/admin/styles.ts`.
- [ ] Textos en español y consistentes con el resto del panel.

## Referencias base (fuente de verdad actual)

- `src/components/admin/orders/admin-sales-dashboard.tsx`
- `src/components/admin/cohorts/admin-cohorts-dashboard.tsx`
- `src/components/admin/users/users-overview.tsx`
- `src/components/admin/admin-header.tsx`
- `src/components/common/admin-dashboard-page-header.tsx`
- `src/components/admin/admin-dashboard-container.tsx`
- `src/lib/admin/styles.ts`
