import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

// Função que rola até o fim da página
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100); // ajusta a velocidade se quiser
    });
  });
}

app.post('/gerar-pdf', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: 'URL e token são obrigatórios' });

  try {
    const browser = await puppeteer.launch({
      "headless": "new",
      "args": ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto((url));
    await page.goto((url));
    await page.waitForSelector(".sc-hYQoXb");

    const pdfBuffer = await page.pdf({
      format: 'Legal',
      // margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      printBackground: true,
      displayHeaderFooter: true,
      // footerTemplate: '<div style="width: 100%; text-align: center; font-size: 10px;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
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
