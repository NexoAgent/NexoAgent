const CHUNK_SIZE = 500;   // palabras por fragmento
const OVERLAP    = 50;    // palabras de solapamiento entre fragmentos

export function trocear(texto: string): string[] {
  const palabras = texto.split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];

  const chunks: string[] = [];
  let inicio = 0;

  while (inicio < palabras.length) {
    const fin = Math.min(inicio + CHUNK_SIZE, palabras.length);
    chunks.push(palabras.slice(inicio, fin).join(" "));
    if (fin === palabras.length) break;
    inicio = fin - OVERLAP;
  }

  return chunks;
}

// Busca los fragmentos más relevantes para una consulta
export function buscarRelevantes(
  query: string,
  chunks: { id: string; contenido: string; indice: number }[],
  topK = 5
): string[] {
  const palabrasClave = query
    .toLowerCase()
    .split(/\s+/)
    .filter((p) => p.length > 3);

  if (palabrasClave.length === 0) return chunks.slice(0, topK).map((c) => c.contenido);

  const puntuados = chunks.map((chunk) => {
    const texto = chunk.contenido.toLowerCase();
    const puntos = palabrasClave.reduce(
      (acc, palabra) => acc + (texto.includes(palabra) ? 1 : 0),
      0
    );
    return { ...chunk, puntos };
  });

  return puntuados
    .sort((a, b) => b.puntos - a.puntos || a.indice - b.indice)
    .slice(0, topK)
    .sort((a, b) => a.indice - b.indice)
    .map((c) => c.contenido);
}
