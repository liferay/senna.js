document.addEventListener("DOMContentLoaded", function(event) {
  var app = new senna.App();

  app.setBasePath('/examples/email');
  app.addSurfaces(['list', 'main']);
  app.addRoutes([
    {
      path: /\w+\.html/,
      screen: senna.HtmlScreen
    }
  ]);
});
