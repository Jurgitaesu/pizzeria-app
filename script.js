// Variables
const pizzasContainer = document.getElementsByClassName('pizzasContainer')[0];
const nameVal = document.getElementById('name');
const price = document.getElementById('price');
const heat = document.getElementById('heat');
const formToppings = document.getElementsByClassName('formToppings');
const toppingInputs = document.getElementById('toppingInputs');
const addTopping = document.getElementById('addTopping');
const formPhotos = document.getElementsByClassName('formPhotos');
const addButton = document.getElementById('addButton');
const updateButton = document.getElementById('updateButton');
const cancelButton = document.getElementById('cancelButton');
const updateButtons = document.getElementById('updateButtons');
const editButtons = document.getElementsByClassName('editButton');
const deleteButtons = document.getElementsByClassName('deleteButton');
const message = document.getElementById('message');
const sortOptions = document.getElementById('sortOptions');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const sortButton = document.getElementById('sortButton');
const sortOption = document.getElementsByClassName('sortOption');
let areInputsValid = false;
let photosArray = [];
let allPizzasFromStorage = [];
let deleteId = '';

//Take all pizzas from storage on page load
!!sessionStorage.getItem('allPizzas') ? null : sessionStorage.setItem('allPizzas', JSON.stringify([]));
allPizzasFromStorage = JSON.parse(sessionStorage.getItem('allPizzas'));

//Add new pizza
const addPizza = (e) => {
  e.preventDefault();
  let pizzasArray = JSON.parse(sessionStorage.getItem('allPizzas'));
  for (let i = 0; i < pizzasArray.length; i++) {
    if (pizzasArray[i].name === nameVal.value) {
      return (message.innerText = 'Name should be unique');
    }
  }
  validateInputs();
  if (areInputsValid) {
    let toppingsArray = [];
    for (let i = 0; i < formToppings.length; i++) {
      toppingsArray.push(formToppings[i].value);
    }
    let pizza = {
      name: nameVal.value,
      price: price.value,
      heat: heat.value,
      toppings: toppingsArray,
      photos: photosArray,
    };
    let pizzasArray = JSON.parse(sessionStorage.getItem('allPizzas'));
    pizzasArray.push(pizza);
    sessionStorage.setItem('allPizzas', JSON.stringify(pizzasArray));
    allPizzasFromStorage = JSON.parse(sessionStorage.getItem('allPizzas'));
    updateHtml();
    clearInputs();
    areInputsValid = false;
    photosArray = [];
  }
};

// Validate pizza form inputs upon adding a new pizza or editing an existing one
const validateInputs = () => {
  if (nameVal.value.length === 0) return (message.innerText = 'Name is required');
  if (nameVal.value.length > 30) return (message.innerText = 'Name length should be not longer than 30 symbols');
  if (price.value.length === 0) return (message.innerText = 'Price is required');
  if ((!!heat.value && heat.value < 1) || heat.value > 3) return (message.innerText = 'Heat should be between 1 and 3');
  if (formToppings[0].value === '' || !!formToppings[1].value === '') return (message.innerText = 'Pizza should include minimum 2 toppings');
  areInputsValid = true;
};

// Create additional inputs for more toppings
const addToppingInput = (e) => {
  e.preventDefault();
  let li = document.createElement('li');
  li.innerHTML = '<input type="text" name="toppings" class="toppings formToppings" />';
  toppingInputs.appendChild(li);
};

//Handle photos select
const selectPhoto = (e) => {
  let photoId = e.target.id;
  if (e.target.className.includes('border')) {
    e.target.classList.remove('border');
    return removeFromPhotosArr(photoId);
  } else {
    e.target.classList.add('border');
    return addToPhotosArr(photoId);
  }
};

const addToPhotosArr = (photo) => {
  photosArray = [...photosArray, photo];
};

const removeFromPhotosArr = (photo) => {
  photosArray = photosArray.filter((x) => x !== photo);
};

//Take edit pizza data from session storage and fill the form
const editPizzaInputs = (e) => {
  clearInputs();
  id = e.path[3].id;
  updateButtons.style.display = 'block';
  addButton.style.display = 'none';
  nameVal.value = allPizzasFromStorage[id].name;
  price.value = allPizzasFromStorage[id].price;
  heat.value = allPizzasFromStorage[id].heat;
  formToppings[0].value = allPizzasFromStorage[id].toppings[0];
  formToppings[1].value = allPizzasFromStorage[id].toppings[1];
  if (allPizzasFromStorage[id].toppings.length > formToppings.length) {
    for (let i = 2; i < allPizzasFromStorage[id].toppings.length; i++) {
      let li = document.createElement('li');
      li.innerHTML = `<input type="text" name="toppings" class="toppings formToppings" value=${allPizzasFromStorage[id].toppings[i]} />`;
      toppingInputs.appendChild(li);
    }
  }
  for (let i = 0; i < formPhotos.length; i++) {
    allPizzasFromStorage[id].photos.map((item) => {
      if (item === formPhotos[i].id) {
        formPhotos[i].classList.add('border');
      }
    });
  }
};

//Upload pizza edit to session storage
const confirmEditPizza = (e) => {
  e.preventDefault();
  validateInputs();
  if (areInputsValid) {
    allPizzasFromStorage[id].name = nameVal.value;
    allPizzasFromStorage[id].price = price.value;
    allPizzasFromStorage[id].heat = heat.value;
    allPizzasFromStorage[id].toppings = [];
    for (let i = 0; i < formToppings.length; i++) {
      if (!!formToppings[i].value) {
        allPizzasFromStorage[id].toppings.push(formToppings[i].value);
      }
    }
    allPizzasFromStorage[id].photos = [];

    for (let i = 0; i < formPhotos.length; i++) {
      if (formPhotos[i].className.includes('border')) {
        allPizzasFromStorage[id].photos.push(formPhotos[i].id);
      }
    }
    // allPizzasFromStorage[id].photos = photosArray;
    sessionStorage.setItem('allPizzas', JSON.stringify(allPizzasFromStorage));
    updateButtons.style.display = 'none';
    addButton.style.display = 'block';
    allPizzasFromStorage = JSON.parse(sessionStorage.getItem('allPizzas'));
    updateHtml();
  }
};

