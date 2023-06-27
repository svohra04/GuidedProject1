let filmName;
let released;
let director;
let episode;
let charactersDiv;
let planetDiv;
const charactersList = document.querySelector("#charactersList")
const baseUrl = `https://swapi2.azurewebsites.net/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  filmName = document.querySelector('h1#filmName');
  released = document.querySelector('span#released');
  director = document.querySelector('span#director');
  episode = document.querySelector('span#episode');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getFilm(id)
});

async function getFilm(id) {
    let films;
    try {
      films = await fetchFilms(id)
      films.characters = await fetchCharacters(films)
      films.planets = await fetchPlanets(films)
    }
    catch (ex) {
      console.error(`Error reading details of the film ${id}.`, ex.message);
    }
    renderFilms(films);
  }

async function fetchFilms(id) {
    let film = `${baseUrl}/films/${id}`;
    return await fetch(film)
        .then(res => res.json())
}

async function fetchCharacters(films) {
    const url = `${baseUrl}/films/${films.id}/characters`;
    const characters = await fetch(url)
        .then(res => res.json())
    return characters;
}

async function fetchPlanets(films) {
    const url = `${baseUrl}/films/${films.id}/planets`;
    const planets = await fetch(url)
        .then(res => res.json())
    return planets;
}

const renderFilms = films => {
    console.log(films);
    document.title = `SWAPI - ${films?.title}`;  // Just to make the browser tab say their name
    filmName.textContent = films?.title;
    released.textContent = films?.release_date;
    director.textContent = films?.director;
    episode.textContent = films?.episode_id;
    renderCharacters(films.characters);
    const planetsLis = films?.planets?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</li>`)
    planetsUl.innerHTML = planetsLis.join("");
  }

  const renderCharacters = characters => {
    const divs = characters.map(character => {
      const el = document.createElement('div');
      el.addEventListener('click', () => goToCharacterPage(character.id));
      el.textContent = character.name;
      return el;
    })
    charactersList.replaceChildren(...divs)
  }
  
  const goToCharacterPage = id => window.location = `/character.html?id=${id}`