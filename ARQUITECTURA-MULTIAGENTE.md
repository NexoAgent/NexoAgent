# Arquitectura Multi-Agente y Multi-WhatsApp

## 🎯 Objetivo

Transformar NexoAgent en un sistema escalable con:
- **Múltiples números de WhatsApp** por empresa
- **Múltiples agentes especializados** por empresa
- **Planes comerciales** con límites configurables

## 📊 Modelo de Planes Propuesto

### PLAN STARTER - $49/mes
- ✅ 1 número de WhatsApp
- ✅ Hasta 3 agentes virtuales
- ✅ 500 conversaciones/mes
- ✅ Base de conocimiento básica
- ✅ Agentes: Atención Cliente, Comercial, Administrativo

### PLAN BUSINESS - $149/mes
- ✅ Hasta 3 números de WhatsApp
- ✅ Hasta 10 agentes virtuales
- ✅ 2,000 conversaciones/mes
- ✅ Base de conocimiento avanzada
- ✅ Agentes personalizables
- ✅ Horarios por agente
- ✅ Transferencia entre agentes

### PLAN CORPORATIVO - $399/mes
- ✅ Hasta 10 números de WhatsApp
- ✅ Agentes ilimitados
- ✅ 10,000 conversaciones/mes
- ✅ Base de conocimiento ilimitada
- ✅ Agentes completamente personalizables
- ✅ Ruteo inteligente
- ✅ Analytics avanzados
- ✅ API personalizada

## 🗄️ Cambios en Base de Datos

### 1. Nueva tabla `Plan`

```prisma
model Plan {
  id                    String    @id @default(cuid())
  nombre                String    // "STARTER", "BUSINESS", "CORPORATIVO"
  descripcion           String?
  precio                Float     // Precio mensual
  maxWhatsApps          Int       // 1, 3, 10
  maxAgentes            Int       // 3, 10, -1 (ilimitado)
  maxConversacionesMes  Int       // 500, 2000, 10000
  maxDocumentosMB       Int       // 10, 100, -1 (ilimitado)
  
  // Features
  transferenciaAgentes  Boolean   @default(false)
  ruteoInteligente      Boolean   @default(false)
  analyticsAvanzados    Boolean   @default(false)
  apiPersonalizada      Boolean   @default(false)
  soportePrioritario    Boolean   @default(false)
  
  empresas              Empresa[]
  creadoEn              DateTime  @default(now())
  actualizadoEn         DateTime  @updatedAt
}
```

### 2. Modificar `Empresa`

```prisma
model Empresa {
  id                String              @id @default(cuid())
  nombre            String
  rif               String?
  email             String?
  responsable       String?
  
  // Plan y límites
  planId            String
  plan              Plan                @relation(fields: [planId], references: [id])
  estadoPlan        EstadoPlan          @default(ACTIVO) // ACTIVO, SUSPENDIDO, CANCELADO
  fechaVencimiento  DateTime?           // Para suscripción
  
  // Contadores mensuales (resetear cada mes)
  conversacionesEsteMes Int            @default(0)
  ultimoResetContador   DateTime       @default(now())
  
  // Relaciones actualizadas
  numerosWhatsApp   NumeroWhatsApp[]    // ¡Múltiples números!
  agentes           Agente[]            // ¡Múltiples agentes!
  conversaciones    Conversacion[]
  contactos         Contacto[]
  documentos        Documento[]
  memoria           Memoria[]
  citas             Cita[]
  automatizaciones  Automatizacion[]
  usuario           Usuario?
  
  // Configuración general (se hereda a todos los agentes si no tienen propia)
  promptSistema     String              @default("Eres un asistente virtual...")
  
  creadoEn          DateTime            @default(now())
  actualizadoEn     DateTime            @updatedAt
}

enum EstadoPlan {
  ACTIVO
  SUSPENDIDO
  CANCELADO
  TRIAL
}
```

### 3. Nueva tabla `NumeroWhatsApp`

```prisma
model NumeroWhatsApp {
  id                String         @id @default(cuid())
  empresaId         String
  empresa           Empresa        @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  
  numero            String         @unique // "+14155238886"
  nombre            String         // "WhatsApp Principal", "Ventas", "Soporte"
  descripcion       String?
  
  // Configuración
  activo            Boolean        @default(true)
  agenteDefaultId   String?        // Agente por defecto para este número
  agenteDefault     Agente?        @relation(fields: [agenteDefaultId], references: [id])
  
  // Horarios
  horaInicio        String?        // "09:00"
  horaFin           String?        // "18:00"
  diasSemana        String[]       // ["LUNES", "MARTES", ...]
  mensajeFueraHorario String?      // Respuesta automática fuera de horario
  
  // Estadísticas
  totalConversaciones Int          @default(0)
  totalMensajes       Int          @default(0)
  
  conversaciones    Conversacion[]
  
  creadoEn          DateTime       @default(now())
  actualizadoEn     DateTime       @updatedAt
  
  @@unique([empresaId, numero])
}
```

