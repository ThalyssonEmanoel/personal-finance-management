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

function generateTransactionPDF(transactions, startDate, endDate, type, balanceInfo = null) {
  const body = [];
  body.push([
    { text: 'Tipo', style: 'tableHeader' },
    { text: 'Nome', style: 'tableHeader' },
    { text: 'Categoria', style: 'tableHeader' },
    { text: 'Valor', style: 'tableHeader' },
    { text: 'Data', style: 'tableHeader' },
    { text: 'Conta', style: 'tableHeader' },
    { text: 'Forma de Pagamento', style: 'tableHeader' },
  ]);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.release_date) - new Date(b.release_date)
  );

  sortedTransactions.forEach((transaction) => {
    body.push([
      { text: transaction.type === 'income' ? 'Receita' : 'Despesa', style: 'tableRow' },
      // Alinhamento à esquerda para melhor legibilidade de textos longos
      { text: transaction.name, style: 'tableRow', alignment: 'left' },
      { text: transaction.category, style: 'tableRow', alignment: 'left' },
      { text: `R$ ${Number(transaction.value).toFixed(2).replace('.', ',')}`, style: 'tableRow', alignment: 'right' },
      { text: new Date(transaction.release_date).toLocaleDateString('pt-BR'), style: 'tableRow' },
      { text: transaction.account.name, style: 'tableRow' },
      { text: transaction.paymentMethod.name, style: 'tableRow' },
    ]);
  });

  const totalReceitas = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.value) || 0), 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.value) || 0), 0);

  let saldo, summaryContent = [];

  // A lógica do resumo foi mantida, apenas a estrutura do conteúdo foi ajustada
  // para usar os novos estilos e layout.
  if (balanceInfo) {
    saldo = balanceInfo.saldoFinal - balanceInfo.saldoInicial;
    const balanceSummary = [
      {
        columns: [
          { width: '*', text: 'Saldo Inicial', style: 'summaryLabel' },
          { width: '*', text: `R$ ${balanceInfo.saldoInicial.toFixed(2).replace('.', ',')}`, style: 'summaryValue', alignment: 'right' },
        ]
      },
      {
        columns: [
          { width: '*', text: 'Receitas', style: 'summaryLabel' },
          { width: '*', text: `R$ ${totalReceitas.toFixed(2).replace('.', ',')}`, style: 'summaryTotalReceitas', alignment: 'right' },
        ]
      },
      {
        columns: [
          { width: '*', text: 'Despesas', style: 'summaryLabel' },
          { width: '*', text: `R$ ${totalDespesas.toFixed(2).replace('.', ',')}`, style: 'summaryTotalDespesas', alignment: 'right' },
        ]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#CCCCCC' }],
        margin: [0, 5, 0, 10]
      },
      {
        columns: [
          { width: '*', text: 'Saldo Final', style: 'summaryLabel' },
          { width: '*', text: `R$ ${balanceInfo.saldoFinal.toFixed(2).replace('.', ',')}`, style: ['summaryBalance', { color: saldo >= 0 ? '#28a745' : '#dc3545' }], alignment: 'right' },
        ],
      },
    ];

    // if (balanceInfo.isSpecificAccount) {
    //   balanceSummary.unshift(
    //     {
    //       columns: [
    //         { width: '*', text: 'Saldo Inicial', style: 'summaryLabel' },
    //         { width: '*', text: `R$ ${balanceInfo.saldoInicial.toFixed(2).replace('.', ',')}`, style: 'summaryValue', alignment: 'right' },
    //       ]
    //     },
    //     { text: ' ', margin: [0, 0, 0, 5] }
    //   );
    // }

    summaryContent = [
      { text: 'Resumo Financeiro', style: 'summaryTitle' },
      {
        stack: balanceSummary,
        style: 'summaryContainer'
      }
    ];

  } else {
    saldo = totalReceitas - totalDespesas;
    summaryContent = [
      { text: 'Resumo Financeiro', style: 'summaryTitle' },
      {
        style: 'summaryContainer',
        stack: [
          {
            columns: [
              { width: '*', text: 'Receitas', style: 'summaryLabel' },
              { width: '*', text: `R$ ${totalReceitas.toFixed(2).replace('.', ',')}`, style: 'summaryTotalReceitas', alignment: 'right' },
            ]
          },
          {
            columns: [
              { width: '*', text: 'Despesas', style: 'summaryLabel' },
              { width: '*', text: `R$ ${totalDespesas.toFixed(2).replace('.', ',')}`, style: 'summaryTotalDespesas', alignment: 'right' },
            ]
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#CCCCCC' }],
            margin: [0, 5, 0, 10]
          },
          {
            columns: [
              { width: '*', text: 'Saldo do Período', style: 'summaryLabel', bold: true },
              { width: '*', text: `R$ ${saldo.toFixed(2).replace('.', ',')}`, style: ['summaryBalance', { color: saldo >= 0 ? '#28a745' : '#dc3545' }], alignment: 'right' },
            ]
          }
        ]
      }
    ];
  }

  const docDefinition = {
    content: [
      { text: 'Extrato de Transações', style: 'header' },
      { text: `Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`, style: 'subheader' },
      { text: `Tipo de Transação: ${type === 'all' ? 'Todas' : type === 'income' ? 'Receitas' : 'Despesas'}`, style: 'subheader' },
      { text: ' ', margin: [0, 0, 0, 10] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: body
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? '#AEAEAE' : '#EAEAEA',
        }
      },
      { text: ' ', margin: [0, 15, 0, 0] },
      ...summaryContent
    ],
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          { text: `Gerado em: ${new Date().toLocaleString('pt-BR')}`, alignment: 'left', style: 'footer' },
          { text: `Página ${currentPage.toString()} de ${pageCount}`, alignment: 'right', style: 'footer' }
        ],
        margin: [40, 0, 40, 0]
      };
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        margin: [0, 0, 0, 8],
        alignment: 'center',
        color: '#333333'
      },
      subheader: {
        fontSize: 11,
        margin: [0, 0, 0, 4],
        alignment: 'center',
        color: '#666666'
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: '#FFFFFF',
        fillColor: '#4A5568',
        alignment: 'center',
        margin: [0, 6, 0, 6]
      },
      tableRow: {
        fontSize: 9,
        margin: [0, 5, 0, 5],
        color: '#4A5568',
        alignment: 'center'
      },
      summaryContainer: {
        fillColor: '#F7FAFC',
        margin: [0, 10, 0, 0],
      },
      summaryTitle: {
        fontSize: 16,
        bold: true,
        alignment: 'left',
        margin: [0, 0, 0, 5],
        color: '#333333'
      },
      summaryLabel: {
        fontSize: 11,
        color: '#4A5568',
        margin: [10, 5, 10, 5]
      },
      summaryValue: {
        fontSize: 11,
        color: '#333333',
        margin: [10, 5, 10, 5]
      },
      summaryTotalReceitas: {
        fontSize: 12,
        bold: true,
        color: '#28a745',
        margin: [10, 5, 10, 5]
      },
      summaryTotalDespesas: {
        fontSize: 12,
        bold: true,
        color: '#dc3545',
        margin: [10, 5, 10, 5]
      },
      summaryBalance: {
        fontSize: 13,
        bold: true,
        margin: [10, 5, 10, 5]
      },
      footer: {
        fontSize: 8,
        color: '#AAAAAA',
        italics: true
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