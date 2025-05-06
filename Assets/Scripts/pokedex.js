class Pokedex {
    constructor() {
        this.grid = document.querySelector('.pokedex-grid'); // grid que recebe os pokemonList cards
        this.api = new PokeAPI();
        this.init();
    }

    // Métodos de renderização
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

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

    // Métodos de exibição
    displayPokemons(pokemonList) {
        this.grid.innerHTML = pokemonList.map(pokemon => this.createPokemonCard(pokemon)).join('');
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