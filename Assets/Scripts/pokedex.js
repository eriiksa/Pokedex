class Pokedex {
    constructor() {
        this.grid = document.querySelector('.pokedex-grid');
        this.baseUrl = 'https://pokeapi.co/api/v2/pokemon';
        this.init();
    }

    async init() {
        try {
            const pokemons = await this.fetchPokemons();
            this.displayPokemons(pokemons);
        } catch (error) {
            console.error('Error initializing Pokedex:', error);
        }
    }

    async fetchPokemons() {
        const response = await fetch(`${this.baseUrl}?limit=1025`);
        const data = await response.json();
        return Promise.all(
            data.results.map(async (pokemon) => {
                const details = await fetch(pokemon.url).then(res => res.json());
                return this.parsePokemonData(details);
            })
        );
    }

    parsePokemonData(pokemon) {
        return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map(t => t.type.name),
            image: pokemon.sprites.other['official-artwork'].front_default
        };
    }

    displayPokemons(pokemons) {
        this.grid.innerHTML = pokemons
            .map(pokemon => this.createPokemonCard(pokemon))
            .join('');
    }

    createPokemonCard(pokemon) {
        return `
            <article class="pokemon-card ${pokemon.types[0]}">
                <div class="pokemon-header">
                    <span class="pokemon-number">#${pokemon.id.toString().padStart(3, '0')}</span>
                    <h2 class="pokemon-name">${this.capitalize(pokemon.name)}</h2>
                </div>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => `
                        <span class="type-badge ${type}">${this.capitalize(type)}</span>
                    `).join('')}
                </div>
                <img class="pokemon-image" src="${pokemon.image}" alt="${pokemon.name}">
            </article>
        `;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize Pokedex when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new Pokedex());