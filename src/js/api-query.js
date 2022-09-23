const MAIN_URL =
  'https://pixabay.com/api/?key=29727763-9de4927242ac493db1fc7e125&image_type=photo&orientation=horizontal&safesearch=true';
export const perPage = 24;
export default class ApiQuery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    return fetch(
      `${MAIN_URL}&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}`
    )
      .then(response => response.json())
      .then(data => {
        this.increasePageNum();
        return data;
      });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  increasePageNum() {
    this.page += 1;
  }

  resetPageNum() {
    this.page = 1;
  }
}
