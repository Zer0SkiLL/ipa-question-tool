"use client"

import React from 'react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { FileDown } from 'lucide-react';
import { Button } from './ui/button';

interface ApprenticePDFGeneratorProps {
  apprentice: {
    first_name: string
    last_name: string
    project_title: string
    expert_role: string
  }
  groupedQuestions: {
    [fachbereich: string]: {
      [themenkomplex: string]: Array<{
        id: number
        question: string
        answer: string
        comment: string
        score: number | null
        isAsked: boolean
        difficulty: { name: string; color: string }
      }>
    }
  }
  scoreInputs: { [key: number]: number | null }
  isAskedInputs: { [key: number]: boolean }
  textInputs: { [key: number]: string }
}

const ApprenticePDFGenerator: React.FC<ApprenticePDFGeneratorProps> = ({
  apprentice,
  groupedQuestions,
  scoreInputs,
  isAskedInputs,
  textInputs,
}) => {
  const generatePDF = () => {
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    const today = new Date();
    const dateStr = today.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const fileName = `IPA_Fachgespraech_${apprentice.first_name}_${apprentice.last_name}.pdf`;

    // --- Header ---
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`IPA Fachgespräch - ${apprentice.first_name} ${apprentice.last_name}`, 14, 20);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(apprentice.project_title, 14, 28);
    pdf.text(`Rolle: ${apprentice.expert_role}`, 14, 35);
    pdf.text(`Datum: ${dateStr}`, pageWidth - 14, 20, { align: 'right' });

    let cursorY = 45;
    let totalScore = 0;
    let totalMaxScore = 0;

    // --- Per Fachbereich / Themenkomplex ---
    for (const [fachbereich, themenkomplexe] of Object.entries(groupedQuestions)) {
      for (const [themenkomplex, questions] of Object.entries(themenkomplexe)) {
        // Check if we need a new page (leave room for header + at least one row)
        if (cursorY > pdf.internal.pageSize.getHeight() - 40) {
          pdf.addPage();
          cursorY = 20;
        }

        // Section header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${fachbereich} - ${themenkomplex}`, 14, cursorY);
        cursorY += 8;

        // Table data
        const dataBody = questions.map((q) => {
          const score = scoreInputs[q.id];
          const scoreDisplay = score !== null && score !== undefined ? String(score) : '--';
          const comment = textInputs[q.id] ?? q.comment ?? '';
          return [q.question, q.answer, scoreDisplay, comment];
        });

        // Generate table
        autoTable(pdf, {
          head: [['Frage', 'Erwartete Antwort', 'Bewertung', 'Kommentar']],
          body: dataBody,
          startY: cursorY,
          rowPageBreak: 'auto',
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 100 },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 70 },
          },
          bodyStyles: {
            minCellHeight: 20,
          },
        });

        // Get the Y position after the table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cursorY = (pdf as any).lastAutoTable.finalY + 5;

        // Subtotal for this Themenkomplex
        const sectionScore = questions.reduce((sum, q) => sum + (scoreInputs[q.id] ?? 0), 0);
        const sectionMaxScore = questions.length * 2;
        totalScore += sectionScore;
        totalMaxScore += sectionMaxScore;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Bewertung: ${sectionScore} / ${sectionMaxScore} Punkte`, 14, cursorY);
        cursorY += 10;
      }
    }

    // --- Footer: Total score on last page ---
    if (cursorY > pdf.internal.pageSize.getHeight() - 30) {
      pdf.addPage();
      cursorY = 20;
    }

    cursorY += 5;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(14, cursorY, pageWidth - 14, cursorY);
    cursorY += 10;

    const percentage = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(1) : '0.0';

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `Gesamtbewertung: ${totalScore} / ${totalMaxScore} Punkte (${percentage}%)`,
      14,
      cursorY,
    );

    pdf.save(fileName);
  };

  return (
    <Button variant="default" onClick={generatePDF}>
      <FileDown className="w-4 h-4 mr-2" />
      Gesamt-PDF erstellen
    </Button>
  );
};

export default ApprenticePDFGenerator;
