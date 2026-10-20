import * as XLSX from 'xlsx';

export async function parseUploadedFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Excel spreadsheets (.xlsx, .xls)
  if (extension === 'xlsx' || extension === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let combinedText = `File Name: ${file.name}\n`;

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      combinedText += `\n--- Sheet: ${sheetName} ---\n${csvData}\n`;
    }
    return combinedText;
  }

  // Plain text, CSV, Markdown, JSON
  if (['csv', 'txt', 'md', 'json', 'log', 'tsv'].includes(extension || '')) {
    return await file.text();
  }

  // Default fallback text representation
  try {
    return await file.text();
  } catch (err) {
    return `[Attached file: ${file.name} (${Math.round(file.size / 1024)} KB)]`;
  }
}

export function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64Data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type || 'image/png';
      resolve({ data: base64Data, mimeType });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
