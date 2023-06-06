exports.icon = 'ti ti-book-open';
exports.name = '@(Posts)';
exports.position = 2;
exports.visible = 1;
exports.group = '@(Configuration)';

exports.install = function() {
	ROUTE('API    /admin/api/    -posts    *Posts   --> list');
};