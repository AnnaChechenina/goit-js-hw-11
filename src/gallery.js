import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32854165-2be33d3b7d62605f34b603c1a';

export default class GalleryApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }
  async fetchGallery() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
        },
      });
      this.page += 1;
      return response;
    } catch (error) {}
  }

  get searchQuery() {
    return this.query;
  }
  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}
