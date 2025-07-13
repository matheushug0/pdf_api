import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/gerar-pdf', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: 'URL obrigatória' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('p');

    const pdfBuffer = await page.pdf({
      path: 'roteiro.pdf',
      scale: 1,
      format: 'A4',
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div>Custom Header</div>',
      footerTemplate: '<div style="width: 100%; text-align: center; font-size: 10px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=roteiro.pdf'
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erro ao gerar PDF' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
