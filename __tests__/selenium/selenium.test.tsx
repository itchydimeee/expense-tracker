import { Builder, By, WebDriver, until } from 'selenium-webdriver'
import 'selenium-webdriver/chrome'
import 'chromedriver'
import { getElementById, getElementByXPath } from '@/lib/selenium'
import { beforeAll, afterAll, expect, describe, it } from '@jest/globals'
import exp from 'constants'

const URL = 'http://localhost:3000'
const AUTH0_USERNAME = 'romarieEder@gmail.com'
const AUTH0_PASSWORD = 'Romarieeder123'
const AUTH0_FAILING_PASSWORD =  'carlomacoco123'

let driver: WebDriver

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build()
})

afterAll(() => {
  driver.quit()
})

describe('Auth0 login test', () => {
  it('renders the login page', async () => {
    driver.get(URL)
    const logoImageElement = await getElementById('logo-image', driver)
    expect(await logoImageElement.isDisplayed()).toBe(true)
    const loginButtonElement = await getElementById('login-button', driver)
    expect(await loginButtonElement.isDisplayed()).toBe(true)
  }, 10000)
  it('logs in with Auth0 successfully', async () => {
    const loginButton = await getElementById('login-button', driver)
    await loginButton.click()
  
    await driver.wait(async () => {
      const auth0LoginUrl = await driver.getCurrentUrl()
      return auth0LoginUrl.includes('auth0.com')
    }, 10000)
  
    const usernameInput = await driver.findElement(By.name('username'))
    await usernameInput.sendKeys(AUTH0_USERNAME)
    const passwordInput = await driver.findElement(By.name('password'))
    await passwordInput.sendKeys(AUTH0_PASSWORD)
  
    await driver.wait(async () => {
      const continueButton = await driver.findElement(
        By.xpath('//button[contains(text(), "Continue")]')
      )
      return (
        (await continueButton.isDisplayed()) &&
        (await continueButton.isEnabled())
      )
    }, 10000)
  
    const continueButton = await driver.findElement(
      By.xpath('//button[contains(text(), "Continue")]')
    )
    await continueButton.click()
  
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl()
      return currentUrl.includes('/home')
    }, 10000)
  }, 30000)
})

// describe('Create and Fetch Expenses Test', () => {
//   const description = 'Nagbakal Pagkaon sa Canteen'
//   const amount = 500
//   const userId = ''
//   it('renders the Home Page', async () => {
//     const homepageElement = await getElementById('home-page', driver)
//     expect(await homepageElement.isDisplayed()).toBe(true)
//   }, 10000)
//   it('creates and fetches expense', async () => {
//     const createTransactionButton = await getElementById(
//       'create-button',
//       driver
//     )
//     createTransactionButton.click()

//     const categoryDropdown = await driver.findElement(By.id('category'))
//     await categoryDropdown.click()

//     const foodOption = await driver.findElement(By.css(`option[value="3"]`))
//     await foodOption.click()

//     const descriptionInput = await driver.findElement(By.id('description'))
//     await descriptionInput.sendKeys(description)
//     const amountInput = await driver.findElement(By.id('amount'))
//     await amountInput.sendKeys(amount)

//     const createExpenseButton = await driver.findElement(
//       By.id('create-transaction')
//     )
//     createExpenseButton.click()
//     // await driver.navigate().refresh()

//     const expenseCategory = await getElementById('expense-category', driver)
//     expect(await expenseCategory.isDisplayed()).toBe(true)

//   }, 30000)

// })
