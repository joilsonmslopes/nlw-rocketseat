
function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {

        for( state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )
}

populateUFs()


function getCities(event) {
    // Aqui pegamos os select e input
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value;

    const indexOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectedState].text

    // Aqui pegamos o serviço de api externo do ibge
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;


    // Limpar dados quando escolher outro estado
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;



    //Aqui fizemos um fetch para receber e tratar esse serviço externo
    fetch(url)
    .then( res => res.json() )
    .then( cities => {

        // estamos pegando uma city de cada cities e adicionando num option
        for( city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        // Habilitamos o select da Cidade
        citySelect.disabled = false;
    })

}

// Pegamos o select do Estado, adicionamos o evento "change" e referimos a função de pegar as cidades.
document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// Itens de Coleta
// Pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li");

for ( const item of itemsToCollect ) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = [];

function handleSelectedItem(event) {
    const itemLi = event.target
    // adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id;

    
    // Primeiro verificar se existe itens selecionados
    // Se sim, pegar os itens selecionados
    
    const alreadySelected = selectedItems.findIndex( item => item == itemId )

    // se ja estiver selecionado
    if( alreadySelected >= 0) {
        // tirar da seleção
        const filteredItems = selectedItems.filter( item => item != itemId )
        
        selectedItems = filteredItems;
    } else {
        // se não estiver selecionado
        // adicionar a seleção
        selectedItems.push(itemId)
    }

    // atualizar o campo escondido com os items selecionados
    collectedItems.value = selectedItems;
};