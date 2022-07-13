import galleryList from './hablbar/gallary.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fachImg } from './js/gallery-js';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};
console.log(SimpleLightbox);
let page = 1;
let perPage = 40;
let query = '';
let simpleLightBox;
let totalPages;
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';

  if (query === '') {
    errorNotifi('Erorr, input is empty.');
    refs.loadBtn.classList.add('is-hiden');
    return;
  }

  try {
    const data = await fachImg(page, perPage, query);
    if (data.totalHits === 0) {
      refs.loadBtn.classList.add('is-hiden');
      errorNotifi(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.gallery.innerHTML = galleryList(data.hits);

    alertNetifyInfo(`Hooray! We found ${data.totalHits} images.`);

    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    slovmo();

    refs.loadBtn.classList.remove('is-hiden');

    refs.searchForm.reset();
  } catch (error) {
    errorNotifi(error);
  }
}

// Кнопка
refs.loadBtn.addEventListener('click', btnMore);

async function btnMore(event) {
  page += 1;
  try {
    const data = await fachImg(page, perPage, query);

    refs.gallery.insertAdjacentHTML('beforeend', galleryList(data.hits));

    slovmo();

    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    totalPages = Math.ceil(data.totalHits / perPage);

    if (page === totalPages) {
      refs.loadBtn.classList.add('is-hiden');

      alertNetifyInfo(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    errorNotifi(error);
  }
}

function slovmo() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function alertNetifyInfo(maseeg) {
  Notify.info(maseeg);
}
function errorNotifi(maseeg) {
  Notify.failure(maseeg);
}
