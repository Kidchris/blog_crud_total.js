var tbl = 'nosql/posts';

NEWSCHEMA('Posts', function(schema) {

	schema.action('list', {
		name: 'List',
		action: function($) {

			DB().list(tbl).autoquery($.query, 'id,title,excerpt,content,photo,dtcreated,dtupdated', 'dtcreated_desc', 100).where('isremoved', false).callback($.callback);
		}
	});

	schema.action('read', {
		name: 'Read',
		params: '*id:UID',
		action: function($) {

			var params = $.params;
			var db = DB();
			var item = db.read(tbl).fields('id,title,excerpt,content,photo,dtcreated').id(params.id).where('isremoved', false).error(404).callback($);

			$.callback(item);

		}
	});

		schema.action('insert', {
		name: 'Insert',
		action: function($, model) {

			model.id =  UID();
			model.dtcreated = NOW;
			model.isremoved = false;

			var db = DB();
			db.insert(tbl, model).callback($);

			$.success(model.id);

		}
	});


	schema.action('update', {
		name: 'Update',
		params: '*id:UID',
		action: function($, model) {

			var params = $.params;
			model.dtupdated = NOW;

			var db = DB();
			db.modify(tbl, model).id(params.id).where('isremoved', false).error(404).callback($);

			$.success();
		}
	});

	schema.action('remove', {
		name: 'Remove',
		params: '*id:UID',
		action: function($) {

			var params = $.params;

			var db = DB();
			db.modify(tbl, { isremoved: true, dtupdated: NOW }).id(params.id).where('isremoved', false).error(404).callback($);

			$.success(params.id);
		}
	});

});