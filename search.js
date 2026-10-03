$(document).ready(function () {
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
    $grid.html(`<div class="loading-state"><p style="text-align:center; width:100%;">Mencari anime "${searchQuery}"...</p></div>`);

    $.ajax({
      url: `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(searchQuery)}&page[limit]=9`,
      method: 'GET'
    })
    .then(function (response) {
      const animeList = response.data;
      $grid.empty();

      if (!animeList || animeList.length === 0) {
        $grid.html('<p class="empty-state">Anime tidak ditemukan.</p>');
        return;
      }

      animeList.forEach(function (anime, index) {
        const attr = anime.attributes;
        const title = attr.canonicalTitle || attr.titles.en || 'Untitled';
        const category = attr.showType || 'TV Show';
        const score = attr.averageRating ? (attr.averageRating / 10).toFixed(1) : 'N/A';
        const description = attr.synopsis ? attr.synopsis : 'No description available.';
        const imgUrl = attr.posterImage ? attr.posterImage.large : 'https://via.placeholder.com/300x400';
        const isWide = (index === 3 || index === 6) ? 'card-wide' : '';

        const cardHtml = `
          <article class="card ${isWide}">
          <div class="card-image">
          <img src="${imgUrl}" alt="${title}">
          </div>
          <div class="card-content">
          <span class="card-category">${category} • ⭐ ${score}</span>
          <h3 class="card-title">${title}</h3>
          <p class="card-description">${description}</p>
          </div>
          </article>
          `;
        $grid.append(cardHtml);
      });
    })
    .catch(function (err) {
      console.error('Error Search Kitsu API:', err);
      $grid.html('<p class="error-state">Gagal mengambil data dari server.</p>');
    });
  }
});
