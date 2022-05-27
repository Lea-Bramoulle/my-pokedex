let offSet= 0 ;
let limit = 1125 ;

const app = {


    init: () => {

        
        app.handleDisplayPokemonsList() ;
        app.fetchTypeInformations() ;
        
        app.addListenerToActions() ;

        
    }, 


    addListenerToActions: () => {


        buttonNextElement = document.getElementById("go-next") ;
        buttonNextElement.addEventListener("click", () => {
            app.goForward() ;
        }) ;

        buttonPrevElement = document.getElementById("go-back") ;
        buttonPrevElement.addEventListener("click", () => {
            app.goBack() ;
        }) ;


    }, 


    handleDisplayPokemonsList: async () => {


        try {

            const result = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offSet}&limit=12`) ;
            const pokemons = await result.json() ;

            const pokemonsContainerElement = document.querySelector(".pokemons-container-all") ;
            pokemonsContainerElement.textContent = "" ;

            pokemons.results.forEach( async pokemon => {

                const result = await fetch(pokemon.url) ;
                const pokemonDetails = await result.json() ;

                await app.displayPokemonsInDom(pokemonDetails) ;

            });

            app.handleDisplayDefaultPokemonDetails() ;





        } catch (error) {
            console.log(error);
            alert("Impossible d'aficher les pokemons");
        }

    }, 




    displayPokemonsInDom: (pokemon) => {

      //console.log(pokemon) ;

        const template = document.getElementById("pokemon-card-template") ;
        const newpokemon = template.cloneNode(true).content ;

        newpokemon.querySelector(".pokemon-card").dataset.dataId = pokemon.id ;

        const spriteElement = newpokemon.querySelector("img") ; 
        spriteElement.src = pokemon.sprites.other.home.front_default ;

        const titleElement = newpokemon.querySelector(".pokemon-card-title") ;
        titleElement.textContent = pokemon.name ; 

        const idElement = newpokemon.querySelector(".pokemon-card-id") ;
        idElement.textContent = `#${pokemon.id}` ; 

        const typesContainerElement = newpokemon.querySelector(".pokemon-card-types") ; 
        //console.log(typesContainerElement) ;

        pokemon.types.forEach( type => {

            const buttonElement = document.createElement("button") ;
            buttonElement.classList.add("pokemon-card-types-button") ; 

            const typeInformationObject =  app.fetchTypeInformations(type.type.name) ;

            buttonElement.style.backgroundColor = `#${typeInformationObject.color}`
            buttonElement.textContent = type.type.name ;


            typesContainerElement.appendChild(buttonElement) ;


        }) ;

        
        newpokemon.querySelector(".pokemon-card").addEventListener('click', app.handleDisplayPokemonDetails);
        
        
        const pokemonContainerElement = document.querySelector(".pokemons-container-all") ;
        pokemonContainerElement.appendChild(newpokemon) ;



    }, 


    handleDisplayDefaultPokemonDetails: async () => {

        try {

            const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${offSet+1}`)
            const pokemon = await result.json() ;

            console.log(pokemon.name) ;

            app.displayPokemonDetailsInDom(pokemon) ;
    
        } catch (error) {
            console.log(error);
            alert("Impossible d'aficher les détails du pokemon");
        }

    },


    handleDisplayPokemonDetails: async (event) => {

        const pokemonId = event.target.closest(".pokemon-card").dataset.dataId ;
        
        try {

            const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            const pokemon = await result.json() ;

            console.log(pokemon.name) ;

            app.displayPokemonDetailsInDom(pokemon) ;
    
        } catch (error) {
            console.log(error);
            alert("Impossible d'aficher les détails du pokemon");
        }

    }, 



    displayPokemonDetailsInDom: (pokemon) => {

        const pokemonsContainerElement = document.querySelector(".pokemon-container-details") ;
        pokemonsContainerElement.textContent = "" ;

        const template = document.getElementById("pokemon-details-template") ;
        const newpokemon = template.cloneNode(true).content ;

        const imgElement = newpokemon.querySelector(".pokemon-detail-img") ;
        imgElement.src = pokemon.sprites.other.home.front_default ;

        const titleElement = newpokemon.querySelector(".pokemon-detail-title") ;
        titleElement.textContent = pokemon.name ; 

        const idElement = newpokemon.querySelector(".pokemon-detail-id") ;
        idElement.textContent = `#${pokemon.id}` ; 

        const typesContainerElement = newpokemon.querySelector(".pokemon-detail-types") ; 
        //console.log(typesContainerElement) ;

        pokemon.types.forEach( type => {

            const buttonElement = document.createElement("button") ;
            buttonElement.classList.add("pokemon-detail-types-button") ; 

            const typeInformationObject =  app.fetchTypeInformations(type.type.name) ;

            buttonElement.style.backgroundColor = `#${typeInformationObject.color}`
            buttonElement.textContent = type.type.name ;


            typesContainerElement.appendChild(buttonElement) ;


        }) ;

        newpokemon.querySelector(".hp-stat-container").style.width = `${(pokemon.stats[0].base_stat*100)/255}%`;
        newpokemon.querySelector(".attaque-stat-container").style.width = `${(pokemon.stats[1].base_stat*100)/255}%`;
        newpokemon.querySelector(".defense-stat-container").style.width = `${(pokemon.stats[2].base_stat*100)/255}%`;
        newpokemon.querySelector(".attaque-spe-stat-container").style.width = `${(pokemon.stats[3].base_stat*100)/255}%`;
        newpokemon.querySelector(".defense-spe-stat-container").style.width = `${(pokemon.stats[4].base_stat*100)/255}%`;
        newpokemon.querySelector(".speed-stat-container").style.width = `${(pokemon.stats[5].base_stat*100)/255}%`;


        const heightElement = newpokemon.querySelector(".height") ;
        heightElement.textContent = `${pokemon.height/10} m.` ;

        const weightElement = newpokemon.querySelector(".weight") ;
        weightElement.textContent = `${pokemon.weight/10} kg.` ;


        app.getPokemonEvolutionChain(pokemon) ;


        const pokemonContainer = document.querySelector(".pokemon-container-details") ;
        pokemonContainer.appendChild(newpokemon) ;

    },



    getPokemonEvolutionChain: async (pokemon) => {


        const pokemonId = pokemon.id ; 
        console.log(pokemonId) ; 
        
        const evolutionChainArray = [] ;

        try {

            const result = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`) ;
            const pokemonSpicies = await result.json() ;

            const result2 = await fetch(pokemonSpicies.evolution_chain.url) ;
            const pokemonEvolutionChain = await result2.json() ;


            if(pokemonEvolutionChain.chain.evolves_to.length === 1) {

                console.log(pokemonEvolutionChain.chain.species) ; 

                const resultEvol1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChain.chain.species.name}`) ;
                const evol1 = await resultEvol1.json() ;

                const resultEvol2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChain.chain.evolves_to[0].species.name}`) ;
                const evol2 = await resultEvol2.json() ;

                if (pokemonEvolutionChain.chain.evolves_to[0].evolves_to.length != 0) {

                    const resultEvol3 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolutionChain.chain.evolves_to[0].evolves_to[0].species.name}`) ;
                    const evol3 = await resultEvol3.json() ;

                    evolutionChainArray.push(evol1,evol2, evol3) ;

                    console.log(evolutionChainArray) ;
                    return evolutionChainArray ; 

             
                } else {

                    evolutionChainArray.push(evol1,evol2) ;

                    console.log(evolutionChainArray) ;
                    return evolutionChainArray ;

                }

            } else if (pokemonEvolutionChain.chain.evolves_to.length === 0) {

                return evolutionChainArray ;

            } else {


                pokemonEvolutionChain.chain.evolves_to.forEach(async pokemon => {
                    
                    const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.species.name}`) ;
                    const pokemonFromChain = await result.json() ;

                    evolutionChainArray.push(pokemonFromChain) ;

                })

                console.log(evolutionChainArray) ;
                return evolutionChainArray ;

            }

        } catch (error) {
            console.log(error);
            alert("Impossible d'aficher les détails du pokemon");
        }

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


    }, 


    goBack: async () => {

        if (offSet > 0 ) {
            offSet = offSet - 12 ;
        } else {
            offSet = 0 ;
        }

        await app.handleDisplayPokemonsList() ;


    }, 



    goForward: async () => {


        if (offSet < limit ) {
            offSet = offSet + 12 ;
        }

        await app.handleDisplayPokemonsList() ;

    },


}



document.addEventListener('DOMContentLoaded', app.init );
