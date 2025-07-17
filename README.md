# Web Scraping - Webpage para PDF
Solução desenvolvida como parte do estágio para a [Tripmee](https://tripmee.com.br/).

## Problema
Gerar um pdf com as especificações de formatação (quebra de páginas, carregamento de imagens, etc.) a partir de uma [página de proposta de viagem](https://agente.tripmee.com.br/proposta/8e9ee079-ad03-446d-b844-80821f54c75b).

## Solução
Desenvolvimento de uma api com um endpoint `/gerar-pdf` que recebe o endereço de proposta e retorna um pdf.

## Detalhe da Solução
A página de proposta apresenta carregamento de dados assíncronos e apis externas, por essas e outras razões o carregamento total da página pode não acontecer no primeiro acesso.
<br>
Uma Solução no `Puppeteer` para carregar a página corretamente foi invocar o `page.goto(url)` duas vezes consecutivas, forçando o carregamento correto da página.