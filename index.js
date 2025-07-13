import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/gerar-pdf', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: 'URL obrigatória' });

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    // Saves the PDF to hn.pdf.
    await page.pdf({
      path: 'roteiro.pdf',
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
