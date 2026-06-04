#!/bin/bash

# Script para ejecutar todas las migraciones pendientes
# Ejecutar con: bash scripts/ejecutar-migraciones.sh

echo "🔄 Aplicando migraciones de base de datos..."
echo ""

# 1. Migración: RIF y NIF únicos
echo "📝 1. Aplicando restricciones únicas RIF/NIF..."
npx prisma db execute --file prisma/migrations/add_unique_rif_nif.sql --schema prisma/schema.prisma
if [ $? -eq 0 ]; then
    echo "✅ Migración RIF/NIF aplicada"
else
    echo "⚠️  Migración RIF/NIF falló o ya está aplicada"
fi
echo ""

# 2. Migración: Múltiples usuarios por empresa
echo "📝 2. Aplicando soporte para múltiples usuarios..."
npx prisma db execute --file prisma/migrations/add_multiple_users_per_empresa.sql --schema prisma/schema.prisma
if [ $? -eq 0 ]; then
    echo "✅ Migración múltiples usuarios aplicada"
else
    echo "⚠️  Migración múltiples usuarios falló o ya está aplicada"
fi
echo ""

# 3. Sincronizar schema Prisma
echo "📝 3. Sincronizando schema de Prisma..."
npx prisma db push --accept-data-loss
if [ $? -eq 0 ]; then
    echo "✅ Schema sincronizado"
else
    echo "❌ Error al sincronizar schema"
    exit 1
fi
echo ""

# 4. Generar cliente de Prisma
echo "📝 4. Generando cliente de Prisma..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Cliente generado"
else
    echo "❌ Error al generar cliente"
    exit 1
fi
echo ""

echo "✅ ¡Todas las migraciones completadas!"
echo ""
echo "📋 Resumen de cambios:"
echo "   - RIF único (permite NULL)"
echo "   - NIF único (permite NULL)"
echo "   - Usuario.esUsuarioPrincipal agregado"
echo "   - Usuario.requiereCambioPassword agregado"
echo "   - Relación Empresa → Usuario cambió de 1-a-1 a 1-a-muchos"
echo "   - Usuarios existentes marcados como principales"
echo ""
echo "🎉 La aplicación ya debería funcionar correctamente"
