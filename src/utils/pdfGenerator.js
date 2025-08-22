import PdfPrinter from 'pdfmake';

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

function generateTransactionPDF(transactions, startDate, endDate, type) {
  const body = [];
  body.push([
    { text: 'ID', style: 'tableHeader' },
    { text: 'Tipo', style: 'tableHeader' },
    { text: 'Nome', style: 'tableHeader' },
    { text: 'Categoria', style: 'tableHeader' },
    { text: 'Valor', style: 'tableHeader', alignment: 'right' },
    { text: 'Data', style: 'tableHeader', alignment: 'center' },
    { text: 'Conta', style: 'tableHeader' },
    { text: 'Forma Pagamento', style: 'tableHeader' },
    { text: 'Usuário', style: 'tableHeader' }
  ]);
  transactions.forEach((transaction, i) => {
    body.push([
      transaction.id.toString(),
      transaction.type === 'income' ? 'Receita' : 'Despesa',
      transaction.name,
      transaction.category,
      { text: `R$ ${Number(transaction.value).toFixed(2).replace('.', ',')}`, alignment: 'right' },
      { text: new Date(transaction.release_date).toLocaleDateString('pt-BR'), alignment: 'center' },
      transaction.account.name,
      transaction.paymentMethod.name,
      transaction.user.name
    ]);
  });

  // Totais
  const totalReceitas = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.value) || 0), 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.value) || 0), 0);

  const saldo = totalReceitas - totalDespesas;

  const docDefinition = {
    content: [
      { text: 'Extrato de Transações', style: 'header' },
      {
        text: `Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`,
        style: 'subheader'
      },
      {
        text: `Tipo de Transação: ${type === 'all' ? 'Todas' : type === 'income' ? 'Receitas' : 'Despesas'}`,
        style: 'subheader'
      },
      { text: ' ', margin: [0, 0, 0, 10] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 60, 'auto', 'auto', 'auto', 'auto'],
          body: body
        },
        // Aqui é a definição do layout da tabela, cores e estilos
        layout: {
          fillColor: function (rowIndex) {
            if (rowIndex === 0) return '#E8DE92';
            return rowIndex % 2 === 0 ? '#F9F9F9' : null; 
          },
          hLineWidth: function () { return 0.5; },
          vLineWidth: function () { return 0.5; },
          hLineColor: function () { return '#aaa'; },
          vLineColor: function () { return '#aaa'; }
        }
      },
      {
        style: 'summaryBox',
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: `Receitas\nR$ ${totalReceitas.toFixed(2).replace('.', ',')}`, style: 'TotalReceitas', alignment: 'center' },
              { text: `Despesas\nR$ ${totalDespesas.toFixed(2).replace('.', ',')}`, style: 'TotalDespesas', alignment: 'center' },
              { text: `Total desse período\nR$ ${saldo.toFixed(2).replace('.', ',')}`, style: 'balance', color: saldo >= 0 ? 'green' : 'red', alignment: 'center' }
            ]
          ]
        },
        layout: {
          fillColor: '#F2F2F2',
          hLineWidth: () => 0,
          vLineWidth: () => 0
        }
      }
    ],

    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 15],
        alignment: 'center',
        color: '#333'
      },
      subheader: {
        fontSize: 11,
        margin: [0, 0, 0, 5],
        alignment: 'center',
        color: '#555'
      },
      tableExample: {
        margin: [0, 5, 0, 15],
        fontSize: 9,
        alignment: 'center',
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: 'black',
        fillColor: '#E8DE92',
        alignment: 'center',
        margin: [0, 3, 0, 3]
      },
      TotalReceitas: {
        fontSize: 12,
        color: 'green'
      },
      TotalDespesas: {
        fontSize: 12,
        color: 'red'
      },
      balance: {
        fontSize: 13,
      },
      summaryBox: {
        margin: [0, 20, 0, 0]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return pdfDoc;
}

export { generateTransactionPDF };
