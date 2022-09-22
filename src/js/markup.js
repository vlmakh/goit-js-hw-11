import ApiQuery from './api-query';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('#gallery'),
  btnLoadMore: document.querySelector('[data-load-more]'),
  spinner: document.querySelector('.spinner'),
};

const apiQuery = new ApiQuery();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  showSpinner();
  clearImagesSearch();
  apiQuery.resetPageNum();
  apiQuery.query = e.currentTarget.elements.inputQuery.value;

  if (apiQuery.query === '') {
    return Notiflix.Notify.warning('Empty query');
  }

  apiQuery.fetchImages().then(data => {
    if (data.totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    markupImages(data.hits);
    hideSpinner();
  });
}

function onLoadMore() {
  apiQuery.fetchImages().then(data => markupImages(data.hits));
}

function markupImages(images) {
  for (const image of images) {
    const imgCard = `
      <div class="photo-card">
        <div class="img-thumb">
        <img
          src="${image.webformatURL}"
          alt="${image.tags}"
          loading="lazy"
        /></div>
        <div class="info">
          <p class="info-item"><b>Likes</b><br />${image.likes}</p>
          <p class="info-item"><b>Views</b><br />${image.views}</p>
          <p class="info-item"><b>Comments</b><br />${image.comments}</p>
          <p class="info-item"><b>Downloads</b><br />${image.downloads}</p>
        </div>
      </div>`;
    refs.divGallery.insertAdjacentHTML('beforeend', imgCard);
  }
  showLoadMoreBtn();
}

function clearImagesSearch() {
  refs.divGallery.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.btnLoadMore.classList.remove('is-hidden');
}

function showSpinner() {
  refs.spinner.classList.remove('is-hidden');
}

function hideSpinner() {
  refs.spinner.classList.add('is-hidden');
}
