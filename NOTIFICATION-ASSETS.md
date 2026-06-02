# 🔔 Assets para Notificaciones - NexoAgent

## 📁 Estructura de Archivos Necesarios

```
public/
├── sounds/                      # Sonidos de notificaciones
│   ├── urgent.mp3              # 🔴 Modo humano (alta prioridad)
│   ├── message.mp3             # 🔵 Mensaje normal
│   └── calendar.mp3            # 🟢 Nueva cita
├── badge-urgent.png            # Badge rojo (modo humano)
├── badge-message.png           # Badge azul (mensaje)
├── badge-calendar.png          # Badge verde (cita)
└── logo.png                    # Logo principal (ícono)
```

---

## 🎵 Archivos de Audio

### Características Técnicas

**Formato recomendado:** MP3  
**Duración:** 1-2 segundos  
**Bitrate:** 128 kbps  
**Sample rate:** 44.1 kHz

### Tipos de Sonidos

#### 1. `urgent.mp3` - Modo Humano (🔴 ALTA PRIORIDAD)

**Descripción:** Sonido urgente y llamativo  
**Características:**
- Tono agudo y penetrante
- Volumen más alto
- Patrón repetitivo (ding-ding-ding)
- Duración: ~1.5 segundos

**Sugerencias:**
- Alarma corta
- Timbre de emergencia
- Notificación de alerta crítica

**Ejemplo de sonido libre:** https://freesound.org/people/InspectorJ/sounds/411088/

---

#### 2. `message.mp3` - Mensaje Normal (🔵 PRIORIDAD NORMAL)

**Descripción:** Sonido suave y amigable  
**Características:**
- Tono medio, agradable
- Volumen moderado
- Un solo "pop" o "ding"
- Duración: ~0.5 segundos

**Sugerencias:**
- Notificación de WhatsApp/Messenger
- Pop corto
- Ding simple

**Ejemplo de sonido libre:** https://freesound.org/people/rhodesmas/sounds/320655/

---

#### 3. `calendar.mp3` - Nueva Cita (🟢 PRIORIDAD BAJA)

**Descripción:** Sonido neutral e informativo  
**Características:**
- Tono grave y calmado
- Volumen bajo
- Melodía corta ascendente
- Duración: ~1 segundo

**Sugerencias:**
- Notificación de calendario
- Chime suave
- Tono informativo

**Ejemplo de sonido libre:** https://freesound.org/people/LittleRobotSoundFactory/sounds/270404/

---

## 🖼️ Badges (Íconos de Notificación)

### Características Técnicas

**Formato:** PNG con transparencia  
**Tamaño:** 96x96 píxeles  
**Diseño:** Simple, monocromático, alto contraste

### Tipos de Badges

#### 1. `badge-urgent.png` - Modo Humano

