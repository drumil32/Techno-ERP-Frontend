import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const container = document.createElement('div');
  container.style.width = '780px';
  container.style.padding = '0';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.backgroundColor = 'white';
  container.style.boxSizing = 'border-box';

  const escapeHtml = (unsafe: any) => {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  };

  const totalAmount = data?.particulars?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.amount || 0),
    0
  );

  let logo = placeholderLogoBase64;
  if (data.collegeName === TIMS) {
    logo = '/images/TIMS.png';
  } else if (data.collegeName === TCL) {
    logo = '/images/TCL.jpg';
  } else if (data.collegeName === THIS) {
    logo = '/images/TIHS.png';
  }

  // Function to generate fee tables
  const generateFeeTables = () => {
    if (!data.studentFee) return '';

    // Semester-wise fees table
    // const semWiseTable = `
    //   <div style="margin-top: 20px;">
    //     <h4 style="font-size: 9px; font-weight: bold; margin-bottom: 2px; color: #851A6A;">
    //       Semester-wise Fees
    //     </h4>
    //     <table style="width: 100%; border-collapse: collapse; font-size: 8px; border: 0.5px solid #E6E6E6;">
    //       <thead>
    //         <tr>
    //           <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: left;">Semester</th>
    //           <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Fee Amount</th>
    //           <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Final Fee</th>
    //           <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Fees Paid</th>
    //           <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Due Date</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         ${data.studentFee.semWiseFees?.map((fee: any, index: number) => `
    //           <tr>
    //             <td style="border: 0.5px solid #E6E6E6; padding: 4px;">Semester ${index + 1}</td>
    //             <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
    //               ${parseFloat(fee.feeAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    //             </td>
    //             <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
    //               ${parseFloat(fee.finalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    //             </td>
    //             <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
    //               ${parseFloat(fee.feesPaid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    //             </td>
    //             <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
    //               ${fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '--'}
    //             </td>
    //           </tr>
    //         `).join('')}
    //       </tbody>
    //     </table>
    //   </div>
    // `;

    // Other fees table
    const otherFeesTable = `
      <div style="margin-top: 20px;">
        <h4 style="font-size: 9px; font-weight: bold; margin-bottom: 5px; color: #851A6A;">
          Other Fees
        </h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 8px; border: 0.5px solid #E6E6E6;">
          <thead>
            <tr>
              <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: left;">Fee Type</th>
              <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Fee Amount</th>
              <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Final Fee</th>
              <th style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.studentFee.otherFees?.map((fee: any) => `
              <tr>
                <td style="border: 0.5px solid #E6E6E6; padding: 4px;">
                  ${fee.type === 'SEM1FEE' ? 'Semester 1 Fee' : 
                    fee.type === 'PROSPECTUS' ? 'Prospectus Fee' :
                    fee.type === 'STUDENTID' ? 'Student ID Fee' :
                    fee.type === 'UNIFORM' ? 'Uniform Fee' :
                    fee.type === 'STUDENTWELFARE' ? 'Student Welfare' :
                    fee.type === 'BOOKBANK' ? 'Book Bank' :
                    fee.type === 'HOSTEL' ? 'Hostel Fee' :
                    fee.type === 'TRANSPORT' ? 'Transport Fee' : fee.type}
                </td>
                <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
                  ${parseFloat(fee.feeAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
                  ${parseFloat(fee.finalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style="border: 0.5px solid #E6E6E6; padding: 4px; text-align: right;">
                  ${fee.feesDepositedTOA ? 'Paid' : 'Pending'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    return  otherFeesTable;
  };

  const generateReceiptHtml = () => `
    <div style="position: relative; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; ">
      <div style="position: absolute; top: 0; left: 0;">
          <img src="${logo}" alt="College Logo"
            style="width: 60px; object-fit: contain;">
      </div>
      <div style="flex-grow: 1; text-align: center; margin: 0 10px;">
          <h2 style="text-align: center; color: #851A6A; font-size: 10px; font-weight: 800; margin:0 0 2px 0;">
              ${escapeHtml(data.collegeName?.toUpperCase() ?? 'Techno Institute of Higher Studies')}</h2>
          <p style="text-align: center; font-size: 8px; font-weight: 600; margin: 0; line-height: 1.2;">
              (Affiliated to ${escapeHtml(data.affiliation) ?? 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow'})<br />
              ${escapeHtml(data.collegeAddress ?? 'CAMPUS : 331, Near Indira Nahar, Faizabad Road, Lucknow - 226028')}<br />
              Email: ${escapeHtml(data.clgEmail ?? 'registrar@tims.edu.in')} | Contact:
              ${escapeHtml(data.clgContactNumber ?? '9839506777')}
          </p>
      </div>
    </div>

    <h3 style="text-align: center; color: #851A6A; font-size: 10px; font-weight: 700; text-decoration: underline; margin: 10px 0;">
      FEE DETAILS
    </h3>

    <!-- Your existing receipt HTML here -->
    <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
      <tbody style="border: 0.5px solid #E6E6E6; padding: 2px 4px 20px 4px;">
        <tr>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Name :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.studentName)}</td>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Category :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.category)}</td>
        </tr>
        <tr>
        <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Father Name :</td>
        <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.fatherName)}</td>
          <td style="color: #666666; padding: 2px 4px 10px 4px; border:none;">Course :</td>
          <td style="padding: 2px 4px 10px 4px; border:none; ">${escapeHtml(data.course)}</td>
          <td style="padding: 2px 4px 10px 4px; border:none; "></td>
          <td style="padding: 2px 4px 10px 4px; border:none;"></td>
        </tr>
      </tbody>
    </table>

    <!-- Add the fee tables after the receipt -->
    ${generateFeeTables()}
  `;

  container.innerHTML = `
      <div style="padding: 10px; box-sizing: border-box;">
        ${generateReceiptHtml()}
      </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
      compress: true
    });

    const fileName = `Fee-Receipt-${data.studentName?.replace(/\s+/g, '-')}-${data.course}.pdf`;
    const title = `Fee Receipt - ${data.studentName}`;

    pdf.setProperties({
      creator: 'Techno Institute',
      title: title,
      subject: `Fee details for ${data.studentName}`,
      author: data.collegeName || 'Techno Institute'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);

    let imgFinalWidth = pdfWidth;
    let imgFinalHeight = (imgProps.height * imgFinalWidth) / imgProps.width;

    if (imgFinalHeight > pdfHeight) {
      imgFinalHeight = pdfHeight;
      imgFinalWidth = (imgProps.width * imgFinalHeight) / imgProps.height;
    }

    const positionX = 0;
    const positionY = 0;

    pdf.addImage(imgData, 'PNG', positionX, positionY, imgFinalWidth, imgFinalHeight);

    const middleY = pdfHeight / 2;
    pdf.setLineDashPattern([4, 2], 0);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(0, middleY, pdfWidth, middleY);
    pdf.setLineDashPattern([], 0);

    pdf.addImage(imgData, 'PNG', positionX, middleY + 3, imgFinalWidth, imgFinalHeight);

    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(file);

    if (directSave) {
      pdf.save(fileName);
    }

    return {
      url: blobUrl,
      fileName: fileName
    };
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
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
