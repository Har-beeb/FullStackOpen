const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // 1. Empty the db here
    await request.post('/api/testing/reset')
    
    // 2. Create a user for the backend here
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password11'
      }
    })

    await request.post('/api/users', {
      data: { 
        name: 'Second User', 
        username: 'seconduser', 
        password: 'password22' 
    }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password11')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')

      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password11')
      await expect(page.getByText('Test User logged in')).toBeVisible()

      await createBlog(page, 'A Blog to Like', 'John Doe', 'http://johndoe.com')
      await expect(page.getByText('A Blog to Like John Doe')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'My First Playwright Blog', 'Jane Doe', 'http://janedoe.com')

      await expect(page.getByText('My First Playwright Blog Jane Doe')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blogElement = page.getByText('A Blog to Like John Doe').locator('..')
      await blogElement.getByRole('button', { name: 'view' }).click()

      await expect(blogElement.getByText('likes: 0')).toBeVisible()

      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes: 1')).toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'seconduser', 'password22')
      await expect(page.getByText('Second User logged in')).toBeVisible()

      const blogElement = page.getByText('A Blog to Like John Doe').locator('..')
      await blogElement.getByRole('button', { name: 'view' }).click()

      await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      const blogElement = page.getByText('A Blog to Like John Doe').locator('..')
      await blogElement.getByRole('button', { name: 'view' }).click()
        
      page.on('dialog', dialog => dialog.accept())
      await blogElement.getByRole('button', { name: 'remove' }).click()
        
      await expect(page.getByText('A Blog to Like John Doe')).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'Second Blog', 'Author 2', 'http://url2.com')
      await createBlog(page, 'Third Blog', 'Author 3', 'http://url3.com')

      await page.getByText('A Blog to Like John Doe').locator('..').getByRole('button', { name: 'view' }).click()
      await page.getByText('Second Blog Author 2').locator('..').getByRole('button', { name: 'view' }).click()
      await page.getByText('Third Blog Author 3').locator('..').getByRole('button', { name: 'view' }).click()
      
      // Third Blog gets 1 like
      const thirdBlog = page.getByText('Third Blog Author 3').locator('..')
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.getByText('likes: 1')).toBeVisible() 
      // Second Blog gets 2 likes
      const secondBlog = page.getByText('Second Blog Author 2').locator('..')
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.getByText('likes: 1')).toBeVisible()
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.getByText('likes: 2')).toBeVisible()

      const blogElements = page.locator('.blog')
      await expect(blogElements.nth(0)).toContainText('Second Blog')
      await expect(blogElements.nth(1)).toContainText('Third Blog')
      await expect(blogElements.nth(2)).toContainText('A Blog to Like')
    })



  })
})
