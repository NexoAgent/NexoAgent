/**
 * Skip links para navegación accesible
 * Permite saltar al contenido principal
 */
export default function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#navigation"
        className="fixed top-4 left-40 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Saltar a navegación
      </a>
    </div>
  );
}
