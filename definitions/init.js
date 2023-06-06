exports.install = function() {

	ROUTE('GET    /admin/', admin);

};

MAIN.plugins = [];
function admin() {
	this.plain(F.plugins);

}