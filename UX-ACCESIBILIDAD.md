# ♿ Accesibilidad (a11y) - NexoAgent

**Fecha:** 2 de junio, 2026  
**Estado:** ✅ COMPLETADO  
**Nivel:** WCAG 2.1 AA Ready

## Herramientas Implementadas

| Utilidad | Propósito |
|----------|-----------|
| **aria helpers** | Generar ARIA attributes |
| **meetsWCAG** | Verificar contraste |
| **useKeyboardNav** | Navegación por teclado |
| **useFocusTrap** | Mantener foco en modales |
| **SkipLinks** | Saltar a contenido |
| **VisuallyHidden** | Ocultar visualmente |

## Uso

### ARIA Labels
```tsx
import { aria } from "@/lib/utils/accessibility";

<button {...aria.button("Enviar mensaje", false)}>
  Enviar
</button>

<input {...aria.input("Buscar", true, false)} />
```

### Navegación por Teclado
```tsx
useKeyboardNav({
  onEscape: handleClose,
  onEnter: handleSubmit,
  onArrowDown: selectNext,
});
```

### Focus Trap
```tsx
const modalRef = useRef<HTMLDivElement>(null);
useFocusTrap(modalRef, isOpen);
```

### Skip Links
```tsx
<SkipLinks />
<main id="main-content">...</main>
```

## Cumplimiento

✅ **WCAG 2.1 Level AA**  
✅ **Lectores de pantalla**  
✅ **Navegación por teclado**  
✅ **Contraste suficiente**

**Sistema inclusivo y accesible** ♿
