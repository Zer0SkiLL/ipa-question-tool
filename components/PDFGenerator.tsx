// components/PDFGenerator.tsx
import React from 'react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
// import { Question } from '@/app/model/Question';

interface PDFGeneratorProps {
  fachbereich: string;
  themenkomplex: string;
  questions: Question[];
}

interface Question {
    id: number
    question: string
    answer: string
    fachbereich: string
    themenkomplex: string
    comment: string
  }

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ fachbereich, themenkomplex, questions }) => {
  const generatePDF = () => {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set the filename
    const fileName = `${fachbereich}_${themenkomplex}.pdf`;

    // Add headers/title
    pdf.text(fachbereich, 14, 20);
    pdf.text(themenkomplex, 14, 30);
    pdf.text(new Date().toLocaleDateString(), 168, 20); // Current date

    // Prepare data for the table
    const dataBody = questions.map((q) => [q.question, q.answer, '']);

    // Generate the table
    autoTable(pdf, {
      head: [['Question', 'Answer', 'Comment']],
      body: dataBody,
      startY: 35,
      rowPageBreak: 'auto',
      headStyles: {
        minCellWidth: 60,
      },
      bodyStyles: {
        minCellHeight: 40,
      },
      columnStyles: {
        2: {
          // Index of the comment column
          cellWidth: 50, // Set the width of the comment column
        },
      },
      didDrawCell: function (data) {
        // Only add form fields to the comment column
        if (
          data.column.index === 2 &&
          data.row.index !== undefined &&
          data.row.index !== null &&
          data.row.section === 'body' // Make sure we're in the body, not the header
        ) {
          const cellWidth = data.cell.width;
          const cellHeight = data.cell.height;
          const cellPosX = data.cell.x;
          const cellPosY = data.cell.y;

          // Add a text input field in the comment column
          const textField = new (pdf as any).AcroFormTextField();
          textField.Rect = [cellPosX + 2, cellPosY + 2, cellWidth - 4, cellHeight - 4];
          textField.multiline = true;
          textField.value = ''; // Initial value (empty)
          pdf.addField(textField);
        }
      },
    });

    // Save the PDF
    pdf.save(fileName);
  };

  return (
    <button onClick={generatePDF} className='bg-transparent border-none p-0'>
      Generate PDF
    </button>
  );
};

export default PDFGenerator;
