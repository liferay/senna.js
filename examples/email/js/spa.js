var app = new senna.App();

app.setBasePath('/examples/email');
app.addSurfaces(['list', 'main']);
app.addRoutes(new senna.Route(/\w+\.html/, senna.HtmlScreen));
