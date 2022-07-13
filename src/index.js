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

function onSearch(event) {
  event.preventDefault();
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  if (query === '') {
    Notify.failure('Erorr, input is empty.');
    return;
  }
  fachImg(page, perPage, query)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      refs.gallery.innerHTML = galleryList(data.hits);

      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      refs.loadBtn.classList.remove('is-hiden');
    })
    .catch(error => console.log(error))
    .finally(() => {
      refs.searchForm.reset();
    });

  return;
}

// Кнопка
refs.loadBtn.addEventListener('click', btnMore);

function btnMore(event) {
  page += 1;
  console.log(page);

  fachImg(page, perPage, query).then(({ data }) => {
    refs.gallery.insertAdjacentHTML('beforeend', galleryList(data.hits));
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    totalPages = Math.ceil(data.totalHits / perPage);
    console.log(totalPages);
    if (page === totalPages) {
      refs.loadBtn.classList.add('is-hiden');
    }
  });
}
