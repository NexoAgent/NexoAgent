# 📱 Diseño Responsivo - NexoAgent

## 🎯 Objetivo

Hacer que NexoAgent sea 100% responsivo y se vea perfecto en:
- 📱 Móviles (320px - 640px)
- 📱 Tablets (641px - 1024px)  
- 💻 Desktop (1025px+)

---

## ✅ Implementado

### 1. Menú Móvil con Hamburguesa

**Componente:** `/app/components/MobileMenu.tsx`

**Características:**
- ✅ Header fijo en mobile con logo + hamburguesa
- ✅ Sidebar deslizable desde la izquierda
- ✅ Overlay oscuro al abrir menú
- ✅ Animaciones suaves (transform + transition)
- ✅ Cierre al hacer click fuera
- ✅ Navegación completa
- ✅ Info de usuario y empresa
- ✅ Botón de logout

**Breakpoints:**
- `lg:hidden` → Visible solo en mobile/tablet (< 1024px)
- `hidden lg:flex` → Sidebar desktop (≥ 1024px)

### 2. Layout Responsivo

**Actualizado:** `/app/empresa/[id]/layout.tsx`

**Cambios:**
- ✅ Sidebar desktop oculto en mobile (`hidden lg:flex`)
- ✅ MobileMenu visible solo en mobile (`lg:hidden`)
- ✅ Main content con padding top en mobile (`pt-16 lg:pt-0`)
- ✅ Main content sin margin left en mobile (`lg:ml-60`)
- ✅ Padding responsivo (`px-4 sm:px-6 lg:px-8`)

---

## 🔄 Pendiente de Implementar

### 3. Componentes de Contenido Responsivos

**Tablas:**
- [ ] Convertir a cards en mobile
- [ ] Scroll horizontal cuando sea necesario
- [ ] Ocultar columnas secundarias en mobile

**Forms:**
- [ ] Stack vertical en mobile
- [ ] Inputs de ancho completo
- [ ] Botones de ancho completo en mobile

**Cards:**
- [ ] Grid responsivo (1 col mobile, 2 tablet, 3+ desktop)
- [ ] Padding y spacing adaptativo

**Modals:**
- [ ] Fullscreen en mobile
- [ ] Centered en desktop

### 4. Otros Layouts

- [ ] `/app/admin/layout.tsx` - Agregar MobileMenu
- [ ] `/app/dashboard/layout.tsx` - Agregar MobileMenu  
- [ ] `/app/login/page.tsx` - Ya es responsivo ✅

### 5. Páginas Específicas

- [ ] Conversaciones - Chat responsivo
- [ ] CRM - Tabla/cards responsivos
- [ ] Agenda - Calendario responsivo
- [ ] Analíticas - Gráficos responsivos
- [ ] Conocimiento - Upload y lista responsivos
- [ ] Configuración - Forms responsivos

---

## 📏 Breakpoints de Tailwind

```css
sm:  640px  /* Mobile landscape, small tablets */
md:  768px  /* Tablets */
lg:  1024px /* Desktop */
xl:  1280px /* Large desktop */
2xl: 1536px /* Extra large */
```

**Estrategia:**
- Mobile-first (default sin prefijo)
- `lg:` para desktop (≥ 1024px)
- `sm:` y `md:` para casos intermedios

---

## 🎨 Guía de Responsive

### Sidebar

**Mobile:**
```tsx
<aside className="lg:hidden ...">
  {/* Sidebar móvil deslizable */}
</aside>
```

**Desktop:**
```tsx
<aside className="hidden lg:flex ...">
  {/* Sidebar fijo desktop */}
</aside>
```

### Main Content

```tsx
<main className="
  flex-1 
  lg:ml-60          /* Margin left solo en desktop */
  pt-16 lg:pt-0     /* Padding top en mobile por header */
">
  <div className="
    max-w-4xl mx-auto 
    px-4 sm:px-6 lg:px-8  /* Padding responsivo */
    py-6 lg:py-8          /* Padding vertical */
  ">
    {children}
  </div>
</main>
```

### Grids

```tsx
{/* 1 columna mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(...)}
</div>
```

### Texto

```tsx
{/* Responsive font sizes */}
<h1 className="text-2xl sm:text-3xl lg:text-4xl">Título</h1>
<p className="text-sm sm:text-base">Párrafo</p>
```

### Buttons

```tsx
{/* Full width en mobile, auto en desktop */}
<button className="w-full sm:w-auto">
  Acción
</button>
```

### Spacing

```tsx
{/* Responsive spacing */}
<div className="space-y-4 lg:space-y-6">
  <div className="p-4 lg:p-6">
    Content
  </div>
</div>
```

---

## 🧪 Testing Responsivo

### Chrome DevTools

1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Probar en:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1280px+)

### Breakpoints a Probar

- ✅ 320px (Mobile pequeño)
- ✅ 375px (iPhone SE)
- ✅ 390px (iPhone 12/13/14)
- ✅ 768px (iPad)
- ✅ 1024px (Desktop pequeño)
- ✅ 1280px+ (Desktop normal)

---

## 📝 Checklist de Responsive

### General
- [x] Menú hamburguesa implementado
- [x] Sidebar colapsable en mobile
- [x] Header fijo en mobile
- [ ] Todas las páginas probadas en mobile
- [ ] Todas las páginas probadas en tablet
- [ ] Todas las páginas probadas en desktop

### Componentes
- [ ] Tablas → Cards en mobile
- [ ] Forms → Stack vertical en mobile
- [ ] Modals → Fullscreen en mobile
- [ ] Grids → Columnas responsivas
- [ ] Imágenes → Width responsivo
- [ ] Videos → Aspect ratio responsive

### Interacciones
- [ ] Touch targets mínimo 44x44px
- [ ] Scroll horizontal evitado
- [ ] Zoom permitido (no disable)
- [ ] Gestures táctiles funcionando

### Performance
- [ ] Imágenes optimizadas
- [ ] Lazy loading implementado
- [ ] CSS minimizado
- [ ] No layout shift (CLS)

---

## 🚀 Próximos Pasos

1. **Actualizar layouts restantes** (admin, dashboard)
2. **Optimizar páginas principales** (CRM, Conversaciones, Agenda)
3. **Hacer tablas responsivas** (cards en mobile)
4. **Optimizar forms** (full-width en mobile)
5. **Testing exhaustivo** en todos los breakpoints
6. **Deploy y verificación** en dispositivos reales

---

**Fecha de inicio:** Mayo 31, 2026  
**Estado:** 🟡 EN PROGRESO (30% completado)
