#!/bin/bash

# Script para aplicar migración de RIF/NIF únicos
# Ejecutar con: bash scripts/migrate-rif-nif.sh

echo "🔄 Aplicando migración de restricciones únicas RIF/NIF..."

# Ejecutar migración SQL usando Prisma
npx prisma db execute --file prisma/migrations/add_unique_rif_nif.sql --schema prisma/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Migración aplicada exitosamente"

    # Actualizar schema Prisma en la base de datos
    echo "🔄 Sincronizando schema Prisma..."
    npx prisma db push

    echo "✅ Schema sincronizado"
    echo ""
    echo "📝 Restricciones aplicadas:"
    echo "   - RIF: Único (permite NULL)"
    echo "   - NIF: Único (permite NULL)"
else
    echo "❌ Error al aplicar migración"
    exit 1
fi
