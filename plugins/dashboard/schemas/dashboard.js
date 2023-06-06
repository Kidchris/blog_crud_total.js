var tbl = 'nosql/dashboard';
NEWSCHEMA('Dashboard', function(schema) {

	schema.action('list', {
		name: 'List',
		action: function($) {

			DB().list(tbl).autoquery($.query, 'id:uid,dtcreated:date,dtupdated:date', null, 'dtcreated_desc', 100).where('isremoved', false).callback($.callback);
		}
	});

	schema.action('stats', {
		name: 'Statistics',
		action: function($) {
		console.log($);
		}
	});



});