var cacheName = 'Numbers v1.00';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',
  '/scenes/nonoOptions.js',

  '/scenes/UI.js',

  '/scenes/games/fuseTen.js',
  '/scenes/games/gridPlus.js',
  '/scenes/games/mineSweeper.js',
  '/scenes/games/nonogram.js',
  '/scenes/games/play2048.js',
  '/scenes/games/plusPlus.js',
  '/scenes/games/Ten.js',
  '/scenes/games/tenPair.js',
  '/scenes/games/twoFourEight.js',
  '/scenes/games/zNumbers.js',
  '/scenes/games/slide.js',
  '/scenes/games/othello.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',
  '/assets/fonts/lato.tff',
  '/assets/fonts/lato.xml',

  '/classes/hexlib-shapes.js',
  '/classes/hexlib.js',
  '/classes/settings.js',
  '/classes/toast.js',
  '/classes/board.js',
  '/classes/dot.js',

  '/assets/particle.png',
  '/assets/particles.png',


  '/assets/sprites/2048_tiles_dark.png',
  '/assets/sprites/arrows.png',
  '/assets/sprites/bar.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/button.png',
  '/assets/sprites/circle.png',
  '/assets/sprites/emoji.png',
  '/assets/sprites/fusehex.png',
  '/assets/sprites/fusehex2.png',
  '/assets/sprites/gems.png',
  '/assets/sprites/icons.png',
  '/assets/sprites/ms.png',
  '/assets/sprites/nonogram.png',
  '/assets/sprites/outline_tile.png',
  '/assets/sprites/Plus.png',
  '/assets/sprites/restart.png',
  '/assets/sprites/tile.png',
  '/assets/sprites/tiles.png',
  '/assets/sprites/rover.png',
  '/assets/sprites/pieces.png',
  '/assets/sprites/board.png',

  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});