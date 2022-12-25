function showVal(newVal) {
    document.getElementById("valBox").innerHTML = `1- ${newVal}`;
}

let btnSearchAdvance = document.querySelectorAll('.btnSearchAdvance')
const btnBusqueda = document.querySelector('#btnBusqueda')
const btnSearchArray = [...btnSearchAdvance]
let inicio = 1
let fin = 20

function comprobar (e){
    return e.getAttribute("aria-expanded") == true
}

btnSearchArray.forEach(element=>{
    const selector = element.getAttribute('data-bs-target')
    const targetElement = document.querySelector(selector)
    targetElement.addEventListener('shown.bs.collapse', mostrarBotonBusqueda)
    targetElement.addEventListener('hidden.bs.collapse', mostrarBotonBusqueda)
})
function mostrarBotonBusqueda(){
    const anyShowed = document.querySelector(`.btnSearchAdvance[aria-expanded="true"]`)
    if(anyShowed) btnBusqueda.style.display = ''
    else btnBusqueda.style.display = 'none'

}
const loadMore = document.querySelector('#loadMore')
const pokemonGeneral = document.querySelector('#pokemonGeneral')
const pokeContainer = document.querySelector('#pokeContainer')
let URL = "https://pokeapi.co/api/v2/pokemon/";

window.onload = cargar

let pokemonCard 
let listaPokemonCard
function cargar(){
    loadMore.disabled = true
    const listaPromesas = []
    let listaDatos = []
    
    for (let i = inicio; i <= fin; i++) {
        const promesa = fetch(URL + i)
            .then((response) => response.json())
            .then(data => listaDatos.push(data) )
        listaPromesas.push(promesa)
    }
    Promise.all(listaPromesas).then(()=>{
        
        listaDatos.sort( ({id: id1}, {id: id2}) => {
            if(id1 > id2) return 1
            if(id1 < id2) return -1
        })
        
        listaDatos.forEach( e => mostrarPokemon(e))
        pokemonCard = document.querySelectorAll('.pokemonCard')
        listaPokemonCard = [...pokemonCard]
        
        inicio += 20
        fin += 20
        loadMore.disabled = false
        /* listaPokemonCard.forEach((e)=>{
            e.addEventListener('click', () => {
                pokeContainer.innerHTML = ''
                pintarPokemon(listaDatos[e.id-1])
                console.log(listaDatos[e.id-1].id)
            })
        }) */

    })
    
   
}


function mostrarPokemon(data) {
    let tipos = data.types.map((type) => `<button class="btn-tipo ${type.type.name}">${type.type.name}</button>`);
    tipos = tipos.join('');
    const div = document.createElement("div");
    div.classList.add("pokemonCard");
    div.setAttribute("id", data.id);
    div.innerHTML = `
            <div class="idPokemon">
                <p>
                    #${data.id}
                </p>
            </div>
            <div class="imgPokemonDiv">
                <img class="imgPokemon"
                    src="${data.sprites.other["official-artwork"].front_default}"
                    alt="${data.name}">
            </div>
            <div class="namePokemon">
                <h4>
                    ${data.name}
                    </h3>
            </div>
            <div class="typePokemon">
            ${tipos}
            </div>
    `
    pokemonGeneral.appendChild(div)
const añadirEvento = (elemento, data) => {
        elemento.addEventListener('click', () => {
            pokeContainer.innerHTML = ''
            pintarPokemon(data)
        })
    }
    añadirEvento(div, data)
}



loadMore.addEventListener('click', cargar)
function pintarPokemon(data){
    let pintarDebilidades 
    const div = document.createElement("div");
    div.classList.add("pokeSelect");
    let tipos = data.types.map((type) => type.type.name);
    const listaDebilidades = []
    const listaPromesas = []
    let debilidadesName = []
    tipos.forEach( e => {
        const promesa = fetch(`https://pokeapi.co/api/v2/type/${e}`)
            .then( response => response.json())
            .then( data => {
                listaDebilidades.push(data.damage_relations.double_damage_from)
                listaPromesas.push(promesa)
                Promise.all(listaPromesas).then(()=>{
                    listaDebilidades.forEach( e => {
                        e.forEach( e => {
                            debilidadesName.push(e.name)
                        })
                    })
                    debilidadesName = debilidadesName.join(', ')
                    pintarDebilidades = `${debilidadesName}`
                })
                console.log(pintarDebilidades)
            })
    })
    tipos = tipos.join(', ')
    div.innerHTML = ``
    div.innerHTML = `
    <div class="imagenPrincipal d-flex flex-column">
            <div class="ID">
                <h1>
                    #${data.id}
                </h1>
            </div>
            <img class="imgBanner"
                src="${data.sprites.other["official-artwork"].front_default}"
                alt="">
            <h1>
                ${data.name}
            </h1>
        </div>
        <div class="infoPrincipal">
            <div class="bg-green">
                <p>Tipo: ${tipos}</p>
                <p>Debilidad: ${debilidadesName}</p>
                <p>HP: ${data.stats[0].base_stat}</p>
                <p>Ataque: ${data.stats[1].base_stat}</p>
                <p>Defensa: ${data.stats[2].base_stat}</p>
                <p>Ataque especial: ${data.stats[3].base_stat}</p>
                <p>Defensa especial: ${data.stats[4].base_stat}</p>
                <p>Velocidad: ${data.stats[5].base_stat}</p>
            </div>
            <div class="d-flex bg-green gap-5">
                <p>Altura: ${(data.height * 0.1).toFixed(1)} M</p>
                <p>Peso: ${(data.weight * 0.1.toFixed(1))} KG</p>
            </div>
        </div>
    `
    pokeContainer.appendChild(div)
    pokeContainer.scrollIntoView({behavior: 'smooth'});
    //location.href = "#pokeContainer"
}

/* <div class="pokeSelect">
        <div class="imagenPrincipal d-flex flex-column">
            <div class="ID">
                <h1>
                    #007
                </h1>
            </div>
            <img class="imgBanner"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
                alt="">
            <h1>
                SQUIRTLE
            </h1>
        </div>
        <div class="infoPrincipal">
            <div class="bg-green">
                <p>Tipo: Water</p>
                <p>Debilidad: Electrico, Planta</p>
                <p>Ps: 10</p>
                <p>Ataque: 10</p>
                <p>Defensa: 10</p>
                <p>Ataque especial 10:</p>
                <p>Defensa especial: 10</p>
                <p>Velocidad: 10</p>
            </div>
            <div class="d-flex bg-green gap-5">
                <p>Altura: 0,5M</p>
                <p>Peso: 9 Kg</p>
            </div>
        </div>
    </div> */

/* <div class="pokemonCard">
            <div class="idPokemon">
                <p>
                    #25
                </p>
            </div>
            <div class="imgPokemonDiv">
                <img class="imgPokemon"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                    alt="pikachu">
            </div>
            <div class="namePokemon">
                <h4>
                    Pikachu
                    </h3>
            </div>
            <div class="typePokemon">
                <button class="btn-tipo electric">
                    Eléctrico
                </button>
                <button class="btn-tipo normal">
                    Normal
                </button>
            </div>
        </div>
 */

        /* pokemonCard.forEach( (e) => {
            e.addEventListener('click', () => {
                fetch(`https://pokeapi.co/api/v2/pokemon/${e.id}`)
                .then( response => response.json())
                .then( data => {
                    pokeContainer.innerHTML = ''
                    pintarPokemon(data)
                }
                )
            })
            
        }) */