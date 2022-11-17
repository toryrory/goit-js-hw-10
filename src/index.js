import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(oninput,DEBOUNCE_DELAY));

function oninput() {
    const name = input.value.trim();
    if (!name) {
        return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    }
    
    fetchCountries(name)
        .then(countries => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
            if (countries.length === 1) {
                countryList.insertAdjacentHTML(
                    'beforeend',
                    renderCountryList(countries)
                );
                countryInfo.insertAdjacentHTML(
                    'beforeend',
                    renderCountryInfo(countries)
                );
            } else if (countries.length <= 10) {
                countryList.insertAdjacentHTML(
                    'beforeend',
                    renderCountryList(countries)
                );
            } else {
                Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            }
        })
        .catch(onSearchError);
}

function renderCountryList(countries) {
        const markup = countries.map(({ flags, name }) => {
            return `<li class="country-list__items">
        <img src="${flags.svg}"alt="Country flag" width=40 height=40>
        <h2>${name.official}</h2>
      </li>`}).join('');
        return markup
}
function renderCountryInfo(countries) {
        const markup = countries.map(({ capital, population, languages }) => {
            return `<li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
      <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
      <li class="country-info__item"><p><b>Languages: </b>${Object.values(
        languages
      ).join(', ')}</p></li>`;
        }).join('');
        return markup
}

function onSearchError() {
    Notify.failure('Oops, there is no country with that name');
}
