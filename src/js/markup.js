import ApiQuery from './api-query';

const refs = {
  searchForm: document.querySelector('#search-form'),
  divGallery: document.querySelector('#gallery'),
  btnLoadMore: document.querySelector('[data-load-more]'),
};

const apiQuery = new ApiQuery();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearImagesSearch();
  apiQuery.resetPageNum();
  apiQuery.query = e.currentTarget.elements.searchQuery.value;

  if (apiQuery.query === '') {
    return Notiflix.Notify.warning('Empty query');
  }
  apiQuery.fetchImages().then(data => {
    if (data.total === 0) {
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      markupImages(data);
    }
  });
}

function onLoadMore(e) {
  apiQuery.fetchImages().then(markupImages);
}

function markupImages(images) {
  for (image of images) {
    const imgCard = `
      <div class="photo-card">
        <img
          src="${image.webformatURL}"
          alt="${image.tags}"
          loading="lazy"
        />
        <div class="info">
          <p class="info-item"><b>Likes</b><br />${image.likes}</p>
          <p class="info-item"><b>Views</b><br />${image.views}</p>
          <p class="info-item"><b>Comments</b><br />${image.comments}</p>
          <p class="info-item"><b>Downloads</b><br />${image.downloads}</p>
        </div>
      </div>`;
    refs.divGallery.insertAdjacentHTML('beforeend', imgCard);
  }
}

function clearImagesSearch() {
  refs.divGallery.innerHTML = '';
}
