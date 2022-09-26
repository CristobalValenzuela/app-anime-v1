const { Builder, Browser, By, Capabilities } = require("selenium-webdriver");
require("chromedriver");

(async function helloSelenium() {
  let caps = new Capabilities();
  caps.setPageLoadStrategy("eager");
  let driver = await new Builder()
    .withCapabilities(caps)
    .forBrowser(Browser.CHROME)
    .build();

  await driver.get("https://www3.animeflv.net/browse?order=title");

  const elementos = driver.findElements(By.css("article"));
  console.log(
    "🚀 ~ file: test.js ~ line 10 ~ helloSelenium ~ elementos",
    elementos
  );
  /*console.log(
    "🚀 ~ file: test.js ~ line 10 ~ helloSelenium ~ elementos",
    elementos
  );

  for (let index in elementos) {
    let url = elementos[index].findElement(By.css("a")).getAttribute("href");
    let title = elementos[index].findElement(By.css("a > h3")).getText();
    console.log(
      "🚀 ~ file: test.js ~ line 14 ~ helloSelenium ~ url",
      title,
      url
    );
  }*/
  await driver.quit();
})();
