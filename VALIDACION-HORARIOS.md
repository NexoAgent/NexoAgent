# ⏰ Sistema Inteligente de Validación de Horarios

NexoAgent ahora incluye **validación automática de disponibilidad** y **sugerencias inteligentes de horarios** para evitar duplicados y optimizar la agenda.

---

## ✨ **Características principales**

### **1. Prevención de conflictos**
- ❌ **No permite citas duplicadas** en el mismo horario
- 🔍 **Verifica disponibilidad** antes de confirmar
- ⚠️ **Detecta solapamientos** de horarios
- 💡 **Sugiere alternativas** automáticamente

### **2. Sugerencias inteligentes**
- 🌅 **Horarios óptimos** según preferencia del cliente
- 📊 **Respeta horarios laborales** de la empresa
- 🎯 **Máximo 3 sugerencias** para no abrumar
- ⏱️ **Slots de 30 minutos** para máxima flexibilidad

### **3. Criterio de agendamiento**
- 🕐 **Preferencia mañana** (8:00 - 12:00)
- 🕑 **Preferencia tarde** (12:00 - 18:00)
- 🕖 **Preferencia noche** (18:00+)
- 🏢 **Horarios personalizados** desde Memoria de la empresa

---

## 🔄 **Flujo completo**

### **Escenario 1: Horario disponible**

```
Cliente: Quiero agendar para mañana a las 10am

Agente (verifica disponibilidad):
  ✅ Verificar_disponibilidad(fecha: 2026-06-01, hora: 10:00)
  → DISPONIBLE ✅

Agente: Perfecto, el 2026-06-01 a las 10:00 está disponible. 
        ¿Cuál es tu nombre para confirmar?

Cliente: Juan Pérez

Agente (crea cita):
  ✅ Crear_cita(nombreCliente: Juan Pérez, ...)
  → CITA CREADA ✅

Agente: Listo Juan, tu cita está agendada para mañana a las 10:00.
```

---

### **Escenario 2: Horario ocupado con sugerencias**

```
Cliente: Necesito cita para el viernes a las 3pm

Agente (verifica disponibilidad):
  ❌ Verificar_disponibilidad(fecha: 2026-06-05, hora: 15:00)
  → OCUPADO (conflicto: 14:30-16:00 - María García) ❌

Agente (busca alternativas):
  Sugerir_horarios(fecha: 2026-06-05, preferencia: tarde)
  → Disponible: 12:00, 16:30, 17:00

Agente: Lo siento, el viernes a las 3pm ya está ocupado. 
        ¿Te vendría bien a las 12:00, 16:30 o 17:00?

Cliente: A las 4:30pm perfecto

Agente: Excelente, ¿cuál es tu nombre?

Cliente: Carlos Ruiz

Agente (crea cita):
  ✅ Crear_cita(nombreCliente: Carlos Ruiz, hora: 16:30)
  → CITA CREADA ✅

Agente: Listo Carlos, tu cita está agendada para el viernes 
        a las 16:30.
```

---

### **Escenario 3: Cliente pide "por la mañana"**

```
Cliente: Quiero agendar el lunes por la mañana

Agente (detecta preferencia: "mañana"):
  Verificar_disponibilidad(fecha: 2026-06-08, preferencia: mañana)
  → Sugerir horarios de 8:00 a 12:00

Agente (busca disponibilidad):
  Sugerir_horarios(fecha: 2026-06-08, preferencia: mañana)
  → Disponible: 09:00, 10:00, 11:30

Agente: Tengo disponibilidad el lunes por la mañana a las 9:00, 
        10:00 o 11:30. ¿Cuál prefieres?

Cliente: A las 10

Agente: Perfecto, ¿cuál es tu nombre?

Cliente: Ana López

Agente (crea cita):
  ✅ Crear_cita(nombreCliente: Ana López, hora: 10:00)
  → CITA CREADA ✅

Agente: Listo Ana, tu cita está agendada para el lunes a las 10:00.
```

---

## 🧠 **Detección de preferencias**

El agente identifica automáticamente la preferencia horaria:

| Frase del cliente | Preferencia detectada | Rango sugerido |
|-------------------|----------------------|----------------|
| "por la mañana" | `mañana` | 8:00 - 12:00 |
| "temprano" | `mañana` | 8:00 - 12:00 |
| "a las 10am" | `mañana` | 8:00 - 12:00 |
| "por la tarde" | `tarde` | 12:00 - 18:00 |
| "a las 3pm" | `tarde` | 12:00 - 18:00 |
| "por la noche" | `noche` | 18:00 - 22:00 |
| "a las 7pm" | `noche` | 18:00 - 22:00 |
| *(sin especificar)* | `undefined` | Todo el horario laboral |

---

## ⚙️ **Configuración de horarios laborales**

### **Desde Memoria de la empresa:**

1. Ve a **Memoria** en el dashboard
2. Categoría: **Horarios**
3. Agrega entradas como:

