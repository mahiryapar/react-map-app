import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { fetchPolygons } from '../../services/api.js';

pdfMake.vfs = pdfFonts.vfs;


async function exportPDF() {
  try {
    const data = await fetchPolygons();
    const features = Array.isArray(data)
      ? data
      : (Array.isArray(data?.features) ? data.features : []);

    if (!features.length) {
      console.warn('exportPDF: Gösterilecek veri yok.');
      return;
    }

    const summaryHeader = [
      { text: 'ID', style: 'tableHeader' },
      { text: 'Ad', style: 'tableHeader' },
      { text: 'Tür', style: 'tableHeader' },
      { text: 'Numarataj', style: 'tableHeader' },
      { text: 'Geometri', style: 'tableHeader' },
    ];

    const summaryRows = features.map((f) => ([
      String(f?.id ?? ''),
      String(f?.properties?.ad ?? ''),
      String(f?.properties?.tur ?? ''),
      String(f?.properties?.numarataj ?? ''),
      String(f?.geometry?.type ?? ''),
    ]));

    const detailSections = features.flatMap((f, idx) => {
      const geomType = f?.geometry?.type ?? '-';
      const ring0 = Array.isArray(f?.geometry?.coordinates?.[0]) ? f.geometry.coordinates[0] : [];
      const coordCount = Array.isArray(ring0) ? ring0.length : 0;

      const propsEntries = Object.entries(f?.properties ?? {}).map(([k, v]) => ([
        String(k),
        v === null || v === undefined || v === '' ? '-' : String(v),
      ]));

      const detailContent = [
        { text: `Kayıt Detayı #${idx + 1}`, style: 'sectionTitle', margin: [0, 0, 0, 8] },
        { text: `ID: ${String(f?.id ?? '-')}`, style: 'text' },
        { text: `Geometri: ${geomType}`, style: 'text' },
        { text: `Koordinat sayısı (ilk halka): ${coordCount}`, style: 'text', margin: [0, 0, 0, 10] },
        propsEntries.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [
                  [
                    { text: 'Özellik', style: 'subTableHeader' },
                    { text: 'Değer', style: 'subTableHeader' },
                  ],
                  ...propsEntries,
                ],
              },
              layout: 'lightHorizontalLines',
            }
          : { text: 'Özellik yok.', style: 'text' },
      ];

      if (idx === 0) {
        return detailContent.map((c, i) => (i === 0 ? { ...c, pageBreak: 'before' } : c));
      }
      return [{ text: '', pageBreak: 'before' }, ...detailContent];
    });

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: 'Veri Özeti', style: 'title', margin: [0, 0, 0, 12] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', 'auto'],
            body: [
              summaryHeader,
              ...summaryRows,
            ],
          },
          layout: 'lightHorizontalLines',
        },
        ...detailSections,
      ],
      styles: {
        title: { fontSize: 16, bold: true },
        sectionTitle: { fontSize: 14, bold: true },
        text: { fontSize: 11 },
        tableHeader: { bold: true, fillColor: '#1677FF', color: 'white', fontSize: 10 },
        subTableHeader: { bold: true, fillColor: '#28A745', color: 'white', fontSize: 10 },
      },
      defaultStyle: {
        font: 'Roboto', // pdfmake varsayılanı, vfs_fonts ile geliyor
      },
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBlob((blob) => FileSaver.saveAs(blob, 'veri.pdf'));
  } catch (err) {
    console.error('exportPDF hata:', err);
  }
}


async function exportExcel() {
  try {
    const data = await fetchPolygons();
    const features = Array.isArray(data)
      ? data
      : (Array.isArray(data?.features) ? data.features : []);

    if (!features.length) {
      console.warn('exportExcel: Gösterilecek veri yok.');
      return;
    }

    const rows = features.map((f) => ({
      ID: String(f?.id ?? ''),
      Ad: String(f?.properties?.ad ?? ''),
      Tür: String(f?.properties?.tur ?? ''),
      Açıklama: String(f?.properties?.aciklama ?? ''),
      Numarataj: String(f?.properties?.numarataj ?? ''),
      Geometri: String(f?.geometry?.type ?? ''),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows, { header: ['ID', 'Ad', 'Tür', 'Açıklama', 'Numarataj', 'Geometri'] });
    XLSX.utils.book_append_sheet(wb, ws, 'Özet');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'veri.xlsx');
  } catch (err) {
    console.error('exportExcel hata:', err);
  }
}




export {exportPDF, exportExcel};