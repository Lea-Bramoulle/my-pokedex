const app = {


    init: () => {


        app.handleDisplayPokemonList() ;
        app.fetchTypeInformations() ;


    }, 


    addListenerToActions: () => {



    }, 


    handleDisplayPokemonList: async () => {


        try {

            const result = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20') ;
            const pokemons = await result.json() ;

            pokemons.results.forEach( async pokemon => {

                const result = await fetch(pokemon.url) ;
                const pokemonDetails = await result.json() ;

                app.displayPokemonInDom(pokemonDetails) ;

            });

        } catch (error) {
            console.log(error);
            alert("Impossible d'aficher les pokemons");
        }

    }, 



    displayPokemonInDom: (pokemon) => {

        console.log(pokemon) ;

        const template = document.getElementById("pokemon-card-template") ;
        const newpokemon = template.cloneNode(true).content ;

        const spriteElement = newpokemon.querySelector("img") ; 
        spriteElement.src = pokemon.sprites.other.home.front_default ;

        const titleElement = newpokemon.querySelector(".pokemon-card-title") ;
        titleElement.textContent = pokemon.name ; 

        const idElement = newpokemon.querySelector(".pokemon-card-id") ;
        idElement.textContent = `#${pokemon.id}` ; 

        const typesContainerElement = newpokemon.querySelector(".pokemon-card-types") ; 
        console.log(typesContainerElement) ;

        pokemon.types.forEach( type => {

            const buttonElement = document.createElement("button") ;
            buttonElement.classList.add("pokemon-card-types-button") ; 

            const typeInformationObject =  app.fetchTypeInformations(type.type.name) ;

            buttonElement.style.backgroundColor = `#${typeInformationObject.color}`
            buttonElement.textContent = type.type.name ;


            typesContainerElement.appendChild(buttonElement) ;




        }) ;


        const pokemonContainerElement = document.querySelector(".pokemons-container-all") ;

        pokemonContainerElement.appendChild(newpokemon) ;


    }, 


    fetchTypeInformations: (typeName) => {

        const typesInformationArray = [
            {id:1, name:'steel', color:'aaaabb', img:'acier.png'},
            {id:2, name:'fighting', color:'bb5544',  img:'combat.png'},
            {id:3, name:'dragon', color:'7766ee',  img:'dragon.png'},
            {id:4, name:'water',color: '3399ff',  img:'eau.png'},
            {id:5, name:'electrik', color:'ffbb33', img:'electrick.png'},
            {id:6, name:'fire', color:'ff4422', img:'feu.png'},
            {id:7, name:'ice', color:'77ddff', img:'glace.png'},
            {id:8, name:'bug', color:'aabb22', img:'insecte.png'},
            {id:9, name:'normal', color:'bbaabb', img:'normal.png'},
            {id:10,name: 'grass', color:'77cc55', img:'plante.png'},
            {id:11,name: 'poison', color:'aa5599', img:'poison.png'},
            {id:12,name: 'psychic', color:'ff5599', img:'psy.png'},
            {id:13,name: 'rock', color:'bbaa66', img:'roche.png'},
            {id:14,name: 'ground', color:'ddbb55', img:'sol.png'},
            {id:15,name: 'ghost', color:'6666bb', img:'spectre.png'},
            {id:16,name: 'dark', color:'665544', img:'tenebre.png'},
            {id:17,name: 'flying', color:'6699ff', img:'vol.png'}
        ]

        let typeInformationObject = {} ;

        typesInformationArray.forEach(element => {
            
            if (element.name === typeName) {
                typeInformationObject = element ;
            }

        }) ;

        return typeInformationObject ;


    }


}



document.addEventListener('DOMContentLoaded', app.init );
