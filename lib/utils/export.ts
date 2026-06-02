/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Exporta datos a CSV
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (data.length === 0) return;

  const cols = columns || Object.keys(data[0]).map((key) => ({ key: key as keyof T, label: key }));

  // Header
  const header = cols.map((col) => col.label).join(",");

  // Rows
  const rows = data.map((row) =>
    cols
      .map((col) => {
        const value = row[col.key];
        // Escapar comillas y comas
        const stringValue = String(value || "");
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csv = [header, ...rows].join("\n");

  downloadFile(csv, filename, "text/csv");
}

/**
 * Exporta datos a JSON
 */
export function exportToJSON<T>(data: T[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, "application/json");
}

/**
 * Descarga un archivo
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formatea fecha para nombres de archivo
 */
export function getExportFilename(prefix: string, extension: string): string {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  return `${prefix}_${date}_${time}.${extension}`;
}
