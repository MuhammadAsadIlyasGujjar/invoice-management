import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private http: HttpClient) {}

  async generatePdf(element: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width);
    
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    return pdf.output('blob');
  }

  async generatePdfV2(element: HTMLElement): Promise<Blob> {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const elementWidth = element.clientWidth;
    const elementHeight = element.clientHeight;

    // Calculate the scaling factor to fit the content within the PDF dimensions
    const scaleX = pdfWidth / elementWidth;
    const scaleY = pdfHeight / elementHeight;
    const scale = Math.min(scaleX, scaleY);

    // Clone the element and scale it
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.transform = `scale(${scale})`;

    // Temporarily append the cloned element to the body for rendering
    document.body.appendChild(clonedElement);

    // Render the cloned element into a canvas
    const canvas = await html2canvas(clonedElement);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
    }

    // Remove the cloned element after rendering
    document.body.removeChild(clonedElement);

    return pdf.output('blob');
  }
  
  async generatePdfV3(element: HTMLElement): Promise<Blob> {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4'
      });
  
      // Ensure images are fully loaded before generating the PDF
      await Promise.all(
          Array.from(element.querySelectorAll('img')).map(img => {
              return new Promise<void>((resolve, reject) => {
                  if (img.complete) {
                      resolve();
                  } else {
                      img.onload = () => resolve();
                      img.onerror = () => reject(new Error('Image failed to load'));
                  }
              });
          })
      );
  
      // Use the html2canvas method to capture the element
      const canvas = await html2canvas(element, {
          scale: 2, // Increase scale for better quality
          useCORS: true // To support images from other origins
      });
  
      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth() * 0.8; // Set zoom level to 80%
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const xOffset = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2; // Calculate horizontal center offset
  
      pdf.addImage(imgData, 'PNG', xOffset, 0, pdfWidth, pdfHeight);
  
      // Output the PDF as a blob
      return pdf.output('blob');
  }
  




  downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

//   async sendPdf(pdfBlob: Blob) {
//     const formData = new FormData();
//     formData.append('pdf', pdfBlob, 'invoice.pdf');

//     return this.http.post('http://localhost:3000/api/send-email', formData).toPromise();
//   }

//   async sendHtmlEmail(element: HTMLElement) {
//     const htmlContent = element.innerHTML;
//     const content = { html: htmlContent };
//     return this.http.post('http://localhost:3000/api/send-html-email', content).toPromise();
//   }
}