| Clave | Valor |
|-------|-------|
| Lunes a Viernes | 9:00 - 18:00 |
| Sábados | 10:00 - 14:00 |
| Domingos | Cerrado |

### **Horarios por defecto** (si no hay configuración):
- Lunes a Viernes: 9:00 - 18:00
- Sábados y Domingos: Cerrado

---

## 🔍 **Lógica de validación**

### **Detección de conflictos:**

Una cita **tiene conflicto** si se solapa con otra en cualquiera de estos casos:

```typescript
// Caso 1: Nueva cita empieza durante una cita existente
Existente: 10:00 - 11:00
Nueva:     10:30 - 11:30  ❌ CONFLICTO

// Caso 2: Nueva cita termina durante una cita existente
Existente: 14:00 - 15:00
Nueva:     13:30 - 14:30  ❌ CONFLICTO

// Caso 3: Nueva cita cubre completamente una existente
Existente: 10:00 - 11:00
Nueva:     09:30 - 11:30  ❌ CONFLICTO

// Caso 4: Citas consecutivas (SIN conflicto)
Existente: 10:00 - 11:00
Nueva:     11:00 - 12:00  ✅ OK
```

### **Margen de seguridad:**
No se requiere margen entre citas. Las citas consecutivas (ej: 10:00-11:00 y 11:00-12:00) son válidas.

---

## 📊 **Algoritmo de sugerencias**

```typescript
1. Obtener horarios laborales de la empresa
2. Filtrar por preferencia del cliente (mañana/tarde/noche)
3. Generar slots de 30 minutos
4. Para cada slot:
   a. Verificar si hay conflicto con citas existentes
   b. Si está disponible, agregar a sugerencias
   c. Máximo 3 sugerencias
5. Retornar sugerencias ordenadas cronológicamente
```

---

## 💡 **Ventajas del sistema**

### **Para el negocio:**
- ✅ **Cero doble-reservas**: No más conflictos de horario
- 📈 **Optimización automática**: Llena huecos vacíos
- ⏰ **Respeta horarios laborales**: No agenda fuera de horario
- 📊 **Aprovecha mejor el tiempo**: Sugiere slots libres

### **Para los clientes:**
- 🎯 **Respuestas inmediatas**: Sabe al instante si hay disponibilidad
- 💬 **Lenguaje natural**: "por la mañana", "temprano", etc.
- 🔄 **Alternativas automáticas**: Si no hay, sugiere otros horarios
- ✨ **Experiencia fluida**: Sin esperas ni idas y vueltas

---

## 🧪 **Casos de prueba**

### **Prueba 1: Prevención de duplicados**

```bash
# Paso 1: Crear primera cita
Cliente A: "Quiero cita para mañana a las 10am"
→ CITA CREADA: 2026-06-01 10:00-11:00

# Paso 2: Intentar duplicar
Cliente B: "Necesito cita mañana a las 10am"
→ RECHAZADO: "Lo siento, mañana a las 10am ya está ocupado. 
              ¿Te vendría bien a las 11:00 o 12:00?"
```

### **Prueba 2: Sugerencias inteligentes**

```bash
Cliente: "Quiero cita el viernes por la tarde"
→ SUGERENCIAS: "Tengo disponibilidad el viernes por la tarde a las
                13:00, 15:30 o 17:00. ¿Cuál prefieres?"
```

### **Prueba 3: Sin disponibilidad**

```bash
# Día completamente lleno
Cliente: "Necesito cita el martes"
→ RESPUESTA: "Lo siento, no tengo disponibilidad el martes. 
              ¿Te gustaría otro día?"
```

---

## 🔧 **API interna**

### **`verificarDisponibilidad()`**

```typescript
verificarDisponibilidad(
  empresaId: string,
  fecha: string,      // "2026-06-01"
  hora: string,       // "10:00"
  duracion: number    // 60 (minutos)
): Promise<{
  disponible: boolean,
  conflictos: string[]  // ["10:30-11:30 (María García)"]
}>
```

### **`sugerirHorarios()`**

```typescript
sugerirHorarios(
  empresaId: string,
  fecha: string,                              // "2026-06-01"
  duracion: number,                           // 60
  preferencia?: "mañana" | "tarde" | "noche"  // opcional
): Promise<string[]>  // ["09:00", "10:30", "14:00"]
```

### **`determinarPreferencia()`**

```typescript
determinarPreferencia(
  texto: string  // "quiero por la mañana"
): "mañana" | "tarde" | "noche" | undefined
```

---

## 🎯 **Roadmap futuro**

- [ ] Margen de seguridad configurable entre citas
- [ ] Detección de "horas pico" y ajuste dinámico
- [ ] Sugerencias basadas en historial del cliente
- [ ] Bloqueo de horarios para descansos/almuerzos
- [ ] Detección de días festivos
- [ ] Capacidad múltiple (ej: 3 citas simultáneas en un spa)

---

**¡Tu sistema de agendamiento es ahora 100% libre de conflictos!** ⏰✅
