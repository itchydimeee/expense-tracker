import { Builder, By, WebDriver } from 'selenium-webdriver'
import 'selenium-webdriver/chrome'
import 'chromedriver'
import { getElementById, getElementByXPath } from '@/lib/selenium'
import { beforeAll, afterAll, expect, describe, it } from '@jest/globals'

const URL = 'http://localhost:3000'
const AUTH0_USERNAME = 'SeleniumTest123@FlexiSpend.com'
const AUTH0_PASSWORD = 'SeleniumTests123'
const AUTH0_FAILING_PASSWORD = 'carlomacoco123'

let driver: WebDriver

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build()
})

afterAll(async () => {
  driver.quit()
})

describe('Auth0 login and logout test', () => {
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
  it('logs out with auth0', async () => {
    const profilePicButton = await getElementById('profile-pic', driver)
    await profilePicButton.click()

    await driver.wait(async () => {
      const logoutButton = await getElementById('logout-button', driver)
      return logoutButton.isDisplayed()
    }, 5000)

    const logoutButton = await getElementById('logout-button', driver)
    await logoutButton.click()
  }, 30000)
  it('logs in with Auth0 unsuccessfully', async () => {
    const loginButton = await getElementById('login-button', driver)
    await loginButton.click()

    await driver.wait(async () => {
      const auth0LoginUrl = await driver.getCurrentUrl()
      return auth0LoginUrl.includes('auth0.com')
    }, 10000)

    const usernameInput = await driver.findElement(By.name('username'))
    await usernameInput.sendKeys(AUTH0_USERNAME)
    const passwordInput = await driver.findElement(By.name('password'))
    await passwordInput.sendKeys(AUTH0_FAILING_PASSWORD)

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
  }, 30000)
})

