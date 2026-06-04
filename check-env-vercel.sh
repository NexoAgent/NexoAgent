#!/bin/bash
echo "Verificando variables de entorno en Vercel..."
vercel env ls production 2>&1 | grep -E "VAPID|NEXT_PUBLIC"
