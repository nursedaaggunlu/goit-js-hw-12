import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;
const PER_PAGE = 40;

const API_KEY = '53734660-27d678c11e0bffdf5dc1da34e';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a');

loader.classList.add('is-hidden');
loadMoreBtn.classList.add('is-hidden');

async function fetchImages(searchQuery, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: PER_PAGE,
    },
  });

  return response.data;
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="gallery-info">
          <li><span>Likes</span><span>${likes}</span></li>
          <li><span>Views</span><span>${views}</span></li>
          <li><span>Comments</span><span>${comments}</span></li>
          <li><span>Downloads</span><span>${downloads}</span></li>
        </ul>
      </li>
    `
    )
    .join('');
}

function waitForImagesToLoad(images) {
  return Promise.all(
    images.map(
      img =>
        new Promise(resolve => {
          if (img.complete) resolve();
          else {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }
        })
    )
  );
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  query = e.target.elements.searchQuery.value.trim();
  if (!query) return;

  page = 1;
  totalHits = 0;
  gallery.innerHTML = '';

  loadMoreBtn.classList.add('is-hidden');
  loader.classList.remove('is-hidden');

  try {
    const data = await fetchImages(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'No images found.',
        position: 'topRight',
      });
      loader.classList.add('is-hidden');
      return;
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(data.hits)
    );

    const images = gallery.querySelectorAll('img');
    await waitForImagesToLoad([...images]);

    lightbox.refresh();
    loader.classList.add('is-hidden');

    if (gallery.children.length < totalHits) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch {
    loader.classList.add('is-hidden');
    iziToast.error({
      message: 'Something went wrong.',
      position: 'topRight',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;

  loadMoreBtn.classList.add('is-hidden');
  loader.classList.remove('is-hidden');

  try {
    const data = await fetchImages(query, page);

    gallery.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(data.hits)
    );

    const cards = gallery.querySelectorAll('.gallery-item');
    const firstNewCard =
      cards[cards.length - data.hits.length];

    const newImages = firstNewCard.querySelectorAll('img');
    await waitForImagesToLoad([...newImages]);

    lightbox.refresh();
    smoothScroll(firstNewCard);

    if (gallery.children.length >= totalHits) {
      iziToast.info({
        message: "You've reached the end of results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch {
    iziToast.error({
      message: 'Error loading more images.',
      position: 'topRight',
    });
  } finally {
    loader.classList.add('is-hidden');
  }
});

function smoothScroll(targetCard) {
  if (!targetCard) return;

  const { height } = targetCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
