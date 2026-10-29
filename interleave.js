import fs from 'node:fs/promises'
import { PDFDocument } from 'pdf-lib';

const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile || !outputFile) {
    console.error("Please specify an input and output file");
    process.exit(1);
}

const inputPDF = await fs.readFile(inputFile)
const inputPDFDoc = await PDFDocument.load(inputPDF)

const outputPDFDoc = await PDFDocument.create()

const pageCount = inputPDFDoc.getPageCount()

for (let i = 0; i < pageCount; i++) {
    const [pdfPage] = await outputPDFDoc.copyPages(inputPDFDoc, [i])
    outputPDFDoc.addPage(pdfPage)
    const source = inputPDFDoc.getPage(i);
    const { width, height } = source.getSize();
    outputPDFDoc.addPage([width, height]);
}

await fs.writeFile(outputFile, await outputPDFDoc.save());

