import { until, By, WebDriver, WebElement } from 'selenium-webdriver';

const waitTimeout= 20000;

export async function getElementById(id: string, driver: WebDriver): Promise<WebElement> {
    return await driver.wait(
      until.elementLocated(By.id(id)),
     waitTimeout
    ).then((element) => driver.wait(until.elementIsVisible(element), waitTimeout));
  }
  
  export async function getElementByXPath(xpath: string, driver: WebDriver): Promise<WebElement> {
    return await driver.wait(
      until.elementLocated(By.xpath(xpath)),
      waitTimeout
    ).then((element) => driver.wait(until.elementIsVisible(element), waitTimeout));
  }