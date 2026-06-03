# 📱 Configuración Twilio WhatsApp Sandbox

## ⚠️ Estado Actual: SANDBOX MODE

El proyecto está usando **Twilio WhatsApp Sandbox** para desarrollo.

### 🔗 Conectar tu número

1. **Ir a:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. **Ver tu sandbox name** (ej: "join correct-tiger")
3. **Desde WhatsApp, enviar a:** +1 415 523 8886
4. **Mensaje:** `join <tu-sandbox-name>`

### ⏰ Limitaciones del Sandbox

- ❌ Expira cada **72 horas**
- ❌ Solo números pre-autorizados pueden usarlo
- ❌ Cada usuario debe hacer "join" primero
- ❌ No apto para producción

### ✅ Solución para Producción

Necesitas **Twilio WhatsApp Business API**:

1. Ir a: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders
2. Request Access to WhatsApp
3. Completar formulario de Facebook Business
4. Esperar aprobación (1-2 semanas)
5. Actualizar `TWILIO_WHATSAPP_FROM` con tu número aprobado

### 🔧 Configuración Actual

```env
TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"  # Sandbox
```

### 📞 Números Conectados

Cada vez que conectes un número nuevo al sandbox, agrega aquí:

- ✅ +351933896880 - Último join: [FECHA]
- [ ] Otro número...

### 🆘 Troubleshooting

**Error:** "Your number is not connected to a Sandbox"
- **Solución:** Enviar `join <sandbox-name>` desde WhatsApp

**Error:** "Sandbox expired"
- **Solución:** Reconectar enviando `join <sandbox-name>` nuevamente

**Error:** "Message not delivered"
- **Verificar:** Número tiene formato correcto (+351933896880)
- **Verificar:** Sandbox está activo en consola Twilio
