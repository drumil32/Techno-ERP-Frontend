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

export const downloadAdmissionForm = async (
  data: any,
  directSave: boolean = false
): Promise<{ url: string; fileName: string }> => {
  const container = document.createElement('div');
  container.style.width = '780px';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.backgroundColor = 'white';
  container.style.boxSizing = 'border-box';

  const escapeHtml = (unsafe: any) => {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  };

  const REQUIRED_LEVELS = ['10th', '12th', 'Graduation'];

  const academicMap = new Map(
    data.academicDetails.map((detail: any) => [detail.educationLevel, detail])
  );

  const imageData = await toBase64(data.profileImage ?? placeholderPhotoBase64);

  const academicRows = REQUIRED_LEVELS.map((level) => {
    const detail: any = academicMap.get(level) || {};
    return `
    <tr>
        <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px;">${escapeHtml(level)}</td>
        <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px;">${escapeHtml(detail.schoolCollegeName ?? '--')}</td>
        <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px;">${escapeHtml(detail.universityBoardName ?? '--')}</td>
        <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; text-align: center;">
        ${escapeHtml(detail.percentageObtained ?? '--')}</td>
        <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: center;">
        ${escapeHtml(detail.passingYear ?? '--')}</td>
        <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px;">${escapeHtml(detail.subjects ?? '--')}</td>
    </tr>
  `;
  }).join('');

  let logo = placeholderLogoBase64;
  if (data.fullCollegeName === TIMS) {
    logo = '/images/TIMS.png';
  } else if (data.fullCollegeName === TCL) {
    logo = '/images/TCL.jpg';
  } else if (data.fullCollegeName === THIS) {
    logo = '/images/TIHS.png';
  }

  container.innerHTML = `
<div style="position: relative; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
    <div style="position: absolute; top: 0; left: 0;">
        <img src="${logo}" alt="College Logo"
            style="width: 100px; object-fit: contain;">
    </div>
    <div style="flex-grow: 1; text-align: center; margin: 0 10px;">
        <h2 style="text-align: center; color: #851A6A; font-size: 18px; font-weight: 800; margin:0 0 4px 0;">
            ${escapeHtml(data.fullCollegeName ? data.fullCollegeName.toUpperCase() : 'Techno Institute of Higher Studies')}</h2>
        <p style="text-align: center; font-size: 12px; font-weight: 600; margin: 0; line-height: 1.3;">
            (Affiliated to ${escapeHtml(data.affiliationName)})<br />
            ${escapeHtml(data.collegeAddress ?? 'CAMPUS : 331, Near Indira Nahar, Faizabad Road, Lucknow - 226028')}<br />
            Website: ${escapeHtml(data.websiteUrl ?? 'tihs.edu.in')} | Email: ${escapeHtml(data.collegeEmail ?? 'registrar@tims.edu.in')} | Contact:
            ${escapeHtml(data.collegeContact ?? '9839506777')}
        </p>
    </div>
    <div style="position: absolute; top: 0; right: 0;">
        <img src="${imageData}" alt="Student Photo"
            style="height: 100px; width: 100px; object-fit: cover; border: 1px solid #DDD;">
    </div>
</div>

<h3
    style="text-align: center; color: #851A6A; font-size: 16px; font-weight: 700; text-decoration: underline; margin-bottom: 18px; margin-top: 14px;">
    ADMISSION FORM
</h3>

<table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #E6E6E6;">
    <tbody>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none; width: 20%;">
                Course :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none; width: 30%;">
                ${escapeHtml(data.courseName ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none; width: 20%;">
                Admission Date :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none; width: 30%;">
                ${escapeHtml(data.admissionDate ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Student Name :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.studentName ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Phone Number :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.studentPhoneNumber ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Father’s Name :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.fatherName ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Father’s Phone Number :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.fatherPhoneNumber ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Mother’s Name :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.motherName ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Mother’s Phone Number :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.motherPhoneNumber ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Date of Birth :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.dateOfBirth ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Email ID :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.emailId ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Gender :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.gender ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Blood Group :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.bloodGroup ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Religion :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.religion ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Category :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.category ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                State of Domicile :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.stateOfDomicile ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Aadhar Card Number :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.aadharNumber ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Address :</td>
            <td colspan="3" style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none; width:30%;">
           <span style="display: inline-block; width: 100%; word-wrap: break-word; word-break: break-word;">
  ${escapeHtml(data.address ?? '--')}
</span>

                </td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Pin Code :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.pincode ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Area Type :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.areaType ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                State :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.state ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px;color: #666666; font-weight: 400; border-right: none;">
                Nationality :</td>
            <td style="border:1px solid #E6E6E6; padding: 4px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.nationality ?? '--')}</td>
        </tr>
    </tbody>
</table>

<h4 style="font-size: 12px; font-weight: 700; margin-top: 6px; margin-bottom: 7px;">Academic Details</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #E6E6E6;">
    <thead>
        <tr style="background-color: #f0f0f0; font-weight: 600;">
            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: left;">Exam</th>
            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: left;">Institution/University
            </th>
            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: left;">Board</th>
            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: center;">Percentage/CGPA</th>

            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: center;">Pass Year</th>
            <th style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; text-align: left;">Subjects/Stream</th>
        </tr>
    </thead>
    <tbody>
    ${academicRows}
    </tbody>
</table>

<h4 style="font-size: 12px; font-weight: 700; margin-top: 6px; margin-bottom: 7px;">Entrance Exam Details</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #E6E6E6;">
    <tbody>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none; width: 20%;">
                Examination Name :</td>
            <td colspan="5" style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.entranceExamDetails.nameOfExamination ?? '--')}</td>
        </tr>
        <tr>
            <td
                style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Roll No :</td>
            <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.entranceExamDetails.rollNumber ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Rank :</td>
            <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; border-left: none;">
                ${escapeHtml(data.entranceExamDetails.rank ?? '--')}</td>
            <td
                style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; color: #666666; font-weight: 400; border-right: none;">
                Qualified :</td>
            <td style="border:1px solid #E6E6E6; padding: 0px 4px 10px 4px; border-left: none;">
                ${
                  data.entranceExamDetails.qualified === undefined
                    ? '--'
                    : data.entranceExamDetails.qualified
                      ? 'Yes'
                      : 'No'
                }
            </td>
        </tr>
    </tbody>
</table>

<h4
    style="text-align: center; font-size: 12px; font-weight: 700; text-decoration: underline; margin-bottom: 6px; margin-top: 12px;">
    Undertaking for Admission
</h4>
<div style="margin-bottom: 15px; display: flex; gap:8px;">
    <p style="font-size: 16px; line-height: 1; margin-top:-2px;">🗹</p>
    <p style="font-size: 11px; line-height: 1.4; text-align: justify;">
    In case I am admitted, I undertake that I will make all the payments laid down by the institute from time to time. I
    solemnly declare that the information provided by me in the admission form is correct and I have not concealed any
    facts. I undertake to abide by all the rules, instructions and guidelines of the University and the Institute. I am
    taking admission in the Institute provisionally at my own risk and
    responsibility, subject to the confirmation of my eligibility as per the norms laid down by University. If at any
    stage, I am found ineligible, my admission shall be cancelled by the University under the rules, I will have no
    claim for it. Further, I undertake not to take part in Ragging, Act of Indiscipline or any unlawful activities
    whatsoever, directly or Indirectly. If my attendance is below 75% detainment will be the sole decision of the
    Principal/Management. No refund is admissible if a student withdraws voluntarily after registering, or his/her
    admission is cancelled due to any reason.
    </p>
</div>

<p style="font-size: 12px; font-weight: 600; margin-top: 10px; margin-bottom: 8px;">Confirmed by Student/Guardian (Via
    OTP):</p>
<div style="font-size: 12px; display: flex; justify-content: space-between; width: 100%; align-items: baseline">
    <div style="display: flex; align-items: baseline; gap: 5px; width: calc(50% - 10px);">
        <p style="font-size: 14px; line-height: 1; vertical-align: center;">🗹</p>
        <p style="color: #666666; font-weight: 400; flex-shrink: 0;">Email ID :</p>
        <p
            style="font-weight: normal; white-space: nowrap;">${escapeHtml(data.emailId ?? '--')}</p>
    </div>
    <div style="display: flex; align-items: baseline; gap: 5px; width: calc(50% - 10px);">
        <p style="font-size: 16px; line-height: 1; vertical-align: middle; margin-top:-2px;">□</p>
        <p style="color: #666666; font-weight: 400; flex-shrink: 0;">Phone Number :</p>
        <p
            style="font-weight: normal; white-space: nowrap;">${escapeHtml(data.studentPhoneNumber ?? '--')}</p>
    </div>
</div>

<div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
    <p style="font-size: 12px; color: #333333; margin: 0;">Date: ____________________</p>
    <p style="text-align: right; font-size: 12px; color: #333333; margin: 0;">Authorised Signatory</p>
</div>
`;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Optional modifications to cloned DOM
      }
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
      compress: true
    });

    const fileName = `Admission-Form-${data.studentName?.replace(/\s+/g, '-')}-${data.courseName}.pdf`;
    const title = `Admission Form - ${data.studentName}`;

    pdf.setProperties({
      creator: 'Techno Institute',
      title: title,
      subject: `Admission details for ${data.studentName}`,
      author: data.collegeName || 'Techno Institute'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add more pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      heightLeft -= pdfHeight;
    }
    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(file);

    // Save the PDF
    if (directSave) {
      pdf.save(fileName);
      return {
        url: blobUrl,
        fileName: fileName
      };
    }

    return {
      url: blobUrl,
      fileName: fileName
    };
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
};

