'use strict';

/* ==========================================================================
   Creates a new Senna app
   ========================================================================== */

var app = new senna.App();

app.addSurfaces('preview');
app.addRoutes(new senna.Route(/\w+\.jpg/, ImageLoaderScreen));
app.addRoutes(new senna.Route('/examples/gallery/dynamic.html', senna.HtmlScreen));

/* Stores the value of the next image path during navigation
   ========================================================================== */

var nextImage;

app.on('startNavigate', function(event) {
  nextImage = event.path;
});

/* ==========================================================================
   Extends Senna's default Screen
   ========================================================================== */

function ImageLoaderScreen() {
  ImageLoaderScreen.base(this, 'constructor');
}

senna.inherits(ImageLoaderScreen, senna.Screen);

ImageLoaderScreen.prototype.cached = true;
ImageLoaderScreen.prototype.getSurfaceContent = function(surfaceId) {
  if (surfaceId === 'preview') {
    switch(nextImage) {
      case '/examples/gallery/img/01.jpg':
        return getContent('08', '01', '02');
      case '/examples/gallery/img/02.jpg':
        return getContent('01', '02', '03');
      case '/examples/gallery/img/03.jpg':
        return getContent('02', '03', '04');
      case '/examples/gallery/img/04.jpg':
        return getContent('03', '04', '05');
      case '/examples/gallery/img/05.jpg':
        return getContent('04', '05', '06');
      case '/examples/gallery/img/06.jpg':
        return getContent('05', '06', '07');
      case '/examples/gallery/img/07.jpg':
        return getContent('06', '07', '08');
      case '/examples/gallery/img/08.jpg':
        return getContent('07', '08', '01');
    }
  }
};

/* Returns a fragment with the new image and its previous/next links
   ========================================================================== */

function getContent(previous, index, next) {
  return '<div class="visible">' +
            '<div class="overlay"></div>' +
            '<span class="canvas">' +
              '<a href="/examples/gallery/dynamic.html">' +
                '<img class="pure-img" src="/examples/gallery/img/' + index + '.jpg" alt="">' +
              '</a>' +
              '<a class="arrow left" href="/examples/gallery/img/' + previous + '.jpg">&#10096;</a>' +
              '<a class="arrow right" href="/examples/gallery/img/' + next + '.jpg">&#10097;</a>' +
            '</span>' +
          '</div>';
}
