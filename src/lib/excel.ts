import * as XLSX from 'xlsx';
import { BulkUploadResult, Job } from '../types';

/**
 * Downloads a sample Excel (.xlsx) template for bulk job uploads
 */
export function downloadExcelTemplate(): void {
  const sampleData = [
    {
      Title: 'Senior Electrical Engineer',
      Category: 'Construction',
      Location: 'Riyadh',
      Description: 'Seeking an experienced electrical engineer for commercial site development in NEOM / Riyadh.',
      Requirements: 'B.Sc in Electrical Engineering, SCE registration, 5+ years experience in KSA.',
      Salary: '12,000 - 15,000 SAR',
      WhatsAppNumber: '966501112233',
      Email: 'recruitment@engineering-ksa.sa',
      Phone: '+966501112233',
    },
    {
      Title: 'Heavy Bus Driver',
      Category: 'Driving',
      Location: 'Jeddah',
      Description: 'Driver required for school and company shuttle transport across Jeddah district.',
      Requirements: 'Valid Saudi Heavy Bus driving license, clean traffic record, transferable Iqama.',
      Salary: '3,800 SAR / month',
      WhatsAppNumber: '966552223344',
      Email: 'hr@jeddah-transport.com',
      Phone: '+966552223344',
    },
    {
      Title: 'Pharmacy Sales Assistant',
      Category: 'Healthcare',
      Location: 'Dammam',
      Description: 'Urgent position for sales assistant in community pharmacy chain.',
      Requirements: 'Healthcare diploma, basic pharmacy terminology knowledge, customer service skills.',
      Salary: '4,500 SAR / month',
      WhatsAppNumber: '966543334455',
      Email: 'jobs@dammam-pharma.sa',
      Phone: '+966543334455',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 30 }, // Title
    { wch: 15 }, // Category
    { wch: 15 }, // Location
    { wch: 45 }, // Description
    { wch: 45 }, // Requirements
    { wch: 20 }, // Salary
    { wch: 18 }, // WhatsAppNumber
    { wch: 30 }, // Email
    { wch: 18 }, // Phone
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs Template');

  XLSX.writeFile(workbook, 'Today_Job_KSA_Bulk_Upload_Template.xlsx');
}

/**
 * Parses an uploaded .xlsx file and validates each row
 */
export async function parseExcelFile(
  file: File
): Promise<{ validJobs: Array<Omit<Job, 'id' | 'created_at'>>; result: BulkUploadResult }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const validJobs: Array<Omit<Job, 'id' | 'created_at'>> = [];
        const errors: Array<{ rowNumber: number; reason: string }> = [];

        let successCount = 0;
        let skippedCount = 0;

        rawRows.forEach((row, index) => {
          const rowNumber = index + 2; // Row 1 is headers

          // Helper to safely fetch value regardless of exact header casing
          const getValue = (possibleKeys: string[]): string => {
            for (const key of possibleKeys) {
              const matchingKey = Object.keys(row).find(
                (k) => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (matchingKey && row[matchingKey] !== undefined) {
                return String(row[matchingKey]).trim();
              }
            }
            return '';
          };

          const title = getValue(['Title', 'Job Title', 'JobTitle', 'title']);
          const category = getValue(['Category', 'Job Category', 'category']) || 'Other';
          const location = getValue(['Location', 'City', 'location']) || 'Riyadh';
          const description = getValue(['Description', 'Job Description', 'description']);
          const requirements = getValue(['Requirements', 'Job Requirements', 'requirements']);
          const salary = getValue(['Salary', 'Pay', 'salary']);
          const whatsapp = getValue(['WhatsAppNumber', 'WhatsApp Number', 'WhatsApp', 'whatsapp_number']);
          const email = getValue(['Email', 'Contact Email', 'email']);
          const phone = getValue(['Phone', 'Contact Phone', 'phone']);

          // Validation: Title is mandatory
          if (!title) {
            skippedCount++;
            errors.push({
              rowNumber,
              reason: 'Missing required field: Title is empty.',
            });
            return;
          }

          // If no contact info provided at all, add default warning/info
          const validWhatsapp = whatsapp || '966500000000';
          const validEmail = email || 'info@todayjobksa.com';
          const validPhone = phone || whatsapp || '+966500000000';

          validJobs.push({
            title,
            category,
            location,
            description: description || `Apply now for ${title} position in ${location}.`,
            requirements: requirements || 'Standard experience and valid identification required.',
            salary: salary || 'Negotiable',
            whatsapp_number: validWhatsapp.replace(/[^0-9]/g, ''),
            email: validEmail,
            phone: validPhone,
            company_name: 'Verified KSA Employer',
          });

          successCount++;
        });

        resolve({
          validJobs,
          result: {
            successCount,
            skippedCount,
            errors,
          },
        });
      } catch (err: any) {
        reject(new Error(err?.message || 'Failed to parse Excel file format. Please use a valid .xlsx file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file. Please try again.'));
    };

    reader.readAsArrayBuffer(file);
  });
}
