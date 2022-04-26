var webdriver = require('selenium-webdriver');
require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

const scraping = async()=>{

    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
    await driver.get('http://www.allo-docteur.com.tn/fr/tunis/1043-medecine-generale/menzah.html');
    let text = await driver.findElements(By.tagName('p'))
    console.log(text)
    

}

module.exports = scraping;
