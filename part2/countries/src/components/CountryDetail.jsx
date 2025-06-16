import Weather from "./Weather"

const CountryDetail = ({ country }) => {
  const capital = country.capital && country.capital.length > 0 ? country.capital[0] : null
  console.log(capital)

  return (
    <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {capital}</p>
    <p>Area: {country.area} km²</p>
    <h4>Languages:</h4>
    <ul>
      {Object.values(country.languages).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
    {capital && <Weather city={capital} />}
    </div>
  )
}

export default CountryDetail