package com.app;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public class PdfTranslator {

    public static void main(String[] args) {
        File pdfFilePath = new File("C:\\Users\\Admin\\Desktop\\TranslateApis\\mypdf.pdf"); // Replace with the path to your PDF file
        String outputCsvFilePath = "translated_text.csv";

        try {
            String pdfText = extractTextFromPdf(pdfFilePath);
            String[] specificRows = extractSpecificRows(pdfText);

            saveToCsv(outputCsvFilePath, specificRows);
            System.out.println("Text extracted and saved to " + outputCsvFilePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String extractTextFromPdf(File pdfFilePath) throws IOException {
        PDDocument document = null;
        try {
            document = PDDocument.load(pdfFilePath);
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } finally {
            if (document != null) {
                document.close();
            }
        }
    }

    private static String[] extractSpecificRows(String pdfText) {
        String[] lines = pdfText.split("\\r?\\n");
        String row4 = lines[3].trim();
        String row7 = lines[6].trim();
        String row8 = lines[7].trim();
        return new String[] { row4, row7, row8 };
    }

    private static void saveToCsv(String filePath, String[] data) throws IOException {
        try (Writer writer = new OutputStreamWriter(new FileOutputStream(filePath), "UTF-8")) {
            writer.write("Row,Text\n");
            for (int i = 0; i < data.length; i++) {
                writer.write((i + 4) + "," + data[i] + "\n");
            }
        }
    }
}
