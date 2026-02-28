import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  screen.debug(div)

  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(div).toHaveTextContent('Test Author')

  expect(div).not.toHaveTextContent('https://test.com')

  expect(div).not.toHaveTextContent('likes 5')

  
})

test('clicking the view button displays url and likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element1 = screen.getByText('https://test.com', { exact: false })
  expect(element1).toBeVisible()

  const element2 = screen.getByText('5', { exact: false })
  expect(element2).toBeVisible()

})

test('clicking the like button twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 5
  }
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} updateLikes={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})