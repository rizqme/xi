(function() {

var vars = {
	scripts: {},
	modules: {},
	queue: [],
	temp: [],
	paths: {},
	processing: false,
	ready: false
};

vars.settings = {
		
	scriptTimeOut: 10000,
	debug: true,
	build: false
};

var xi = {
	
	version: '0.1.0',
	modules: {},
	
	setting: function(name, value) {
		
		if(arguments.length == 1) {
			
			if(typeof name == 'object')
				return xi.extend(vars.settings, name);
			else
				return vars.settings[name];
		}
		else {
			
			vars.settings[name] = value;
			return vars.settings[name];
		}
	},
	
	path: function(name, value) {
		
		if(arguments.length == 1) {
			
			if(typeof name == 'object')
				return xi.extend(vars.paths, name);
			else
				return vars.paths[name];
		}
		else {
			
			vars.paths[name] = value;
			return vars.paths[name];
		}
	},
	
	process: function(fn) {
		
		if(vars.processing)
			vars.temp.push(fn);
		else
			vars.queue = [fn].concat(vars.queue);
		
		if(vars.ready)
			xi.stateChange();
			
	},
	
	stateChange: function() {
		if(vars.processing) return;
		
		vars.processing = true;
		var que = [];
		
		for(var i=0; i<vars.queue.length; i++) {
			
			if(typeof vars.queue[i] != 'function')
				continue;
			
			try {
				
				if(vars.queue[i].require && !vars.modules[vars.queue[i].require]) {
					
					que.push(vars.queue[i]);
				}
				else if(!vars.queue[i].executed) {
					
					vars.queue[i]();
					vars.queue[i].executed = true;
				}
			}
			catch(e){
				
				if(e.retry) {
					vars.queue[i].require = e.retry;
					que.push(vars.queue[i]);
				}
				else
					throw e;
			}
		}
		
		vars.queue = vars.temp.concat(que);
		vars.processing = false;
		
		if(vars.temp.length) {
			
			vars.temp.length = 0;
			xi.stateChange();
		}
	},
	
	extend: function(target, source) {
		
		for(var i in source)
			target[i] = source[i];
		
		return target;
	},
	
	mixin: function() {
		
		var args = Array.prototype.slice.call(arguments);
		var target = args.shift();
		
		for(var i=0; i<args.length; i++)
			xi.extend(target, args[i]);
		
		return target;
	},
	
	namespace: function(string, modules) {
		
		var path = string.split('.');
		var pointer = modules || xi.modules;
		for(var i=0; i<path.length; i++) {
			
			if(typeof pointer[path[i]] != 'object')
				pointer[path[i]] = {};
			
			pointer = pointer[path[i]];
		}
	},
	
	load: function(uri, onload) {
		
		if(vars.scripts[uri] == 'failed')
			throw new Error("[xi] Script doesn't exist: " + uri);
		
		if(vars.scripts[uri])
			return;
		
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		
		var fn = function() {
			
			vars.scripts[uri] = 'completed';
			head.removeChild(script);
			
			if(typeof onload == 'function')
				onload();
		};
		
		script.src = uri;
		script.onreadystatechange = function(){if(this.readyState == 'complete') fn();};
		script.onload = fn;
		vars.scripts[uri] = 'loading';
		head.appendChild(script);
		
		setTimeout(function() {
			
			if(vars.scripts[uri] != 'completed')
			{
				vars.scripts[uri] = 'failed';
				xi.stateChange();
			}
		}
		, vars.settings.scriptTimeOut);
	},
	
	module: function(string) {
		
		var path = string.split('.');
		var pointer = xi.modules;
		
		for(var i=0; i<path.length; i++) {
			
			if(typeof pointer[path[i]] != 'object')
				return null;
			
			pointer = pointer[path[i]];
		}
		
		return pointer;
	},
	
	run: function(name, fn)	{
		
		var xii = new xi.Xi;
		
		if(!fn && typeof name == 'function') {
			
			fn = name;
			name = 'anonymousRun';
		}
		
		if(typeof fn != 'function')
			return xi.error('[xi] xi.run: fn has to be a function');
		
		fn.runID = name;
		
		var run = function () {
			fn(xii);
		};
		
		xi.process(run);
	},
	
	provide: function(name, fn) {
		
		var xii = new xi.Xi;
		
		if(typeof fn != 'function')
			return xi.error('[xi] xi.provide: fn has to be a function');
		else
			fn.runID = name;
		
		var split = name.split('.');
		
		var run = function() {
			
			fn(xii);
			
			var exported = {};
			var count = 0;
			var prop = '';
			
			for(var i in xii) {
				
				if(!xi.Xi.prototype[i] && xii[i] !== xii.imported[i]) {
					
					exported[i] = xii[i];
					prop = i;
					count++;
				}
			}
			
			if(count == 1 && prop == split[split.length-1] && prop.charAt(0) == prop.charAt(0).toUpperCase()) {
				
				split.pop();
				xi.namespace(split.join('.'));
				xi.module(split.join('.'))[prop] = exported[prop];
			}
			else {
				
				xi.namespace(name);
				xi.extend(xi.module(name), exported);
			}
			
			vars.modules[name] = true;
			
			if(vars.settings.debug)
				xi.debug.track(name);
		};
		
		xi.process(run);
	}
};

xi.debug = {
	
	logs: [],
	events: {},
	
	vars: vars,
	
	addEvent: function(event, fn) {
		
		if(!this.events[event])
			this.events[event] = [];
		
		for(var i=0; i<this.events[event].length; i++) {
			
			if(this.events[event][i] == fn)
				return;
		}
		
		this.events[event].push(fn);
	},
	
	removeEvent: function(event, fn)
	{
		if(!this.events[event])
			this.events[event] = [];
		
		var list = [];
		for(var i=0; i<this.events[event].length; i++) {
			
			if(this.events[event][i] != fn)
				list.push(this.events[event][i]);
		}
	},
	
	fireEvent: function(event, args) {
		
		if(!this.events[event])
			this.events[event] = [];
		
		for(var i=0; i<this.events[event].length; i++) {
			
			if(typeof this.events[event][i] == 'function')
				this.events[event][i].apply(null, args);
		}
	},
	
	log: function(message) {
		
		if(vars.settings.debug) {
			
			var object = {type:'log', message:message, caller:arguments.callee.caller};
			xi.debug.logs.push(object);
			xi.debug.fireEvent('log', [object]);
			xi.debug.fireEvent('push', [object]);
		}
	},
	
	info: function(message) {
		
		if(vars.settings.debug) {
			
			var object = {type:'info', message:message, caller:arguments.callee.caller};
			xi.debug.logs.push(object);
			xi.debug.fireEvent('info', [object]);
			xi.debug.fireEvent('push', [object]);
		}
	},
	
	error: function(message) {
		
		if(vars.settings.debug) {
			
			if(typeof message == 'object') {
				
				var stack = xi.debug.tracer(message);
				message = message.message;
			}
			else {
				
				var stack = xi.debug.tracer();
			}
			
			var object = {type:'error', message:message, stack:stack, caller:arguments.callee.caller};
			
			stack.shift();
			xi.debug.logs.push(object);
			xi.debug.fireEvent('error', [object]);
			xi.debug.fireEvent('push', [object]);
		}
	},
	
	warn: function(message) {
		
		if(vars.settings.debug) {
			
			var stack = xi.debug.tracer();
			var object = {type:'warning', message:message, stack:stack, caller:arguments.callee.caller};
			
			stack.shift();
			xi.debug.logs.push(object);
			xi.debug.fireEvent('warn', [object]);
			xi.debug.fireEvent('push', [object]);
		}
	},
	
	tracer: new function() {
	
		var mode;
	
		try {null.er} catch(e) {
		
			mode = e.stack ? 'Firefox': window.opera ? 'Opera' : 'Other';
		}
	
		switch(mode) {
		
			case 'Firefox': return function(error) {
			
				try {null.er} catch(e) {
					
					e = error || e;
					
					var lines = e.stack.split('\n');
					var stack = [];
				
					lines.shift();
				
					for(var i=0; i<lines.length; i++) {
					
						lines[i] = lines[i].match(/@(.+)\:(\d+)$/);
						if(lines[i])
							lines[i] = {file: lines[i][1], line: lines[i][2]};
					}
				
					var pointer = arguments.callee.caller;
					while(pointer && lines[0]) {
					
						lines[0].method = pointer;
						lines[0].id = pointer.runID || pointer.xID;
						stack.push(lines.shift());
					
						if(pointer.runID)
							break;
						else
							pointer = pointer.caller;
					}
				
					return stack;
				}
			}
		
			case 'Opera': return function() {
			
				try {null.er} catch(e) {
					
					e = error || e;
				
					var lines = e.message.split('\n');
					var stack = [];
				
					lines.shift();
				
					for(var i=0; i<lines.length; i++) {
					
						lines[i] = lines[i].match(/Line (\d+) of .* (.*): /);
						if(lines[i])
							lines[i] = {file: lines[i][2], line: lines[i][1]};
						else
							lines[i] = {};
					}
				
					var pointer = arguments.callee.caller;
					while(pointer && lines[0]) {
					
						lines[0].method = pointer;
						lines[0].id = pointer.runID || pointer.xID;
						stack.push(lines.shift());
					
						if(pointer.runID)
							break;
						else
							pointer = pointer.caller;
					}
				
					return stack;
				}
			}
		
			default: return function() {
			
				try {null.er} catch(e) {
					
					e = error || e;
				
					var pointer = arguments.callee.caller;
					var stack = [];
					while(pointer) {
					
						stack.push({method: pointer, id: pointer.runID || pointer.xID});
					
						if(pointer.runID)
							break;
						else
							pointer = pointer.caller;
					}
				
					return stack;
				}
			}
		}
	
	},
	
	track: function(mod) {
		
		var module = xi.module(mod);
		
		if(!module) return;
		
		for(var i in module) {
			
			if(!module.hasOwnProperty(i))
				continue;
			
			if(typeof module[i] == 'function' && !module[i].xID)
				module[i].xID = mod+'.'+i;
			
			if(module[i])
				xi.debug.track(mod+'.'+i);
		}
	}
};



xi.Xi = function() {
	
	this.imported = {};
};

xi.Xi.prototype = {
	
	xi: xi,
	version: xi.version,
	imported: true,
	
	modules: xi.modules,
	debug: xi.debug,
	
	extend: xi.extend,
	mixin: xi.mixin,
	namespace: xi.namespace,
	
	require: function(string) {
		
		if(vars.modules[string]) return;
		
		var path = string.split('.');
		var root = (path[0] == 'xi') ? path.shift() + '/lib' : (path[0] == 'app') ? path.shift() + '/lib' : 'lib';
		
		var uri = root + '/' + path.join('/') + '.js';
		
		if(vars.scripts[uri])
			return xi.debug.error("[xi] The module "  + string + " isn't provided by: " + uri);
		if(vars.scripts[uri] == 'failed')
			return xi.debug.error("[xi] Can't find module: " + string);
		
		xi.load(vars.paths[string] || uri);

		throw {retry: string};
	},
	
	using: function(string)	{
		
		var path = string.split('.');
		var name = path.pop();
		
		this.require(path.join('.') + (name == '*' ? '' : '.'+name));
		
		var module = xi.module(path.join('.'));
		if(!module) return xi.debug.error("[xi] Module doesn't exist: " + path.join('.'));
		
		var imported = {};
		if(name == '*')
			imported = module;
		else
			imported[name] = module[name];
		
		for(var i in imported) {
			
			if(xi.Xi.prototype[i])
				xi.debug.warning("[xi] 'using' unable to import '" + i + "': name reserved");
			else
				this.imported[i] = this[i] = imported[i];
		}
	}
};

var onload = window.onload;
window.onload = function() {
	
	xi.debug.info('[xi] xi framework version '+xi.version);
	vars.ready = true;
	xi.stateChange();
	
	if(onload)onload();
};

window.xi = xi;

})();