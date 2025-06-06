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
  console.log(data)
  const container = document.createElement('div');
  container.style.width = '780px';
  container.style.padding = '0';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.backgroundColor = 'white';
  container.style.boxSizing = 'border-box';

  console.log("data ", data.otherFeesTotals.totalFinal, " ", data.otherFeesTotals.totalDue, " ", data.otherFeesTotals.totalDeposited)


  const escapeHtml = (unsafe: any) => {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  };

  const totalAmount = data?.studentFee?.otherFees?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.finalFee || 0),
    0
  );

  const totalDeposite = data?.studentFee?.otherFees?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.feesDepositedTOA || 0),
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

    // Calculate totals dynamically
    let totalDeposite = 0;
    let totalFinalFee = 0;
    let totalDue = 0;

    // Format date if available
    const feeDate = data.studentFee.feesClearanceDate ?
      new Date(data.studentFee.feesClearanceDate).toLocaleDateString('en-IN') :
      new Date().toLocaleDateString('en-IN');



    // Generate the main fees table
    const feesTable = `
    <div style="margin-top: 20px;">
      <h4 style="font-size: 9px; font-weight: bold; margin-bottom: 5px; color: #851A6A;">
        Fees Details (Date: ${feeDate})
      </h4>

      <!-- Header Row -->
      <div style="display: grid; grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.8fr 0.8fr 0.5fr; 
           background-color: #5B31D110; color: #5B31D1; font-weight: bold; padding: 8px; 
           border-radius: 5px; font-size: 8px; gap: 8px; margin-bottom: 5px;">
        <div style="grid-column: span 1">Fees Details</div>
        <div>Schedule</div>
        <div>Fees</div>
        <div style="text-align: center;">Discount</div>
        <div style="text-align: right;">Final Fees</div>
        <div style="text-align: right;">Fees Deposit</div>
        <div style="text-align: right;">Fees Due</div>
      </div>

      <!-- Fee Items -->
      <div style="border: 1px solid #E6E6E6; border-radius: 5px; overflow: hidden;">
        ${data.otherFeesData?.map((fee: any, index: number) => {
      const feeType = data.form.getValues(`otherFees.${index}.type`);
      if (feeType == "BOOKBANK") return;

      const originalFeeData = data.otherFeesData?.find((fee: any) =>
        fee.type === FeeType.SEM1FEE
          ? fee.type === feeType
          : fee.type === displayFeeMapper(feeType)
      );


      let totalFee;
      if (feeType == FeeType.TRANSPORT || feeType == FeeType.HOSTEL) {
        totalFee = data.form.getValues(`otherFees.${index}.finalFee`);
      } else {
        totalFee = originalFeeData?.amount;
      }

      const finalFee = data.otherFeesWatched?.[index]?.finalFee;

      const feesDeposited = data.otherFeesWatched?.[index]?.feesDepositedTOA;

      let discountValue;
      if (feeType == FeeType.TRANSPORT || feeType == FeeType.HOSTEL) {
        discountValue = '-';
      } else {
        discountValue =
          finalFee != undefined
            ? calculateDiscountPercentage(totalFee, finalFee)
            : '-';
      }
      const discountDisplay =
        typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
      const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);

      return `
            <div style="display: grid; grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.8fr 0.8fr 0.5fr; 
                 padding: 8px; font-size: 8px; gap: 8px; border-bottom: 1px solid #F3F3F3;
                 align-items: center;">
              <div style="grid-column: span 1; font-weight: 500; color: #333;">
                ${displayFeeMapper(feeType)}
              </div>
              <div style="color: #666;">${scheduleFeeMapper(feeType)}</div>
              <div style="color: #666;">${formatCurrency(totalFee)}</div>
               <div style="text-align: center; color: #666;">
                ${discountDisplay}
              </div>
              <div style="text-align: right; color: #666;">
                ${formatCurrency(finalFee)}
              </div>
              <div style="text-align: right; color: #666;">
                ${formatCurrency(feesDeposited)}
              </div>
              <div style="text-align: right; color: #333;">
                ${formatCurrency(remainingFee)}
              </div>
              
            </div>
          `;
    }).join('')}
      </div>

      <!-- Total Row -->
      <div style="display: grid; grid-template-columns: 1fr 0.5fr 0.5fr 0.5fr 0.8fr 0.8fr 0.5fr; 
           background-color: #5B31D110; color: #5B31D1; font-weight: bold; padding: 8px; 
           border-radius: 5px; font-size: 8px; gap: 8px; margin-top: 5px;">
        <div style="grid-column: span 1">Total Fees</div>
        <div></div>
        <div>-</div>
        <div style="text-align: center;">-</div>
        <div style="text-align: right;"> ${formatCurrency(data.otherFeesTotals.totalFinal)} </div>
        <div style="text-align: right;">${formatCurrency(data.otherFeesTotals.totalDeposited)}</div>
        <div style="text-align: right;">${formatCurrency(data.otherFeesTotals.totalDue)}</div>
      </div>

      <!-- Additional notes -->
      <div style="margin-top: 10px;padding:2px;  background-color: #F9FAFB; border-radius: 5px; 
           font-size: 7px; color: #666; ">
        <p style="margin: 0px;">* Book Bank - 50% adjustable at the end of final semester</p>
        <p style="margin: 0px;">* Book Bank - Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</p>
        <p style="margin: 0px;">* Exam Fees - To be given at the time of exam form submission as per LU/AKTU Norms</p>
      </div>
      <div style="font-size : 10px">
        Fee applicable : ${data.isFeeApplicable == true ? 'Yes' : 'No'}
      </div>
    </div>
  `;

    return feesTable;
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
    <div style="display: flex; flex-direction: column; font-size: 8px; gap: 6px; border: 1px solid #E6E6E6; padding: 8px;">

  <!-- Row 1: Name & Category -->
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; gap: 4px; flex: 1;">
      <div style="color: #666666;">Name:</div>
      <div>${escapeHtml(data.studentName)}</div>
    </div>
    <div style="display: flex; gap: 4px; flex: 1;">
      <div style="color: #666666;">Category:</div>
      <div>${escapeHtml(data.category)}</div>
    </div>
  </div>

  <!-- Row 2: Father Name & Course -->
  <div style="display: flex; justify-content: space-between;">
    <div style="display: flex; gap: 4px; flex: 1;">
      <div style="color: #666666;">Father Name:</div>
      <div>${escapeHtml(data.fatherName)}</div>
    </div>
    <div style="display: flex; gap: 4px; flex: 1;">
      <div style="color: #666666;">Course:</div>
      <div>${escapeHtml(data.course)}</div>
    </div>
  </div>

</div>



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
      scale: 3,
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

    const fileName = `Fee-details-${data.studentName?.replace(/\s+/g, '-')}-${data.course}.pdf`;
    const title = `Fee details - ${data.studentName}`;

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