**Color:** Rojo (#EF4444)  
**Ícono:** Círculo con signo de exclamación (!)  
**Uso:** Notificaciones de modo humano

```
  ⚠️
[Círculo rojo con "!" en blanco]
```

---

#### 2. `badge-message.png` - Mensaje

**Color:** Azul (#3B82F6)  
**Ícono:** Burbuja de chat  
**Uso:** Nuevos mensajes de clientes

```
  💬
[Burbuja de chat azul]
```

---

#### 3. `badge-calendar.png` - Cita

**Color:** Verde (#10B981)  
**Ícono:** Calendario  
**Uso:** Nuevas citas agendadas

```
  📅
[Calendario verde]
```

---

## 🎨 Cómo Crear los Badges

### Opción 1: Usando Figma/Canva (Recomendado)

1. Crear canvas de 96x96 px
2. Dibujar círculo del color correspondiente
3. Agregar ícono en blanco al centro
4. Exportar como PNG con transparencia

### Opción 2: Usando Código SVG → PNG

```svg
<!-- badge-urgent.svg -->
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="48" r="48" fill="#EF4444"/>
  <text x="48" y="68" font-size="60" fill="white" text-anchor="middle" font-weight="bold">!</text>
</svg>
```

Convertir a PNG usando:
- https://cloudconvert.com/svg-to-png
- O comando: `inkscape badge-urgent.svg --export-png=badge-urgent.png`

### Opción 3: Usar Emojis como Placeholders Temporales

Mientras no tengas los badges personalizados, puedes usar los mismos íconos emoji:

```javascript
// En sw.js, temporalmente:
icon: '/logo.png',
badge: type === 'modo-humano' ? '🚨' : 
       type === 'mensaje' ? '💬' : '📅'
```

**Nota:** Esto funciona en algunos navegadores, pero no es la solución ideal.

---

## 🔊 Cómo Agregar los Archivos de Audio

### Paso 1: Descargar Sonidos

**Opción A: Usar Freesound.org (Gratis, Creative Commons)**

1. Ir a https://freesound.org
2. Buscar: "notification urgent", "message pop", "calendar chime"
3. Descargar archivos WAV o MP3
4. Convertir a MP3 128kbps si es necesario

**Opción B: Usar Zapsplat (Gratis, con atribución)**

https://www.zapsplat.com/sound-effect-category/notifications-and-bells/

**Opción C: Generar con IA**

- https://www.myedit.online/es/audio-editor/text-to-sound-effect
- Describir el sonido deseado y generar

### Paso 2: Preparar Archivos

```bash
# Convertir WAV a MP3 con FFmpeg
ffmpeg -i urgent.wav -b:a 128k urgent.mp3
ffmpeg -i message.wav -b:a 128k message.mp3
ffmpeg -i calendar.wav -b:a 128k calendar.mp3
```

### Paso 3: Colocar en /public/sounds/

```bash
mkdir -p public/sounds
cp urgent.mp3 public/sounds/
cp message.mp3 public/sounds/
cp calendar.mp3 public/sounds/
```

---

## 🧪 Cómo Probar

### Probar Sonidos

```javascript
// En la consola del navegador
const audio = new Audio('/sounds/urgent.mp3');
audio.play();
```

### Probar Badges

1. Disparar una notificación
2. Verificar que el badge se muestra correctamente en:
   - Centro de notificaciones (Windows/Mac)
   - Barra de notificaciones (Android)
   - Notification Center (iOS)

---

## 📦 Alternativa: Usar Data URLs (Sin Archivos Externos)

Si prefieres no depender de archivos externos, puedes usar Data URLs:

### Para Badges (Base64)

```javascript
// badge-urgent como Data URL
const badgeUrgent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
```

**Ventajas:**
- No requiere archivos externos
- Funcionan offline inmediatamente

**Desventajas:**
- Más difícil de mantener
- Archivos más grandes en el código

---

## ✅ Checklist de Implementación

### Sonidos
- [ ] Descargar/generar `urgent.mp3`
- [ ] Descargar/generar `message.mp3`
- [ ] Descargar/generar `calendar.mp3`
- [ ] Crear directorio `public/sounds/`
- [ ] Colocar archivos en `public/sounds/`
- [ ] Probar reproducción en navegador

### Badges
- [ ] Crear/descargar `badge-urgent.png` (96x96, rojo)
- [ ] Crear/descargar `badge-message.png` (96x96, azul)
- [ ] Crear/descargar `badge-calendar.png` (96x96, verde)
- [ ] Colocar en `public/`
- [ ] Verificar en notificaciones

### Integración
- [ ] Service Worker (`sw.js`) actualizado ✅
- [ ] `lib/push-notifications.ts` actualizado ✅
- [ ] Archivos de sonido agregados
- [ ] Archivos de badge agregados
- [ ] Probado en Chrome
- [ ] Probado en Firefox
- [ ] Probado en Safari
- [ ] Probado en Edge

---

## 🚀 Quick Start (Temporal)

Si quieres probar **ahora mismo** sin esperar por los assets:

### 1. Usar solo el logo existente

```javascript
// En sw.js - comentar temporalmente los badges custom
badge: '/logo.png', // En lugar de badge-urgent.png
```

### 2. Deshabilitar sonidos temporalmente

```javascript
// En sw.js - comentar la llamada a playNotificationSound
// await playNotificationSound(options.data.sound),
```

### 3. Usar vibración diferenciada (ya implementado)

Las notificaciones **ya funcionan** con vibraciones diferentes por tipo:
- Modo humano: vibración intensa
- Mensaje: vibración normal
- Cita: vibración suave

---

## 📚 Recursos Adicionales

### Sitios de Sonidos Gratis

- **Freesound:** https://freesound.org
- **Zapsplat:** https://www.zapsplat.com
- **Notification Sounds:** https://notificationsounds.com
- **Mixkit:** https://mixkit.co/free-sound-effects/notification/

### Herramientas de Edición

- **Audacity:** Edición de audio (gratis)
- **FFmpeg:** Conversión de formatos
- **Online Audio Converter:** https://online-audio-converter.com

### Generadores de Íconos

- **Figma:** https://figma.com
- **Canva:** https://canva.com
- **Flaticon:** https://flaticon.com (iconos PNG gratis)

---

## 🎯 Prioridades

1. **AHORA (Testing):** Usar logo existente y vibración
2. **Corto plazo (1-2 días):** Agregar badges personalizados
3. **Medio plazo (1 semana):** Agregar sonidos diferenciados

---

**Nota:** El sistema de notificaciones **ya funciona completamente** con:
- ✅ Prioridad visual (requireInteraction)
- ✅ Agrupación de mensajes
- ✅ Vibración diferenciada
- ✅ Acciones (Ver/Ignorar)

Los assets (sonidos y badges) son **mejoras opcionales** que elevan la UX pero no son críticos.

---

**¿Necesitas ayuda creando los assets?** Puedo ayudarte a:
1. Generar los SVG de los badges
2. Recomendar sonidos específicos de Freesound
3. Crear un script que descargue todo automáticamente
