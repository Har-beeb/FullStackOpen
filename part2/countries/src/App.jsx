import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null) 
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  let content = null

  if (filter && filteredCountries.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  }

  else if (filter && filteredCountries.length <= 10 && filteredCountries.length > 1) {
    content = 
    (<>
      <ul>
        {filteredCountries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>show</button>
          </li>
        ))}
      </ul>
      {selectedCountry && <CountryDetail country={selectedCountry} />}
      </>
    )
  }

  else if (filteredCountries.length === 1) {
    content = 
    (
      <div>
        <CountryDetail country = {filteredCountries[0]} />
      </div>
   )
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        {content}
      </div>
    </div>
  )

}

export default App