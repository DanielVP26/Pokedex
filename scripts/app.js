function showVal(newVal) {
    document.getElementById("valBox").innerHTML = `1- ${newVal}`;
}

const restarRange = document.querySelector('#restarRange')
const sumarRange = document.querySelector('#sumarRange')
const range = document.querySelector('#rangoPokemon')

restarRange.addEventListener('click', () => {
    range.value = parseInt(range.value) - 1
    showVal(range.value)
})
sumarRange.addEventListener('click', () => {
    range.value = parseInt(range.value) + 1
    showVal(range.value)
})


let btnSearchAdvance = document.querySelectorAll('.btnSearchAdvance')
const btnBusqueda = document.querySelector('#btnBusqueda')
const btnSearchArray = [...btnSearchAdvance]

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
let inicio = 1
let fin = 20
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
    <button class="btnExit"><span class="material-icons" id="btnExit">close</span></button>
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
    const btnExit = document.querySelector('#btnExit')
    btnExit.addEventListener('click', () => {
        pokeContainer.innerHTML = ''
    })
}

const listaNombresPokemon = []

fetch('https://pokeapi.co/api/v2/pokemon?limit=1154&offset=0')
    .then( response => response.json())
    .then( data => data.results.forEach( e => listaNombresPokemon.push(e.name)) )

function search(array, value){
    return array.filter(item => item.toLowerCase().includes(value.toLowerCase()) )
}

const searchInput = document.querySelector('#search')
searchInput.addEventListener('input', () => {
    const value = searchInput.value
    const ulSearch = document.querySelector('#ulSearch')
    if(value != ''){
        const listaResultados = search(listaNombresPokemon, value)
        const fiveValue = listaResultados.slice(0,5)
        ulSearch.innerHTML = ''
        fiveValue.forEach((e)=>{
            const li = document.createElement('li')
            li.classList.add("list-group-item")
            li.innerText = e.toUpperCase()
            ulSearch.appendChild(li)
            li.addEventListener('click', () => {
                const id = listaNombresPokemon.indexOf(e) + 1
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then( response => response.json())
                    .then( data => {
                        pokeContainer.innerHTML = ''
                        pintarPokemon(data)
                    })
            })
        })
    }else{
        ulSearch.innerHTML = ''
    }
})