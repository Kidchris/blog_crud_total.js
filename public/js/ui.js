// Component: j-Approve
// Version: 1
// Updated: 2023-01-23 09:15
COMPONENT('approve', 'cancel:Cancel', function(self, config, cls) {

	var cls2 = '.' + cls;
	var events = {};
	var buttons;
	var oldcancel;

	self.readonly();
	self.singleton();
	self.nocompile && self.nocompile();

	self.make = function() {

		self.aclass(cls + ' hidden');
		self.html('<div><div class="{0}-body"><span class="{0}-close"><i class="ti ti-times"></i></span><div class="{0}-content"></div><div class="{0}-buttons"><button data-index="0"></button><button data-index="1"></button></div></div></div>'.format(cls));

		buttons = self.find(cls2 + '-buttons').find('button');

		self.event('click', 'button', function() {
			self.hide(+$(this).attrd('index'));
		});

		self.event('click', cls2 + '-close', function() {
			self.callback = null;
			self.hide(-1);
		});

		self.event('click', function(e) {
			var t = e.target.tagName;
			if (t !== 'DIV')
				return;
			var el = self.find(cls2 + '-body');
			el.aclass(cls + '-click');
			setTimeout(function() {
				el.rclass(cls + '-click');
			}, 300);
		});
	};

	events.keydown = function(e) {
		var index = e.which === 13 ? 0 : e.which === 27 ? 1 : null;
		if (index != null) {
			self.find('button[data-index="{0}"]'.format(index)).trigger('click');
			e.preventDefault();
			e.stopPropagation();
			events.unbind();
		}
	};

	events.bind = function() {
		$(W).on('keydown', events.keydown);
	};

	events.unbind = function() {
		$(W).off('keydown', events.keydown);
	};

	self.show = function(message, a, b, fn) {

		clearTimeout2(self.id);

		if (typeof(b) === 'function') {
			fn = b;
			b = config.cancel;
		}

		if (M.scope)
			self.currscope = M.scope();

		self.callback = fn;

		var icon = a.match(/"[a-z0-9-\s]+"/);
		if (icon) {

			var tmp = icon + '';
			if (tmp.indexOf(' ') == -1)
				tmp = 'ti ti-' + tmp;

			a = a.replace(icon, '').trim();
			icon = '<i class="{0}"></i>'.format(tmp.replace(/"/g, ''));
		} else
			icon = '';

		var color = a.match(/#[0-9a-f]+/i);
		if (color)
			a = a.replace(color, '').trim();

		buttons.eq(0).css('background-color', color || '').html(icon + a);

		if (oldcancel !== b) {
			oldcancel = b;
			buttons.eq(1).html(b);
		}

		self.find(cls2 + '-content').html(message.replace(/\n/g, '<br />'));
		$('html').aclass(cls + '-noscroll');
		self.rclass('hidden');
		events.bind();
		self.aclass(cls + '-visible', 5);
		document.activeElement && document.activeElement.blur();
	};

	self.hide = function(index) {

		if (!index) {
			self.currscope && M.scope(self.currscope);
			self.callback && self.callback(index);
		}

		self.rclass(cls + '-visible');
		events.unbind();

		setTimeout2(self.id, function() {
			$('html').rclass(cls + '-noscroll');
			self.aclass('hidden');
		}, 50);
	};
});
// End: j-Approve

// Component: j-Button
// Version: 1
// Updated: 2023-01-23 10:22
COMPONENT('button', 'delay:100;icon:ti ti-home;flags:visible;validation:1;name:submit;size:normal', function(self, config, cls) {

	var ihtml, old, track;
	var flags = null;
	var tracked = false;
	var ready = false;

	self.readonly();

	self.make = function() {
		self.aclass(cls);
		ihtml = self.dom.innerHTML;

		self.event('click', 'button', function() {
			var t = this;
			if (config.exec && (!config.ddos || !BLOCKED(self.ID, config.ddos)))
				self.EXEC(config.exec, $(t), self.path);
		});

		self.redraw();
	};

	self.configure = function(key, value) {
		switch (key) {
			case 'flags':
				if (value) {
					flags = value.split(',');
					for (var i = 0; i < flags.length; i++)
						flags[i] = '@' + flags[i];
				} else
					flags = null;
				break;
			case 'track':
				track = value.split(',').trim();
				break;
			case 'disabled':
				self.button && self.button.prop('disabled', !!value);
				break;
			case 'icon':
				if (self.button) {
					var i = self.find('i').rclass2('ti');
					if (value)
						i.aclass(self.faicon(value)).rclass('hidden');
					else
						i.aclass('hidden');
				}
				break;
			case 'size':
				ready && self.rclass2(cls + '-');
				self.aclass(cls + '-' + value);
				break;
		}
	};

	var settracked = function() {
		tracked = 0;
	};

	self.redraw = function() {
		var html = '<i class="{0}"></i>'.format(config.icon ? (self.faicon(config.icon) + (config.color ? (' ' + config.color) : '')) : 'hidden') + ihtml;
		self.html('<button' + (config.disabled || (self.path && config.validation) ? ' disabled' : '') + (config.name ? (' name="' + config.name + '"') : '') + '>' + html + '</button>');
		self.button = self.find('button');
		if (ready) {
			if (config.validation && self.path)
				self.check();
		} else
			ready = false;
		self.rclass('hidden invisible', 100);
	};

	self.setter = function(value, path, type) {

		if (!config.validation || !path)
			return;

		if ((type === 1 || type === 2) && track && track.length) {
			for (var i = 0; i < track.length; i++) {
				if (path.indexOf(track[i]) !== -1) {
					tracked = 1;
					return;
				}
			}
			if (tracked === 1) {
				tracked = 2;
				setTimeout(settracked, config.delay * 3);
			}
		}
	};

	var check = function() {
		var path = self.path.replace(/\.\*$/, '');
		var disabled = tracked || config.validonly ? !VALID(path, flags) : DISABLED(path, flags);
		if (!disabled && config.if)
			disabled = !EVALUATE(path, config.if);

		if (disabled !== old && self.button) {
			self.button.prop('disabled', disabled);
			old = disabled;
		}
	};

	self.state = function(type, what) {
		if (config.validation && self.path) {
			if (type === 3 || what === 3)
				tracked = 0;
			setTimeout2(self.ID, check, config.delay);
		}
	};

});
// End: j-Button