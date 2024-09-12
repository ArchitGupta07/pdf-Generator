import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";
import { drawLinesInBox, drawTextCentered, splitTextIntoLines } from "./helper";

class Pdf {
  async createPdf(width?: number, height?: number) {
    const pdfDoc = await PDFDocument.create();

    let page;

    if (width && height) {
      page = pdfDoc.addPage([width, height]);
    } else {
      page = pdfDoc.addPage();
    }
    return { pdfDoc, page };
  }

  async drawTextOnPage(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    font: any,
    color = rgb(0, 0, 0.1)
  ) {
    page.drawText(text, {
      x: x,
      y: y,
      size: fontSize,
      font: font,
      color: color,
    });
  }

  async createRadioOption(
    page: PDFPage,
    reference: string,
    text: string,
    x: number,
    y: number,
    font: any,
    optionSize: number,
    form: any
  ) {
    this.drawTextOnPage(page, text, x, y, optionSize, font);
    const rocketField = form.createRadioGroup(reference);
    rocketField.addOptionToPage(text, page, {
      x: x / 2,
      y: y - 20,
      width: 20,
      height: 20,
    });
  }
  async createCheckbox(
    page: PDFPage,
    reference: string,
    text: string,
    x: number,
    y: number,
    font: any,
    size: number,
    form: any
  ) {
    this.drawTextOnPage(page, text, x, y, size, font);
    const checkBoxField = form.createCheckBox(reference);
    checkBoxField.addToPage(page, {
      x: x - 12,
      y: y - 2,
      width: size,
      height: size,
    });
  }

  async createCell(
    page: PDFPage,
    x: number,
    y: number,
    cellWidth: number,
    rowHeight: number,
    borderWidth = 1,
    color = rgb(1, 1, 1)
  ) {
    page.drawRectangle({
      x: x,
      y: y - rowHeight,
      width: cellWidth,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: borderWidth,
      color: color,
    });
  }

  async getTextWidth(
    font: any,
    text: string,
    fontSize: number
  ): Promise<number> {
    return await font.widthOfTextAtSize(text, fontSize);
  }
}

