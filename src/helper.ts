import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

export function splitTextIntoLines(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";
  words.forEach((word) => {
    const lineWithWord = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(lineWithWord, fontSize);
    if (textWidth < maxWidth) {
      currentLine = lineWithWord;
    } else {
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
export function drawTextCentered(
  page: PDFPage,
  text: string,
  font: PDFFont,
  fontSize: number,
  currY: number,
  width: number
) {
  const lines = splitTextIntoLines(text, font, fontSize, width - 2 * 25);
  lines.forEach((line) => {
    const textWidth = font.widthOfTextAtSize(line, fontSize);
    page.drawText(line, {
      x: width / 2 - textWidth / 2,
      y: currY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    currY -= fontSize + 3; // Adjust Y position for the next line
  });
  return currY;
}

export function drawLinesInBox(
  page: PDFPage,
  start: { x: number; y: number },
  end: { x: number; y: number },
  lineCount: number,
  fontSize: number
) {
  let startY = start.y;

  for (let i = 0; i < lineCount; i++) {
    startY += fontSize;
    page.drawLine({
      start: { x: start.x, y: startY },
      end: { x: end.x, y: startY },
    });
  }
}
