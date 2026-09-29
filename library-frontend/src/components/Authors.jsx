import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState(authors[0]?.name || '')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = (event) => {
    event.preventDefault()

    editAuthor({
      variables: {
        name,
        setBornTo: parseInt(born),
      },
    })

    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">name</label>
          <select
            id="name"
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>
          <input
            id="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = ({ show, token }) => {
  const result = useQuery(ALL_AUTHORS)

  if (!show) return null

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>error loading authors</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && authors.length > 0 && <BirthYearForm authors={authors} />}
    </div>
  )
}

export default Authors
