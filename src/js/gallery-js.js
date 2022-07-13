import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const KEY = '28582397-47e4de6d820c4a43f4b992bf8';

export async function fachImg(page, perPage, query) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
