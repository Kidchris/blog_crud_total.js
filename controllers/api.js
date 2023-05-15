exports.install = function() {
	// Posts
	ROUTE('API     /api/                     -posts_list           *Posts   --> list');
	ROUTE('API     /api/                     -posts_read/{id}      *Posts   --> read');
	ROUTE('API     /api/                     -posts_remove/{id}    *Posts   --> remove');
	ROUTE('POST    /api/posts_insert                               *Posts   --> insert', ['upload'], 1024 * 10);
	ROUTE('PUT     /api/posts_update/{id}                          *Posts   --> update', ['upload'], 1024 * 10);
};