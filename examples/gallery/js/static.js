var app = new senna.App();

app.setBasePath('/examples/gallery');
app.addSurfaces('preview');
app.addRoutes(new senna.Route(/\w+\.html/, senna.HtmlScreen));

function navigateWithArrows(e) {
  var event = window.event ? window.event : e;
  if (event.keyCode === 37) {//left
    document.querySelector('a.arrow.left').click();
  } else if (event.keyCode === 39) { // right
    document.querySelector('a.arrow.right').click();
  } else if (event.keyCode === 38) {// up
    document.querySelector('a.arrow.left').click();
  } else if (event.keyCode === 40) {// down
    document.querySelector('a.arrow.right').click();
  }
}

/* I tried it but dosen't happen as I thought
   app.addListener('onkeydown', navigateWithArrows);
*/

document.onkeydown = navigateWithArrows;
