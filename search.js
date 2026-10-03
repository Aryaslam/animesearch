$(document).ready(function () {
  const API_BASE_URL = 'https://api.jikan.moe/v4';

  function getQueryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
  }

  const query = getQueryFromURL();

  if (query) {
    $('#search-input').val(query);
    fetchAnimeResults(query);
  }

  function fetchAnimeResults(searchQuery) {
    const $grid =$('#results-section');
    $grid.html(`<div class="loading-state"><p>Mencari anime "${searchQuery}"...</p></div>`);

    $.ajax({
      url: `${API_BASE_URL}/anime`,
      method: 'GET',
      data: { q: searchQuery, limit: 9 }
    })
    .then(function (response) {
      const animeList = response.data;
      $grid.empty();

      if (!animeList || animeList.length === 0) {
        $grid.html('<p class="empty-state">Anime tidak ditemukan.</p>');
        return;
      }

      animeList.forEach(function (anime, index) {
        const category = anime.type || 'TV Show';
        const description = anime.synopsis ? anime.synopsis : 'No description available.';
        const isWide = (index === 3 || index === 6) ? 'card-wide' : '';

        const cardHtml = `
          <article class="card ${isWide}">
          <div class="card-image">
          <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
          </div>
          <div class="card-content">
          <span class="card-category">${category} • ⭐ ${anime.score || 'N/A'}</span>
          <h3 class="card-title">${anime.title}</h3>
          <p class="card-description">${description}</p>
          </div>
          </article>
          `;
        $grid.append(cardHtml);
      });
    })
    .catch(function () {
      $grid.html('<p class="error-state">Gagal mengambil data dari Jikan API.</p>');
    });
  }
});
