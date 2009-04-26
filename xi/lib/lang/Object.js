xi.provide('xi.lang.Object', function(xi) {
	
	xi.using('xi.lang.Clone');
	xi.using('xi.lang.Enum');
	
	/**
	 * Object Class
	 * 
	 * @module xi.lang
	 * 
	 * @static
	 * @id Object
	 */ 
	xi.Object = {};
	
	/**
	 * Check whether argument an object or not
	 * 
	 * @id Object.is
	 */ 
	xi.Object.is = function is(object) {
		
		return object ? (xi.Function.getName(object.constructor) == 'Object') : false;
	};
	
	/**
	 * Iterate through object. Property inherited will not iterated over.
	 * 
	 * @id Object.each
	 */ 
	xi.Object.each = function each(object, iter) {
		
		for(var i in object) {
			if(object.hasOwnProperty(i))
				iter(object[i], i);
		}
	};
	
	/**
	 * Map object
	 * 
	 * @id Object.map
	 */ 
	xi.Object.map = xi.Enum.map;
	
	/**
	 * Copy object
	 * 
	 * @id Object.copy
	 */ 
	xi.Object.copy = function copy(object) {
		
		return xi.extend({}, object);
	};
	
	/**
	 * Filter object by function
	 * 
	 * @id Object.filter
	 */ 
	xi.Object.filter = function filter(object, fn) {
		
		var filtered = {};
		
		xi.Object.each(object, function(value, key) {
			
			if(fn(value, key))
				fitered[key] = value;
		});
		
		return filtered;
	};
	
	/**
	 * Object module for Clone
	 * 
	 * @private
	 * @id cloneModule
	 */ 
	xi.Clone.addModule({
		
		match: function match(object) {
			
			return xi.Object.is(object);
		},
		
		clone: function clone(object) {
			
			return xi.Object.map(object, function(each) {
				
				return new xi.Clone(each);
			});
		}
	});
})