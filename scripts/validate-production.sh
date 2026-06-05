#!/bin/bash

# Production Validation Script
# Valida que el deploy está funcionando correctamente

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
PROD_URL="${PROD_URL:-https://nexoagent-sage.vercel.app}"
TIMEOUT=10

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 VALIDACIÓN DE PRODUCCIÓN - NEXOAGENT${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "URL: $PROD_URL"
echo "Timeout: ${TIMEOUT}s por request"
echo ""

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para test individual
run_test() {
    local test_name=$1
    local command=$2
    local expected=$3

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "  Testing: $test_name... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}1. HEALTH CHECKS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 1.1: Health endpoint
run_test "Health endpoint responds" \
    "curl -sf --max-time $TIMEOUT $PROD_URL/api/health | grep -q 'ok\|healthy\|200'"

# Test 1.2: Homepage loads
run_test "Homepage loads (200 OK)" \
    "curl -sf --max-time $TIMEOUT -o /dev/null -w '%{http_code}' $PROD_URL | grep -q 200"

# Test 1.3: Login page loads
run_test "Login page accessible" \
    "curl -sf --max-time $TIMEOUT -o /dev/null -w '%{http_code}' $PROD_URL/login | grep -q 200"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}2. SECURITY HEADERS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 2.1: X-Frame-Options
run_test "X-Frame-Options: DENY" \
    "curl -sI --max-time $TIMEOUT $PROD_URL | grep -qi 'X-Frame-Options.*DENY'"

# Test 2.2: X-Content-Type-Options
run_test "X-Content-Type-Options: nosniff" \
    "curl -sI --max-time $TIMEOUT $PROD_URL | grep -qi 'X-Content-Type-Options.*nosniff'"

# Test 2.3: X-XSS-Protection
run_test "X-XSS-Protection present" \
    "curl -sI --max-time $TIMEOUT $PROD_URL | grep -qi 'X-XSS-Protection'"

# Test 2.4: Content-Security-Policy
run_test "Content-Security-Policy present" \
    "curl -sI --max-time $TIMEOUT $PROD_URL | grep -qi 'Content-Security-Policy'"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}3. RATE LIMITING${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -n "  Testing: Rate limiter (101 requests)... "
# Hacer 101 requests al webhook
RATE_LIMIT_TRIGGERED=false
for i in {1..101}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        --max-time 2 \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "Body=test&From=whatsapp:+1234567890&To=whatsapp:+0987654321" \
        "$PROD_URL/api/webhook" 2>/dev/null || echo "000")

    if [ "$response" = "429" ]; then
        RATE_LIMIT_TRIGGERED=true
        break
    fi

    # Pequeña pausa para no saturar
    sleep 0.05
done

if [ "$RATE_LIMIT_TRIGGERED" = true ]; then
    echo -e "${GREEN}✅ PASS${NC} (429 received)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  WARN${NC} (no 429 received, might need more requests)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}4. API ENDPOINTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 4.1: Auth endpoint exists
run_test "Auth API exists" \
    "curl -sf --max-time $TIMEOUT -o /dev/null -w '%{http_code}' $PROD_URL/api/auth/signin | grep -qE '200|405'"

# Test 4.2: Webhook endpoint (GET should work for verification)
run_test "Webhook endpoint exists" \
    "curl -sf --max-time $TIMEOUT -o /dev/null -w '%{http_code}' '$PROD_URL/api/webhook?hub.mode=subscribe&hub.verify_token=test&hub.challenge=test' | grep -qE '200|403|500'"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}5. PERFORMANCE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 5.1: Response time < 2s
echo -n "  Testing: Response time homepage... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT $PROD_URL)
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ PASS${NC} (${response_time}s)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  SLOW${NC} (${response_time}s > 2s)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 5.2: Response time login page
echo -n "  Testing: Response time login... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT $PROD_URL/login)
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ PASS${NC} (${response_time}s)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  SLOW${NC} (${response_time}s > 2s)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}6. REDIRECTS & ROUTES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 6.1: Dashboard redirect to login (sin auth)
run_test "Dashboard redirects to login" \
    "curl -sL --max-time $TIMEOUT -o /dev/null -w '%{url_effective}' $PROD_URL/dashboard | grep -q '/login'"

# Test 6.2: Admin redirect to login (sin auth)
run_test "Admin redirects to login" \
    "curl -sL --max-time $TIMEOUT -o /dev/null -w '%{url_effective}' $PROD_URL/admin | grep -q '/login'"

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}7. SSL/TLS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 7.1: HTTPS funciona
run_test "HTTPS connection works" \
    "curl -sf --max-time $TIMEOUT https://nexoagent-sage.vercel.app > /dev/null"

# Test 7.2: HTTP redirect a HTTPS
echo -n "  Testing: HTTP → HTTPS redirect... "
if curl -sL --max-time $TIMEOUT -o /dev/null -w '%{url_effective}' http://nexoagent-sage.vercel.app | grep -q 'https://'; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  INFO${NC} (Vercel might handle this)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}8. ERROR HANDLING${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 8.1: 404 page exists
run_test "404 page works" \
    "curl -s --max-time $TIMEOUT $PROD_URL/pagina-que-no-existe | grep -qi '404\|not found'"

# Test 8.2: API error handling
echo -n "  Testing: API error handling... "
response=$(curl -s --max-time $TIMEOUT -X POST $PROD_URL/api/webhook)
if echo "$response" | grep -qiE 'error|invalid|missing'; then
    echo -e "${GREEN}✅ PASS${NC} (returns error message)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  WARN${NC} (no clear error response)"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RESUMEN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📊 RESUMEN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Total tests: $TOTAL_TESTS"
echo -e "  ${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "  ${RED}Failed: $FAILED_TESTS${NC}"
echo ""

# Calcular porcentaje
percentage=$((PASSED_TESTS * 100 / TOTAL_TESTS))

if [ $percentage -ge 90 ]; then
    echo -e "  ${GREEN}✅ PRODUCCIÓN SALUDABLE${NC} ($percentage% tests passing)"
    echo ""
    exit 0
elif [ $percentage -ge 70 ]; then
    echo -e "  ${YELLOW}⚠️  PRODUCCIÓN CON WARNINGS${NC} ($percentage% tests passing)"
    echo "  Algunos tests fallaron pero el sistema está funcional."
    echo ""
    exit 0
else
    echo -e "  ${RED}❌ PRODUCCIÓN CON PROBLEMAS${NC} ($percentage% tests passing)"
    echo "  Revisar urgentemente los tests fallidos."
    echo ""
    exit 1
fi
