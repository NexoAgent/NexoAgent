#!/bin/bash
# Pre-Migration Checklist - Verifica que estés listo para migrar

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${BOLD}${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     ✅ Pre-Migration Check - NexoAgent                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${YELLOW}Verificando que tengas todo listo para migrar...${NC}"
echo ""

READY=true

# ═══════════════════════════════════════════════════════════
# 1. GIT
# ═══════════════════════════════════════════════════════════

echo -e "${BLUE}📦 Git y GitHub${NC}"
echo "──────────────────────────────────────────────────────"

# Check git installed
if command -v git &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} Git instalado: $(git --version | cut -d' ' -f3)"
else
    echo -e "  ${RED}❌${NC} Git no instalado"
    READY=false
fi

# Check git repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅${NC} Directorio es un repositorio Git"
else
    echo -e "  ${RED}❌${NC} No es un repositorio Git"
    READY=false
fi

# Check uncommitted changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} No hay cambios sin commitear"
else
    echo -e "  ${YELLOW}⚠️${NC}  Hay cambios sin commitear"
    echo -e "     ${YELLOW}→${NC} Ejecuta: git add -A && git commit -m 'pre-migration'"
fi

# Check remote
REMOTE=$(git remote get-url origin 2>/dev/null)
if [ -n "$REMOTE" ]; then
    echo -e "  ${GREEN}✅${NC} Remote configurado: $REMOTE"
else
    echo -e "  ${RED}❌${NC} No hay remote configurado"
    READY=false
fi

echo ""

# ═══════════════════════════════════════════════════════════
# 2. NODE & NPM
# ═══════════════════════════════════════════════════════════

echo -e "${BLUE}📦 Node.js & npm${NC}"
echo "──────────────────────────────────────────────────────"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✅${NC} Node.js instalado: $NODE_VERSION"

    # Check version >= 18
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        echo -e "     ${GREEN}→${NC} Versión compatible (>= 18)"
    else
        echo -e "     ${RED}→${NC} Versión muy antigua (requiere >= 18)"
        READY=false
    fi
else
    echo -e "  ${RED}❌${NC} Node.js no instalado"
    READY=false
fi

if command -v npm &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} npm instalado: $(npm --version)"
else
    echo -e "  ${RED}❌${NC} npm no instalado"
    READY=false
fi

# Check node_modules
if [ -d "node_modules" ]; then
    echo -e "  ${GREEN}✅${NC} Dependencias instaladas"
else
    echo -e "  ${YELLOW}⚠️${NC}  Dependencias no instaladas"
    echo -e "     ${YELLOW}→${NC} Ejecuta: npm install"
fi

echo ""

# ═══════════════════════════════════════════════════════════
# 3. DATABASE
# ═══════════════════════════════════════════════════════════

echo -e "${BLUE}🗄️  Base de Datos${NC}"
echo "──────────────────────────────────────────────────────"

if [ -f ".env" ] && grep -q "DATABASE_URL" .env; then
    echo -e "  ${GREEN}✅${NC} DATABASE_URL encontrado en .env"
else
    echo -e "  ${YELLOW}⚠️${NC}  DATABASE_URL no encontrado en .env"
fi

if command -v pg_dump &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} pg_dump instalado (para backups)"
else
    echo -e "  ${YELLOW}⚠️${NC}  pg_dump no instalado"
    echo -e "     ${YELLOW}→${NC} Instalar: brew install postgresql (macOS)"
fi

if [ -f "prisma/schema.prisma" ]; then
    echo -e "  ${GREEN}✅${NC} Schema de Prisma encontrado"
else
    echo -e "  ${RED}❌${NC} Schema de Prisma no encontrado"
    READY=false
fi

echo ""

# ═══════════════════════════════════════════════════════════
# 4. ACCOUNTS & CREDENTIALS
# ═══════════════════════════════════════════════════════════

echo -e "${BLUE}🔐 Cuentas y Credenciales${NC}"
echo "──────────────────────────────────────────────────────"

read -p "  ¿Tienes cuenta en Vercel? (y/n): " has_vercel
if [ "$has_vercel" = "y" ]; then
    echo -e "  ${GREEN}✅${NC} Cuenta de Vercel lista"
