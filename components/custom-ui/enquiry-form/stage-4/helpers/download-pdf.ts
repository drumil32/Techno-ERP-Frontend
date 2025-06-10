import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FeeType } from '@/types/enum';
import { calculateDiscountPercentage, formatCurrency } from '../../stage-2/student-fees-form';
import { displayFeeMapper, scheduleFeeMapper } from '../../stage-2/helpers/mappers';
const placeholderLogoBase64 = '/images/techno-logo.webp';
const placeholderPhotoBase64 = '/images/dummy_user.webp';
const TIMS = 'Techno Institute of Management Sciences';
const THIS = 'Techno Institute of Higher Studies';
const TCL = 'Techno College of Law';

const toBase64 = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadStep4 = async (
  data: any,
  directSave: boolean = false
): Promise<{ url: string; fileName: string }> => {

  console.log("data is ",data)

  const container = document.createElement('div');
  container.style.width = '794px'; // A4 width in pixels (210mm)
  container.style.minHeight = '1123px'; // A4 height in pixels (297mm)
  container.style.padding = '20px';
  container.style.fontFamily = "'Arial', sans-serif";
  container.style.backgroundColor = 'white';
  container.style.boxSizing = 'border-box';
  container.style.margin = '0 auto';

  // Color scheme
  const primaryColor = '#5B31D1';
  const secondaryColor = '#851A6A';
  const lightBgColor = '#F8FAFC';
  const borderColor = '#E5E7EB';
  const textColor = '#111827';
  const secondaryText = '#4B5563';

  const escapeHtml = (unsafe: any) => {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const otherfixedfees = [
    {Fees : 12000, Discount: 0},
    {Fees : 1000, Discount: 99},
    {Fees : 100, Discount: 90},
    {Fees : 4000, Discount: 100},
    {Fees : 1500, Discount: 99},
    {Fees : 0, Discount: 0},
    {Fees : 0, Discount: 0},
  ]
  // College logo handling
  let logo = placeholderLogoBase64;
  if (data.collegeName === TIMS) logo = '/images/TIMS.png';
  else if (data.collegeName === TCL) logo = '/images/TCL.jpg';
  else if (data.collegeName === THIS) logo = '/images/TIHS.png';



  // Helper function to create consistent table headers
  const createTableHeader = (columns: string[]) => `
    <div style="
      display: grid;
      grid-template-columns: ${columns.map(() => '1fr').join(' ')};
      background-color: ${primaryColor}10;
      color: ${primaryColor};
      font-weight: bold;
      padding: 10px;
      font-size: 9px;
      gap: 1px;
      border: 1px solid ${borderColor};
      border-radius: 6px 6px 0 0;
    ">
      ${columns.map(col => `<div style="text-align: ${(col === 'Semester' || col === 'Fees Details') ? 'left' : (col === 'Fee Type') ? 'center' : 'right'}">${col}</div>`).join('')}
    </div>
  `;

  // Main fees table generator
  const generateFeeTables = () => {
    const feeDate = data.studentFee?.feesClearanceDate
      ? new Date(data.studentFee.feesClearanceDate).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN');

      let totalOriginal= 0;
      let totalDue = 0;
      let totalDeposited = 0;
      let totalFinal = 0;


    const headerColumns = [
      'Fees Details',
      'Schedule',
      'Fees',
      'Discount',
      'Final Fees',
      'Fees Deposit',
      'Fees Due'
    ];

    return `
      <div style="margin-top: 20px;">
        <h4 style="
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 10px;
          color: ${secondaryColor};
          padding-bottom: 4px;
          border-bottom: 1px solid ${borderColor};
        ">
          Fees Details (Date: ${feeDate})
        </h4>

        ${createTableHeader(headerColumns)}

        <div style="border: 1px solid ${borderColor}; border-top: none; border-radius: 0 0 6px 6px;">
  ${data.studentFee.otherFees?.map((fee: any, index: number) => {
    let feeType = fee.type;
    if(feeType === "BOOKBANK"){
      return;
    }
    let schedule = scheduleFeeMapper(feeType) || '-';
    
    // Get values from fee object with fallbacks
    const totalFee = otherfixedfees[index]?.Fees || 0;
    const finalFee = fee.finalFee || 0;
    const feesDeposited = fee.feesDepositedTOA || 0;
    const discountValue = otherfixedfees[index]?.Discount || 0;
    const remainingFee = finalFee - feesDeposited;

    totalOriginal += totalFee;
    totalDeposited += feesDeposited;
    totalFinal += finalFee;
    totalDue += remainingFee;

    return `
      <div style="
        display: grid;
        grid-template-columns: ${headerColumns.map(() => '1fr').join(' ')};
        padding: 10px;
        font-size: 9px;
        gap: 1px;
        border-bottom: 1px solid ${borderColor};
        background-color: ${index % 2 === 0 ? 'white' : lightBgColor};
        align-items: center;
      ">
        <div style="font-weight: 500; color: ${textColor}; text-align: left;">
          ${displayFeeMapper(feeType)}
        </div>
        <div style="color: ${secondaryText}; text-align: right;">
          ${escapeHtml(schedule)}
        </div>
        <div style="color: ${secondaryText}; text-align: right;">
          ${formatCurrency(totalFee)}
        </div>
        <div style="color: ${typeof discountValue === 'number' && discountValue > 0 ? '#059669' : secondaryText}; 
             text-align: right; font-weight: ${typeof discountValue === 'number' ? '500' : 'normal'}">
          ${typeof discountValue === 'number' ? `${discountValue}%` : '-'}
        </div>
        <div style="color: ${textColor}; font-weight: 500; text-align: right;">
          ${formatCurrency(finalFee)}
        </div>
        <div style="color: ${secondaryText}; text-align: right;">
          ${formatCurrency(feesDeposited)}
        </div>
        <div style="color: ${remainingFee > 0 ? '#DC2626' : textColor}; font-weight: 500; text-align: right;">
          ${formatCurrency(remainingFee)}
        </div>
      </div>
    `;
  }).join('')}
</div>

        <!-- Total Row -->
        <div style="
          display: grid;
          grid-template-columns: ${headerColumns.map(() => '1fr').join(' ')};
          background-color: ${lightBgColor};
          color: ${textColor};
          font-weight: bold;
          padding: 10px;
          font-size: 9px;
          gap: 1px;
          border: 1px solid ${borderColor};
          border-top: none;
          border-radius: 0 0 6px 6px;
        ">
          <div style="text-align: left;">Total Fees</div>
          <div></div>
          <div style="text-align: right;">${formatCurrency(totalOriginal || 0)}</div>
          <div style="text-align: center;">-</div>
          <div style="text-align: right;">${formatCurrency(totalFinal || 0)}</div>
          <div style="text-align: right;">${formatCurrency(totalDeposited || 0)}</div>
          <div style="text-align: right; color: ${(totalDue || 0) > 0 ? '#DC2626' : textColor}">
            ${formatCurrency(totalDue || 0)}
          </div>
        </div>

        <!-- Additional notes -->
        <div style="
          margin-top: 15px;
          padding: 10px;
          background-color: ${lightBgColor};
          border-radius: 6px;
          font-size: 8px;
          color: ${secondaryText};
          border: 1px solid ${borderColor};
        ">
          <p style="margin: 0 0 5px 0;"><strong>Notes:</strong></p>
          <ul style="margin: 0; padding-left: 15px;">
            <li>Book Bank - 50% adjustable at the end of final semester</li>
            <li>Book Bank - Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</li>
            <li>Exam Fees - To be given at the time of exam form submission as per LU/AKTU Norms</li>
          </ul>
        </div>
      </div>
    `;
  };

  // Semester-wise fees table generator
  const generateSemWiseFeesTable = () => {
    let totalFees = 0;
    let totalDue = 0;
    const headerColumns = [
      'Semester',
      'Fee Type',
      'Original Fee',
      'Discount',
      'Final Fee'
    ];

    return `
      <div style="margin-top: 30px;">
        <h4 style="
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 10px;
          color: ${secondaryColor};
          padding-bottom: 4px;
          border-bottom: 1px solid ${borderColor};
        ">
          Semester-wise Fee Structure
        </h4>

        ${createTableHeader(headerColumns)}

        <div style="border: 1px solid ${borderColor}; border-top: none; border-radius: 0 0 6px 6px;">
          ${data.studentFee.semWiseFees?.map((fee: any, index: number) => {
      const originalFeeAmount: number = fee.finalFee || 0;
      const finalFee = fee?.finalFee;
      const discountValue = finalFee != undefined
        ? calculateDiscountPercentage(originalFeeAmount, finalFee)
        : '0';
      const discountDisplay = typeof discountValue === 'number'
        ? `${discountValue || 0}%`
        : discountValue || 0;

        totalDue += finalFee;
        totalFees += originalFeeAmount;

      return `
              <div style="
                display: grid;
                grid-template-columns: ${headerColumns.map(() => '1fr').join(' ')};
                padding: 10px;
                font-size: 9px;
                gap: 1px;
                border-bottom: 1px solid ${borderColor};
                background-color: ${index % 2 === 0 ? 'white' : lightBgColor};
                align-items: center;
              ">
                <div style="font-weight: 500; color: ${textColor}; text-align: left;">
                  Semester ${index + 1}
                </div>
                <div style="color: ${secondaryText};margin-left:2px; text-align: center;">Tuition Fee</div>
                <div style="color: ${secondaryText}; text-align: right;">${formatCurrency(originalFeeAmount)}</div>
                <div style="color: ${typeof discountValue === 'number' && discountValue > 0 ? '#059669' : secondaryText}; 
                     text-align: right; font-weight: ${typeof discountValue === 'number' ? '500' : 'normal'}">
                  ${discountDisplay}
                </div>
                <div style="color: ${textColor}; font-weight: 500; text-align: right;">
                  ${finalFee ? formatCurrency(finalFee) : '-'}
                </div>
              </div>
            `;
    }).join('')}
        </div>

        <!-- Total Row -->
        <div style="
          display: grid;
          grid-template-columns: ${headerColumns.map(() => '1fr').join(' ')};
          background-color: ${lightBgColor};
          color: ${textColor};
          font-weight: bold;
          padding: 10px;
          font-size: 9px;
          gap: 1px;
          border: 1px solid ${borderColor};
          border-top: none;
          border-radius: 0 0 6px 6px;
        ">
          <div style="text-align: left;">Total</div>
          <div></div>
          <div style="text-align: right;">${totalFees}</div>
          <div style="text-align: center;">-</div>
          <div style="text-align: right;">
            ${formatCurrency(totalDue)}
          </div>
        </div>
      </div>
    `;
  };

  // Main receipt HTML
  const generateReceiptHtml = () => `
    <div style="width: 100%; max-width: 794px; margin: 0 auto;">
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div style="flex: 0 0 auto;">
          <img src="${logo}" alt="College Logo" style="width: 70px; height: auto;">
        </div>
        <div style="flex: 1;margin-right: 70px;  text-align: center; padding: 0 15px;">
          <h1 style="color: ${secondaryColor}; font-size: 14px; font-weight: 800; margin: 0 0 5px 0;">
            ${escapeHtml(data.collegeName?.toUpperCase() ?? 'TECHNO INSTITUTE OF HIGHER STUDIES')}
          </h1>
          <p style="font-size: 9px; font-weight: 600; margin: 0 0 3px 0; color: ${textColor};">
            (Affiliated to ${escapeHtml(data.affiliation) ?? 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow'})
          </p>
          <p style="font-size: 8px; margin: 0 0 3px 0; color: ${secondaryText};">
            ${escapeHtml(data.collegeAddress ?? 'CAMPUS : 331, Near Indira Nahar, Faizabad Road, Lucknow - 226028')}
          </p>
          <p style="font-size: 8px; margin: 0; color: ${secondaryText};">
            Email: ${escapeHtml(data.collegeFeeEmail ?? 'registrar@tims.edu.in')} | 
            Contact: ${escapeHtml(data.collegeFeeContactNumber  ?? '9839506777')}
          </p>
        </div>
      </div>

      <!-- Title Section -->
      <h2 style="
        text-align: center;
        color: ${secondaryColor};
        font-size: 12px;
        font-weight: 700;
        text-decoration: underline;
        margin: 15px 0;
      ">
        FEE DETAILS
      </h2>

      <!-- Student Information -->
      <div style="
        border: 1px solid ${borderColor};
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 20px;
        background-color: ${lightBgColor};
      ">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9px;">
          <!-- Row 1 -->
          <div style="display: flex; ">
            <div style="color: ${secondaryText}; min-width: 70px;">Student Name:</div>
            <div style="font-weight: 500; color: ${textColor};">${escapeHtml(data.studentName)}</div>
          </div>
          <div style="display: flex; ">
            <div style="color: ${secondaryText}; min-width: 50px;">Category:</div>
            <div style="font-weight: 500; color: ${textColor};">${escapeHtml(data.category)}</div>
          </div>
          
          <!-- Row 2 -->
          <div style="display: flex;">
            <div style="color: ${secondaryText}; min-width: 70px;">Father Name:</div>
            <div style="font-weight: 500; color: ${textColor};">${escapeHtml(data.fatherName)}</div>
          </div>
          <div style="display: flex;">
            <div style="color: ${secondaryText}; min-width: 50px;">Course:</div>
            <div style="font-weight: 500; color: ${textColor};">${escapeHtml(data.course)}</div>
          </div>
          
          <!-- Row 3 -->
          
        </div>
      </div>

      <!-- Fee Tables -->
      ${generateFeeTables()}
      ${generateSemWiseFeesTable()}

      <!-- Footer Section -->
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div style="font-size: 10px; color: ${textColor};">
          <div style="margin-bottom: 30px;">Fee applicable: ${data.isFeeApplicable ? 'Yes' : 'No'}</div>
          <div>Date: ____________________</div>
        </div>
        <div style="text-align: center; font-size: 10px; color: ${textColor};">
          <div style="margin-bottom: 30px;">Student Signature</div>
          <div>____________________</div>
        </div>
        <div style="text-align: right; font-size: 10px; color: ${textColor};">
          <div style="margin-bottom: 30px;">Verified by</div>
          <div>Authorised Signatory</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = generateReceiptHtml();
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: 'white'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const fileName = `Fee-Details-${data.studentName?.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
    const title = `Fee details for ${data.studentName}`;

    pdf.setProperties({
      title: title,
      subject: `Fee details for ${data.studentName} - ${data.course}`,
      author: data.collegeName || 'Techno Institute',
      creator: 'Techno Institute Fee System'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit the PDF page
    const imgWidth = pdfWidth - 40; // 20px margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF with centered alignment
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);

    if (directSave) {
      pdf.save(fileName);
    }

    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    return {
      url: blobUrl,
      fileName: fileName
    };
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
export const mockDataFee = {
  logoLink: placeholderLogoBase64,
  collegeName: 'TECHNO INSTITUTE OF HIGHER STUDIES',
  collegeAddress: '331, Anaura, Near Indira Canal, Ayodhya Road, Lucknow - 226028',
  email: 'accounts@tims.edu.in',
  contact: '7897123666 (Voice & Whatsapp)',
  receiptNo: '767',
  date: '16-05-25',
  studentName: 'Avnish Kumar S/o Mr. Bal Govind',
  category: 'General',
  fatherName: 'Mr. Bal Govind',
  session: '2024 - 25',
  course: 'BSc',
  feeDetails: [
    {
      particular: '2022-23- Third Year-Vith-Misc Fee',
      amount: 400.0
    },
    {
      particular: '2024-25- Third Year-Vith-Exam Fee & PC',
      amount: 2600.0
    },
    {
      particular: '2024-25- Third Year-Vith-Misc Fee',
      amount: 800.0
    },
    {
      particular: '2024-25- Third Year-Vith-Tution Fee',
      amount: 10000.0
    }
  ],
  amountInWords: 'INR Thirteen Thousand Eight Hundred Only',
  qrCode: 'QQ 271395'
};
