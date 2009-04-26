xi.provide('xi.lang.Class', function(xi) {
	
	xi.using('xi.lang.Clone');
	xi.using('xi.lang.Array');
	xi.using('xi.lang.Function');
	
	/**
	 * Class Class
	 * 
	 * @module xi.lang
	 * 
	 * @constructor
	 * @id Class
	 */ 
	xi.Class = function Class() {
		
		var args = xi.Array.pure(arguments);
		var proto = args.pop();
		
		var name = xi.Function.is(proto.initialize) ? xi.Function.getName(proto.initialize) : '';
		
		var properties = {};
		var methods = {};
		
		proto = xi.mixin.apply(null, [{}].concat(args).concat([proto]));
		
		for(var i in proto) {
			
			if(xi.Function.is(proto[i]))
				methods[i] = proto[i];
			else
				properties[i] = proto[i];
		}
		
		// derived form makeClass (c) John Resig
		var clazz = function(args) {
			
			if (this instanceof clazz) {
				
				xi.extend(this, new xi.Clone(clazz.properties));
				
				if(typeof this.initialize == 'function')
					this.initialize.apply(this, (args && args.callee == clazz) ? args : arguments);
			}
			
			else {
				
				return new clazz(args);
			}
		};
		
		clazz.prototype = methods;
		clazz.properties = properties;
		clazz.className = name;
		clazz.implementations = args;
		clazz.constructor = xi.Class;
		xi.extend(clazz, xi.Class.prototype);
	};
	
	/**
	 * Get class-name of a class
	 * 
	 * @id Class.getClassName
	 */ 
	xi.Class.getClassName = function(clazz) {
		
		return clazz ? (clazz.className || xi.Function.getName(clazz)) : '';
	};
	
	/**
	 * Class prototype
	 * 
	 * @prototype
	 * @id Class.prototype
	 */ 
	xi.Class.prototype = {
		
		/**
		 * Subclass Class
		 * 
		 * @id Class.prototype.extend
		 */ 
		extend: function() {
			
			var args = xi.Array.pure(arguments);
			var proto = args.pop();
			var imps = xi.Array.uniq(this.implementations.concat(args).reverse()).reverse();
			
			for(var i in proto) {
				
				if(this.prototype[i] && xi.Function.is(proto[i]) && this.prototype[i] != proto[i])
					proto[i].superMethod = this.prototype[i];
					
				else if(this.properties[i]) {
					
					if(xi.Array.is(this.properties[i]) && xi.Array.is(proto[i]))
						proto[i] = this.properties[i].concat(proto[i]);
					else if(typeof this.properties[i] == 'object' && typeof proto[i] == 'object')
						proto[i] = xi.mixin({}, this.properties[i], proto[i]);
				}
			}
			
			var clazz = xi.Clazz.apply(null, xi.Array.include(imps, proto));
			
			clazz.superclass = this;
			clazz.prototype.execSuper = function() {
				
				if(arguments.callee.caller && arguments.callee.caller.superMethod)
					return arguments.callee.caller.superMethod.apply(this, arguments);
			};
			
			return clazz;
		}
	}
})