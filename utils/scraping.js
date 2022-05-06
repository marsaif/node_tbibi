var webdriver = require("selenium-webdriver");
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const scraping = async (speciality) => {
  var data = await getdoctors(speciality);
  return data;
  //   var driver = new webdriver.Builder().
  //   withCapabilities(webdriver.Capabilities.chrome()).
  //   build();
  //   let i = 0 ;
  //   var driver2 = new webdriver.Builder().
  // withCapabilities(webdriver.Capabilities.chrome()).
  // build();

  //   try {
  //     while(true)
  //     {

  //       let url2=`https://tunisie-medicale.com/index.php/docteur/rechercher/${i}?speciality_id=17&city_id=1&words=`
  //       await geturl(url2,driver,driver2)
  //       i+=20

  //     }
  //   } catch (error) {
  //     console.log("error")
  //   }
};

const getdoctors = async (speciality) => {
  let options = new chrome.Options();
  //Below arguments are critical for Heroku deployment
  options.addArguments("--headless");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");

  var driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  var driver2 = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  let url = "https://tunisie--medicale-com.translate.goog/index.php/docteur?_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=fr";
  await driver.get(url);
  let div = await driver
    .findElement(By.id("speciality"))
    .findElements(By.tagName("option"));

  for (let link of div) {
    if ((await link.getText()) == speciality) {
      link.click();
      await driver.findElement(By.className("btn btn-dark btn-block")).submit();
      let urll = await driver.getCurrentUrl();
      let list = await geturl(urll, driver, driver2);
      return list;
    }
  }
  console.log("speciality not found !");
  return []
};

const geturl = async (url, driver, driver2) => {
  await driver.get(url);
  let div = await driver.findElements(
    By.className("col-lg-6 col-md-6 col-sm-6 col-xs-12")
  );
  console.log("number of doctor in page : " + div.length);
  if (div.length == 0) {
    throw "test";
  }
  var list = [];
  for (let link of div) {
    try {
      urll = await link.findElement(By.tagName("a")).getAttribute("href");
      var data = await info(urll, driver2);
      list.push(data);
      // console.log(urll)
    } catch (error) {}
  }
  console.log(list);
  return list;
};

const info = async (url, driver) => {
  await driver.get(url);
  let div = await driver.findElement(By.className("big_team_widget"));
  let name = await div.findElement(By.tagName("h2")).getText();
  let telephone = await div
    .findElement(By.css("a[itemprop='telephone']"))
    .getAttribute("href");
  let map = await div
    .findElement(By.css("a[itemprop='streetAddress']"))
    .getAttribute("href");
  let adress = await div
    .findElement(By.css("a[itemprop='streetAddress']"))
    .getText();

  var data = { name: name, telephone: telephone, Adress: adress, Map: map };

  console.log(name + " " + telephone);
  console.log(map + "   " + adress);
  console.log("-----------------");

  return data;
};

module.exports = scraping;
