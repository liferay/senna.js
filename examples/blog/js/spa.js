'use strict';

/* ==========================================================================
   Creates a new Senna app
   ========================================================================== */

var app = new senna.App();

app.setBasePath('/examples/blog');
app.addSurfaces('posts');
app.addRoutes(new senna.Route(/\w+\.html/, senna.HtmlScreen));
app.dispatch();

/* ==========================================================================
   Creates loading feedback HTML element
   ========================================================================== */

var loadingFeedback = document.createElement('div');

loadingFeedback.innerHTML = 'Loading more posts...';
loadingFeedback.classList.add('loading');

/* ==========================================================================
   Locks scroll position during navigation
   ========================================================================== */

var isLoading = false;
var scrollSensitivity = 0;

app.on('startNavigate', function(event) {
  isLoading = true;
  scrollSensitivity = 0;

  if (!event.replaceHistory) {
    app.setUpdateScrollPosition(false);
  }
});

app.on('endNavigate', function() {
  isLoading = false;

  app.setUpdateScrollPosition(true);
});

/* ==========================================================================
   Infinite scrolling logic
   ========================================================================== */

document.addEventListener('scroll', function() {
  scrollSensitivity++;

  if (isLoading || scrollSensitivity < 5) {
    return;
  }

  console.log(window.pageYOffset);
  console.log(getScrollTopOffset());

  if (window.pageYOffset > getScrollTopOffset()) {
    debouncedNextPageLoader();
  }
});

var debouncedNextPageLoader = senna.debounce(loadNextPage, 100);

function loadNextPage() {
  if (!app.pendingNavigate && window.nextPage) {
    document.querySelector('#posts').appendChild(loadingFeedback);

    // Goes to the next page using senna.App
    app.navigate(window.nextPage);
  }
}

function getScrollTopOffset() {
  return document.body.offsetHeight - window.innerHeight - 200;
}
