var app = new senna.App();

app.setBasePath('/examples/gallery');
app.addSurfaces('preview');
app.addRoutes(new senna.Route(/\w+\.html/, senna.HtmlScreen));
