import { useMemo, useState } from 'react'
import './App.css'

const initialBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-help',
    review: 'Clear and actionable advice I could apply quickly.',
    rating: 5,
  },
  {
    id: 2,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    review: 'A fun adventure with memorable characters.',
    rating: 4,
  },
]

const emptyForm = {
  title: '',
  author: '',
  genre: '',
  review: '',
  rating: 5,
}

function App() {
  const [books, setBooks] = useState(initialBooks)
  const [form, setForm] = useState(emptyForm)

  const stats = useMemo(() => {
    const totalBooks = books.length
    const totalRating = books.reduce((sum, book) => sum + book.rating, 0)
    const averageRating = totalBooks ? (totalRating / totalBooks).toFixed(1) : '0.0'

    const genres = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] ?? 0) + 1
      return acc
    }, {})

    const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: books.filter((book) => book.rating === rating).length,
    }))

    return { totalBooks, averageRating, genres, ratingBreakdown }
  }, [books])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const title = form.title.trim()
    const author = form.author.trim()
    const genre = form.genre.trim()
    const review = form.review.trim()

    if (!title || !author || !genre || !review) {
      return
    }

    setBooks((prev) => [
      {
        id: Date.now(),
        title,
        author,
        genre,
        review,
        rating: form.rating,
      },
      ...prev,
    ])
    setForm(emptyForm)
  }

  return (
    <main className="library-app">
      <header>
        <h1>My Digital Library</h1>
        <p>Track the books you read with short reviews and star ratings.</p>
      </header>

      <section className="dashboard" aria-label="Reading dashboard">
        <h2>Dashboard</h2>
        <div className="stats-grid">
          <article>
            <h3>Books read</h3>
            <p>{stats.totalBooks}</p>
          </article>
          <article>
            <h3>Average rating</h3>
            <p>{stats.averageRating} / 5</p>
          </article>
        </div>

        <div className="dashboard-lists">
          <article>
            <h3>Genres</h3>
            <ul>
              {Object.entries(stats.genres).map(([genre, count]) => (
                <li key={genre}>
                  <span>{genre}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h3>Ratings</h3>
            <ul>
              {stats.ratingBreakdown.map(({ rating, count }) => (
                <li key={rating}>
                  <span>{rating} stars</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="add-book" aria-label="Add a new book">
        <h2>Add Book</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Author
            <input name="author" value={form.author} onChange={handleChange} required />
          </label>
          <label>
            Genre
            <input name="genre" value={form.genre} onChange={handleChange} required />
          </label>
          <label>
            Short review
            <textarea name="review" value={form.review} onChange={handleChange} required />
          </label>
          <label>
            Rating
            <select name="rating" value={form.rating} onChange={handleChange}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Save book</button>
        </form>
      </section>

      <section className="book-list" aria-label="Books I have read">
        <h2>Books I Have Read</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <h3>
                {book.title} <span>by {book.author}</span>
              </h3>
              <p className="book-meta">Genre: {book.genre}</p>
              <p>{book.review}</p>
              <p className="rating" aria-label={`${book.rating} out of 5 stars`}>
                {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
