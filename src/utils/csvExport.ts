// CSV Export Utilities for Customer Rotation Calculator

export interface CsvRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface CsvSection {
  title: string;
  headers: string[];
  rows: CsvRow[];
}

export interface CsvExportOptions {
  filename?: string;
  includeTimestamp?: boolean;
  includeBOM?: boolean; // UTF-8 BOM for Thai language support
}

/**
 * Escapes and formats a value for CSV output
 */
export function formatCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If the value contains commas, quotes, or newlines, wrap it in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    // Escape any existing quotes by doubling them
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
}

/**
 * Converts an array of objects to CSV rows
 */
export function objectsToCsvRows(objects: CsvRow[]): string[] {
  if (objects.length === 0) return [];

  // Get all unique keys from all objects
  const allKeys = Array.from(
    new Set(objects.flatMap(obj => Object.keys(obj)))
  );

  const rows: string[] = [];

  // Add header row
  rows.push(allKeys.map(formatCsvValue).join(','));

  // Add data rows
  objects.forEach(obj => {
    const row = allKeys.map(key => formatCsvValue(obj[key]));
    rows.push(row.join(','));
  });

  return rows;
}

/**
 * Converts CSV sections to a complete CSV string
 */
export function sectionsToCSV(sections: CsvSection[]): string {
  const csvLines: string[] = [];

  sections.forEach((section, sectionIndex) => {
    // Add section title
    if (section.title) {
      csvLines.push(formatCsvValue(section.title));
      csvLines.push(''); // Empty line after title
    }

    // Add headers if provided
    if (section.headers && section.headers.length > 0) {
      csvLines.push(section.headers.map(formatCsvValue).join(','));
    }

    // Add data rows
    section.rows.forEach(row => {
      if (section.headers && section.headers.length > 0) {
        // Use headers as the key order
        const orderedValues = section.headers.map(header => formatCsvValue(row[header]));
        csvLines.push(orderedValues.join(','));
      } else {
        // Use object keys order
        const values = Object.values(row).map(formatCsvValue);
        csvLines.push(values.join(','));
      }
    });

    // Add empty line between sections (except for the last one)
    if (sectionIndex < sections.length - 1) {
      csvLines.push('');
    }
  });

  return csvLines.join('\n');
}

/**
 * Generates a timestamp-based filename
 */
export function generateFilename(baseName: string = 'export', extension: string = 'csv'): string {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    (now.getMonth() + 1).toString().padStart(2, '0'),
    now.getDate().toString().padStart(2, '0'),
    '_',
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
    now.getSeconds().toString().padStart(2, '0')
  ].join('');

  return `${baseName}_${timestamp}.${extension}`;
}

/**
 * Downloads CSV data as a file
 */
export function downloadCSV(csvContent: string, options: CsvExportOptions = {}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // Generate filename
      const filename = options.filename || generateFilename('customer_rotation_export');

      // Add UTF-8 BOM for proper Thai language support
      const bom = options.includeBOM !== false ? '\uFEFF' : '';
      const fullContent = bom + csvContent;

      // Create blob
      const blob = new Blob([fullContent], {
        type: 'text/csv;charset=utf-8;'
      });

      // Check if we can use the modern API
      if (typeof window !== 'undefined') {
        // Modern browsers
        if (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Firefox') || navigator.userAgent.includes('Safari')) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the URL object
          setTimeout(() => URL.revokeObjectURL(url), 100);
          resolve(true);
        } else {
          // Fallback for older browsers
          const reader = new FileReader();
          reader.onload = function() {
            const dataUrl = reader.result as string;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            link.click();
            resolve(true);
          };
          reader.onerror = () => reject(new Error('Failed to read blob'));
          reader.readAsDataURL(blob);
        }
      } else {
        reject(new Error('Window object not available'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates a simple CSV from a 2D array of data
 */
export function arrayToCSV(data: (string | number)[][]): string {
  return data
    .map(row => row.map(formatCsvValue).join(','))
    .join('\n');
}

/**
 * Validates CSV content for common issues
 */
export function validateCsvContent(csvContent: string): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  const lines = csvContent.split('\n');

  // Check for empty content
  if (!csvContent.trim()) {
    errors.push('CSV content is empty');
    return { isValid: false, warnings, errors };
  }

  // Check for consistent column counts
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  if (nonEmptyLines.length > 1) {
    const firstLineColumns = nonEmptyLines[0].split(',').length;
    const inconsistentLines = nonEmptyLines
      .map((line, index) => ({ line: line.split(',').length, index }))
      .filter(item => item.line !== firstLineColumns);

    if (inconsistentLines.length > 0) {
      warnings.push(`Inconsistent column counts found in lines: ${inconsistentLines.map(item => item.index + 1).join(', ')}`);
    }
  }

  // Check for potential encoding issues
  if (csvContent.includes('�')) {
    warnings.push('Potential encoding issues detected (replacement characters found)');
  }

  // Check file size (warn if over 10MB)
  const sizeInMB = new Blob([csvContent]).size / (1024 * 1024);
  if (sizeInMB > 10) {
    warnings.push(`Large file size: ${sizeInMB.toFixed(2)}MB`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
}