async function createPdfPage() {
  // Create a new PDFDocument
  const pdf_obj = new Pdf();
  const { pdfDoc, page } = await pdf_obj.createPdf();

  // Embed a font
  const form = pdfDoc.getForm();
  //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //   const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const { width, height } = page.getSize();

  const fontSize = 10;
  const textWidth = font.widthOfTextAtSize("Acute Impatient Rehab", fontSize);

  var currentheight = height - 50;
  var currentWidth = width - 69;

  const cellHeight = 20;

  const tableMarginL = 40;
  const paddinL = 5;

  //   =====================================================Merge Start=====================================================
  const borderMargin = 20;
  const leftGapFromBox = 2;
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: width - 2 * borderMargin,
    height: height - 2 * borderMargin,
    borderColor: rgb(0, 0, 0),
  });

  //   ===========================Main hEADING=========================================

  currentheight = drawTextCentered(
    page,
    "PRIOR AUTHORIZATION",
    boldFont,
    fontSize + 4,
    currentheight,
    width
  );

  //   // Draw 'REQUEST FORM'
  currentheight = drawTextCentered(
    page,
    "REQUEST FORM",
    boldFont,
    fontSize + 4,
    currentheight,
    width
  );
  let text =
    "Instructions: Please fill out all applicable sections on both pages completely and legibly. Attach any additional documentation that is important for the review, e.g. chart notes or lab data, to support the prior authorization request.";

  const maxWidth = width - 2 * 25;

  // Split the text into lines
  const lines = splitTextIntoLines(text, font, fontSize, maxWidth);

  // Adjust the line height by setting a smaller gap between lines
  const lineHeight = fontSize + 2; // You can tweak this value to adjust the gap

  // Loop through each line and draw it on the page
  lines.forEach((line, i) => {
    page.drawText(line, {
      x: 25,
      y: currentheight - i * lineHeight, // Adjust y position for each line
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  currentheight -= 25;

  //   ========================================Table 1 heading start =============================================
  currentheight = currentheight - cellHeight * 5;
  const memberInfoBoxY = currentheight;
  const memberInfoBoxX = tableMarginL;
  const memberInfoWidth = width - 2 * memberInfoBoxX + 10;

  page.drawRectangle({
    x: memberInfoBoxX,
    y: memberInfoBoxY + cellHeight * 4,
    width: memberInfoWidth,
    height: cellHeight,
    color: rgb(144 / 255, 180 / 255, 228 / 255),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  currentheight -= cellHeight;

  //   ========================================Table 1 heading end =============================================
  //   ===========================================================================================================
  //   ========================================Table 1 Starts =============================================
  page.drawRectangle({
    x: memberInfoBoxX,
    y: memberInfoBoxY,
    width: memberInfoWidth,
    height: cellHeight * 5,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  //   currentheight -= cellHeight * 4;

  drawLinesInBox(
    page,
    { x: memberInfoBoxX, y: memberInfoBoxY },
    { x: memberInfoWidth + memberInfoBoxX, y: memberInfoBoxY },
    4,
    cellHeight
  );

  page.drawLine({
    start: { x: (memberInfoWidth + memberInfoBoxX) / 2, y: memberInfoBoxY },
    end: {
      x: (memberInfoWidth + memberInfoBoxX) / 2,
      y: memberInfoBoxY + 4 * cellHeight,
    },
  });
  page.drawLine({
    start: {
      x: (memberInfoWidth + memberInfoBoxX) * (3 / 4),
      y: memberInfoBoxY + cellHeight * 3,
    },
    end: {
      x: (memberInfoWidth + memberInfoBoxX) * (3 / 4),
      y: memberInfoBoxY + cellHeight * 2,
    },
  });

  page.drawLine({
    start: {
      x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5),
      y: memberInfoBoxY + cellHeight * 3,
    },
    end: {
      x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5),
      y: memberInfoBoxY + cellHeight * 4,
    },
  });

  page.drawLine({
    start: {
      x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5),
      y: memberInfoBoxY,
    },
    end: {
      x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5),
      y: memberInfoBoxY + cellHeight,
    },
  });

  text = "Member Information";
  let newtextWidth = await pdf_obj.getTextWidth(font, text, fontSize);
  page.drawText(text, {
    x: (memberInfoWidth + memberInfoBoxX) / 2 - newtextWidth / 2,
    y: memberInfoBoxY + cellHeight * 4 + 6,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  text = "Plan";
  //   textWidth = font.widthOfTextAtSize(text, fontSize);
  page.drawText(text, {
    x: memberInfoBoxX + 2,
    y: memberInfoBoxY + cellHeight * 3 + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = "Member Name : ";
  page.drawText(text, {
    x: memberInfoBoxX + 2,
    y: memberInfoBoxY + cellHeight * 2 + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = "DOB :";
  page.drawText(text, {
    x: (memberInfoWidth + memberInfoBoxX) / 2 + 2,
    y: memberInfoBoxY + cellHeight * 2 + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = ` Today's Date  :`;
  page.drawText(text, {
    x: (memberInfoWidth + memberInfoBoxX) * (3 / 4) + 2,
    y: memberInfoBoxY + cellHeight * 2 + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = "Member Id : ";
  // textWidth = pdf_obj.getTextWidth(font,text, fontSize);
  page.drawText(text, {
    x: memberInfoBoxX + 2,
    y: memberInfoBoxY + cellHeight + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = "Member Phone Number : ";
  page.drawText(text, {
    x: (memberInfoWidth + memberInfoBoxX) / 2 + 2,
    y: memberInfoBoxY + cellHeight + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  text = "Service Type";
  page.drawText(text, {
    x: memberInfoBoxX + 2,
    y: memberInfoBoxY + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Elective/Routine", {
    x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5) + 30,
    y: memberInfoBoxY + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Expedited/Urgent", {
    x: (memberInfoWidth + memberInfoBoxX) / 2 + 30,
    y: memberInfoBoxY + 2,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  //   const form = pdfDoc.getForm();
  // Add a checkbox for 'Elective/Routine'
  const electiveRoutineCheckBox = form.createCheckBox("electiveRoutine");
  electiveRoutineCheckBox.addToPage(page, {
    x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5) + 15,
    y: memberInfoBoxY + 2,
    width: 12,
    height: 12,
  });

  // Add a checkbox for 'Elective/Routine'
  const expeditedUrgentCheckBox = form.createCheckBox("urgentRoutine");
  expeditedUrgentCheckBox.addToPage(page, {
    x: (memberInfoWidth + memberInfoBoxX) / 2 + 15,
    y: memberInfoBoxY + 2,
    width: 12,
    height: 12,
  });

  //   =====================================================Merge End=====================================================

  var lineText =
    "***Clinical notes and supporting documentation are REQUIRED to review for medical necessity***";
  var subTextWidth = await pdf_obj.getTextWidth(font, lineText, fontSize);
  pdf_obj.drawTextOnPage(
    page,
    lineText,
    40 + (currentWidth - subTextWidth) / 2,
    currentheight + 8,
    fontSize,
    font
  );

  //   ===========================================================================================================
  //   ========================================Table 2 Starts =============================================
  //   type TableColumnValue = {
  //     [key: string]: string;
  //   };

  const column1 = [
    {
      Inpatient: "subhead",
      "ER Admits": "checkbox",
      SNF: "checkbox",
      Custodial: "checkbox",
      "Acute Impatient Rehab": "checkbox",
      "Inpatient Detox": "checkbox",
      "Ventilator Services": "checkbox",
    },
  ];
  const column2 = [
    {
      "": "subhead",
      "Surgical Procedure": "checkbox",
      "Diagnostic Procedure": "checkbox",
      "Infusion Therapy": "checkbox",
      "Speech Therapy": "checkbox",
      "Physical therapy": "checkbox",
      "Occupational Therapy": "checkbox",
    },
  ];
  const column3: TableColumnValue[] = [
    {
      "**Office": "subhead",
      "Office Procedure/Visit": "checkbox",
    },
    {
      "**Home Health": "subhead",
      "Skilled Services": "checkbox",
      "Home Infusion": "checkbox",
    },
  ];
  const column4 = [
    {
      "**DME": "subhead",
      wheelchair: "checkbox",
      "Enteral Formula": "checkbox",
      Prosthetic: "checkbox",
      Other: "checkbox",
      "": "text",
      "Out-of-State request": "checkbox",
    },
  ];
  let extraSpacing = 12;

  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    width - 69,
    20,
    undefined,
    rgb(144 / 255, 180 / 255, 228 / 255)
  );
  let headx1 = await pdf_obj.getTextWidth(
    font,
    "Referal'Service type requested",
    fontSize
  );
  pdf_obj.drawTextOnPage(
    page,
    "Referal/Service type requested",
    typeof width === "number" && typeof headx1 === "number"
      ? (width - headx1) / 2
      : 0,
    currentheight - (23 - fontSize),
    fontSize,
    boldFont
  );

  currentheight -= 20;

  var checkBoxPadding: number = 3;

  column1.forEach((item: TableColumnValue, index: number) => {
    const rowHeight = fontSize * 6 + extraSpacing;
    pdf_obj.createCell(
      page,
      tableMarginL,
      currentheight,
      currentWidth * (1 / 4),
      rowHeight * (1 / column1.length) + 10 + checkBoxPadding * 5
    );

    Object.entries(item).forEach(([key, value], indx) => {
      let xChange = (textWidth + 30) * indx;
      const padding: number = 3;

      console.log(currentheight - (fontSize + checkBoxPadding) * (indx + 1));

      if (value === "checkbox") {
        pdf_obj.createCheckbox(
          page,
          `column1.${key}`,
          key,
          60,
          currentheight -
            (fontSize + checkBoxPadding) * (indx + 1) -
            extraSpacing / Object.keys(item).length,
          font,
          fontSize,
          form
        );
      } else if (value === "subhead") {
        pdf_obj.drawTextOnPage(
          page,
          key,
          50,
          currentheight - fontSize * (indx + 1),
          fontSize,
          boldFont
        );
      }
    });
  });
  column2.forEach((item: TableColumnValue, index: number) => {
    let upperPadding = 4;
    const rowHeight = fontSize * 6 + extraSpacing;
    pdf_obj.createCell(
      page,
      tableMarginL + currentWidth * 0.25 * 1,
      currentheight,
      currentWidth * 0.25,
      //   textWidth + 30,
      rowHeight * (1 / column1.length) + 10 + checkBoxPadding * 5
    );

    Object.entries(item).forEach(([key, value], indx) => {
      let xChange = (textWidth + 30) * indx;
      if (value === "checkbox") {
        pdf_obj.createCheckbox(
          page,
          `column2.${key}`,
          key,
          60 + currentWidth * 0.25 * 1 - upperPadding,
          currentheight -
            (fontSize + checkBoxPadding) * (indx + 1) -
            extraSpacing / Object.keys(item).length,
          font,
          fontSize,
          form
        );
      } else {
        pdf_obj.drawTextOnPage(
          page,
          key,
          60 + currentWidth * 0.25 * 3,
          currentheight -
            fontSize * (indx + 1) -
            extraSpacing / Object.keys(item).length,
          fontSize,
          boldFont
        );
      }
    });
  });
  column3.forEach((item: TableColumnValue, index: number) => {
    const rowHeight =
      (fontSize * 6 + extraSpacing + 10 + checkBoxPadding * 5) *
      (1 / column3.length);
    console.log(rowHeight);
    pdf_obj.createCell(
      page,
      tableMarginL + currentWidth * 0.25 * 2,
      currentheight - rowHeight * index,
      currentWidth * 0.25,
      rowHeight
    );

    Object.entries(item).forEach(([key, value], indx) => {
      let xChange = (textWidth + 30) * indx;

      if (value === "checkbox") {
        pdf_obj.createCheckbox(
          page,
          `column3.${key}`,
          key,
          60 + currentWidth * 0.25 * 2,
          currentheight -
            (fontSize + checkBoxPadding) * (indx + 1) -
            rowHeight * index,
          font,
          fontSize,
          form
        );
      } else if (value === "subhead") {
        pdf_obj.drawTextOnPage(
          page,
          key,
          50 + currentWidth * 0.25 * 2,
          currentheight - fontSize * (indx + 1) - rowHeight * index,
          fontSize,
          boldFont
        );
      }
    });
  });

  var heightIncrement = 0;
  console.log("curretwidth1", currentWidth, currentWidth * 0.25);
  column4.forEach((item: TableColumnValue, index: number) => {
    const rowHeight =
      (fontSize * 6 + extraSpacing + 10 + checkBoxPadding * 5) *
      (1 / column4.length);
    console.log(rowHeight);

    pdf_obj.createCell(
      page,
      tableMarginL + currentWidth * 0.25 * 3,
      currentheight,
      currentWidth * (1 / 4),
      rowHeight
    );
    heightIncrement += rowHeight;

    Object.entries(item).forEach(([key, value], indx) => {
      let xChange = (textWidth + 30) * indx;
      if (value === "checkbox") {
        pdf_obj.createCheckbox(
          page,
          `column4.${key}`,
          key,
          60 + currentWidth * 0.25 * 3,
          currentheight -
            (fontSize + checkBoxPadding) * (indx + 1) -
            extraSpacing / Object.keys(item).length,
          font,
          fontSize,
          form
        );
      } else {
        pdf_obj.drawTextOnPage(
          page,
          key,
          60 + currentWidth * 0.25 * 3,
          currentheight -
            fontSize * (indx + 1) -
            extraSpacing / Object.keys(item).length,
          fontSize,
          boldFont
        );
      }
    });
  });

  currentheight -= heightIncrement + checkBoxPadding * 5 - 15;

  //   ========================================Table heading =============================================

  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    width - 69,
    cellHeight,
    undefined,
    rgb(144 / 255, 180 / 255, 228 / 255)
  );
  let headx2 = await pdf_obj.getTextWidth(
    font,
    "Procedure Information",
    fontSize
  );
  pdf_obj.drawTextOnPage(
    page,
    "Procedure Information",
    typeof width === "number" && typeof headx1 === "number"
      ? (width - headx2) / 2
      : 0,
    currentheight - (23 - fontSize),
    fontSize,
    boldFont
  );

  currentheight -= 20;

  //   ========================================Table 3 heading end =============================================
  //   ===========================================================================================================
  //   ========================================Table 3 Starts =============================================

  //   row1------------------

  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    currentWidth * (2 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Diagnosis Code & Description:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row2------------------------------------------------------------------------------
  console.log("curretwidth", currentWidth);
  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    currentWidth * (2 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*CPT/HCPC Code & Description: ",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row3------------------------------------------------------------------------------

  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    currentWidth * (2 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*J Code/Description/Dose/NDC:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row4------------------------------------------------------------------------------

  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    currentWidth * (2 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Number of visits/days/units requested (circle type and specific quantity):",
    tableMarginL + 5,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row5------------------------------------------------------------------------------

  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight + 20 * 4,
    currentWidth * (1 / 3),
    cellHeight * 4
  );
  pdf_obj.drawTextOnPage(
    page,
    "For Internal Use:",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight + 20 * 4 - (23 - fontSize),
    fontSize,
    font
  );

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 9), 20);
  pdf_obj.drawTextOnPage(
    page,
    "Dates of Service:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 9),
    currentheight,
    currentWidth * (4 / 9),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "From:                    To:",
    tableMarginL + paddinL + currentWidth * (2 / 9),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (6 / 9),
    currentheight,
    currentWidth * (3 / 9),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (6 / 9),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   ========================================Table heading=============================================
  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    width - 69,
    cellHeight,
    undefined,
    rgb(144 / 255, 180 / 255, 228 / 255)
  );
  let headx3 = await pdf_obj.getTextWidth(
    font,
    "Requesting Provider Information",
    fontSize
  );
  pdf_obj.drawTextOnPage(
    page,
    "Requesting Provider Information",
    typeof width === "number" && typeof headx1 === "number"
      ? (width - headx3) / 2
      : 0,
    currentheight - (23 - fontSize),
    fontSize,
    boldFont
  );

  currentheight -= 20;
  //   ========================================Table 4 heading end =============================================
  //   ===========================================================================================================
  //   ========================================Table 4 Starts =============================================

  //   row1------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Name/Credentials:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );

  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row2--------------------------------------------------------------------------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Address:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "Contact Name:",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row3--------------------------------------------------------------------------------------
  pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Billing NPI: ",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (1 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Phone No:",
    tableMarginL + paddinL + currentWidth * (1 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Fax No:",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;
  //   row4--------------------------------------------------------------------------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Billing TIN: ",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (1 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (1 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   ========================================Table Ends =============================================
  //   ========================================Table heading=============================================
  let headx4 = await pdf_obj.getTextWidth(
    font,
    "Servicing Provider/Facility Information",
    fontSize
  );
  pdf_obj.createCell(
    page,
    tableMarginL,
    currentheight,
    width - 69,
    cellHeight,
    undefined,
    rgb(144 / 255, 180 / 255, 228 / 255)
  );
  pdf_obj.drawTextOnPage(
    page,
    "Servicing Provider/Facility Information",
    typeof width === "number" && typeof headx1 === "number"
      ? (width - headx4) / 2
      : 0,
    currentheight - (23 - fontSize),
    fontSize,
    boldFont
  );

  currentheight -= 20;
  //   ========================================Table 5 heading end =============================================
  //   ===========================================================================================================
  //   ========================================Table 5 Starts =============================================

  //   row1------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Name:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );

  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row2--------------------------------------------------------------------------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Address:",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "Contact Name:",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row3--------------------------------------------------------------------------------------
  pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Servicing NPI: ",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (1 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Phone No: ",
    tableMarginL + paddinL + currentWidth * (1 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "*Fax No: ",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;
  //   row4--------------------------------------------------------------------------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "*Servicing TIN: ",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    tableMarginL + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    cellHeight
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  //   row5--------------------------------------------------------------------------------------

  pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL,
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  pdf_obj.createCell(
    page,
    40 + currentWidth * (2 / 3),
    currentheight,
    currentWidth * (1 / 3),
    20
  );
  pdf_obj.drawTextOnPage(
    page,
    "",
    tableMarginL + paddinL + currentWidth * (2 / 3),
    currentheight - (23 - fontSize),
    fontSize,
    font
  );
  currentheight -= 20;

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync("output.pdf", pdfBytes);
  console.log("PDF created successfully with TypeScript!");
}

createPdfPage();