### 4. Nueva tabla `Agente`

```prisma
model Agente {
  id                String              @id @default(cuid())
  empresaId         String
  empresa           Empresa             @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  
  nombre            String              // "Atención al Cliente", "Ventas", "Soporte Técnico"
  tipo              TipoAgente          // ATENCION_CLIENTE, COMERCIAL, ADMINISTRATIVO, PERSONALIZADO
  descripcion       String?
  
  // Personalización
  promptSistema     String              // Prompt específico del agente
  activo            Boolean             @default(true)
  
  // Conocimiento específico
  documentosIds     String[]            // IDs de documentos específicos de este agente
  memoriasIds       String[]            // IDs de memorias específicas
  
  // Capacidades
  puedeAgendarCitas Boolean             @default(false)
  puedeTransferir   Boolean             @default(false)
  puedeEscalar      Boolean             @default(true)
  
  // Detección de intenciones (keywords para ruteo)
  keywords          String[]            // ["precio", "comprar", "cotización"] para agente comercial
  
  // Estadísticas
  conversacionesAtendidas Int           @default(0)
  satisfaccionPromedio    Float?
  
  // Relaciones
  numerosWhatsApp   NumeroWhatsApp[]    // Como agente por defecto
  conversaciones    Conversacion[]      // Conversaciones atendidas por este agente
  transferenciasOrigen TransferenciaAgente[] @relation("AgenteOrigen")
  transferenciasDestino TransferenciaAgente[] @relation("AgenteDestino")
  
  creadoEn          DateTime            @default(now())
  actualizadoEn     DateTime            @updatedAt
  
  @@unique([empresaId, nombre])
}

enum TipoAgente {
  ATENCION_CLIENTE
  COMERCIAL
  ADMINISTRATIVO
  SOPORTE_TECNICO
  RECURSOS_HUMANOS
  PERSONALIZADO
}
```

### 5. Nueva tabla `TransferenciaAgente`

```prisma
model TransferenciaAgente {
  id                String       @id @default(cuid())
  conversacionId    String
  conversacion      Conversacion @relation(fields: [conversacionId], references: [id], onDelete: Cascade)
  
  agenteOrigenId    String
  agenteOrigen      Agente       @relation("AgenteOrigen", fields: [agenteOrigenId], references: [id])
  
  agenteDestinoId   String
  agenteDestino     Agente       @relation("AgenteDestino", fields: [agenteDestinoId], references: [id])
  
  razon             String       // "Cliente solicitó hablar con ventas"
  mensajeCliente    String?      // Mensaje del cliente que activó la transferencia
  
  creadoEn          DateTime     @default(now())
}
```

### 6. Modificar `Conversacion`

```prisma
model Conversacion {
  id                String              @id @default(cuid())
  empresaId         String
  empresa           Empresa             @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  
  // Asociar a número específico de WhatsApp
  numeroWhatsAppId  String
  numeroWhatsApp    NumeroWhatsApp      @relation(fields: [numeroWhatsAppId], references: [id])
  
  numeroCliente     String
  contactoId        String?
  contacto          Contacto?           @relation(fields: [contactoId], references: [id])
  
  // Agente actual que maneja la conversación
  agenteActualId    String?
  agenteActual      Agente?             @relation(fields: [agenteActualId], references: [id])
  
  modoHumano        Boolean             @default(false)
  
  mensajes          Mensaje[]
  transferencias    TransferenciaAgente[]
  
  creadoEn          DateTime            @default(now())
  actualizadoEn     DateTime            @updatedAt
  
  @@unique([empresaId, numeroWhatsAppId, numeroCliente])
}
```

## 🔄 Flujo de Trabajo Multi-Agente

### Flujo 1: Mensaje Nuevo

```
1. Cliente envía mensaje por WhatsApp
   ↓
2. Webhook identifica número WhatsApp receptor
   ↓
3. Busca/crea conversación asociada a ese número
   ↓
4. Determina agente apropiado:
   a) Si hay agenteActual → usar ese
   b) Si no → usar agenteDefault del número
   c) Si no → ruteo inteligente por keywords
   ↓
5. Generar respuesta con contexto del agente
   ↓
6. Evaluar si necesita transferencia a otro agente
```

### Flujo 2: Transferencia entre Agentes

