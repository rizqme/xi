xi.provide('xi.lang.Clone', function(xi) {
	
	/**
	 * Clone Class
	 * 
	 * @module xi.lang
	 * 
	 * @constructor
	 * @id Clone
	 */ 
	xi.Clone = function Clone(object) {
		
		if(object == null)
			return object;
		
		for(var i=0; i<modules.length; i++) {
			
			if(modules[i].match(object))
				return modules[i].clone(object);
		}
		
		return object;
	};
	
	/**
	 * Clone modules
	 * 
	 * @private
	 * @property
	 * 
	 * @id modules
	 */ 
	var modules = [];
	
	/**
	 * Add Clone module
	 * 
	 * @id Clone.addModule
	 */ 
	xi.Clone.addModule = function addModule(module) {
		
		if(typeof module.match != 'function' || typeof module.clone != 'function') {
			
			xi.debug.error("[xi] Clone can't add module: clone and match have to be a function");
			return;
		}
		
		for(var i=0; i<modules.length; i++) {
			
			if(modules[i] == module)
				return;
		}
		
		modules.push(module);
	};
	
	/**
	 * Remove Clone module
	 * 
	 * @id Clone.removeModule
	 */ 
	xi.Clone.removeModule = function removeModule(module) {
		
		var result = [];
		
		for(var i=0; i<modules.length; i++) {
			
			if(modules[i] != module)
				result.push(modules[i]);
		}
		
		modules = result;
	};
})