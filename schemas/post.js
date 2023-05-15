var tbl = 'nosql/posts';

NEWSCHEMA('Posts', function(schema) {

	schema.action('list', {
		name: 'List',
		action: function($) {

			DB().list(tbl).autoquery($.query, 'id,title,excerpt,content,photo,dtcreated,dtupdated', null, 'dtcreated_desc', 100).where('isremoved', false).callback($.callback);
		}
	});

	schema.action('read', {
		name: 'Read',
		params: '*id:UID',
		action: async function($) {

			var params = $.params;
			var db = DB();
			var item = await db.read(tbl).fields('id,title,excerpt,content,photo,dtcreated').id(params.id).where('isremoved', false).error(404).promise($);

			$.callback(item);

		}
	});

	schema.action('insert', {
		name: 'Insert',
		action: async function($, model) {

			var id = UID();
			var photo = $.files[0];
			model.id = id;
			model.dtcreated = NOW;
			model.isremoved = false;
			model.photo = '/img/' +photo.filename;

			await F.Fs.readFile(photo.path, function(err, content) {
					if (err) {
						$.invalid(err);
						return;
					}
				F.Fs.writeFile(PATH.public('/img/' +photo.filename), content, function() {
					$.success();
				});
			});

			var db = DB();
			await db.insert(tbl, model).promise($);

			$.success(model.id);

		}
	});

	schema.action('update', {
		name: 'Update',
		params: '*id:UID',
		action: async function($, model) {

			var params = $.params;
			var photo = $.files[0];
			model.dtupdated = NOW;
			model.isremoved = true;
			var post  = await DB().read(tbl).id(params.id).where('isremoved', false).promise($);

			if(photo.filename){

				await PATH.unlink([post.photo]);
				model.photo = await '/img/' +photo.filename;

				if(photo.isImage()){
					await F.Fs.readFile(photo.path, function(err, content) {
						if (err) {
							$.invalid(err);
							return;
						}
						F.Fs.writeFile(PATH.public('/img/' +photo.filename), content, function() {
							$.success();
						});
					});
				}
			}

			var db = DB();
			await db.modify(tbl, model).id(params.id).where('isremoved', false).error(404).promise($);

			$.success(params.id);
		}
	});

	schema.action('remove', {
		name: 'Remove',
		params: '*id:UID',
		action: async function($) {

			var params = $.params;
			// Uncomment in case you want to remove the file from public path
			// var post  = await DB().read(tbl).id(params.id).where('isremoved', false).promise($);
			// await PATH.unlink(post.photo);

			var db = DB();
			await db.modify(tbl, { isremoved: true, dtupdated: NOW }).id(params.id).where('isremoved', false).error(404).promise($);

			$.success(params.id);
		}
	});

});