```
Cliente: "Quiero información de precios"
   ↓
Agente Atención: Detecta keyword "precios"
   ↓
Sistema: Transfiere a Agente Comercial
   ↓
Registra TransferenciaAgente
   ↓
Agente Comercial: Toma control de la conversación
   ↓
Cliente recibe: "Te conecto con nuestro agente comercial..."
```

## 🎨 Cambios en UI

### 1. Admin: Gestión de Planes

**Nueva página:** `/admin/planes`

```
┌─────────────────────────────────────┐
│ Planes Disponibles                  │
├─────────────────────────────────────┤
│                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐│
│  │STARTER │  │BUSINESS│  │CORPORA ││
│  │ $49/mes│  │$149/mes│  │$399/mes││
│  │        │  │        │  │        ││
│  │1 WA    │  │3 WA    │  │10 WA   ││
│  │3 Agent.│  │10 Agent│  │Ilimitad││
│  └────────┘  └────────┘  └────────┘│
│                                     │
│  [+ Crear Nuevo Plan]               │
└─────────────────────────────────────┘
```

### 2. Empresa: Gestión de Números WhatsApp

**Nueva página:** `/empresa/[id]/numeros-whatsapp`

```
┌─────────────────────────────────────┐
│ Números WhatsApp    [+ Agregar]     │
├─────────────────────────────────────┤
│                                     │
│ 📱 +1 415 523 8886 - Principal      │
│    Agente: Atención al Cliente      │
│    Estado: ● Activo                 │
│    Conversaciones: 145              │
│    [Configurar] [Horarios]          │
│                                     │
│ 📱 +1 415 523 8887 - Ventas         │
│    Agente: Comercial                │
│    Estado: ● Activo                 │
│    Conversaciones: 89               │
│    [Configurar] [Horarios]          │
│                                     │
│ ⚠️ Límite: 1/3 números (Business)   │
└─────────────────────────────────────┘
```

### 3. Empresa: Gestión de Agentes

**Nueva página:** `/empresa/[id]/agentes`

```
┌─────────────────────────────────────┐
│ Agentes Virtuales  [+ Crear Agente] │
├─────────────────────────────────────┤
│                                     │
│ 🤖 Atención al Cliente              │
│    Tipo: ATENCION_CLIENTE           │
│    Conversaciones: 234              │
│    Satisfacción: ⭐ 4.8/5            │
│    Keywords: ayuda, problema, duda  │
│    [Editar] [Prompt] [Conocimiento] │
│                                     │
│ 💼 Agente Comercial                 │
│    Tipo: COMERCIAL                  │
│    Conversaciones: 156              │
│    Satisfacción: ⭐ 4.9/5            │
│    Keywords: precio, comprar, cuota │
│    [Editar] [Prompt] [Conocimiento] │
│                                     │
│ ⚠️ Límite: 2/10 agentes (Business)  │
└─────────────────────────────────────┘
```

### 4. Dashboard: Vista de Conversaciones

```
┌─────────────────────────────────────┐
│ Conversaciones                      │
├─────────────────────────────────────┤
│                                     │
│ 💬 +52 555 1234 5678                │
│    📱 Principal  🤖 Atención Cliente│
│    "Tengo un problema con..."       │
│    Hace 5 min                       │
│                                     │
│ 💬 +52 555 9876 5432                │
│    📱 Ventas  🤖 Comercial          │
│    "¿Cuánto cuesta el..."           │
│    🔄 Transferido de: Atención      │
│    Hace 15 min                      │
└─────────────────────────────────────┘
```

## 💻 Implementación del Webhook

### Nuevo flujo del webhook:

