const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());

var url = "https://www.mobilassistance.com/Paket-Satin-Al";

  (async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox']
      });

    const page = await browser.newPage();
    await page.goto(url);
  
    const data = {};
    const selectElementContentPlaceHolder1 = await page.$('#ContentPlaceHolder1_TXT_AracModeli');

    const optionsContentPlaceHolder1 = await selectElementContentPlaceHolder1.$$eval('option', options => options.map(option => {
      return {
        value: option.value,
        text: option.textContent.trim()
      };
    }));
  
    for (const option of optionsContentPlaceHolder1) {
      data[option.text] = [];
      await page.select('#ContentPlaceHolder1_TXT_AracModeli', option.value);
      await page.waitForNavigation();
      const datalistOptionsAracListe = await page.$$eval('#AracListe option', options => options.map(option => option.value));
      data[option.text] = datalistOptionsAracListe;
    }

    fs.writeFileSync('datas.json', JSON.stringify(data, null, 2));
    console.log('Veriler başarıyla JSON dosyasına yazıldı: datas.json');
    
    await browser.close();
  })();