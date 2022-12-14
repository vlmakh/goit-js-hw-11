import axios from 'axios';

axios.defaults.baseURL =
  'https://pixabay.com/api/?key=29727763-9de4927242ac493db1fc7e125&image_type=photo&orientation=horizontal&safesearch=true';

export const perPage = 24;

export default class ApiQuery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    // --- вариант 1 - fetch
    // return fetch(
    //   `${MAIN_URL}&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}`
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     this.increasePageNum();
    //     return data;
    //   });

    // --- вариант 2 - axios
    // return axios
    //   .get(`&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}`)
    //   .then(response => {
    //     this.increasePageNum();
    //     const data = response.data;
    //     return data;
    //   });

    // --- вариант 3 - async-axios
    const response = await axios.get(
      `&q=${this.searchQuery}&page=${this.page}&per_page=${perPage}`
    );
    this.increasePageNum();
    return response.data;
  }

  increasePageNum() {
    this.page += 1;
  }

  resetPageNum() {
    this.page = 1;
  }
}
