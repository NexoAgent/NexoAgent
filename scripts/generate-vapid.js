#!/usr/bin/env node

/**
 * Genera claves VAPID para push notifications
 * Uso: node scripts/generate-vapid.js
 */

const crypto = require('crypto');

function generateVAPIDKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'der'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der'
    }
  });

  const publicKeyBase64 = publicKey.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const privateKeyBase64 = privateKey.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64
  };
}

console.log('🔐 Generando claves VAPID para push notifications...\n');

const keys = generateVAPIDKeys();

console.log('✅ Claves generadas exitosamente!\n');
console.log('Agrega estas variables a tu .env.local y a Render:\n');
console.log('─'.repeat(60));
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:perofaga@gmail.com`);
console.log('─'.repeat(60));
console.log('\n⚠️  IMPORTANTE: Guarda la clave privada de forma segura!');
console.log('No la compartas ni la subas a Git.\n');