```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  const body = formData.get("Body") as string;
  const from = formData.get("From") as string; // Cliente
  const to = formData.get("To") as string;     // Número WhatsApp receptor
  
  // 1. Identificar número WhatsApp
  const numeroWhatsApp = await prisma.numeroWhatsApp.findUnique({
    where: { numero: to.replace("whatsapp:", "") },
    include: { empresa: true, agenteDefault: true }
  });
  
  if (!numeroWhatsApp) {
    return twiml("Número no configurado");
  }
  
  // 2. Buscar/crear conversación
  let conversacion = await prisma.conversacion.findUnique({
    where: {
      empresaId_numeroWhatsAppId_numeroCliente: {
        empresaId: numeroWhatsApp.empresaId,
        numeroWhatsAppId: numeroWhatsApp.id,
        numeroCliente: from.replace("whatsapp:", "")
      }
    },
    include: { agenteActual: true }
  });
  
  if (!conversacion) {
    conversacion = await prisma.conversacion.create({
      data: {
        empresaId: numeroWhatsApp.empresaId,
        numeroWhatsAppId: numeroWhatsApp.id,
        numeroCliente: from.replace("whatsapp:", ""),
        agenteActualId: numeroWhatsApp.agenteDefaultId // Agente por defecto
      },
      include: { agenteActual: true }
    });
  }
  
  // 3. Determinar agente apropiado
  const agente = await determinarAgente(
    conversacion,
    body,
    numeroWhatsApp.empresa
  );
  
  // 4. Si cambió de agente, registrar transferencia
  if (agente.id !== conversacion.agenteActualId) {
    await registrarTransferencia(
      conversacion.id,
      conversacion.agenteActualId!,
      agente.id,
      body
    );
    
    await prisma.conversacion.update({
      where: { id: conversacion.id },
      data: { agenteActualId: agente.id }
    });
  }
  
  // 5. Generar respuesta con contexto del agente
  const respuesta = await generarRespuestaAgente(
    agente,
    conversacion,
    body,
    numeroWhatsApp.empresa
  );
  
  return twiml(respuesta);
}

async function determinarAgente(
  conversacion: Conversacion,
  mensaje: string,
  empresa: Empresa
): Promise<Agente> {
  // Si ya tiene agente y no solicita cambio
  if (conversacion.agenteActual && !solicitaCambioAgente(mensaje)) {
    return conversacion.agenteActual;
  }
  
  // Ruteo inteligente por keywords
  const agentes = await prisma.agente.findMany({
    where: { empresaId: empresa.id, activo: true }
  });
  
  const mensajeLower = mensaje.toLowerCase();
  
  for (const agente of agentes) {
    const tieneKeyword = agente.keywords.some(k => 
      mensajeLower.includes(k.toLowerCase())
    );
    
    if (tieneKeyword) {
      return agente;
    }
  }
  
  // Por defecto, retornar agente de atención al cliente
  return agentes.find(a => a.tipo === "ATENCION_CLIENTE") || agentes[0];
}
```

## 📈 Plan de Implementación

### FASE 1: Planes y Límites (1-2 días)
- [ ] Migración: Agregar tabla `Plan`
- [ ] Migración: Modificar `Empresa` con `planId`
- [ ] Seeder: Crear 3 planes básicos
- [ ] UI: Selector de plan al crear empresa
- [ ] Validación: Middleware para verificar límites

### FASE 2: Múltiples WhatsApp (2-3 días)
- [ ] Migración: Agregar tabla `NumeroWhatsApp`
- [ ] Migración: Modificar `Conversacion` con `numeroWhatsAppId`
- [ ] UI: `/empresa/[id]/numeros-whatsapp`
- [ ] Webhook: Identificar número receptor
- [ ] Validación: Límite según plan

### FASE 3: Sistema de Agentes (3-4 días)
- [ ] Migración: Agregar tabla `Agente`
- [ ] Migración: Agregar tabla `TransferenciaAgente`
- [ ] UI: `/empresa/[id]/agentes`
- [ ] Lógica: Ruteo por keywords
- [ ] Lógica: Transferencia entre agentes

### FASE 4: Testing y Optimización (1-2 días)
- [ ] Tests de ruteo
- [ ] Tests de límites
- [ ] Dashboard de analytics
- [ ] Documentación

## 💰 Consideraciones Comerciales

### Precios Sugeridos (México)

- **STARTER**: $999 MXN/mes (~$49 USD)
- **BUSINESS**: $2,999 MXN/mes (~$149 USD)
- **CORPORATIVO**: $7,999 MXN/mes (~$399 USD)

### Add-ons Opcionales

- **WhatsApp adicional**: $299 MXN/mes
- **Agente adicional**: $199 MXN/mes
- **1,000 conversaciones extra**: $499 MXN
- **Soporte 24/7**: $1,499 MXN/mes

### Estrategia de Migración

1. Empresas actuales → STARTER gratis por 3 meses
2. Después → Elegir plan o mantener STARTER
3. Trial gratuito 14 días para nuevos clientes

## 🎯 Valor Agregado

### Para el Cliente:
- ✅ Escala según necesidad
- ✅ Un agente por especialidad
- ✅ Mejor experiencia para el usuario final
- ✅ ROI medible por agente

### Para tu Negocio:
- ✅ Revenue recurrente predecible
- ✅ Upselling natural
- ✅ Diferenciación competitiva
- ✅ Expansión por cuenta

## 🚀 Estimación Total

- **Desarrollo**: 8-10 días
- **Testing**: 2-3 días
- **Documentación**: 1 día
- **Total**: ~2 semanas

¿Quieres que empecemos con la FASE 1?
