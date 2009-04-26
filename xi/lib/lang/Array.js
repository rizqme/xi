xi.provide('xi.lang.Array', function(xi) {
	
	xi.using('xi.lang.Clone');
	xi.using('xi.lang.Enum');
	
	/**
	 * Extended Array Class
	 * 
	 * @module xi.lang
	 * 
	 * @constructor
	 * @id Array
	 */ 
	xi.Array = function Array() {
		
		var array = xi.Array.pure(arguments);
		array.constructor = xi.Array;
		
		xi.extend(array, xi.Array.prototype);
		return array;
	};
	
	/**
	 * Convert array or array-like to extended array
	 * 
	 * @id Array.to
	 */ 
	xi.Array.to = function to(array) {
		
		if(array.constructor == xi.Array)
			return array;
		else
			return xi.Array.apply(null, array);
	};
	
	/**
	 * Convert array-like to normal array
	 * 
	 * @id Array.pure
	 */ 
	xi.Array.pure = function pure(like) {
		
		return Array.prototype.slice.call(like);
	};
	
	/**
	 * Check whether it is array or not
	 * 
	 * @id Array.is
	 */ 
	xi.Array.is = function is(array) {
		
		return array ? (xi.Function.getName(array.constructor) == 'Array') : false;
	};
	
	
	/**
	 * Each iterator
	 * 
	 * @id Array.each
	 */ 
	xi.Array.each = function each(array, iter) {
		
		for(var i=0; i<array.length; i++)
			iter(array[i], i);
		
		return array;
	};
	
	/**
	 * Map Array
	 * 
	 * @id Array.map
	 */ 
	xi.Array.map = xi.Enum.map;
	
	/**
	 * Get index of an item
	 * 
	 * @id Array.indexOf
	 */ 
	xi.Array.indexOf = function indexOf(array, item) {
		
		if(array.indexOf)
			return array.indexOf(item);
		
		for(var i=0; i<array.length; i++) {
			
			if(array[i] === item)
				return i;
		}
		
		return -1;
	};
	
	/**
	 * Check whether array contains item
	 * 
	 * @id Array.contain
	 */ 
	xi.Array.contain = function contain(array, item) {
		
		return xi.Array.indexOf(array, item) > -1;
	};
	
	/**
	 * Extend array with other array
	 * 
	 * @id Array.extend
	 */ 
	xi.Array.extend = function extend(array, other) {
		
		for(var i=0; i<other.length; i++)
			array.push(other[i]);
		
		return array;
	};
	
	/**
	 * Include item if isn't already included
	 * 
	 * @id Array.include
	 */ 
	xi.Array.include = function include(array, item) {
		
		var index = xi.Array.indexOf(array, item);
		if(index < 0)
			array.push(item);
		return array;
	};
	
	/**
	 * Exclude item
	 * 
	 * @id Array.exclude
	 */ 
	xi.Array.exclude = function exclude(array, item) {
		
		var index = xi.Array.indexOf(array, item);
		if(index > -1)
			array.splice(index, 1);
		return array;
	};
	
	/**
	 * Remove duplicates
	 * 
	 * @id Array.uniq
	 */ 
	xi.Array.uniq = function uniq(array) {
		
		var result = [];
		
		for(var i=0; i<array.length; i++)
			xi.Array.include(result, array[i]);
		
		return result;
	};
	
	/**
	 * Array Clone Module
	 * 
	 * @private
	 * @property
	 * 
	 * @id cloneModule
	 */ 
	
	xi.Clone.addModule({
		
		match: function match(object) {
			
			return xi.Array.is(object);
		},
		
		clone: function clone(object) {
			
			return xi.Array.map(object, function(each) {
				
				return new Clone(each);
			});
		}
	});
})