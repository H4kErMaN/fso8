import { useState } from 'react'
import { useQuery, gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  // Query 1: all books (no filter) — used to collect the set of genres
  // for the buttons. Runs once and stays in the Apollo cache.
  const allResult = useQuery(ALL_BOOKS)

  // Query 2: books filtered by the selected genre. This asks the server
  // to do the filtering. Skipped when no genre is chosen.
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })

  if (!show) return null

  if (allResult.loading) {
    return <div>loading...</div>
  }

  if (allResult.error) {
    return <div>error loading books</div>
  }

  // Collect all unique genres from the unfiltered result
  const genres = [
    ...new Set(allResult.data.allBooks.flatMap((b) => b.genres)),
  ]

  // Which books to show?
  const booksToShow = selectedGenre
    ? filteredResult.data?.allBooks || []
    : allResult.data.allBooks

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
