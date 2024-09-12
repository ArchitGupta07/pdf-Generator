"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawLinesInBox = exports.drawTextCentered = exports.splitTextIntoLines = void 0;
const pdf_lib_1 = require("pdf-lib");
function splitTextIntoLines(text, font, fontSize, maxWidth) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    words.forEach((word) => {
        const lineWithWord = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(lineWithWord, fontSize);
        if (textWidth < maxWidth) {
            currentLine = lineWithWord;
        }
        else {
            lines.push(currentLine);
            currentLine = word; // Start a new line with the word that didn't fit
        }
    });
    // Push the last line if it's not empty
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}
exports.splitTextIntoLines = splitTextIntoLines;
function drawTextCentered(page, text, font, fontSize, currY, width) {
    const lines = splitTextIntoLines(text, font, fontSize, width - 2 * 25);
    lines.forEach((line) => {
        const textWidth = font.widthOfTextAtSize(line, fontSize);
        page.drawText(line, {
            x: width / 2 - textWidth / 2,
            y: currY,
            size: fontSize,
            font: font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        currY -= fontSize + 3; // Adjust Y position for the next line
    });
    return currY;
}
exports.drawTextCentered = drawTextCentered;
function drawLinesInBox(page, start, end, lineCount, fontSize) {
    let startY = start.y;
    for (let i = 0; i < lineCount; i++) {
        startY += fontSize;
        page.drawLine({
            start: { x: start.x, y: startY },
            end: { x: end.x, y: startY },
        });
    }
}
exports.drawLinesInBox = drawLinesInBox;
