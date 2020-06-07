
function populateUFs () {
	const ufSelect = document.querySelector("select[name=uf]")
	fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?OrderBy=nome")
	.then(res => res.json())
	.then(states => {
		for(state of states){
			ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
		}
	})
}

populateUFs()

function getCities(event) {
	const citySelect = document.querySelector("select[name=city]")
	const stateInput = document.querySelector("input[name=state]")
	const ufValue = event.target.value
	const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

	stateInput.value = event.target.options[event.target.selectedIndex].text
	citySelect.innerHTML = '<option value="">Selecione a Cidade</option>'
	citySelect.disabled = true

	fetch(url)
	.then(res => res.json())
	.then(cities => {
		for( const city of cities ) {
			citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
		}

		citySelect.disabled = false
	})
}

document
	.querySelector("select[name=uf]")
	.addEventListener("change", getCities)


const hiddenInput = document.querySelector("input[name=items]")
// items de coleta

const itemsToColect = document.querySelectorAll(".items-grid li")

for (item of itemsToColect){
	item.addEventListener("click", handleSelectedItem)
}

let selectedItems = []

function handleSelectedItem(event){
	const itemLi = event.target
	itemLi.classList.toggle("selected")
	const itemId = itemLi.dataset.id


	const alreadySelected = selectedItems.findIndex(item => item === itemId)

	if (alreadySelected >= 0){
		selectedItems = selectedItems.filter( item => item != itemId)
	} else {
		selectedItems.push(itemId)
	}

	hiddenInput.value = selectedItems

	console.log(selectedItems)
}
