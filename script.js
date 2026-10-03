$(document).ready(function () {
  const API_BASE_URL = 'https://api.jikan.moe/v4';

  let isMoving = false;
  let currentTranslate = 0;

  function loadTopAnimeCarousel() {
    const $track = $('.carousel-track');$track.html('<p style="text-align:center; width:100%;">Memuat Top Anime...</p>');

    $.ajax({
      url: `${API_BASE_URL}/top/anime?limit=10`,
      method: 'GET'
    })
    .then(function (response) {
      const animeList = response.data;
      $track.empty();

      animeList.forEach(function (anime) {
        const category = anime.type || 'Anime';
        const description = anime.synopsis ? anime.synopsis : 'No description available.';

        const cardHtml = `
          <article class="card">
          <div class="card-image">
          <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" draggable="false">
          </div>
          <div class="card-content">
          <span class="card-category">${category} • ⭐ ${anime.score || 'N/A'}</span>
          <h3 class="card-title">${anime.title}</h3>
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
      console.error('Error Jikan API:', err);
      $track.html('<p style="text-align:center; width:100%;">Gagal memuat carousel dari Jikan API.</p>');
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
    currentTranslate = offset;
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

  // Jalankan Carousel di Home
  loadTopAnimeCarousel();
});
