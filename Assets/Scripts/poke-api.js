class PokeAPI {
    constructor() {
        this.baseUrl = 'https://pokeapi.co/api/v2/pokemon';
        this.offset = 0;
        this.limit = 35;
    }

    async fetchPokemons() {
        const response = await fetch(`${this.baseUrl}?offset=${this.offset}&limit=${this.limit}`);
        const data = await response.json();
        this.offset += this.limit; // Atualiza o offset para a próxima página
        return Promise.all(
            data.results.map(async pokemon =>
                this.parsePokemonData(await this.fetchPokemonDetails(pokemon.url))
            )
        );
    }

    async fetchPokemonDetails(url) {
        const response = await fetch(url);
        return response.json();
    }

    parsePokemonData(pokemonData) {
        return {
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types.map(t => t.type.name),
            image: pokemonData.sprites.other['official-artwork'].front_default
        };
    }
}