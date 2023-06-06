exports.install = function() {
	// Posts
	ROUTE('API     /api/            -posts_list           *Posts   --> list');
	ROUTE('API     /api/            -posts_read/{id}      *Posts   --> read');
	ROUTE('API     /api/            +posts_insert         *Posts   --> insert');
	ROUTE('API     /api/            -posts_remove/{id}    *Posts   --> remove');
	ROUTE('API     /api/            +posts_update/{id}    *Posts   --> update');

};
