import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm onBlogCreate={createBlog} />)

  const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(input[0], 'testing a blog...')
  await user.type(input[1], 'Test Author')
  await user.type(input[2], 'https://testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a blog...')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testurl.com')
})