describe('CRUD Expense Test and Expense Stats', () => {
  const description = 'Nagbakal Pagkaon sa Canteen'
  const amount = 500
  it('renders the Home Page', async () => {
    driver.get(URL)
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

    const homepageElement = await getElementById('home-page', driver)
    expect(await homepageElement.isDisplayed()).toBe(true)
  }, 30000)
  it('creates expense', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const dailyLedgerElement = await getElementById('daily-ledger', driver)
    expect(await dailyLedgerElement.isDisplayed()).toBe(true)

    const createTransactionButton = await getElementById(
      'create-button',
      driver
    )
    createTransactionButton.click()

    const categoryDropdown = await driver.findElement(By.id('category'))
    await categoryDropdown.click()

    const foodOption = await driver.findElement(By.css(`option[value="3"]`))
    await foodOption.click()

    const descriptionInput = await driver.findElement(By.id('description'))
    await descriptionInput.sendKeys(description)
    const amountInput = await driver.findElement(By.id('amount'))
    await amountInput.sendKeys(amount)

    const createExpenseButton = await driver.findElement(
      By.id('create-transaction')
    )
    createExpenseButton.click()
  }, 30000)
  it('fetches the expenses created', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return dailyLedgerElement.isDisplayed()
    }, 20000)
    const expenseCategoryElement = await getElementById(
      'expense-category',
      driver
    )
    await driver.wait(
      async () => await expenseCategoryElement.isDisplayed(),
      10000
    )
    expect(await expenseCategoryElement.isDisplayed()).toBe(true)

    const expenseDescriptionElement = await getElementById(
      'expense-description',
      driver
    )
    await driver.wait(
      async () => await expenseDescriptionElement.isDisplayed(),
      10000
    )
    expect(await expenseDescriptionElement.isDisplayed()).toBe(true)

    const expenseAmountElement = await getElementById('expense-amount', driver)
    await driver.wait(
      async () => await expenseAmountElement.isDisplayed(),
      10000
    )
    expect(await expenseAmountElement.isDisplayed()).toBe(true)
  }, 30000)
  it('renders the stat page with the created expense', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const statPageButton = await getElementById('stat-page', driver)
    statPageButton.click()

    const statName = await getElementById('stat-name', driver)
    expect(await statName.isDisplayed()).toBe(true)

    const loadingScreen = await getElementById('loading-screen', driver)
    expect(await loadingScreen.isDisplayed()).toBe(true)

    await driver.wait(async () => {
      const pieChart = await getElementById('pie-chart', driver)
      return await pieChart.isDisplayed()
    }, 10000)
    const pieChart = await getElementById('pie-chart', driver)
    expect(pieChart.isDisplayed()).toBeTruthy
  }, 30000)
  it('create expenses without amount input', async () => {
    const homePageButton = await getElementById('home-page', driver)
    homePageButton.click()

    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const dailyLedgerElement = await getElementById('daily-ledger', driver)
    expect(await dailyLedgerElement.isDisplayed()).toBe(true)

    const createTransactionButton = await getElementById(
      'create-button',
      driver
    )
    createTransactionButton.click()

    const categoryDropdown = await driver.findElement(By.id('category'))
    await categoryDropdown.click()

    const foodOption = await driver.findElement(By.css(`option[value="3"]`))
    await foodOption.click()

    const descriptionInput = await driver.findElement(By.id('description'))
    await descriptionInput.sendKeys(description)

    const createExpenseButton = await driver.findElement(
      By.id('create-transaction')
    )
    createExpenseButton.click()

    const errorMessage = await driver.findElement(By.id('error-message'))
    expect(await errorMessage.isDisplayed()).toBe(true)
  }, 30000)
  it('update expense', async () => {
    await driver.navigate().refresh()
    const expenseItemElement = await getElementById('list-item', driver)
    expect(await expenseItemElement.isDisplayed()).toBe(true)

    expenseItemElement.click()

    const amountInput = await driver.findElement(By.id('update-amount'))
    await amountInput.clear()
    await amountInput.sendKeys(1000)

    const updateButton = await driver.findElement(By.id('update-button'))
    await updateButton.click()

    await driver.wait(async () => {
      const updatedAmountElement = await getElementById(
        'expense-amount',
        driver
      )
      return (await updatedAmountElement.getText()) === '1000.00'
    }, 20000)

    const updatedAmountElement = await getElementById('expense-amount', driver)
    expect(await updatedAmountElement.getText()).toBe('1000.00')
  }, 30000)
  it('delete created expenses', async () => {
    const expenseItemElement = await getElementById('list-item', driver)
    expect(await expenseItemElement.isDisplayed()).toBe(true)

    expenseItemElement.click()

    const deleteButton = await driver.findElement(By.id('delete-button'))
    await deleteButton.click()

    expect(expenseItemElement).toBeFalsy

    //logout before proceeding to other test
    const profilePicButton = await getElementById('profile-pic', driver)
    await profilePicButton.click()

    await driver.wait(async () => {
      const logoutButton = await getElementById('logout-button', driver)
      return logoutButton.isDisplayed()
    }, 5000)

    const logoutButton = await getElementById('logout-button', driver)
    await logoutButton.click()
  }, 30000)
})
describe('CRUD Incomes Test', () => {
  const description = 'Hatag ni mama'
  const amount = 1000
  it('renders the Home Page', async () => {
    driver.get(URL)
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

    const homepageElement = await getElementById('home-page', driver)
    expect(await homepageElement.isDisplayed()).toBe(true)
  }, 30000)
  it('creates income', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const dailyLedgerElement = await getElementById('daily-ledger', driver)
    expect(await dailyLedgerElement.isDisplayed()).toBe(true)

    const createTransactionButton = await getElementById(
      'create-button',
      driver
    )
    createTransactionButton.click()

    const setIncomeButton = await getElementById('set-create-income', driver)
    setIncomeButton.click()

    const categoryDropdown = await driver.findElement(By.id('category'))
    await categoryDropdown.click()

    const salaryOption = await driver.findElement(By.css(`option[value="1"]`))
    await salaryOption.click()

    const descriptionInput = await driver.findElement(By.id('description'))
    await descriptionInput.sendKeys(description)
    const amountInput = await driver.findElement(By.id('amount'))
    await amountInput.sendKeys(amount)

    const createIncomeButton = await driver.findElement(
      By.id('create-transaction')
    )
    createIncomeButton.click()
  }, 30000)
  it('fetches the incomes created', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return dailyLedgerElement.isDisplayed()
    }, 20000)
    const incomeCategoryElement = await getElementById(
      'income-category',
      driver
    )
    await driver.wait(
      async () => await incomeCategoryElement.isDisplayed(),
      10000
    )
    expect(await incomeCategoryElement.isDisplayed()).toBe(true)

    const incomeDescriptionElement = await getElementById(
      'income-description',
      driver
    )
    await driver.wait(
      async () => await incomeDescriptionElement.isDisplayed(),
      10000
    )
    expect(await incomeDescriptionElement.isDisplayed()).toBe(true)

    const incomeAmountElement = await getElementById('income-amount', driver)
    await driver.wait(
      async () => await incomeAmountElement.isDisplayed(),
      10000
    )
    expect(await incomeAmountElement.isDisplayed()).toBe(true)
  }, 30000)
  it('renders the stat page with the created income', async () => {
    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const statPageButton = await getElementById('stat-page', driver)
    statPageButton.click()

    const incomeStatButton = await getElementById('income-stat-button', driver)
    incomeStatButton.click()

    const statName = await getElementById('stat-name', driver)
    expect(await statName.isDisplayed()).toBe(true)

    const loadingScreen = await getElementById('loading-screen', driver)
    expect(await loadingScreen.isDisplayed()).toBe(true)

    await driver.wait(async () => {
      const pieChart = await getElementById('pie-chart', driver)
      return await pieChart.isDisplayed()
    }, 10000)

    const pieChart = await getElementById('pie-chart', driver)
    expect(pieChart.isDisplayed()).toBeTruthy
  }, 30000)
  it('create incomes without amount input', async () => {
    const homePageButton = await getElementById('home-page', driver)
    homePageButton.click()

    await driver.wait(async () => {
      const dailyLedgerElement = await getElementById('daily-ledger', driver)
      return (
        (await dailyLedgerElement.isDisplayed()) &&
        (await dailyLedgerElement.getAttribute('data-user-id')) !== null
      )
    }, 10000)

    const dailyLedgerElement = await getElementById('daily-ledger', driver)
    expect(await dailyLedgerElement.isDisplayed()).toBe(true)

    const createTransactionButton = await getElementById(
      'create-button',
      driver
    )
    createTransactionButton.click()

    const categoryDropdown = await driver.findElement(By.id('category'))
    await categoryDropdown.click()

    const salaryOption = await driver.findElement(By.css(`option[value="1"]`))
    await salaryOption.click()

    const descriptionInput = await driver.findElement(By.id('description'))
    await descriptionInput.sendKeys(description)

    const createIncomeButton = await driver.findElement(
      By.id('create-transaction')
    )
    createIncomeButton.click()

    const errorMessage = await driver.findElement(By.id('error-message'))
    expect(await errorMessage.isDisplayed()).toBe(true)
  }, 30000)
  it('update income', async () => {
    await driver.navigate().refresh()
    const incomeItemElement = await getElementById('list-item', driver)
    expect(await incomeItemElement.isDisplayed()).toBe(true)

    incomeItemElement.click()

    const amountInput = await driver.findElement(By.id('update-amount'))
    await amountInput.clear()
    await amountInput.sendKeys(2000)

    const updateButton = await driver.findElement(By.id('update-button'))
    await updateButton.click()

    await driver.wait(async () => {
      const updatedAmountElement = await getElementById('income-amount', driver)
      return (await updatedAmountElement.getText()) === '2000.00'
    }, 20000)

    const updatedAmountElement = await getElementById('income-amount', driver)
    expect(await updatedAmountElement.getText()).toBe('2000.00')
  }, 30000)
  it('delete created incomes', async () => {
    const incomeItemElement = await getElementById('list-item', driver)
    expect(await incomeItemElement.isDisplayed()).toBe(true)

    incomeItemElement.click()

    const deleteButton = await driver.findElement(By.id('delete-button'))
    await deleteButton.click()

    expect(incomeItemElement).toBeFalsy

    //logout before proceeding to other test
    const profilePicButton = await getElementById('profile-pic', driver)
    await profilePicButton.click()

    await driver.wait(async () => {
      const logoutButton = await getElementById('logout-button', driver)
      return logoutButton.isDisplayed()
    }, 5000)

    const logoutButton = await getElementById('logout-button', driver)
    await logoutButton.click()
  }, 30000)
})
