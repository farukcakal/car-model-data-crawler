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
  
    await page.goto(url); // Sayfanın URL'sini buraya ekleyin
  
    const data = {}; // JSON verilerini depolamak için boş bir obje oluşturun
  
    // Select elementini bul
    const selectElementContentPlaceHolder1 = await page.$('#ContentPlaceHolder1_TXT_AracModeli');
  
    // Select elementinin içindeki tüm seçenekleri al
    const optionsContentPlaceHolder1 = await selectElementContentPlaceHolder1.$$eval('option', options => options.map(option => {
      return {
        value: option.value,
        text: option.textContent.trim()
      };
    }));
  
    for (const option of optionsContentPlaceHolder1) {
      // JSON objesine seçeneği ekleyin
      data[option.text] = [];
  
      // Seçenekleri sırasıyla tıkla
      await page.select('#ContentPlaceHolder1_TXT_AracModeli', option.value);
  
      // Sayfanın yeniden yüklenmesini bekle
      await page.waitForNavigation();
  
      // Datalist elementinin değerlerini al
      const datalistOptionsAracListe = await page.$$eval('#AracListe option', options => options.map(option => option.value));
  
      // JSON objesine datalist değerlerini ekleyin
      data[option.text] = datalistOptionsAracListe;
    }
  
    // JSON verilerini bir dosyaya yazın
    fs.writeFileSync('veriler.json', JSON.stringify(data, null, 2));
  
    console.log('Veriler başarıyla JSON dosyasına yazıldı: veriler.json');
  
    await browser.close();
  })();