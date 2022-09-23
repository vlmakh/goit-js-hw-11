import ApiQuery from './api-query';
import { perPage } from './api-query';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('#gallery'),
  btnLoadMore: document.querySelector('[data-load-more]'),
  spinner: document.querySelector('.spinner'),
};

const apiQuery = new ApiQuery();
let totalHits = 0;
let pagesQty = 0;
let pageNumber = 0;

refs.searchForm.addEventListener('submit', onSearch);

Notiflix.Notify.init({
  position: 'right-top',
  cssAnimationStyle: 'from-top', // 'zoom' - 'from-top'
});

async function onSearch(e) {
  e.preventDefault();
  pageNumber = 0;
  clearImagesSearch();
  apiQuery.resetPageNum();
  apiQuery.searchQuery = e.currentTarget.elements.inputQuery.value.trim();

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

  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  markupImages(data.hits);
  hideSpinner();

  totalHits = data.totalHits;
  pagesQty = totalHits / perPage;
  pageNumber += 1;

  if (pageNumber >= pagesQty) {
    hideLoadMoreBtn();
  }
  // });
}

async function onLoadMore() {
  showLoadMoreBtn();
  showSpinner();

  const data = await apiQuery.fetchImages();
  markupImages(data.hits);
  hideSpinner();
  pageNumber += 1;

  if (pageNumber >= pagesQty) {
    hideLoadMoreBtn();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function markupImages(images) {
  for (const {
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } of images) {
    const imgCard = `
      <div class="photo-card">
        <div class="img-thumb">
        <img
          src="${webformatURL}"
          alt="${tags}"
          loading="lazy"
        /></div>
        <div class="info">
          <p class="info-item"><b>Likes</b><br />${likes}</p>
          <p class="info-item"><b>Views</b><br />${views}</p>
          <p class="info-item"><b>Comments</b><br />${comments}</p>
          <p class="info-item"><b>Downloads</b><br />${downloads}</p>
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