export const downloadFeeReceipt = async (
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

  const totalAmount = data.particulars.reduce(
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

  const generateReceiptHtml = () => `
    <div style="position: relative; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; ">
      <div style="position: absolute; top: 0; left: 0;">
          <img src="${logo}" alt="College Logo"
            style="width: 60px; object-fit: contain;">
      </div>
      <div style="flex-grow: 1; text-align: center; margin: 0 10px;">
          <h2 style="text-align: center; color: #851A6A; font-size: 10px; font-weight: 800; margin:0 0 2px 0;">
              ${escapeHtml(data.collegeName.toUpperCase() ?? 'Techno Institute of Higher Studies')}</h2>
          <p style="text-align: center; font-size: 8px; font-weight: 600; margin: 0; line-height: 1.2;">
              (Affiliated to ${escapeHtml(data.affiliationName) ?? 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow'})<br />
              ${escapeHtml(data.collegeAddress ?? 'CAMPUS : 331, Near Indira Nahar, Faizabad Road, Lucknow - 226028')}<br />
              Email: ${escapeHtml(data.collegeEmail ?? 'registrar@tims.edu.in')} | Contact:
              ${escapeHtml(data.collegeContactNumber ?? '9839506777')}
          </p>
      </div>
    </div>

    <h3 style="text-align: center; color: #851A6A; font-size: 10px; font-weight: 700; text-decoration: underline; margin: 10px 0;">
      FEE RECEIPT
    </h3>

    <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
      <tbody style="border: 0.5px solid #E6E6E6; padding: 2px 4px 20px 4px;">
        <tr>
          <td style="color: #666666; padding: 2px 4px 4px 4px; width: 18%; border:none;">Receipt No :</td>
          <td style="padding: 2px 4px 4px 4px; width: 32%; border:none;">${escapeHtml(data.recieptNumber)}</td>
          <td style="color: #666666; padding: 2px 4px 4px 4px; width: 18%; border:none;">Date :</td>
          <td style="padding: 2px 4px 4px 4px; width: 32%; border:none;">${escapeHtml(data.date)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Name :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.studentName)}</td>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Category :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.category)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Father Name :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.fatherName)}</td>
          <td style="color: #666666; padding: 2px 4px 4px 4px; border:none;">Session :</td>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(data.session)}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 2px 4px 10px 4px; border:none;">Course :</td>
          <td style="padding: 2px 4px 10px 4px; border:none; ">${escapeHtml(data.course)}</td>
          <td style="padding: 2px 4px 10px 4px; border:none; "></td>
          <td style="padding: 2px 4px 10px 4px; border:none;"></td>
        </tr>
      </tbody>
    </table>

    <table style="border: 0.5px solid #E6E6E6; padding: 2px 4px 20px 4px; width: 100%; border-collapse: collapse; font-size: 8px; margin-top: -1px;">
      <thead>
        <tr>
          <th style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; text-align: left; border-right:none;">Particulars</th>
          <th style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; text-align: right; border-left:none; width: 25%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.particulars
          .map(
            (fee: any) => `
        <tr>
          <td style="padding: 2px 4px 4px 4px; border:none;">${escapeHtml(fee.name)}</td>
          <td style="padding: 2px 4px 4px 4px; text-align: right; border:none;">
          ${parseFloat(fee.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
        </tr>`
          )
          .join('')}
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; font-weight: bold; border-right:none;">Total</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; border-left:none;"></td>
        </tr>
      </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-top: -1px;">
      <tbody>
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; font-weight: bold; border-right:none;">Total Received Amount</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; text-align: right; border-left:none;">
          ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
        </tr>
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; border-right:none;">Vide ${escapeHtml(data.transactionType)}</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; text-align: right; border-left:none;"><span style="color: #666666; ">Date : </span>${escapeHtml(data.date)}</td>
        </tr>
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 4px 4px; font-weight: bold; border-right:none; border-bottom:none;">Amount in words</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 4px 4px; text-align: right; border-left:none; border-bottom:none;">For Techno Institute of Higher Studies</td>
        </tr>
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 4px 4px; border-right:none; border-bottom:none; border-top:none;">${escapeHtml(data.amountInWords)}</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 4px 4px; border-left:none; border-bottom:none; border-top:none;"></td>
        </tr>
        <tr>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; border-right:none; border-top:none; width: 30%;">${escapeHtml(data.remarks ?? '--')}</td>
          <td style="border: 0.5px solid #E6E6E6; padding: 2px 4px 10px 4px; text-align: right; border-left:none; border-top:none;">Authorized Signatory</td>
        </tr>
      </tbody>
    </table>
  `;

  container.innerHTML = `
      <div style="padding: 20px; box-sizing: border-box;">
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
