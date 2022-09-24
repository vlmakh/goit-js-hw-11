import ApiQuery from './api-query';
import { perPage } from './api-query';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('#gallery'),
  btnLoadMore: document.querySelector('[data-load-more]'),
  spinner: document.querySelector('.spinner'),
};

const apiQuery = new ApiQuery();
let totalLoadedImgs = 0;
let leftToLoadImgs = 0;

refs.searchForm.addEventListener('submit', onSearch);
refs.divGallery.addEventListener('click', onImageClick);

Notiflix.Notify.init({
  position: 'right-top',
  cssAnimationStyle: 'from-top', // 'zoom' - 'from-top'
});

function onImageClick(evt) {
  evt.preventDefault();

  if (!evt.target.classList.contains('gallery__image')) {
    return;
  }

  var gallery = new SimpleLightbox('.gallery a', {});
  gallery.refresh();
}

async function onSearch(e) {
  e.preventDefault();
  clearImagesSearch();
  apiQuery.resetPageNum();
  apiQuery.searchQuery = e.currentTarget.elements.inputQuery.value.trim();
  totalLoadedImgs = 0;
  leftToLoadImgs = 0;

  if (apiQuery.searchQuery === '') {
    return Notiflix.Notify.warning(
      'Empty query. Please input something for search'
    );
  }

  showLoadMoreBtn();
  showSpinner();

  const data = await apiQuery.fetchImages();
  // apiQuery.fetchImages().then(data => {
  if (data.totalHits === 0) {
    hideLoadMoreBtn();
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (data.totalHits <= perPage) {
    totalLoadedImgs = data.totalHits;
    hideLoadMoreBtn();
  } else {
    totalLoadedImgs = perPage;
    leftToLoadImgs = data.totalHits - totalLoadedImgs;
  }

  Notiflix.Notify.success(
    `Hooray! We found ${data.totalHits} images. ${totalLoadedImgs} of ${data.totalHits} images loaded`
  );
  markupImages(data.hits);
  hideSpinner();
  // });
}

async function onLoadMore() {
  showLoadMoreBtn();
  showSpinner();

  const data = await apiQuery.fetchImages();
  markupImages(data.hits);
  hideSpinner();

  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth',
  });

  if (leftToLoadImgs <= perPage) {
    totalLoadedImgs += leftToLoadImgs;
    hideLoadMoreBtn();
    Notiflix.Notify.info(
      `All ${totalLoadedImgs} of ${data.totalHits} images loaded. You reached the end of search results.`
    );
    return;
  } else {
    totalLoadedImgs += perPage;
    leftToLoadImgs -= perPage;
    Notiflix.Notify.success(
      `${totalLoadedImgs} of ${data.totalHits} images loaded.`
    );
  }
}

function markupImages(images) {
  for (const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } of images) {
    const imgCard = `
      <div class="gallery__card">
        <div class="gallery__thumb">
        <a href="${largeImageURL}">
        <img class="gallery__image"
          src="${webformatURL}"
          alt="${tags}"
          loading="lazy"
        /></a></div>
        <div class="info">
          <p class="info__item"><b>Likes</b><br />${likes}</p>
          <p class="info__item"><b>Views</b><br />${views}</p>
          <p class="info__item"><b>Comments</b><br />${comments}</p>
          <p class="info__item"><b>Downloads</b><br />${downloads}</p>
        </div>
      </div>`;
    refs.divGallery.insertAdjacentHTML('beforeend', imgCard);
  }
}

function clearImagesSearch() {
  refs.divGallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.btnLoadMore.classList.remove('is-hidden');
  refs.btnLoadMore.addEventListener('click', onLoadMore);
}

function hideLoadMoreBtn() {
  refs.btnLoadMore.classList.add('is-hidden');
  refs.btnLoadMore.removeEventListener('click', onLoadMore);
}

function showSpinner() {
  refs.spinner.classList.remove('is-hidden');
  refs.btnLoadMore.disabled = true;
}

function hideSpinner() {
  refs.spinner.classList.add('is-hidden');
  refs.btnLoadMore.disabled = false;
}
