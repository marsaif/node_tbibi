var webdriver = require('selenium-webdriver');
require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');

const scraping = async()=>{

    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
    let i = 0 ;
    var driver2 = new webdriver.Builder().
  withCapabilities(webdriver.Capabilities.chrome()).
  build();


    try {
      while(true)
      {

        let url2=`https://tunisie-medicale.com/index.php/docteur/rechercher/${i}?speciality_id=17&city_id=1&words=`
        await geturl(url2,driver,driver2)
        i+=20

      }
    } catch (error) {
      console.log("error")
    }


}



const geturl = async(url,driver,driver2)=>{
  

  await driver.get(url)
  let div = await driver.findElements(By.className("col-lg-6 col-md-6 col-sm-6 col-xs-12"))
  console.log("number of doctor in page : "+div.length)
  if(div.length== 0)
  {
    throw "test"
  }
  for(let link of div) {
    try {
      urll = await link.findElement(By.tagName("a")).getAttribute("href");
    await info(urll,driver2);
    // console.log(urll)
    } catch (error) {
      
    }
    
}
}

const info = async (url,driver)=>{

  await driver.get(url)
  let div = await driver.findElement(By.className('big_team_widget'))
  let name = await div.findElement(By.tagName("h2")).getText()
  let telephone = await div.findElement(By.css("a[itemprop='telephone']")).getAttribute("href")
  let map = await div.findElement(By.css("a[itemprop='streetAddress']")).getAttribute("href")
  let adress =  await div.findElement(By.css("a[itemprop='streetAddress']")).getText()

  console.log(name+" "+telephone)
  console.log(map+"   "+adress/n)
  console.log("")
  
}

module.exports = scraping;
