import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', onInput);

function onInput() {
  fetch('https://restcountries.com/v3.1/name/switzerland')
    .then(response => {
      return response.json();
    })
    .then(country => {
      refs.countryInfo.insertAdjacentHTML('beforeend', markup(country));
    })
    .catch(error => {
      console.log(error);
    });
}

function markup(country) {
  return country.map(
    ({ name, capital, population, languages, flags }) =>
      `<h1 class="country-info__country"><img src="${flags.svg}" alt="${
        name.official
      }" width="25">${name.official}</h1> 
      <p class="country-info__capital">Capital: ${capital[0]}</p>
      <p class="country-info__population">Population: ${population}</p>
      <p class="country-info__languages-list">Languages: ${Object.values(
        languages
      )}</p>`
  );
}
