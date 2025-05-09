class Pokedex {
    constructor() {
        this.grid = document.querySelector('.pokedex-grid');
        this.api = new PokeAPI();
        this.loadMoreButton = document.getElementById('load-more');
        this.init();
        this.setupEventListeners(); // Mantenha esta ordem
    }

    // Métodos de renderização
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    displayPokemons(pokemonList) {
        this.grid.innerHTML += pokemonList.map(pokemon => `
            <article class="pokemon-card ${pokemon.types[0]}">
                <div class="pokemon-header">
                    <span class="pokemon-number"># ${pokemon.id.toString().padStart(3, '0')} </span>
                    <h2 class="pokemon-name"> ${this.capitalize(pokemon.name)} </h2>
                </div>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => `
                    <span class="type-badge ${type}"> ${this.capitalize(type)} </span>`).join('')}
                </div>
                <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}">
            </article>`).join('');
    }

    setupEventListeners() {
        this.loadMoreButton.addEventListener('click', () => this.loadMorePokemon());
    }

    async loadMorePokemon() {
        this.loadMoreButton.disabled = true;
        this.loadMoreButton.content = "Loading...";

        try {
            const pokemonList = await this.api.fetchPokemons();
            this.displayPokemons(pokemonList);
        } catch {
            console.error("Error loading more Pokemon", error);
        } finally {
            this.loadMoreButton.disabled = false;
            this.loadMoreButton.content = "Load More"
        }
    }

    async init() {
        try {
            const pokemonList = await this.api.fetchPokemons();
            this.displayPokemons(pokemonList);
        } catch (error) {
            console.error('Error initializing Pokedex', error)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new Pokedex());
