import { Builder, By, WebDriver } from 'selenium-webdriver'
import 'selenium-webdriver/chrome'
import 'chromedriver'
import { getElementById, getElementByXPath } from '@/lib/selenium'
import { beforeAll, afterAll, expect } from '@jest/globals'
import { describe, it } from 'node:test'
import exp from 'constants'

const URL = 'http://localhost:3000'
const AUTH0_USERNAME = 'romarieEder@gmail.com'
const AUTH0_PASSWORD = 'Romarieeder123'

let driver: WebDriver

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build()
})

afterAll(() => {
  driver.quit()

  // if there's a way to revert the database, do that here.
})

describe('Auth0 login test', () => {
  it('renders the login page', async () => {
    driver.get(URL)
    const logoImageElement = await getElementById('logo-image', driver)
    expect(await logoImageElement.isDisplayed()).toBe(true)
    const loginButtonElement = await getElementById('login-button', driver)
    expect(await loginButtonElement.isDisplayed()).toBe(true)
  })

  it('logs in with Auth0', async () => {
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


    const auth0LoginButton = await driver.findElement(By.name('Continue'))
    await auth0LoginButton.click()

    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl()
      return currentUrl.includes('/home')
    }, 10000)

    // Verify that we're logged in and redirected to the homepage
    const homepageElement = await getElementById('homepage-element', driver)
    expect(await homepageElement.isDisplayed()).toBe(true)
  })
})
