class Pokedex {
    constructor() {
        this.grid = document.querySelector('.pokedex-grid'); // grid que recebe os pokemonList cards
        this.UrlBase = 'https://pokeapi.co/api/v2/pokemon';
        this.offset = 0;
        this.limit = 151;
        this.init();
    }

    // Métodos auxiliares
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    // Layout dos cards
    createPokemonCard(pokemon) {
        return `
            <article class="pokemon-card ${pokemon.types[0]}">
                <div class="pokemon-header">
                    <span class="pokemon-number"># ${pokemon.id.toString().padStart(3, '0')} </span>
                    <h2 class="pokemon-name"> ${this.capitalize(pokemon.name)} </h2>
                </div>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => /* map percorre os tipos,criando um span type-badge para cada tipo*/ `
                    <span class="type-badge ${type}"> ${this.capitalize(type)} </span>`).join('')/*retira a virgula que o join adiciona ao concatenar os spans*/} 
                </div>
                <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}">
            </article>
        `;
    }

    // Métodos de processamento de dados
    parsePokemonData(pokemon) {
        return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map(t => t.type.name),
            image: pokemon.sprites.other['official-artwork'].front_default
        };
    }

    async fetchPokemons() {
        const response = await fetch(`${this.UrlBase}?offset=${this.offset}&limit=${this.limit}`);
        const data = await response.json();
        return Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetch(pokemon.url).then(res => res.json());
                return this.parsePokemonData(details);
            })
        );
    }

    // Métodos de exibição
    displayPokemons(pokemonList) {
        this.grid.innerHTML = pokemonList.map(pokemon => this.createPokemonCard(pokemon)).join('');
    }

    // Fluxo principal
    async init() {
        try {
            const pokemonList = await this.fetchPokemons();
            this.displayPokemons(pokemonList);
        } catch (error) {
            console.error('Error initializing Pokedex:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new Pokedex());