# 🤖 Agente IA con Creación Automática de Citas/Tareas

El agente de NexoAgent ahora puede **crear citas/tareas automáticamente** cuando los clientes las solicitan por WhatsApp.

---

## ✨ **Cómo funciona**

### **Flujo completo:**

```
Cliente (WhatsApp)
    ↓
    "Hola, quiero agendar una cita para mañana a las 3pm"
    ↓
Agente IA (Claude)
    ↓
    Detecta intención de agendar
    ↓
    Usa tool "crear_cita"
    ↓
Sistema NexoAgent
    ↓
    ✅ Crea cita en base de datos
    ✅ Crea contacto si no existe
    ✅ Sincroniza con Google Calendar (si está conectado)
    ↓
Agente IA responde
    ↓
    "Perfecto, he agendado tu cita para el 2026-06-01 a las 15:00. 
     Te llegará una confirmación."
    ↓
Cliente recibe confirmación
```

---

## 💬 **Ejemplos de conversaciones**

### **Ejemplo 1: Cliente proporciona toda la información**

```
Cliente: Hola, necesito agendar una cita para mañana a las 10am

Agente: ¡Perfecto! Para confirmar tu cita, necesito tu nombre completo.

Cliente: Juan Pérez

Agente: Excelente Juan, he agendado tu cita para mañana 1 de junio 
        a las 10:00 AM. La duración será de 1 hora. ¿Hay algo más 
        en que pueda ayudarte?
```

**✅ Resultado:** Cita creada automáticamente en BD + Google Calendar

---

### **Ejemplo 2: Cliente proporciona información parcial**

```
Cliente: Quiero agendar

Agente: ¡Claro! Con gusto te ayudo a agendar. ¿Para qué día y hora 
        te gustaría la cita?

Cliente: El viernes a las 2pm

Agente: Perfecto, viernes 5 de junio a las 2pm. ¿Cuál es tu nombre?

Cliente: María García

Agente: Listo María, tu cita está agendada para el viernes 5 de junio 
        a las 14:00. Te enviaré un recordatorio antes de la cita.
```

**✅ Resultado:** Cita creada con todos los datos

---

### **Ejemplo 3: Cliente quiere agendar con detalles**

```
Cliente: Hola, necesito agendar una consulta para el martes 10 de junio 
         a las 4:30pm. Es para una revisión de mi proyecto.

Agente: Entendido. Para completar tu cita, ¿me podrías dar tu nombre?

Cliente: Carlos Ruiz, mi tel es 5215512345678

Agente: Perfecto Carlos, he agendado tu consulta para el martes 10 de junio 
        a las 16:30. Motivo: Revisión de proyecto. ¿Te parece bien?

Cliente: Sí, perfecto

Agente: ¡Excelente! Tu cita está confirmada. Te espero el martes 10.
```

**✅ Resultado:** Cita creada con notas "Revisión de proyecto"

---

## 🛠️ **Datos que el agente captura**

El agente puede extraer automáticamente:

| Campo | Obligatorio | Ejemplo | Notas |
|-------|-------------|---------|-------|
| **nombreCliente** | ✅ | "Juan Pérez" | Nombre completo del cliente |
| **telefono** | ✅ | "5215512345678" | Del número de WhatsApp |
| **fecha** | ✅ | "2026-06-01" | Formato YYYY-MM-DD |
| **hora** | ✅ | "15:00" | Formato 24h HH:MM |
| **duracion** | ❌ | 60 | Minutos (default: 60) |
| **notas** | ❌ | "Consulta sobre..." | Detalles adicionales |

---

## 🧠 **Inteligencia del agente**

### **El agente entiende lenguaje natural:**

- ✅ "Mañana a las 3pm" → Calcula fecha correcta
- ✅ "El próximo viernes" → Identifica la fecha
- ✅ "En 2 días a las 10" → Calcula fecha + hora
- ✅ "15 de junio a las 4:30pm" → Formato correcto
- ✅ "Media hora de consulta" → duracion: 30

### **El agente pregunta lo que falta:**

Si el cliente no proporciona:
- ❓ Nombre → "¿Cuál es tu nombre?"
- ❓ Fecha → "¿Para qué día te gustaría?"
- ❓ Hora → "¿A qué hora prefieres?"

### **El agente NO crea cita si:**

