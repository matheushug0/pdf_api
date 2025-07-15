import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());


app.post("/gerar-pdf", async (req, res) => {
  const { url } = req.body;
  if (!url)
    return res.status(400).send({ error: "URL e token são obrigatórios" });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);
    await page.goto(url);
    await page.waitForSelector(".sc-hYQoXb");
    await page.addStyleTag({
      content: `
    .nao-quebrar {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `,
    });
    await page.evaluate(() => {
      document.querySelectorAll(".no-break").forEach((el) => {
        el.classList.add("nao-quebrar");
      });
    });

    await page.evaluate(async () => {
      const selectors = Array.from(document.images);
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve);
          });
        })
      );
    });

    const pdfBuffer = await page.pdf({
      format: "Tabloid",
      printBackground: true,
      displayHeaderFooter: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=roteiro.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Erro ao gerar PDF" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
