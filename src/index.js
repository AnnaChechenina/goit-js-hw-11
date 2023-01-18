import './css/styles.css';
import Notiflix from 'notiflix';
import GalleryApiService from './gallery.js';

const galleryList = new GalleryApiService();
const formSearch = document.querySelector('.search-form');
const galleryColections = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

formSearch.addEventListener('submit', onSearchSubmit);
loadBtn.addEventListener('click', onClickButton);

async function onSearchSubmit(event) {
  event.preventDefault();
  galleryColections.innerHTML = '';
  loadBtn.classList.remove('is-seen');
  galleryList.page = 1;
  const inputText = event.currentTarget.elements.searchQuery.value.trim();
  galleryList.searchQuery = inputText;
  try {
    if (inputText) {
      const items = await galleryList.fetchGallery();
      createGalleryInfo(items.data.hits, galleryColections);
      createGalleryList(items);
      if (items.data.totalHits > 40) {
        loadBtn.classList.add('is-seen');
      }
    }
  } catch (error) {}
}

async function onClickButton() {
  try {
    const items = await galleryList.fetchGallery();
    createGalleryInfo(items.data.hits, galleryColections);
    createGalleryList(items);
    pageScroll();
  } catch (error) {}
}

function createGalleryInfo(items, galleryColections) {
  const galleryMarkup = items
    .map(card => {
      return `<div class="photo-card"><a href=${card.largeImageURL}>
  <img src=${card.webformatURL} alt=${card.tags} loading="lazy" width="200" height="200"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${card.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${card.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${card.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${card.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  galleryColections.insertAdjacentHTML('beforeend', galleryMarkup);
}

function createGalleryList(items) {
  const allItems = document.querySelectorAll('.photo-card');
  if (!items.data.total) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (!loadBtn.classList.contains('is-seen')) {
    return Notiflix.Notify.success(
      `Hooray! We found ${items.data.totalHits} images.`
    );
  }

  if (items.data.totalHits <= allItems.length) {
    return Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function pageScroll() {
  const { height: cardHeight } =
    galleryColections.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
