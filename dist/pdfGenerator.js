"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_lib_1 = require("pdf-lib");
const fs = __importStar(require("fs"));
const helper_1 = require("./helper");
class Pdf {
    createPdf(width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfDoc = yield pdf_lib_1.PDFDocument.create();
            let page;
            if (width && height) {
                page = pdfDoc.addPage([width, height]);
            }
            else {
                page = pdfDoc.addPage();
            }
            return { pdfDoc, page };
        });
    }
    drawTextOnPage(page, text, x, y, fontSize, font, color = (0, pdf_lib_1.rgb)(0, 0, 0.1)) {
        return __awaiter(this, void 0, void 0, function* () {
            page.drawText(text, {
                x: x,
                y: y,
                size: fontSize,
                font: font,
                color: color,
            });
        });
    }
    createRadioOption(page, reference, text, x, y, font, optionSize, form) {
        return __awaiter(this, void 0, void 0, function* () {
            this.drawTextOnPage(page, text, x, y, optionSize, font);
            const rocketField = form.createRadioGroup(reference);
            rocketField.addOptionToPage(text, page, {
                x: x / 2,
                y: y - 20,
                width: 20,
                height: 20,
            });
        });
    }
    createCheckbox(page, reference, text, x, y, font, size, form) {
        return __awaiter(this, void 0, void 0, function* () {
            this.drawTextOnPage(page, text, x, y, size, font);
            const checkBoxField = form.createCheckBox(reference);
            checkBoxField.addToPage(page, {
                x: x - 12,
                y: y - 2,
                width: size,
                height: size,
            });
        });
    }
    createCell(page, x, y, cellWidth, rowHeight, borderWidth = 1, color = (0, pdf_lib_1.rgb)(1, 1, 1)) {
        return __awaiter(this, void 0, void 0, function* () {
            page.drawRectangle({
                x: x,
                y: y - rowHeight,
                width: cellWidth,
                height: rowHeight,
                borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
                borderWidth: borderWidth,
                color: color,
            });
        });
    }
    getTextWidth(font, text, fontSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield font.widthOfTextAtSize(text, fontSize);
        });
    }
}
function createPdfPage() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a new PDFDocument
        const pdf_obj = new Pdf();
        const { pdfDoc, page } = yield pdf_obj.createPdf();
        // Embed a font
        const form = pdfDoc.getForm();
        //   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        //   const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRoman);
        const boldFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.TimesRomanBold);
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
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        //   ===========================Main hEADING=========================================
        currentheight = (0, helper_1.drawTextCentered)(page, "PRIOR AUTHORIZATION", boldFont, fontSize + 4, currentheight, width);
        //   // Draw 'REQUEST FORM'
        currentheight = (0, helper_1.drawTextCentered)(page, "REQUEST FORM", boldFont, fontSize + 4, currentheight, width);
        let text = "Instructions: Please fill out all applicable sections on both pages completely and legibly. Attach any additional documentation that is important for the review, e.g. chart notes or lab data, to support the prior authorization request.";
        const maxWidth = width - 2 * 25;
        // Split the text into lines
        const lines = (0, helper_1.splitTextIntoLines)(text, font, fontSize, maxWidth);
        // Adjust the line height by setting a smaller gap between lines
        const lineHeight = fontSize + 2; // You can tweak this value to adjust the gap
        // Loop through each line and draw it on the page
        lines.forEach((line, i) => {
            page.drawText(line, {
                x: 25,
                y: currentheight - i * lineHeight, // Adjust y position for each line
                size: fontSize,
                font: font,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
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
            color: (0, pdf_lib_1.rgb)(144 / 255, 180 / 255, 228 / 255),
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
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
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
            borderWidth: 1,
        });
        //   currentheight -= cellHeight * 4;
        (0, helper_1.drawLinesInBox)(page, { x: memberInfoBoxX, y: memberInfoBoxY }, { x: memberInfoWidth + memberInfoBoxX, y: memberInfoBoxY }, 4, cellHeight);
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
        let newtextWidth = yield pdf_obj.getTextWidth(font, text, fontSize);
        page.drawText(text, {
            x: (memberInfoWidth + memberInfoBoxX) / 2 - newtextWidth / 2,
            y: memberInfoBoxY + cellHeight * 4 + 6,
            size: fontSize,
            font: boldFont,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "Plan";
        //   textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
            x: memberInfoBoxX + 2,
            y: memberInfoBoxY + cellHeight * 3 + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "Member Name : ";
        page.drawText(text, {
            x: memberInfoBoxX + 2,
            y: memberInfoBoxY + cellHeight * 2 + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "DOB :";
        page.drawText(text, {
            x: (memberInfoWidth + memberInfoBoxX) / 2 + 2,
            y: memberInfoBoxY + cellHeight * 2 + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = ` Today's Date  :`;
        page.drawText(text, {
            x: (memberInfoWidth + memberInfoBoxX) * (3 / 4) + 2,
            y: memberInfoBoxY + cellHeight * 2 + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "Member Id : ";
        // textWidth = pdf_obj.getTextWidth(font,text, fontSize);
        page.drawText(text, {
            x: memberInfoBoxX + 2,
            y: memberInfoBoxY + cellHeight + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "Member Phone Number : ";
        page.drawText(text, {
            x: (memberInfoWidth + memberInfoBoxX) / 2 + 2,
            y: memberInfoBoxY + cellHeight + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        text = "Service Type";
        page.drawText(text, {
            x: memberInfoBoxX + 2,
            y: memberInfoBoxY + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        page.drawText("Elective/Routine", {
            x: ((memberInfoWidth + memberInfoBoxX) / 2) * (2 / 5) + 30,
            y: memberInfoBoxY + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        page.drawText("Expedited/Urgent", {
            x: (memberInfoWidth + memberInfoBoxX) / 2 + 30,
            y: memberInfoBoxY + 2,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
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
        var lineText = "***Clinical notes and supporting documentation are REQUIRED to review for medical necessity***";
        var subTextWidth = yield pdf_obj.getTextWidth(font, lineText, fontSize);
        pdf_obj.drawTextOnPage(page, lineText, 40 + (currentWidth - subTextWidth) / 2, currentheight + 8, fontSize, font);
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
        const column3 = [
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
        pdf_obj.createCell(page, tableMarginL, currentheight, width - 69, 20, undefined, (0, pdf_lib_1.rgb)(144 / 255, 180 / 255, 228 / 255));
        let headx1 = yield pdf_obj.getTextWidth(font, "Referal'Service type requested", fontSize);
        pdf_obj.drawTextOnPage(page, "Referal/Service type requested", typeof width === "number" && typeof headx1 === "number"
            ? (width - headx1) / 2
            : 0, currentheight - (23 - fontSize), fontSize, boldFont);
        currentheight -= 20;
        var checkBoxPadding = 3;
        column1.forEach((item, index) => {
            const rowHeight = fontSize * 6 + extraSpacing;
            pdf_obj.createCell(page, tableMarginL, currentheight, currentWidth * (1 / 4), rowHeight * (1 / column1.length) + 10 + checkBoxPadding * 5);
            Object.entries(item).forEach(([key, value], indx) => {
                let xChange = (textWidth + 30) * indx;
                const padding = 3;
                console.log(currentheight - (fontSize + checkBoxPadding) * (indx + 1));
                if (value === "checkbox") {
                    pdf_obj.createCheckbox(page, `column1.${key}`, key, 60, currentheight -
                        (fontSize + checkBoxPadding) * (indx + 1) -
                        extraSpacing / Object.keys(item).length, font, fontSize, form);
                }
                else if (value === "subhead") {
                    pdf_obj.drawTextOnPage(page, key, 50, currentheight - fontSize * (indx + 1), fontSize, boldFont);
                }
            });
        });
        column2.forEach((item, index) => {
            let upperPadding = 4;
            const rowHeight = fontSize * 6 + extraSpacing;
            pdf_obj.createCell(page, tableMarginL + currentWidth * 0.25 * 1, currentheight, currentWidth * 0.25, 
            //   textWidth + 30,
            rowHeight * (1 / column1.length) + 10 + checkBoxPadding * 5);
            Object.entries(item).forEach(([key, value], indx) => {
                let xChange = (textWidth + 30) * indx;
                if (value === "checkbox") {
                    pdf_obj.createCheckbox(page, `column2.${key}`, key, 60 + currentWidth * 0.25 * 1 - upperPadding, currentheight -
                        (fontSize + checkBoxPadding) * (indx + 1) -
                        extraSpacing / Object.keys(item).length, font, fontSize, form);
                }
                else {
                    pdf_obj.drawTextOnPage(page, key, 60 + currentWidth * 0.25 * 3, currentheight -
                        fontSize * (indx + 1) -
                        extraSpacing / Object.keys(item).length, fontSize, boldFont);
                }
            });
        });
        column3.forEach((item, index) => {
            const rowHeight = (fontSize * 6 + extraSpacing + 10 + checkBoxPadding * 5) *
                (1 / column3.length);
            console.log(rowHeight);
            pdf_obj.createCell(page, tableMarginL + currentWidth * 0.25 * 2, currentheight - rowHeight * index, currentWidth * 0.25, rowHeight);
            Object.entries(item).forEach(([key, value], indx) => {
                let xChange = (textWidth + 30) * indx;
                if (value === "checkbox") {
                    pdf_obj.createCheckbox(page, `column3.${key}`, key, 60 + currentWidth * 0.25 * 2, currentheight -
                        (fontSize + checkBoxPadding) * (indx + 1) -
                        rowHeight * index, font, fontSize, form);
                }
                else if (value === "subhead") {
                    pdf_obj.drawTextOnPage(page, key, 50 + currentWidth * 0.25 * 2, currentheight - fontSize * (indx + 1) - rowHeight * index, fontSize, boldFont);
                }
            });
        });
        var heightIncrement = 0;
        console.log("curretwidth1", currentWidth, currentWidth * 0.25);
        column4.forEach((item, index) => {
            const rowHeight = (fontSize * 6 + extraSpacing + 10 + checkBoxPadding * 5) *
                (1 / column4.length);
            console.log(rowHeight);
            pdf_obj.createCell(page, tableMarginL + currentWidth * 0.25 * 3, currentheight, currentWidth * (1 / 4), rowHeight);
            heightIncrement += rowHeight;
            Object.entries(item).forEach(([key, value], indx) => {
                let xChange = (textWidth + 30) * indx;
                if (value === "checkbox") {
                    pdf_obj.createCheckbox(page, `column4.${key}`, key, 60 + currentWidth * 0.25 * 3, currentheight -
                        (fontSize + checkBoxPadding) * (indx + 1) -
                        extraSpacing / Object.keys(item).length, font, fontSize, form);
                }
                else {
                    pdf_obj.drawTextOnPage(page, key, 60 + currentWidth * 0.25 * 3, currentheight -
                        fontSize * (indx + 1) -
                        extraSpacing / Object.keys(item).length, fontSize, boldFont);
                }
            });
        });
        currentheight -= heightIncrement + checkBoxPadding * 5 - 15;
        //   ========================================Table heading =============================================
        pdf_obj.createCell(page, tableMarginL, currentheight, width - 69, cellHeight, undefined, (0, pdf_lib_1.rgb)(144 / 255, 180 / 255, 228 / 255));
        let headx2 = yield pdf_obj.getTextWidth(font, "Procedure Information", fontSize);
        pdf_obj.drawTextOnPage(page, "Procedure Information", typeof width === "number" && typeof headx1 === "number"
            ? (width - headx2) / 2
            : 0, currentheight - (23 - fontSize), fontSize, boldFont);
        currentheight -= 20;
        //   ========================================Table 3 heading end =============================================
        //   ===========================================================================================================
        //   ========================================Table 3 Starts =============================================
        //   row1------------------
        pdf_obj.createCell(page, tableMarginL, currentheight, currentWidth * (2 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Diagnosis Code & Description:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row2------------------------------------------------------------------------------
        console.log("curretwidth", currentWidth);
        pdf_obj.createCell(page, tableMarginL, currentheight, currentWidth * (2 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*CPT/HCPC Code & Description: ", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row3------------------------------------------------------------------------------
        pdf_obj.createCell(page, tableMarginL, currentheight, currentWidth * (2 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*J Code/Description/Dose/NDC:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row4------------------------------------------------------------------------------
        pdf_obj.createCell(page, tableMarginL, currentheight, currentWidth * (2 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Number of visits/days/units requested (circle type and specific quantity):", tableMarginL + 5, currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row5------------------------------------------------------------------------------
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight + 20 * 4, currentWidth * (1 / 3), cellHeight * 4);
        pdf_obj.drawTextOnPage(page, "For Internal Use:", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight + 20 * 4 - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 9), 20);
        pdf_obj.drawTextOnPage(page, "Dates of Service:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 9), currentheight, currentWidth * (4 / 9), cellHeight);
        pdf_obj.drawTextOnPage(page, "From:                    To:", tableMarginL + paddinL + currentWidth * (2 / 9), currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (6 / 9), currentheight, currentWidth * (3 / 9), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (6 / 9), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   ========================================Table heading=============================================
        pdf_obj.createCell(page, tableMarginL, currentheight, width - 69, cellHeight, undefined, (0, pdf_lib_1.rgb)(144 / 255, 180 / 255, 228 / 255));
        let headx3 = yield pdf_obj.getTextWidth(font, "Requesting Provider Information", fontSize);
        pdf_obj.drawTextOnPage(page, "Requesting Provider Information", typeof width === "number" && typeof headx1 === "number"
            ? (width - headx3) / 2
            : 0, currentheight - (23 - fontSize), fontSize, boldFont);
        currentheight -= 20;
        //   ========================================Table 4 heading end =============================================
        //   ===========================================================================================================
        //   ========================================Table 4 Starts =============================================
        //   row1------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Name/Credentials:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row2--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Address:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "Contact Name:", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row3--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Billing NPI: ", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (1 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Phone No:", tableMarginL + paddinL + currentWidth * (1 / 3), currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Fax No:", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row4--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Billing TIN: ", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (1 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (1 / 3), currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   ========================================Table Ends =============================================
        //   ========================================Table heading=============================================
        let headx4 = yield pdf_obj.getTextWidth(font, "Servicing Provider/Facility Information", fontSize);
        pdf_obj.createCell(page, tableMarginL, currentheight, width - 69, cellHeight, undefined, (0, pdf_lib_1.rgb)(144 / 255, 180 / 255, 228 / 255));
        pdf_obj.drawTextOnPage(page, "Servicing Provider/Facility Information", typeof width === "number" && typeof headx1 === "number"
            ? (width - headx4) / 2
            : 0, currentheight - (23 - fontSize), fontSize, boldFont);
        currentheight -= 20;
        //   ========================================Table 5 heading end =============================================
        //   ===========================================================================================================
        //   ========================================Table 5 Starts =============================================
        //   row1------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Name:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row2--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Address:", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "Contact Name:", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row3--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (1 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Servicing NPI: ", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (1 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Phone No: ", tableMarginL + paddinL + currentWidth * (1 / 3), currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "*Fax No: ", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row4--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "*Servicing TIN: ", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, tableMarginL + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), cellHeight);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        //   row5--------------------------------------------------------------------------------------
        pdf_obj.createCell(page, 40, currentheight, currentWidth * (2 / 3), 20);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL, currentheight - (23 - fontSize), fontSize, font);
        pdf_obj.createCell(page, 40 + currentWidth * (2 / 3), currentheight, currentWidth * (1 / 3), 20);
        pdf_obj.drawTextOnPage(page, "", tableMarginL + paddinL + currentWidth * (2 / 3), currentheight - (23 - fontSize), fontSize, font);
        currentheight -= 20;
        const pdfBytes = yield pdfDoc.save();
        fs.writeFileSync("output.pdf", pdfBytes);
        console.log("PDF created successfully with TypeScript!");
    });
}
createPdfPage();
