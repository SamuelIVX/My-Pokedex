/**
 * Pokedex page logic: fetches the first 150 Pokémon from PokéAPI and renders
 * name / sprite / type cards into `#pokedex`. Runs fetchPokemon() on load.
 * Talks to the public PokéAPI over the network (serve over HTTP to avoid CORS issues).
 */
const pokedex = document.getElementById("pokedex");

/**
 * Requests Pokémon 1–150 in parallel, maps each payload to a display record,
 * then calls displayPokemon. Unhandled fetch/JSON failures leave `#pokedex` empty.
 * @returns {void}
 * @example
 * fetchPokemon(); // fills #pokedex after Promise.all resolves
 */
const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 150; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    const pokemon = results.map((result) => ({
      name: result.name,
      image: result.sprites["front_default"],
      type: result.types.map((type) => type.type.name).join(", "),
      id: result.id,
    }));
    displayPokemon(pokemon);
  });
};

/**
 * Renders a list of Pokémon card HTML into the `#pokedex` element.
 * Preconditions: `#pokedex` exists in the DOM (`pokedex` is non-null).
 * @param {Array<{name: string, image: string, type: string, id: number}>} pokemon
 *   Display records produced by fetchPokemon.
 * @returns {void}
 * @example
 * displayPokemon([{ name: "bulbasaur", image: "...", type: "grass, poison", id: 1 }]);
 */
const displayPokemon = (pokemon) => {
  const pokemonHTMLString = pokemon
    .map(
      (pokeman) => `
        <li class="card">
            <img class="card-image" src="${pokeman.image}"/>
            <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
            <p class="card-subtitle">Type: ${pokeman.type}</p>
        </li>
    `,
    )
    .join("");
  pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();