else
    echo -e "  ${YELLOW}⚠️${NC}  Necesitas crear cuenta en Vercel"
    echo -e "     ${YELLOW}→${NC} Ir a: https://vercel.com/signup"
fi

read -p "  ¿Tienes las credenciales de Twilio? (y/n): " has_twilio
if [ "$has_twilio" = "y" ]; then
    echo -e "  ${GREEN}✅${NC} Credenciales de Twilio listas"
else
    echo -e "  ${YELLOW}⚠️${NC}  Necesitas tener TWILIO_ACCOUNT_SID y AUTH_TOKEN"
fi

read -p "  ¿Tienes VAPID keys para push notifications? (y/n): " has_vapid
if [ "$has_vapid" = "y" ]; then
    echo -e "  ${GREEN}✅${NC} VAPID keys listas"
else
    echo -e "  ${YELLOW}⚠️${NC}  Puedes generar VAPID keys con: node scripts/generate-vapid.js"
fi

echo ""

# ═══════════════════════════════════════════════════════════
# 5. OPTIONAL
# ═══════════════════════════════════════════════════════════

echo -e "${BLUE}🌐 Opcional${NC}"
echo "──────────────────────────────────────────────────────"

read -p "  ¿Tienes un dominio propio? (y/n): " has_domain
if [ "$has_domain" = "y" ]; then
    echo -e "  ${GREEN}✅${NC} Dominio listo para configurar"
    read -p "     ¿Cuál es? " domain_name
    echo -e "     ${BLUE}→${NC} Lo configurarás durante la migración"
else
    echo -e "  ${YELLOW}ℹ️${NC}  Puedes usar el dominio gratuito de Vercel (.vercel.app)"
fi

read -p "  ¿Quieres migrar la BD a Supabase? (y/n): " use_supabase
if [ "$use_supabase" = "y" ]; then
    echo -e "  ${GREEN}✅${NC} Migrarás a Supabase (recomendado)"

    read -p "     ¿Ya creaste el proyecto en Supabase? (y/n): " has_supabase
    if [ "$has_supabase" = "n" ]; then
        echo -e "     ${YELLOW}→${NC} Lo crearás durante la migración"
    fi
else
    echo -e "  ${YELLOW}ℹ️${NC}  Mantendrás tu BD actual"
fi

echo ""
echo ""

# ═══════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════

echo -e "${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║                    📊 RESUMEN                            ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$READY" = true ]; then
    echo -e "${GREEN}${BOLD}✅ ¡Estás listo para migrar!${NC}"
    echo ""
    echo -e "${BLUE}Siguiente paso:${NC}"
    echo ""
    echo -e "  ${BOLD}./scripts/migrate.sh${NC}"
    echo ""
    echo -e "Tiempo estimado: ${YELLOW}45-60 minutos${NC}"
    echo ""
else
    echo -e "${RED}${BOLD}❌ Aún no estás listo para migrar${NC}"
    echo ""
    echo -e "${YELLOW}Completa los requisitos marcados arriba con ❌${NC}"
    echo ""
    echo "Requisitos mínimos:"
    echo "  - Git instalado y repo configurado"
    echo "  - Node.js >= 18"
    echo "  - Cuenta de Vercel"
    echo "  - Prisma schema"
    echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Crear archivo de reporte
REPORT_FILE="pre-migration-report.txt"
cat > "$REPORT_FILE" << EOF
Pre-Migration Check Report
Generado: $(date)

Git Status:
$(git status 2>&1 || echo "N/A")

Node Version: $(node --version 2>&1 || echo "Not installed")
npm Version: $(npm --version 2>&1 || echo "Not installed")

Remote: $(git remote get-url origin 2>&1 || echo "N/A")

Vercel Account: $has_vercel
Twilio Credentials: $has_twilio
VAPID Keys: $has_vapid
Domain: ${domain_name:-"None"}
Supabase: $use_supabase

Status: $(if [ "$READY" = true ]; then echo "READY ✅"; else echo "NOT READY ❌"; fi)
EOF

echo -e "${YELLOW}📄 Reporte guardado en: $REPORT_FILE${NC}"
echo ""
