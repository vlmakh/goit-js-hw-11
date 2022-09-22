export default class ApiQuery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchImages() {
    const MAIN_URL =
      'https://pixabay.com/api/?key=29727763-9de4927242ac493db1fc7e125&image_type=photo&orientation=horizontal&safesearch=true';

    return fetch(
      `${MAIN_URL}&q=${this.searchQuery}&page=${this.page}&per_page=24`
    )
      .then(r => r.json())
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
