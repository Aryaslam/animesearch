$(document).ready(function () {
  let isMoving = false;

  function loadTopAnimeCarousel() {
    const $track = $('.carousel-track');$track.html('<p style="text-align:center; width:100%; color:#666;">Memuat Top Anime...</p>');

    $.ajax({
      url: 'https://kitsu.io/api/edge/trending/anime',
      method: 'GET'
    })
    .then(function (response) {
      const animeList = response.data;
      $track.empty();

      if (!animeList || animeList.length === 0) {
        $track.html('<p style="text-align:center; width:100%;">Data anime kosong.</p>');
        return;
      }

      animeList.forEach(function (anime) {
        const attr = anime.attributes;
        const title = attr.canonicalTitle || attr.titles.en || 'Untitled';
        const category = attr.showType || 'Anime';
        const score = attr.averageRating ? (attr.averageRating / 10).toFixed(1) : 'N/A';
        const description = attr.synopsis ? attr.synopsis : 'No description available.';
        const imgUrl = attr.posterImage ? attr.posterImage.large : 'https://via.placeholder.com/300x400';

        const cardHtml = `
          <article class="card">
          <div class="card-image">
          <img src="${imgUrl}" alt="${title}" draggable="false">
          </div>
          <div class="card-content">
          <span class="card-category">${category} • ⭐ ${score}</span>
          <h3 class="card-title">${title}</h3>
          <p class="card-description">${description}</p>
          </div>
          </article>
          `;
        $track.append(cardHtml);
      });

      $track.prepend($track.children().last());
      updateCenterPosition();
      initCarouselEvents();
    })
    .catch(function (err) {
      console.error('Error Kitsu API:', err);
      $track.html('<p style="text-align:center; width:100%;">Gagal mengambil data dari Kitsu API.</p>');
    });
  }

  function getShiftDistance() {
    const $firstCard =$('.carousel-track .card').first();
    if (!$firstCard.length) return 0;
    return $firstCard[0].getBoundingClientRect().width + 16;
  }

  function getCenterOffset() {
    const shiftDistance = getShiftDistance();
    const $firstCard =$('.carousel-track .card').first();
    if (!$firstCard.length) return 0;

    const wrapperWidth = $('.carousel-wrapper').width() || 0;
    const singleCardWidth = $firstCard[0].getBoundingClientRect().width;
    const centerMargin = (wrapperWidth - singleCardWidth) / 2;
    return -(shiftDistance - centerMargin);
  }

  function updateCenterPosition() {
    const offset = getCenterOffset();
    $('.carousel-track').css('left', offset + 'px');
  }

  function moveNext() {
    if (isMoving) return;
    isMoving = true;
    const shiftDistance = getShiftDistance();

    $('.carousel-track').animate({ left: `-=${shiftDistance}px` }, 300, function () {
      $(this).append($(this).children().first());
      updateCenterPosition();
      isMoving = false;
    });
  }

  function movePrev() {
    if (isMoving) return;
    isMoving = true;
    const shiftDistance = getShiftDistance();
    const $track =$('.carousel-track');

    $track.animate({ left: `+=${shiftDistance}px` }, 300, function () {
      $track.prepend($track.children().last());
      updateCenterPosition();
      isMoving = false;
    });
  }

  function initCarouselEvents() {
    $('.next-btn').off('click').on('click', moveNext);$('.prev-btn').off('click').on('click', movePrev);
  }

  $(window).on('resize', function () {
    if (!isMoving) updateCenterPosition();
  });

  loadTopAnimeCarousel();
});
