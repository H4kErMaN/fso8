import { useQuery, gql } from '@apollo/client'
import { ALL_BOOKS } from './Books'

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const Recommendations = ({ show, token }) => {
  const meResult = useQuery(ME, { skip: !token })

  const favoriteGenre = meResult.data?.me?.favoriteGenre

  // Suositukset haetaan vasta kun lempigenre on tiedossa
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  })

  if (!show) return null

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (!favoriteGenre) {
    return <div>log in to see recommendations</div>
  }

  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
