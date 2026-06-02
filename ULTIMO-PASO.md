# ⚡ ÚLTIMO PASO - 2 MINUTOS

## ✅ TODO LISTO:

- ✅ Código en GitHub
- ✅ Database migrada ✨
- ✅ Build verificado
- ✅ Variables en `.env.production`

---

## 🎯 CREAR WEB SERVICE:

### 1. Ve a Render
https://dashboard.render.com

### 2. New Web Service
- Click "New +" → "Web Service"
- Conecta GitHub
- Selecciona **NexoAgent/NexoAgent**

### 3. Config
```
Name: nexoagent
Build: npm install && npx prisma generate && npm run build  
Start: npm start
Plan: Free
```

### 4. Variables
Copia de `.env.production`:
```bash
cat .env.production
```

Pégalas en Render (Environment tab)

### 5. Create!
Click "Create Web Service"

---

## ✅ Verificar (3-5 min después):
```
https://nexoagent.onrender.com/api/health
```

## 🎉 DONE!