- ❌ Cliente solo pregunta horarios disponibles
- ❌ Cliente pregunta precios
- ❌ Cliente quiere cancelar una cita existente
- ❌ Información incompleta y cliente no responde

---

## 📅 **Integración con Google Calendar**

Si la empresa tiene Google Calendar conectado:

1. **Cita creada** → Evento aparece en Google Calendar
2. **Cliente recibe** → Link directo al evento (futuro)
3. **Recordatorios** → Los de Google Calendar funcionan automáticamente
4. **Sincronización** → Bidireccional (cambios se reflejan en ambos lados)

---

## ⚙️ **Configuración técnica**

### **Tool Definition (Claude API)**

```typescript
{
  name: "crear_cita",
  description: "Crea una cita o tarea en el calendario cuando el cliente 
                solicita agendar. Úsala SOLO cuando el cliente confirme 
                fecha y hora específicas.",
  input_schema: {
    type: "object",
    properties: {
      nombreCliente: { type: "string", description: "Nombre completo" },
      telefono: { type: "string", description: "Número con código de país" },
      fecha: { type: "string", description: "YYYY-MM-DD" },
      hora: { type: "string", description: "HH:MM formato 24h" },
      duracion: { type: "number", description: "Minutos (default: 60)" },
      notas: { type: "string", description: "Detalles adicionales" }
    },
    required: ["nombreCliente", "telefono", "fecha", "hora"]
  }
}
```

### **Modelo utilizado**

- **Modelo**: `claude-haiku-4-5-20251001`
- **Max tokens**: 500
- **Tool calling**: Habilitado
- **Temperatura**: Default (1.0)

---

## 🎯 **Casos de uso**

### **1. Clínicas y consultorios médicos**
```
"Necesito agendar consulta con el doctor para el jueves"
→ Cita médica creada automáticamente
```

### **2. Salones de belleza y spas**
```
"Quiero cita para corte de cabello el sábado a las 11am"
→ Cita de servicio creada
```

### **3. Restaurantes**
```
"Reserva para 4 personas mañana a las 8pm"
→ Reservación creada (como cita/tarea)
```

### **4. Servicios profesionales**
```
"Necesito una asesoría el martes a las 3pm"
→ Cita de asesoría agendada
```

### **5. Entregas y logística**
```
"Quiero programar una entrega para el viernes a las 2pm"
→ Tarea de entrega creada
```

---

## 📊 **Ventajas vs. sistema manual**

| Aspecto | Manual | Automático (IA) |
|---------|--------|-----------------|
| **Tiempo de respuesta** | Horas/días | Inmediato (segundos) |
| **Disponibilidad** | Horario laboral | 24/7 |
| **Errores de transcripción** | Posibles | Ninguno |
| **Lenguaje natural** | Limitado | Total |
| **Sincronización** | Manual | Automática |
| **Recordatorios** | Manual | Automático (Google) |

---

## 🔮 **Próximas mejoras**

### **En desarrollo:**
- [ ] Envío de recordatorio automático 24h antes
- [ ] Confirmación por WhatsApp 1h antes
- [ ] Cancelación/reprogramación por WhatsApp
- [ ] Sugerencias de horarios disponibles
- [ ] Detección de conflictos de horario
- [ ] Envío de link de Google Meet automático

---

## 🧪 **Cómo probar**

### **Prueba 1: Cita simple**
1. Envía por WhatsApp: "Hola, quiero agendar para mañana a las 10am"
2. Responde con tu nombre cuando el agente pregunte
3. Ve a `/empresa/[id]/agenda` en el dashboard
4. ✅ Deberías ver la cita creada

### **Prueba 2: Con detalles**
1. Envía: "Necesito una consulta el viernes 7 de junio a las 3pm sobre mi proyecto"
2. Da tu nombre
3. Verifica que las notas incluyan "sobre mi proyecto"

### **Prueba 3: Google Calendar**
1. Conecta Google Calendar primero
2. Crea una cita por WhatsApp
3. Abre tu Google Calendar
4. ✅ La cita debe aparecer automáticamente

---

## 📞 **Soporte**

Si tienes dudas:
- Email: perofaga@gmail.com
- Revisa los logs en Render para debug
- Verifica que `ANTHROPIC_API_KEY` esté configurada

---

**¡Tu agente está listo para agendar citas automáticamente!** 🎉📅
