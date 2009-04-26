xi.provide('xi.lang.Function', function(xi) {

	xi.using('xi.lang.Clone');
	xi.using('xi.lang.Array');
	xi.using('xi.lang.String');
	
	/**
	 * Function Class
	 * 
	 * @module xi.lang
	 * 
	 * @static
	 * @id Function
	 */ 
	xi.Function = {};
	
	/**
	 * Check whether object is a function
	 * 
	 * @id Function.is
	 */ 
	xi.Function.is = function is(fn) {
		
		return fn ? (xi.Function.getName(fn.constructor) == 'Function') : false;
	};
	
	/**
	 * Get function name
	 * 
	 * @id Function.getName
	 */ 
	xi.Function.getName = function getName(fn) {
		
		if(!fn) return '';
		
		if(fn.name) return fn.name;
		
		var match =  fn.toString().match(/function\s+([A-Z_a-z\$][\w\$]*)\(/);
		
		return match ? match[1] : '';
	};
	
	/**
	 * Get argument names
	 * 
	 * @id Function.getArgumentNames
	 */ 
	xi.Function.getArgumentNames = function getArgumentNames(fn) {
		
		var match = fn ? fn.toString().match(/function\s+[\w\$]\s*\(([^\)]*)\)/) : null;
		
		if(!match) return [];
		
		return xi.Array.map(match[1].split(','), function(each) {
			
			return xi.String.trim(each);
		});
	};
	
	/**
	 * Empty Function
	 * 
	 * @id Function.empty
	 */ 
	xi.Function.empty = function() {
		
	};
	
	/**
	 * Add module to Clone
	 * 
	 * @private
	 * @property
	 * 
	 * @id cloneModule
	 */ 
	xi.Clone.addModule({
		
		match: function match(object) {
			
			return xi.Function.is(object);
		},
		
		clone: function clone(object) {
			
			return object;
		}
	});
})