//Cancel edit
const cancelEdit = (e) => {
  e.preventDefault();
  clearInputs();
  updateButtons.style.display = 'none';
  addButton.style.display = 'block';
};

// Clear all form inputs
const clearInputs = () => {
  nameVal.value = '';
  price.value = '';
  heat.value = '';
  for (let i = 0; i < formToppings.length; i++) {
    formToppings[i].value = '';
  }
  if (formToppings.length > 2) {
    for (let i = 2; i < formToppings.length; i++) {
      toppingInputs.removeChild(toppingInputs.children[i]);
    }
  }
  for (let i = 0; i < formPhotos.length; i++) {
    formPhotos[i].classList.remove('border');
  }
};

// Show elements on pizza cards
const showChiliIcon = (heat) => {
  let chiliIcon = [];
  for (let i = 0; i < 3; i++) {
    if (i < heat) {
      chiliIcon.push('<img src="./photos/chilli.png" class="chilli" alt="chilli" />');
    }
  }
  return chiliIcon.join('');
};

const showToppings = (toppings) => {
  let allToppings = [];
  toppings.map((item) => {
    if (!!item) allToppings.push(`<span>${item}</span>`);
  });
  return allToppings.join(', ');
};

const showPhotos = (photos) => {
  let allPhotos = [];
  photos.map((item) => {
    allPhotos.push(`<img src="./photos/${item}.jpg" class="photos" alt="pizza" />`);
  });
  return allPhotos.join('');
};

//Handle pizza delete
const openDeleteModal = (e) => {
  modal.style.display = 'block';
  deleteId = e.path[3].id;
};

const closeDeleteModal = () => {
  modal.style.display = 'none';
};

const confirmDel = () => {
  let allPizzas = JSON.parse(sessionStorage.getItem('allPizzas'));
  allPizzas.splice(deleteId, 1);
  sessionStorage.setItem('allPizzas', JSON.stringify(allPizzas));
  allPizzasFromStorage = JSON.parse(sessionStorage.getItem('allPizzas'));
  deleteId = '';
  updateHtml();
};

// Update HTML
const updateHtml = () => {
  message.innerText = '';
  modal.style.display = 'none';
  pizzasContainer.innerHTML = '';
  updateButtons.style.display = 'none';
  allPizzasFromStorage.map((item, index) => {
    pizzasContainer.innerHTML += `<div class="pizza-card" id="${index}">
    <div>
      <h2 class="mb-10">${item.name}<span class="ml-10">${showChiliIcon(item.heat)}</span></h3>
      <div class="mb-10">Price: <span>${item.price}</span> &#8364</div>
      <div class="mb-10">Toppings: <span>${showToppings(item.toppings)}</span></div>
      <div class="d-flex j-center flex-wrap">
      ${showPhotos(item.photos)}
      </div>
    </div>
    <div>
      <div class="buttons-container">
        <button class="button button-white editButton">Edit</button>
        <button class="button button-white deleteButton">Delete</button>
      </div>
    </div>
  </div>`;
  });
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener('click', editPizzaInputs);
  }
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', openDeleteModal);
  }
  clearInputs();
};

updateHtml();

// Sort pizzas
const sortPizzas = () => {
  let selection = '';
  for (let i = 0; i < sortOption.length; i++) {
    if (sortOption[i].hasAttribute('selected')) {
      selection = sortOption[i].value;
    }
  }
  allPizzasFromStorage = JSON.parse(sessionStorage.getItem('allPizzas'));
  const sortPizzasName = (arg) => {
    const sortTitles = [...allPizzasFromStorage];
    sortTitles.sort((prod1, prod2) => (prod1[arg] > prod2[arg] ? 1 : -1));
    allPizzasFromStorage = sortTitles;
  };
  const sortPizzasPriceHeat = (arg) => {
    const sortPizzas = [...allPizzasFromStorage];
    sortPizzas.sort((pizza1, pizza2) => pizza2[arg] - pizza1[arg]);
    allPizzasFromStorage = sortPizzas;
    return allPizzasFromStorage;
  };
  if (selection === 'name') {
    sortPizzasName('name');
  }
  if (selection === 'price') {
    sortPizzasPriceHeat('price');
  }
  if (selection === 'heat') {
    sortPizzasPriceHeat('heat');
  }
  updateHtml();
};

// Event Listeners
addTopping.addEventListener('click', addToppingInput);
addButton.addEventListener('click', addPizza);
cancelButton.addEventListener('click', cancelEdit);
closeModal.addEventListener('click', closeDeleteModal);
cancelDelete.addEventListener('click', closeDeleteModal);
sortButton.addEventListener('click', sortPizzas);
updateButton.addEventListener('click', confirmEditPizza);
confirmDelete.addEventListener('click', () => confirmDel(deleteId));
for (let i = 0; i < formPhotos.length; i++) {
  formPhotos[i].addEventListener('click', selectPhoto);
}
sortOptions.addEventListener('change', (e) => {
  for (let i = 0; i < sortOption.length; i++) {
    if (sortOption[i].value === e.target.value) {
      sortOption[i].setAttribute('selected', true);
    } else {
      sortOption[i].removeAttribute('selected');
    }
  }
});
