import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  console.log(`🚀 ~ onInput ~ countryName`, countryName);

  if (countryName === '') {
    resetSearchResults();
    return;
  }
  fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,languages,flags`
  )
    .then(response => {
      return response.json();
    })
    .then(country => {
      console.log(`🚀 ~ onInput ~ country`, country.length);
      if (country.length === 1) {
        resetSearchResults();
        refs.countryInfo.insertAdjacentHTML('beforeend', markupItem(country));
        return;
      }
      checkingInputInfo(country);
    })
    .catch(error => {
      console.log(error);
    });
}

function checkingInputInfo(data) {
  if (data.length > 10) {
    resetSearchResults();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (data.length > 2 && data.length <= 10) {
    resetSearchResults();
    refs.countryList.insertAdjacentHTML('beforeend', markupList(data));
    return;
  }

  if (data.length === undefined) {
    resetSearchResults();
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }
}

function markupList(country) {
  return country
    .map(
      ({ name, flags }) =>
        `<li class="country-info__item"><img src="${flags.svg}" alt="${name.official}" width="25">${name.official}</li>`
    )
    .join('');
}

function markupItem(country) {
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

function resetSearchResults() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
