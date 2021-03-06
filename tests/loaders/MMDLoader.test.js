var Three = (function (exports) {
	'use strict';

	var FrontSide = 0;
	var BackSide = 1;
	var DoubleSide = 2;
	var FlatShading = 1;
	var NoColors = 0;
	var FaceColors = 1;
	var VertexColors = 2;
	var NoBlending = 0;
	var NormalBlending = 1;
	var AdditiveBlending = 2;
	var SubtractiveBlending = 3;
	var MultiplyBlending = 4;
	var CustomBlending = 5;
	var AddEquation = 100;
	var SrcAlphaFactor = 204;
	var OneMinusSrcAlphaFactor = 205;
	var DstAlphaFactor = 206;
	var LessEqualDepth = 3;
	var MultiplyOperation = 0;
	var AddOperation = 2;
	var UVMapping = 300;
	var SphericalReflectionMapping = 305;
	var RepeatWrapping = 1000;
	var ClampToEdgeWrapping = 1001;
	var MirroredRepeatWrapping = 1002;
	var LinearFilter = 1006;
	var LinearMipMapLinearFilter = 1008;
	var UnsignedByteType = 1009;
	var RGBFormat = 1022;
	var RGBAFormat = 1023;
	var LoopOnce = 2200;
	var LoopRepeat = 2201;
	var LoopPingPong = 2202;
	var InterpolateDiscrete = 2300;
	var InterpolateLinear = 2301;
	var InterpolateSmooth = 2302;
	var ZeroCurvatureEnding = 2400;
	var ZeroSlopeEnding = 2401;
	var WrapAroundEnding = 2402;
	var TrianglesDrawMode = 0;
	var LinearEncoding = 3000;

	var _Math = {

		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,

		generateUUID: ( function () {

			// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

			var lut = [];

			for ( var i = 0; i < 256; i ++ ) {

				lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 ).toUpperCase();

			}

			return function generateUUID() {

				var d0 = Math.random() * 0xffffffff | 0;
				var d1 = Math.random() * 0xffffffff | 0;
				var d2 = Math.random() * 0xffffffff | 0;
				var d3 = Math.random() * 0xffffffff | 0;
				return lut[ d0 & 0xff ] + lut[ d0 >> 8 & 0xff ] + lut[ d0 >> 16 & 0xff ] + lut[ d0 >> 24 & 0xff ] + '-' +
					lut[ d1 & 0xff ] + lut[ d1 >> 8 & 0xff ] + '-' + lut[ d1 >> 16 & 0x0f | 0x40 ] + lut[ d1 >> 24 & 0xff ] + '-' +
					lut[ d2 & 0x3f | 0x80 ] + lut[ d2 >> 8 & 0xff ] + '-' + lut[ d2 >> 16 & 0xff ] + lut[ d2 >> 24 & 0xff ] +
					lut[ d3 & 0xff ] + lut[ d3 >> 8 & 0xff ] + lut[ d3 >> 16 & 0xff ] + lut[ d3 >> 24 & 0xff ];

			};

		} )(),

		clamp: function ( value, min, max ) {

			return Math.max( min, Math.min( max, value ) );

		},

		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation

		euclideanModulo: function ( n, m ) {

			return ( ( n % m ) + m ) % m;

		},

		// Linear mapping from range <a1, a2> to range <b1, b2>

		mapLinear: function ( x, a1, a2, b1, b2 ) {

			return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

		},

		// https://en.wikipedia.org/wiki/Linear_interpolation

		lerp: function ( x, y, t ) {

			return ( 1 - t ) * x + t * y;

		},

		// http://en.wikipedia.org/wiki/Smoothstep

		smoothstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * ( 3 - 2 * x );

		},

		smootherstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

		},

		// Random integer from <low, high> interval

		randInt: function ( low, high ) {

			return low + Math.floor( Math.random() * ( high - low + 1 ) );

		},

		// Random float from <low, high> interval

		randFloat: function ( low, high ) {

			return low + Math.random() * ( high - low );

		},

		// Random float from <-range/2, range/2> interval

		randFloatSpread: function ( range ) {

			return range * ( 0.5 - Math.random() );

		},

		degToRad: function ( degrees ) {

			return degrees * _Math.DEG2RAD;

		},

		radToDeg: function ( radians ) {

			return radians * _Math.RAD2DEG;

		},

		isPowerOfTwo: function ( value ) {

			return ( value & ( value - 1 ) ) === 0 && value !== 0;

		},

		ceilPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );

		},

		floorPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );

		}

	};

	function Vector2( x, y ) {

		this.x = x || 0;
		this.y = y || 0;

	}

	Object.defineProperties( Vector2.prototype, {

		"width": {

			get: function () {

				return this.x;

			},

			set: function ( value ) {

				this.x = value;

			}

		},

		"height": {

			get: function () {

				return this.y;

			},

			set: function ( value ) {

				this.y = value;

			}

		}

	} );

	Object.assign( Vector2.prototype, {

		isVector2: true,

		set: function ( x, y ) {

			this.x = x;
			this.y = y;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		},

		multiply: function ( v ) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;

			return this;

		},

		divide: function ( v ) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		applyMatrix3: function ( m ) {

			var x = this.x, y = this.y;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

			return this;

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );

			return this;

		},

		clampScalar: function () {

			var min = new Vector2();
			var max = new Vector2();

			return function clampScalar( minVal, maxVal ) {

				min.set( minVal, minVal );
				max.set( maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		angle: function () {

			// computes the angle in radians with respect to the positive x-axis

			var angle = Math.atan2( this.y, this.x );

			if ( angle < 0 ) angle += 2 * Math.PI;

			return angle;

		},

		distanceTo: function ( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		},

		distanceToSquared: function ( v ) {

			var dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		},

		manhattanDistanceTo: function ( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'Vector2: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );

			return this;

		},

		rotateAround: function ( center, angle ) {

			var c = Math.cos( angle ), s = Math.sin( angle );

			var x = this.x - center.x;
			var y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

	} );

	var Cache = {

		enabled: false,

		files: {},

		add: function ( key, file ) {

			if ( this.enabled === false ) return;

			// console.log( 'Cache', 'Adding key:', key );

			this.files[ key ] = file;

		},

		get: function ( key ) {

			if ( this.enabled === false ) return;

			// console.log( 'Cache', 'Checking key:', key );

			return this.files[ key ];

		},

		remove: function ( key ) {

			delete this.files[ key ];

		},

		clear: function () {

			this.files = {};

		}

	};

	function LoadingManager( onLoad, onProgress, onError ) {

		var scope = this;

		var isLoading = false;
		var itemsLoaded = 0;
		var itemsTotal = 0;
		var urlModifier = undefined;

		this.onStart = undefined;
		this.onLoad = onLoad;
		this.onProgress = onProgress;
		this.onError = onError;

		this.itemStart = function ( url ) {

			itemsTotal ++;

			if ( isLoading === false ) {

				if ( scope.onStart !== undefined ) {

					scope.onStart( url, itemsLoaded, itemsTotal );

				}

			}

			isLoading = true;

		};

		this.itemEnd = function ( url ) {

			itemsLoaded ++;

			if ( scope.onProgress !== undefined ) {

				scope.onProgress( url, itemsLoaded, itemsTotal );

			}

			if ( itemsLoaded === itemsTotal ) {

				isLoading = false;

				if ( scope.onLoad !== undefined ) {

					scope.onLoad();

				}

			}

		};

		this.itemError = function ( url ) {

			if ( scope.onError !== undefined ) {

				scope.onError( url );

			}

		};

		this.resolveURL = function ( url ) {

			if ( urlModifier ) {

				return urlModifier( url );

			}

			return url;

		};

		this.setURLModifier = function ( transform ) {

			urlModifier = transform;
			return this;

		};

	}

	var DefaultLoadingManager = new LoadingManager();

	var loading = {};

	function FileLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	}

	Object.assign( FileLoader.prototype, {

		load: function ( url, onLoad, onProgress, onError ) {

			if ( url === undefined ) url = '';

			if ( this.path !== undefined ) url = this.path + url;

			url = this.manager.resolveURL( url );

			var scope = this;

			var cached = Cache.get( url );

			if ( cached !== undefined ) {

				scope.manager.itemStart( url );

				setTimeout( function () {

					if ( onLoad ) onLoad( cached );

					scope.manager.itemEnd( url );

				}, 0 );

				return cached;

			}

			// Check if request is duplicate

			if ( loading[ url ] !== undefined ) {

				loading[ url ].push( {

					onLoad: onLoad,
					onProgress: onProgress,
					onError: onError

				} );

				return;

			}

			// Check for data: URI
			var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
			var dataUriRegexResult = url.match( dataUriRegex );

			// Safari can not handle Data URIs through XMLHttpRequest so process manually
			if ( dataUriRegexResult ) {

				var mimeType = dataUriRegexResult[ 1 ];
				var isBase64 = !! dataUriRegexResult[ 2 ];
				var data = dataUriRegexResult[ 3 ];

				data = window.decodeURIComponent( data );

				if ( isBase64 ) data = window.atob( data );

				try {

					var response;
					var responseType = ( this.responseType || '' ).toLowerCase();

					switch ( responseType ) {

						case 'arraybuffer':
						case 'blob':

							var view = new Uint8Array( data.length );

							for ( var i = 0; i < data.length; i ++ ) {

								view[ i ] = data.charCodeAt( i );

							}

							if ( responseType === 'blob' ) {

								response = new Blob( [ view.buffer ], { type: mimeType } );

							} else {

								response = view.buffer;

							}

							break;

						case 'document':

							var parser = new DOMParser();
							response = parser.parseFromString( data, mimeType );

							break;

						case 'json':

							response = JSON.parse( data );

							break;

						default: // 'text' or other

							response = data;

							break;

					}

					// Wait for next browser tick like standard XMLHttpRequest event dispatching does
					window.setTimeout( function () {

						if ( onLoad ) onLoad( response );

						scope.manager.itemEnd( url );

					}, 0 );

				} catch ( error ) {

					// Wait for next browser tick like standard XMLHttpRequest event dispatching does
					window.setTimeout( function () {

						if ( onError ) onError( error );

						scope.manager.itemEnd( url );
						scope.manager.itemError( url );

					}, 0 );

				}

			} else {

				// Initialise array for duplicate requests

				loading[ url ] = [];

				loading[ url ].push( {

					onLoad: onLoad,
					onProgress: onProgress,
					onError: onError

				} );

				var request = new XMLHttpRequest();

				request.open( 'GET', url, true );

				request.addEventListener( 'load', function ( event ) {

					var response = this.response;

					Cache.add( url, response );

					var callbacks = loading[ url ];

					delete loading[ url ];

					if ( this.status === 200 ) {

						for ( var i = 0, il = callbacks.length; i < il; i ++ ) {

							var callback = callbacks[ i ];
							if ( callback.onLoad ) callback.onLoad( response );

						}

						scope.manager.itemEnd( url );

					} else if ( this.status === 0 ) {

						// Some browsers return HTTP Status 0 when using non-http protocol
						// e.g. 'file://' or 'data://'. Handle as success.

						console.warn( 'FileLoader: HTTP Status 0 received.' );

						for ( var i = 0, il = callbacks.length; i < il; i ++ ) {

							var callback = callbacks[ i ];
							if ( callback.onLoad ) callback.onLoad( response );

						}

						scope.manager.itemEnd( url );

					} else {

						for ( var i = 0, il = callbacks.length; i < il; i ++ ) {

							var callback = callbacks[ i ];
							if ( callback.onError ) callback.onError( event );

						}

						scope.manager.itemEnd( url );
						scope.manager.itemError( url );

					}

				}, false );

				request.addEventListener( 'progress', function ( event ) {

					var callbacks = loading[ url ];

					for ( var i = 0, il = callbacks.length; i < il; i ++ ) {

						var callback = callbacks[ i ];
						if ( callback.onProgress ) callback.onProgress( event );

					}

				}, false );

				request.addEventListener( 'error', function ( event ) {

					var callbacks = loading[ url ];

					delete loading[ url ];

					for ( var i = 0, il = callbacks.length; i < il; i ++ ) {

						var callback = callbacks[ i ];
						if ( callback.onError ) callback.onError( event );

					}

					scope.manager.itemEnd( url );
					scope.manager.itemError( url );

				}, false );

				if ( this.responseType !== undefined ) request.responseType = this.responseType;
				if ( this.withCredentials !== undefined ) request.withCredentials = this.withCredentials;

				if ( request.overrideMimeType ) request.overrideMimeType( this.mimeType !== undefined ? this.mimeType : 'text/plain' );

				for ( var header in this.requestHeader ) {

					request.setRequestHeader( header, this.requestHeader[ header ] );

				}

				request.send( null );

			}

			scope.manager.itemStart( url );

			return request;

		},

		setPath: function ( value ) {

			this.path = value;
			return this;

		},

		setResponseType: function ( value ) {

			this.responseType = value;
			return this;

		},

		setWithCredentials: function ( value ) {

			this.withCredentials = value;
			return this;

		},

		setMimeType: function ( value ) {

			this.mimeType = value;
			return this;

		},

		setRequestHeader: function ( value ) {

			this.requestHeader = value;
			return this;

		}

	} );

	function MaterialLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
		this.textures = {};

	}

	Object.assign( MaterialLoader.prototype, {

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var loader = new FileLoader( scope.manager );
			loader.load( url, function ( text ) {

				onLoad( scope.parse( JSON.parse( text ) ) );

			}, onProgress, onError );

		},

		setTextures: function ( value ) {

			this.textures = value;

		},

		parse: function ( json ) {

			var textures = this.textures;

			function getTexture( name ) {

				if ( textures[ name ] === undefined ) {

					console.warn( 'MaterialLoader: Undefined texture', name );

				}

				return textures[ name ];

			}

			var material = new Materials[ json.type ]();

			if ( json.uuid !== undefined ) material.uuid = json.uuid;
			if ( json.name !== undefined ) material.name = json.name;
			if ( json.color !== undefined ) material.color.setHex( json.color );
			if ( json.roughness !== undefined ) material.roughness = json.roughness;
			if ( json.metalness !== undefined ) material.metalness = json.metalness;
			if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
			if ( json.specular !== undefined ) material.specular.setHex( json.specular );
			if ( json.shininess !== undefined ) material.shininess = json.shininess;
			if ( json.clearCoat !== undefined ) material.clearCoat = json.clearCoat;
			if ( json.clearCoatRoughness !== undefined ) material.clearCoatRoughness = json.clearCoatRoughness;
			if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
			if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
			if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;
			if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
			if ( json.fog !== undefined ) material.fog = json.fog;
			if ( json.flatShading !== undefined ) material.flatShading = json.flatShading;
			if ( json.blending !== undefined ) material.blending = json.blending;
			if ( json.side !== undefined ) material.side = json.side;
			if ( json.opacity !== undefined ) material.opacity = json.opacity;
			if ( json.transparent !== undefined ) material.transparent = json.transparent;
			if ( json.alphaTest !== undefined ) material.alphaTest = json.alphaTest;
			if ( json.depthTest !== undefined ) material.depthTest = json.depthTest;
			if ( json.depthWrite !== undefined ) material.depthWrite = json.depthWrite;
			if ( json.colorWrite !== undefined ) material.colorWrite = json.colorWrite;
			if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;
			if ( json.wireframeLinewidth !== undefined ) material.wireframeLinewidth = json.wireframeLinewidth;
			if ( json.wireframeLinecap !== undefined ) material.wireframeLinecap = json.wireframeLinecap;
			if ( json.wireframeLinejoin !== undefined ) material.wireframeLinejoin = json.wireframeLinejoin;

			if ( json.rotation !== undefined ) material.rotation = json.rotation;

			if ( json.linewidth !== 1 ) material.linewidth = json.linewidth;
			if ( json.dashSize !== undefined ) material.dashSize = json.dashSize;
			if ( json.gapSize !== undefined ) material.gapSize = json.gapSize;
			if ( json.scale !== undefined ) material.scale = json.scale;

			if ( json.skinning !== undefined ) material.skinning = json.skinning;
			if ( json.morphTargets !== undefined ) material.morphTargets = json.morphTargets;
			if ( json.dithering !== undefined ) material.dithering = json.dithering;

			if ( json.visible !== undefined ) material.visible = json.visible;
			if ( json.userData !== undefined ) material.userData = json.userData;

			// Deprecated

			if ( json.shading !== undefined ) material.flatShading = json.shading === 1; // FlatShading

			// for PointsMaterial

			if ( json.size !== undefined ) material.size = json.size;
			if ( json.sizeAttenuation !== undefined ) material.sizeAttenuation = json.sizeAttenuation;

			// maps

			if ( json.map !== undefined ) material.map = getTexture( json.map );

			if ( json.alphaMap !== undefined ) {

				material.alphaMap = getTexture( json.alphaMap );
				material.transparent = true;

			}

			if ( json.bumpMap !== undefined ) material.bumpMap = getTexture( json.bumpMap );
			if ( json.bumpScale !== undefined ) material.bumpScale = json.bumpScale;

			if ( json.normalMap !== undefined ) material.normalMap = getTexture( json.normalMap );
			if ( json.normalScale !== undefined ) {

				var normalScale = json.normalScale;

				if ( Array.isArray( normalScale ) === false ) {

					// Blender exporter used to export a scalar. See #7459

					normalScale = [ normalScale, normalScale ];

				}

				material.normalScale = new Vector2().fromArray( normalScale );

			}

			if ( json.displacementMap !== undefined ) material.displacementMap = getTexture( json.displacementMap );
			if ( json.displacementScale !== undefined ) material.displacementScale = json.displacementScale;
			if ( json.displacementBias !== undefined ) material.displacementBias = json.displacementBias;

			if ( json.roughnessMap !== undefined ) material.roughnessMap = getTexture( json.roughnessMap );
			if ( json.metalnessMap !== undefined ) material.metalnessMap = getTexture( json.metalnessMap );

			if ( json.emissiveMap !== undefined ) material.emissiveMap = getTexture( json.emissiveMap );
			if ( json.emissiveIntensity !== undefined ) material.emissiveIntensity = json.emissiveIntensity;

			if ( json.specularMap !== undefined ) material.specularMap = getTexture( json.specularMap );

			if ( json.envMap !== undefined ) material.envMap = getTexture( json.envMap );

			if ( json.reflectivity !== undefined ) material.reflectivity = json.reflectivity;

			if ( json.lightMap !== undefined ) material.lightMap = getTexture( json.lightMap );
			if ( json.lightMapIntensity !== undefined ) material.lightMapIntensity = json.lightMapIntensity;

			if ( json.aoMap !== undefined ) material.aoMap = getTexture( json.aoMap );
			if ( json.aoMapIntensity !== undefined ) material.aoMapIntensity = json.aoMapIntensity;

			if ( json.gradientMap !== undefined ) material.gradientMap = getTexture( json.gradientMap );

			return material;

		}

	} );

	function ImageLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	}

	Object.assign( ImageLoader.prototype, {

		crossOrigin: 'Anonymous',

		load: function ( url, onLoad, onProgress, onError ) {

			if ( url === undefined ) url = '';

			if ( this.path !== undefined ) url = this.path + url;

			url = this.manager.resolveURL( url );

			var scope = this;

			var cached = Cache.get( url );

			if ( cached !== undefined ) {

				scope.manager.itemStart( url );

				setTimeout( function () {

					if ( onLoad ) onLoad( cached );

					scope.manager.itemEnd( url );

				}, 0 );

				return cached;

			}

			var image = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );

			image.addEventListener( 'load', function () {

				Cache.add( url, this );

				if ( onLoad ) onLoad( this );

				scope.manager.itemEnd( url );

			}, false );

			

			image.addEventListener( 'error', function ( event ) {

				if ( onError ) onError( event );

				scope.manager.itemEnd( url );
				scope.manager.itemError( url );

			}, false );

			if ( url.substr( 0, 5 ) !== 'data:' ) {

				if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

			}

			scope.manager.itemStart( url );

			image.src = url;

			return image;

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;
			return this;

		},

		setPath: function ( value ) {

			this.path = value;
			return this;

		}

	} );

	function EventDispatcher() {}

	Object.assign( EventDispatcher.prototype, {

		addEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) this._listeners = {};

			var listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {

				listeners[ type ] = [];

			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {

				listeners[ type ].push( listener );

			}

		},

		hasEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) return false;

			var listeners = this._listeners;

			return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

		},

		removeEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) return;

			var listeners = this._listeners;
			var listenerArray = listeners[ type ];

			if ( listenerArray !== undefined ) {

				var index = listenerArray.indexOf( listener );

				if ( index !== - 1 ) {

					listenerArray.splice( index, 1 );

				}

			}

		},

		dispatchEvent: function ( event ) {

			if ( this._listeners === undefined ) return;

			var listeners = this._listeners;
			var listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {

				event.target = this;

				var array = listenerArray.slice( 0 );

				for ( var i = 0, l = array.length; i < l; i ++ ) {

					array[ i ].call( this, event );

				}

			}

		}

	} );

	function Matrix4() {

		this.elements = [

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		];

		if ( arguments.length > 0 ) {

			console.error( 'Matrix4: the constructor no longer reads arguments. use .set() instead.' );

		}

	}

	Object.assign( Matrix4.prototype, {

		isMatrix4: true,

		set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			var te = this.elements;

			te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
			te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
			te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
			te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new Matrix4().fromArray( this.elements );

		},

		copy: function ( m ) {

			var te = this.elements;
			var me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
			te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
			te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
			te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

			return this;

		},

		copyPosition: function ( m ) {

			var te = this.elements, me = m.elements;

			te[ 12 ] = me[ 12 ];
			te[ 13 ] = me[ 13 ];
			te[ 14 ] = me[ 14 ];

			return this;

		},

		extractBasis: function ( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrixColumn( this, 0 );
			yAxis.setFromMatrixColumn( this, 1 );
			zAxis.setFromMatrixColumn( this, 2 );

			return this;

		},

		makeBasis: function ( xAxis, yAxis, zAxis ) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		},

		extractRotation: function () {

			var v1 = new Vector3();

			return function extractRotation( m ) {

				var te = this.elements;
				var me = m.elements;

				var scaleX = 1 / v1.setFromMatrixColumn( m, 0 ).length();
				var scaleY = 1 / v1.setFromMatrixColumn( m, 1 ).length();
				var scaleZ = 1 / v1.setFromMatrixColumn( m, 2 ).length();

				te[ 0 ] = me[ 0 ] * scaleX;
				te[ 1 ] = me[ 1 ] * scaleX;
				te[ 2 ] = me[ 2 ] * scaleX;

				te[ 4 ] = me[ 4 ] * scaleY;
				te[ 5 ] = me[ 5 ] * scaleY;
				te[ 6 ] = me[ 6 ] * scaleY;

				te[ 8 ] = me[ 8 ] * scaleZ;
				te[ 9 ] = me[ 9 ] * scaleZ;
				te[ 10 ] = me[ 10 ] * scaleZ;

				return this;

			};

		}(),

		makeRotationFromEuler: function ( euler ) {

			if ( ! ( euler && euler.isEuler ) ) {

				console.error( 'Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			var te = this.elements;

			var x = euler.x, y = euler.y, z = euler.z;
			var a = Math.cos( x ), b = Math.sin( x );
			var c = Math.cos( y ), d = Math.sin( y );
			var e = Math.cos( z ), f = Math.sin( z );

			if ( euler.order === 'XYZ' ) {

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = - c * f;
				te[ 8 ] = d;

				te[ 1 ] = af + be * d;
				te[ 5 ] = ae - bf * d;
				te[ 9 ] = - b * c;

				te[ 2 ] = bf - ae * d;
				te[ 6 ] = be + af * d;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YXZ' ) {

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce + df * b;
				te[ 4 ] = de * b - cf;
				te[ 8 ] = a * d;

				te[ 1 ] = a * f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b;

				te[ 2 ] = cf * b - de;
				te[ 6 ] = df + ce * b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZXY' ) {

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce - df * b;
				te[ 4 ] = - a * f;
				te[ 8 ] = de + cf * b;

				te[ 1 ] = cf + de * b;
				te[ 5 ] = a * e;
				te[ 9 ] = df - ce * b;

				te[ 2 ] = - a * d;
				te[ 6 ] = b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZYX' ) {

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = be * d - af;
				te[ 8 ] = ae * d + bf;

				te[ 1 ] = c * f;
				te[ 5 ] = bf * d + ae;
				te[ 9 ] = af * d - be;

				te[ 2 ] = - d;
				te[ 6 ] = b * c;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YZX' ) {

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = bd - ac * f;
				te[ 8 ] = bc * f + ad;

				te[ 1 ] = f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b * e;

				te[ 2 ] = - d * e;
				te[ 6 ] = ad * f + bc;
				te[ 10 ] = ac - bd * f;

			} else if ( euler.order === 'XZY' ) {

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = - f;
				te[ 8 ] = d * e;

				te[ 1 ] = ac * f + bd;
				te[ 5 ] = a * e;
				te[ 9 ] = ad * f - bc;

				te[ 2 ] = bc * f - ad;
				te[ 6 ] = b * e;
				te[ 10 ] = bd * f + ac;

			}

			// last column
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// bottom row
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		},

		makeRotationFromQuaternion: function ( q ) {

			var te = this.elements;

			var x = q._x, y = q._y, z = q._z, w = q._w;
			var x2 = x + x, y2 = y + y, z2 = z + z;
			var xx = x * x2, xy = x * y2, xz = x * z2;
			var yy = y * y2, yz = y * z2, zz = z * z2;
			var wx = w * x2, wy = w * y2, wz = w * z2;

			te[ 0 ] = 1 - ( yy + zz );
			te[ 4 ] = xy - wz;
			te[ 8 ] = xz + wy;

			te[ 1 ] = xy + wz;
			te[ 5 ] = 1 - ( xx + zz );
			te[ 9 ] = yz - wx;

			te[ 2 ] = xz - wy;
			te[ 6 ] = yz + wx;
			te[ 10 ] = 1 - ( xx + yy );

			// last column
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// bottom row
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		},

		lookAt: function () {

			var x = new Vector3();
			var y = new Vector3();
			var z = new Vector3();

			return function lookAt( eye, target, up ) {

				var te = this.elements;

				z.subVectors( eye, target );

				if ( z.lengthSq() === 0 ) {

					// eye and target are in the same position

					z.z = 1;

				}

				z.normalize();
				x.crossVectors( up, z );

				if ( x.lengthSq() === 0 ) {

					// up and z are parallel

					if ( Math.abs( up.z ) === 1 ) {

						z.x += 0.0001;

					} else {

						z.z += 0.0001;

					}

					z.normalize();
					x.crossVectors( up, z );

				}

				x.normalize();
				y.crossVectors( z, x );

				te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
				te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
				te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

				return this;

			};

		}(),

		multiply: function ( m, n ) {

			if ( n !== undefined ) {

				console.warn( 'Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
				return this.multiplyMatrices( m, n );

			}

			return this.multiplyMatrices( this, m );

		},

		premultiply: function ( m ) {

			return this.multiplyMatrices( m, this );

		},

		multiplyMatrices: function ( a, b ) {

			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;

			var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
			var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
			var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
			var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

			var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
			var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
			var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
			var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		},

		multiplyScalar: function ( s ) {

			var te = this.elements;

			te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
			te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
			te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
			te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

			return this;

		},

		applyToBufferAttribute: function () {

			var v1 = new Vector3();

			return function applyToBufferAttribute( attribute ) {

				for ( var i = 0, l = attribute.count; i < l; i ++ ) {

					v1.x = attribute.getX( i );
					v1.y = attribute.getY( i );
					v1.z = attribute.getZ( i );

					v1.applyMatrix4( this );

					attribute.setXYZ( i, v1.x, v1.y, v1.z );

				}

				return attribute;

			};

		}(),

		determinant: function () {

			var te = this.elements;

			var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
			var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
			var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
			var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (
					+ n14 * n23 * n32
					 - n13 * n24 * n32
					 - n14 * n22 * n33
					 + n12 * n24 * n33
					 + n13 * n22 * n34
					 - n12 * n23 * n34
				) +
				n42 * (
					+ n11 * n23 * n34
					 - n11 * n24 * n33
					 + n14 * n21 * n33
					 - n13 * n21 * n34
					 + n13 * n24 * n31
					 - n14 * n23 * n31
				) +
				n43 * (
					+ n11 * n24 * n32
					 - n11 * n22 * n34
					 - n14 * n21 * n32
					 + n12 * n21 * n34
					 + n14 * n22 * n31
					 - n12 * n24 * n31
				) +
				n44 * (
					- n13 * n22 * n31
					 - n11 * n23 * n32
					 + n11 * n22 * n33
					 + n13 * n21 * n32
					 - n12 * n21 * n33
					 + n12 * n23 * n31
				)

			);

		},

		transpose: function () {

			var te = this.elements;
			var tmp;

			tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
			tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
			tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

			tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
			tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
			tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

			return this;

		},

		setPosition: function ( v ) {

			var te = this.elements;

			te[ 12 ] = v.x;
			te[ 13 ] = v.y;
			te[ 14 ] = v.z;

			return this;

		},

		getInverse: function ( m, throwOnDegenerate ) {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			var te = this.elements,
				me = m.elements,

				n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
				n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
				n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
				n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if ( det === 0 ) {

				var msg = "Matrix4: .getInverse() can't invert matrix, determinant is 0";

				if ( throwOnDegenerate === true ) {

					throw new Error( msg );

				} else {

					console.warn( msg );

				}

				return this.identity();

			}

			var detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
			te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
			te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

			te[ 4 ] = t12 * detInv;
			te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
			te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
			te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

			te[ 8 ] = t13 * detInv;
			te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
			te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
			te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

			te[ 12 ] = t14 * detInv;
			te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
			te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
			te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

			return this;

		},

		scale: function ( v ) {

			var te = this.elements;
			var x = v.x, y = v.y, z = v.z;

			te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
			te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
			te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
			te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

			return this;

		},

		getMaxScaleOnAxis: function () {

			var te = this.elements;

			var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
			var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
			var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

			return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

		},

		makeTranslation: function ( x, y, z ) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationX: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				1, 0, 0, 0,
				0, c, - s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationY: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				 c, 0, s, 0,
				 0, 1, 0, 0,
				- s, 0, c, 0,
				 0, 0, 0, 1

			);

			return this;

		},

		makeRotationZ: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				c, - s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationAxis: function ( axis, angle ) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			var c = Math.cos( angle );
			var s = Math.sin( angle );
			var t = 1 - c;
			var x = axis.x, y = axis.y, z = axis.z;
			var tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			 return this;

		},

		makeScale: function ( x, y, z ) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeShear: function ( x, y, z ) {

			this.set(

				1, y, z, 0,
				x, 1, z, 0,
				x, y, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		compose: function ( position, quaternion, scale ) {

			this.makeRotationFromQuaternion( quaternion );
			this.scale( scale );
			this.setPosition( position );

			return this;

		},

		decompose: function () {

			var vector = new Vector3();
			var matrix = new Matrix4();

			return function decompose( position, quaternion, scale ) {

				var te = this.elements;

				var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
				var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
				var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

				// if determine is negative, we need to invert one scale
				var det = this.determinant();
				if ( det < 0 ) sx = - sx;

				position.x = te[ 12 ];
				position.y = te[ 13 ];
				position.z = te[ 14 ];

				// scale the rotation part
				matrix.copy( this );

				var invSX = 1 / sx;
				var invSY = 1 / sy;
				var invSZ = 1 / sz;

				matrix.elements[ 0 ] *= invSX;
				matrix.elements[ 1 ] *= invSX;
				matrix.elements[ 2 ] *= invSX;

				matrix.elements[ 4 ] *= invSY;
				matrix.elements[ 5 ] *= invSY;
				matrix.elements[ 6 ] *= invSY;

				matrix.elements[ 8 ] *= invSZ;
				matrix.elements[ 9 ] *= invSZ;
				matrix.elements[ 10 ] *= invSZ;

				quaternion.setFromRotationMatrix( matrix );

				scale.x = sx;
				scale.y = sy;
				scale.z = sz;

				return this;

			};

		}(),

		makePerspective: function ( left, right, top, bottom, near, far ) {

			if ( far === undefined ) {

				console.warn( 'Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.' );

			}

			var te = this.elements;
			var x = 2 * near / ( right - left );
			var y = 2 * near / ( top - bottom );

			var a = ( right + left ) / ( right - left );
			var b = ( top + bottom ) / ( top - bottom );
			var c = - ( far + near ) / ( far - near );
			var d = - 2 * far * near / ( far - near );

			te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
			te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

			return this;

		},

		makeOrthographic: function ( left, right, top, bottom, near, far ) {

			var te = this.elements;
			var w = 1.0 / ( right - left );
			var h = 1.0 / ( top - bottom );
			var p = 1.0 / ( far - near );

			var x = ( right + left ) * w;
			var y = ( top + bottom ) * h;
			var z = ( far + near ) * p;

			te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
			te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

			return this;

		},

		equals: function ( matrix ) {

			var te = this.elements;
			var me = matrix.elements;

			for ( var i = 0; i < 16; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			for ( var i = 0; i < 16; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			var te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];
			array[ offset + 3 ] = te[ 3 ];

			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];
			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];

			array[ offset + 8 ] = te[ 8 ];
			array[ offset + 9 ] = te[ 9 ];
			array[ offset + 10 ] = te[ 10 ];
			array[ offset + 11 ] = te[ 11 ];

			array[ offset + 12 ] = te[ 12 ];
			array[ offset + 13 ] = te[ 13 ];
			array[ offset + 14 ] = te[ 14 ];
			array[ offset + 15 ] = te[ 15 ];

			return array;

		}

	} );

	function Quaternion( x, y, z, w ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._w = ( w !== undefined ) ? w : 1;

	}

	Object.assign( Quaternion, {

		slerp: function ( qa, qb, qm, t ) {

			return qm.copy( qa ).slerp( qb, t );

		},

		slerpFlat: function ( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

			// fuzz-free, array-based Quaternion SLERP operation

			var x0 = src0[ srcOffset0 + 0 ],
				y0 = src0[ srcOffset0 + 1 ],
				z0 = src0[ srcOffset0 + 2 ],
				w0 = src0[ srcOffset0 + 3 ],

				x1 = src1[ srcOffset1 + 0 ],
				y1 = src1[ srcOffset1 + 1 ],
				z1 = src1[ srcOffset1 + 2 ],
				w1 = src1[ srcOffset1 + 3 ];

			if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

				var s = 1 - t,

					cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

					dir = ( cos >= 0 ? 1 : - 1 ),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if ( sqrSin > Number.EPSILON ) {

					var sin = Math.sqrt( sqrSin ),
						len = Math.atan2( sin, cos * dir );

					s = Math.sin( s * len ) / sin;
					t = Math.sin( t * len ) / sin;

				}

				var tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if ( s === 1 - t ) {

					var f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[ dstOffset ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;

		}

	} );

	Object.defineProperties( Quaternion.prototype, {

		x: {

			get: function () {

				return this._x;

			},

			set: function ( value ) {

				this._x = value;
				this.onChangeCallback();

			}

		},

		y: {

			get: function () {

				return this._y;

			},

			set: function ( value ) {

				this._y = value;
				this.onChangeCallback();

			}

		},

		z: {

			get: function () {

				return this._z;

			},

			set: function ( value ) {

				this._z = value;
				this.onChangeCallback();

			}

		},

		w: {

			get: function () {

				return this._w;

			},

			set: function ( value ) {

				this._w = value;
				this.onChangeCallback();

			}

		}

	} );

	Object.assign( Quaternion.prototype, {

		set: function ( x, y, z, w ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor( this._x, this._y, this._z, this._w );

		},

		copy: function ( quaternion ) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this.onChangeCallback();

			return this;

		},

		setFromEuler: function ( euler, update ) {

			if ( ! ( euler && euler.isEuler ) ) {

				throw new Error( 'Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.' );

			}

			var x = euler._x, y = euler._y, z = euler._z, order = euler.order;

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			var cos = Math.cos;
			var sin = Math.sin;

			var c1 = cos( x / 2 );
			var c2 = cos( y / 2 );
			var c3 = cos( z / 2 );

			var s1 = sin( x / 2 );
			var s2 = sin( y / 2 );
			var s3 = sin( z / 2 );

			if ( order === 'XYZ' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'YXZ' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if ( order === 'ZXY' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'ZYX' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if ( order === 'YZX' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'XZY' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			}

			if ( update !== false ) this.onChangeCallback();

			return this;

		},

		setFromAxisAngle: function ( axis, angle ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			var halfAngle = angle / 2, s = Math.sin( halfAngle );

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos( halfAngle );

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function ( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

				trace = m11 + m22 + m33,
				s;

			if ( trace > 0 ) {

				s = 0.5 / Math.sqrt( trace + 1.0 );

				this._w = 0.25 / s;
				this._x = ( m32 - m23 ) * s;
				this._y = ( m13 - m31 ) * s;
				this._z = ( m21 - m12 ) * s;

			} else if ( m11 > m22 && m11 > m33 ) {

				s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

				this._w = ( m32 - m23 ) / s;
				this._x = 0.25 * s;
				this._y = ( m12 + m21 ) / s;
				this._z = ( m13 + m31 ) / s;

			} else if ( m22 > m33 ) {

				s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

				this._w = ( m13 - m31 ) / s;
				this._x = ( m12 + m21 ) / s;
				this._y = 0.25 * s;
				this._z = ( m23 + m32 ) / s;

			} else {

				s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

				this._w = ( m21 - m12 ) / s;
				this._x = ( m13 + m31 ) / s;
				this._y = ( m23 + m32 ) / s;
				this._z = 0.25 * s;

			}

			this.onChangeCallback();

			return this;

		},

		setFromUnitVectors: function () {

			// assumes direction vectors vFrom and vTo are normalized

			var v1 = new Vector3();
			var r;

			var EPS = 0.000001;

			return function setFromUnitVectors( vFrom, vTo ) {

				if ( v1 === undefined ) v1 = new Vector3();

				r = vFrom.dot( vTo ) + 1;

				if ( r < EPS ) {

					r = 0;

					if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

						v1.set( - vFrom.y, vFrom.x, 0 );

					} else {

						v1.set( 0, - vFrom.z, vFrom.y );

					}

				} else {

					v1.crossVectors( vFrom, vTo );

				}

				this._x = v1.x;
				this._y = v1.y;
				this._z = v1.z;
				this._w = r;

				return this.normalize();

			};

		}(),

		inverse: function () {

			// quaternion is assumed to have unit length

			return this.conjugate();

		},

		conjugate: function () {

			this._x *= - 1;
			this._y *= - 1;
			this._z *= - 1;

			this.onChangeCallback();

			return this;

		},

		dot: function ( v ) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		},

		lengthSq: function () {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		},

		length: function () {

			return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

		},

		normalize: function () {

			var l = this.length();

			if ( l === 0 ) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this.onChangeCallback();

			return this;

		},

		multiply: function ( q, p ) {

			if ( p !== undefined ) {

				console.warn( 'Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
				return this.multiplyQuaternions( q, p );

			}

			return this.multiplyQuaternions( this, q );

		},

		premultiply: function ( q ) {

			return this.multiplyQuaternions( q, this );

		},

		multiplyQuaternions: function ( a, b ) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
			var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this.onChangeCallback();

			return this;

		},

		slerp: function ( qb, t ) {

			if ( t === 0 ) return this;
			if ( t === 1 ) return this.copy( qb );

			var x = this._x, y = this._y, z = this._z, w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if ( cosHalfTheta < 0 ) {

				this._w = - qb._w;
				this._x = - qb._x;
				this._y = - qb._y;
				this._z = - qb._z;

				cosHalfTheta = - cosHalfTheta;

			} else {

				this.copy( qb );

			}

			if ( cosHalfTheta >= 1.0 ) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

			if ( Math.abs( sinHalfTheta ) < 0.001 ) {

				this._w = 0.5 * ( w + this._w );
				this._x = 0.5 * ( x + this._x );
				this._y = 0.5 * ( y + this._y );
				this._z = 0.5 * ( z + this._z );

				return this;

			}

			var halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
			var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
				ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

			this._w = ( w * ratioA + this._w * ratioB );
			this._x = ( x * ratioA + this._x * ratioB );
			this._y = ( y * ratioA + this._y * ratioB );
			this._z = ( z * ratioA + this._z * ratioB );

			this.onChangeCallback();

			return this;

		},

		equals: function ( quaternion ) {

			return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this._x = array[ offset ];
			this._y = array[ offset + 1 ];
			this._z = array[ offset + 2 ];
			this._w = array[ offset + 3 ];

			this.onChangeCallback();

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._w;

			return array;

		},

		onChange: function ( callback ) {

			this.onChangeCallback = callback;

			return this;

		},

		onChangeCallback: function () {}

	} );

	function Vector3( x, y, z ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

	}

	Object.assign( Vector3.prototype, {

		isVector3: true,

		set: function ( x, y, z ) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setZ: function ( z ) {

			this.z = z;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y, this.z );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		},

		multiply: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
				return this.multiplyVectors( v, w );

			}

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;

		},

		multiplyVectors: function ( a, b ) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		},

		applyEuler: function () {

			var quaternion = new Quaternion();

			return function applyEuler( euler ) {

				if ( ! ( euler && euler.isEuler ) ) {

					console.error( 'Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

				}

				return this.applyQuaternion( quaternion.setFromEuler( euler ) );

			};

		}(),

		applyAxisAngle: function () {

			var quaternion = new Quaternion();

			return function applyAxisAngle( axis, angle ) {

				return this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			};

		}(),

		applyMatrix3: function ( m ) {

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
			this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

			return this;

		},

		applyMatrix4: function ( m ) {

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			var w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

			this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
			this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
			this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

			return this;

		},

		applyQuaternion: function ( q ) {

			var x = this.x, y = this.y, z = this.z;
			var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// calculate quat * vector

			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = - qx * x - qy * y - qz * z;

			// calculate result * inverse quat

			this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
			this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
			this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

			return this;

		},

		project: function () {

			var matrix = new Matrix4();

			return function project( camera ) {

				matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
				return this.applyMatrix4( matrix );

			};

		}(),

		unproject: function () {

			var matrix = new Matrix4();

			return function unproject( camera ) {

				matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
				return this.applyMatrix4( matrix );

			};

		}(),

		transformDirection: function ( m ) {

			// input: Matrix4 affine matrix
			// vector interpreted as a direction

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

			return this.normalize();

		},

		divide: function ( v ) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );

			return this;

		},

		clampScalar: function () {

			var min = new Vector3();
			var max = new Vector3();

			return function clampScalar( minVal, maxVal ) {

				min.set( minVal, minVal, minVal );
				max.set( maxVal, maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		},

		// TODO lengthSquared?

		lengthSq: function () {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		cross: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
				return this.crossVectors( v, w );

			}

			return this.crossVectors( this, v );

		},

		crossVectors: function ( a, b ) {

			var ax = a.x, ay = a.y, az = a.z;
			var bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		},

		projectOnVector: function ( vector ) {

			var scalar = vector.dot( this ) / vector.lengthSq();

			return this.copy( vector ).multiplyScalar( scalar );

		},

		projectOnPlane: function () {

			var v1 = new Vector3();

			return function projectOnPlane( planeNormal ) {

				v1.copy( this ).projectOnVector( planeNormal );

				return this.sub( v1 );

			};

		}(),

		reflect: function () {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			var v1 = new Vector3();

			return function reflect( normal ) {

				return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

			};

		}(),

		angleTo: function ( v ) {

			var theta = this.dot( v ) / ( Math.sqrt( this.lengthSq() * v.lengthSq() ) );

			// clamp, to handle numerical problems

			return Math.acos( _Math.clamp( theta, - 1, 1 ) );

		},

		distanceTo: function ( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		},

		distanceToSquared: function ( v ) {

			var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		},

		manhattanDistanceTo: function ( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

		},

		setFromSpherical: function ( s ) {

			var sinPhiRadius = Math.sin( s.phi ) * s.radius;

			this.x = sinPhiRadius * Math.sin( s.theta );
			this.y = Math.cos( s.phi ) * s.radius;
			this.z = sinPhiRadius * Math.cos( s.theta );

			return this;

		},

		setFromCylindrical: function ( c ) {

			this.x = c.radius * Math.sin( c.theta );
			this.y = c.y;
			this.z = c.radius * Math.cos( c.theta );

			return this;

		},

		setFromMatrixPosition: function ( m ) {

			var e = m.elements;

			this.x = e[ 12 ];
			this.y = e[ 13 ];
			this.z = e[ 14 ];

			return this;

		},

		setFromMatrixScale: function ( m ) {

			var sx = this.setFromMatrixColumn( m, 0 ).length();
			var sy = this.setFromMatrixColumn( m, 1 ).length();
			var sz = this.setFromMatrixColumn( m, 2 ).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		},

		setFromMatrixColumn: function ( m, index ) {

			return this.fromArray( m.elements, index * 4 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'Vector3: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );

			return this;

		}

	} );

	function Matrix3() {

		this.elements = [

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		];

		if ( arguments.length > 0 ) {

			console.error( 'Matrix3: the constructor no longer reads arguments. use .set() instead.' );

		}

	}

	Object.assign( Matrix3.prototype, {

		isMatrix3: true,

		set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			var te = this.elements;

			te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
			te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
			te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new this.constructor().fromArray( this.elements );

		},

		copy: function ( m ) {

			var te = this.elements;
			var me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
			te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
			te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];

			return this;

		},

		setFromMatrix4: function ( m ) {

			var me = m.elements;

			this.set(

				me[ 0 ], me[ 4 ], me[ 8 ],
				me[ 1 ], me[ 5 ], me[ 9 ],
				me[ 2 ], me[ 6 ], me[ 10 ]

			);

			return this;

		},

		applyToBufferAttribute: function () {

			var v1 = new Vector3();

			return function applyToBufferAttribute( attribute ) {

				for ( var i = 0, l = attribute.count; i < l; i ++ ) {

					v1.x = attribute.getX( i );
					v1.y = attribute.getY( i );
					v1.z = attribute.getZ( i );

					v1.applyMatrix3( this );

					attribute.setXYZ( i, v1.x, v1.y, v1.z );

				}

				return attribute;

			};

		}(),

		multiply: function ( m ) {

			return this.multiplyMatrices( this, m );

		},

		premultiply: function ( m ) {

			return this.multiplyMatrices( m, this );

		},

		multiplyMatrices: function ( a, b ) {

			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;

			var a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
			var a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
			var a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

			var b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
			var b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
			var b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
			te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
			te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
			te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
			te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
			te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
			te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		},

		multiplyScalar: function ( s ) {

			var te = this.elements;

			te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
			te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
			te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

			return this;

		},

		determinant: function () {

			var te = this.elements;

			var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
				d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
				g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		},

		getInverse: function ( matrix, throwOnDegenerate ) {

			if ( matrix && matrix.isMatrix4 ) {

				console.error( "Matrix3: .getInverse() no longer takes a Matrix4 argument." );

			}

			var me = matrix.elements,
				te = this.elements,

				n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ],
				n12 = me[ 3 ], n22 = me[ 4 ], n32 = me[ 5 ],
				n13 = me[ 6 ], n23 = me[ 7 ], n33 = me[ 8 ],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if ( det === 0 ) {

				var msg = "Matrix3: .getInverse() can't invert matrix, determinant is 0";

				if ( throwOnDegenerate === true ) {

					throw new Error( msg );

				} else {

					console.warn( msg );

				}

				return this.identity();

			}

			var detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
			te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

			te[ 3 ] = t12 * detInv;
			te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
			te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

			te[ 6 ] = t13 * detInv;
			te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
			te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

			return this;

		},

		transpose: function () {

			var tmp, m = this.elements;

			tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
			tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
			tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

			return this;

		},

		getNormalMatrix: function ( matrix4 ) {

			return this.setFromMatrix4( matrix4 ).getInverse( this ).transpose();

		},

		transposeIntoArray: function ( r ) {

			var m = this.elements;

			r[ 0 ] = m[ 0 ];
			r[ 1 ] = m[ 3 ];
			r[ 2 ] = m[ 6 ];
			r[ 3 ] = m[ 1 ];
			r[ 4 ] = m[ 4 ];
			r[ 5 ] = m[ 7 ];
			r[ 6 ] = m[ 2 ];
			r[ 7 ] = m[ 5 ];
			r[ 8 ] = m[ 8 ];

			return this;

		},

		setUvTransform: function ( tx, ty, sx, sy, rotation, cx, cy ) {

			var c = Math.cos( rotation );
			var s = Math.sin( rotation );

			this.set(
				sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
				- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
				0, 0, 1
			);

		},

		scale: function ( sx, sy ) {

			var te = this.elements;

			te[ 0 ] *= sx; te[ 3 ] *= sx; te[ 6 ] *= sx;
			te[ 1 ] *= sy; te[ 4 ] *= sy; te[ 7 ] *= sy;

			return this;

		},

		rotate: function ( theta ) {

			var c = Math.cos( theta );
			var s = Math.sin( theta );

			var te = this.elements;

			var a11 = te[ 0 ], a12 = te[ 3 ], a13 = te[ 6 ];
			var a21 = te[ 1 ], a22 = te[ 4 ], a23 = te[ 7 ];

			te[ 0 ] = c * a11 + s * a21;
			te[ 3 ] = c * a12 + s * a22;
			te[ 6 ] = c * a13 + s * a23;

			te[ 1 ] = - s * a11 + c * a21;
			te[ 4 ] = - s * a12 + c * a22;
			te[ 7 ] = - s * a13 + c * a23;

			return this;

		},

		translate: function ( tx, ty ) {

			var te = this.elements;

			te[ 0 ] += tx * te[ 2 ]; te[ 3 ] += tx * te[ 5 ]; te[ 6 ] += tx * te[ 8 ];
			te[ 1 ] += ty * te[ 2 ]; te[ 4 ] += ty * te[ 5 ]; te[ 7 ] += ty * te[ 8 ];

			return this;

		},

		equals: function ( matrix ) {

			var te = this.elements;
			var me = matrix.elements;

			for ( var i = 0; i < 9; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			for ( var i = 0; i < 9; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			var te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];

			array[ offset + 3 ] = te[ 3 ];
			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];

			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];
			array[ offset + 8 ] = te[ 8 ];

			return array;

		}

	} );

	var textureId = 0;

	function Texture( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding ) {

		Object.defineProperty( this, 'id', { value: textureId ++ } );

		this.uuid = _Math.generateUUID();

		this.name = '';

		this.image = image !== undefined ? image : Texture.DEFAULT_IMAGE;
		this.mipmaps = [];

		this.mapping = mapping !== undefined ? mapping : Texture.DEFAULT_MAPPING;

		this.wrapS = wrapS !== undefined ? wrapS : ClampToEdgeWrapping;
		this.wrapT = wrapT !== undefined ? wrapT : ClampToEdgeWrapping;

		this.magFilter = magFilter !== undefined ? magFilter : LinearFilter;
		this.minFilter = minFilter !== undefined ? minFilter : LinearMipMapLinearFilter;

		this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

		this.format = format !== undefined ? format : RGBAFormat;
		this.type = type !== undefined ? type : UnsignedByteType;

		this.offset = new Vector2( 0, 0 );
		this.repeat = new Vector2( 1, 1 );
		this.center = new Vector2( 0, 0 );
		this.rotation = 0;

		this.matrixAutoUpdate = true;
		this.matrix = new Matrix3();

		this.generateMipmaps = true;
		this.premultiplyAlpha = false;
		this.flipY = true;
		this.unpackAlignment = 4;	// valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

		// Values of encoding !== LinearEncoding only supported on map, envMap and emissiveMap.
		//
		// Also changing the encoding after already used by a Material will not automatically make the Material
		// update.  You need to explicitly call Material.needsUpdate to trigger it to recompile.
		this.encoding = encoding !== undefined ? encoding : LinearEncoding;

		this.version = 0;
		this.onUpdate = null;

	}

	Texture.DEFAULT_IMAGE = undefined;
	Texture.DEFAULT_MAPPING = UVMapping;

	Texture.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: Texture,

		isTexture: true,

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( source ) {

			this.name = source.name;

			this.image = source.image;
			this.mipmaps = source.mipmaps.slice( 0 );

			this.mapping = source.mapping;

			this.wrapS = source.wrapS;
			this.wrapT = source.wrapT;

			this.magFilter = source.magFilter;
			this.minFilter = source.minFilter;

			this.anisotropy = source.anisotropy;

			this.format = source.format;
			this.type = source.type;

			this.offset.copy( source.offset );
			this.repeat.copy( source.repeat );
			this.center.copy( source.center );
			this.rotation = source.rotation;

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrix.copy( source.matrix );

			this.generateMipmaps = source.generateMipmaps;
			this.premultiplyAlpha = source.premultiplyAlpha;
			this.flipY = source.flipY;
			this.unpackAlignment = source.unpackAlignment;
			this.encoding = source.encoding;

			return this;

		},

		toJSON: function ( meta ) {

			var isRootObject = ( meta === undefined || typeof meta === 'string' );

			if ( ! isRootObject && meta.textures[ this.uuid ] !== undefined ) {

				return meta.textures[ this.uuid ];

			}

			function getDataURL( image ) {

				var canvas;

				if ( image instanceof HTMLCanvasElement ) {

					canvas = image;

				} else {

					canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );
					canvas.width = image.width;
					canvas.height = image.height;

					var context = canvas.getContext( '2d' );

					if ( image instanceof ImageData ) {

						context.putImageData( image, 0, 0 );

					} else {

						context.drawImage( image, 0, 0, image.width, image.height );

					}

				}

				if ( canvas.width > 2048 || canvas.height > 2048 ) {

					return canvas.toDataURL( 'image/jpeg', 0.6 );

				} else {

					return canvas.toDataURL( 'image/png' );

				}

			}

			var output = {
				metadata: {
					version: 4.5,
					type: 'Texture',
					generator: 'Texture.toJSON'
				},

				uuid: this.uuid,
				name: this.name,

				mapping: this.mapping,

				repeat: [ this.repeat.x, this.repeat.y ],
				offset: [ this.offset.x, this.offset.y ],
				center: [ this.center.x, this.center.y ],
				rotation: this.rotation,

				wrap: [ this.wrapS, this.wrapT ],

				minFilter: this.minFilter,
				magFilter: this.magFilter,
				anisotropy: this.anisotropy,

				flipY: this.flipY
			};

			if ( this.image !== undefined ) {

				// TODO: Move to Image

				var image = this.image;

				if ( image.uuid === undefined ) {

					image.uuid = _Math.generateUUID(); // UGH

				}

				if ( ! isRootObject && meta.images[ image.uuid ] === undefined ) {

					meta.images[ image.uuid ] = {
						uuid: image.uuid,
						url: getDataURL( image )
					};

				}

				output.image = image.uuid;

			}

			if ( ! isRootObject ) {

				meta.textures[ this.uuid ] = output;

			}

			return output;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		},

		transformUv: function ( uv ) {

			if ( this.mapping !== UVMapping ) return;

			uv.applyMatrix3( this.matrix );

			if ( uv.x < 0 || uv.x > 1 ) {

				switch ( this.wrapS ) {

					case RepeatWrapping:

						uv.x = uv.x - Math.floor( uv.x );
						break;

					case ClampToEdgeWrapping:

						uv.x = uv.x < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {

							uv.x = Math.ceil( uv.x ) - uv.x;

						} else {

							uv.x = uv.x - Math.floor( uv.x );

						}
						break;

				}

			}

			if ( uv.y < 0 || uv.y > 1 ) {

				switch ( this.wrapT ) {

					case RepeatWrapping:

						uv.y = uv.y - Math.floor( uv.y );
						break;

					case ClampToEdgeWrapping:

						uv.y = uv.y < 0 ? 0 : 1;
						break;

					case MirroredRepeatWrapping:

						if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {

							uv.y = Math.ceil( uv.y ) - uv.y;

						} else {

							uv.y = uv.y - Math.floor( uv.y );

						}
						break;

				}

			}

			if ( this.flipY ) {

				uv.y = 1 - uv.y;

			}

		}

	} );

	Object.defineProperty( Texture.prototype, "needsUpdate", {

		set: function ( value ) {

			if ( value === true ) this.version ++;

		}

	} );

	function TextureLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	}

	Object.assign( TextureLoader.prototype, {

		crossOrigin: 'Anonymous',

		load: function ( url, onLoad, onProgress, onError ) {

			var texture = new Texture();

			var loader = new ImageLoader( this.manager );
			loader.setCrossOrigin( this.crossOrigin );
			loader.setPath( this.path );

			loader.load( url, function ( image ) {

				texture.image = image;

				// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
				var isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

				texture.format = isJPEG ? RGBFormat : RGBAFormat;
				texture.needsUpdate = true;

				if ( onLoad !== undefined ) {

					onLoad( texture );

				}

			}, onProgress, onError );

			return texture;

		},

		setCrossOrigin: function ( value ) {

			this.crossOrigin = value;
			return this;

		},

		setPath: function ( value ) {

			this.path = value;
			return this;

		}

	} );

	var ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
		'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
		'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
		'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
		'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
		'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
		'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
		'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
		'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
		'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
		'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
		'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
		'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
		'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
		'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
		'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
		'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
		'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
		'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
		'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'rebeccapurple': 0x663399, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
		'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
		'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
		'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
		'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

	function Color( r, g, b ) {

		if ( g === undefined && b === undefined ) {

			// r is Color, hex or string
			return this.set( r );

		}

		return this.setRGB( r, g, b );

	}

	Object.assign( Color.prototype, {

		isColor: true,

		r: 1, g: 1, b: 1,

		set: function ( value ) {

			if ( value && value.isColor ) {

				this.copy( value );

			} else if ( typeof value === 'number' ) {

				this.setHex( value );

			} else if ( typeof value === 'string' ) {

				this.setStyle( value );

			}

			return this;

		},

		setScalar: function ( scalar ) {

			this.r = scalar;
			this.g = scalar;
			this.b = scalar;

			return this;

		},

		setHex: function ( hex ) {

			hex = Math.floor( hex );

			this.r = ( hex >> 16 & 255 ) / 255;
			this.g = ( hex >> 8 & 255 ) / 255;
			this.b = ( hex & 255 ) / 255;

			return this;

		},

		setRGB: function ( r, g, b ) {

			this.r = r;
			this.g = g;
			this.b = b;

			return this;

		},

		setHSL: function () {

			function hue2rgb( p, q, t ) {

				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
				return p;

			}

			return function setHSL( h, s, l ) {

				// h,s,l ranges are in 0.0 - 1.0
				h = _Math.euclideanModulo( h, 1 );
				s = _Math.clamp( s, 0, 1 );
				l = _Math.clamp( l, 0, 1 );

				if ( s === 0 ) {

					this.r = this.g = this.b = l;

				} else {

					var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
					var q = ( 2 * l ) - p;

					this.r = hue2rgb( q, p, h + 1 / 3 );
					this.g = hue2rgb( q, p, h );
					this.b = hue2rgb( q, p, h - 1 / 3 );

				}

				return this;

			};

		}(),

		setStyle: function ( style ) {

			function handleAlpha( string ) {

				if ( string === undefined ) return;

				if ( parseFloat( string ) < 1 ) {

					console.warn( 'Color: Alpha component of ' + style + ' will be ignored.' );

				}

			}


			var m;

			if ( m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec( style ) ) {

				// rgb / hsl

				var color;
				var name = m[ 1 ];
				var components = m[ 2 ];

				switch ( name ) {

					case 'rgb':
					case 'rgba':

						if ( color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// rgb(255,0,0) rgba(255,0,0,0.5)
							this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
							this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
							this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

							handleAlpha( color[ 5 ] );

							return this;

						}

						if ( color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
							this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
							this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
							this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

							handleAlpha( color[ 5 ] );

							return this;

						}

						break;

					case 'hsl':
					case 'hsla':

						if ( color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// hsl(120,50%,50%) hsla(120,50%,50%,0.5)
							var h = parseFloat( color[ 1 ] ) / 360;
							var s = parseInt( color[ 2 ], 10 ) / 100;
							var l = parseInt( color[ 3 ], 10 ) / 100;

							handleAlpha( color[ 5 ] );

							return this.setHSL( h, s, l );

						}

						break;

				}

			} else if ( m = /^\#([A-Fa-f0-9]+)$/.exec( style ) ) {

				// hex color

				var hex = m[ 1 ];
				var size = hex.length;

				if ( size === 3 ) {

					// #ff0
					this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 ) / 255;
					this.g = parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 ) / 255;
					this.b = parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 ) / 255;

					return this;

				} else if ( size === 6 ) {

					// #ff0000
					this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 1 ), 16 ) / 255;
					this.g = parseInt( hex.charAt( 2 ) + hex.charAt( 3 ), 16 ) / 255;
					this.b = parseInt( hex.charAt( 4 ) + hex.charAt( 5 ), 16 ) / 255;

					return this;

				}

			}

			if ( style && style.length > 0 ) {

				// color keywords
				var hex = ColorKeywords[ style ];

				if ( hex !== undefined ) {

					// red
					this.setHex( hex );

				} else {

					// unknown color
					console.warn( 'Color: Unknown color ' + style );

				}

			}

			return this;

		},

		clone: function () {

			return new this.constructor( this.r, this.g, this.b );

		},

		copy: function ( color ) {

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			return this;

		},

		copyGammaToLinear: function ( color, gammaFactor ) {

			if ( gammaFactor === undefined ) gammaFactor = 2.0;

			this.r = Math.pow( color.r, gammaFactor );
			this.g = Math.pow( color.g, gammaFactor );
			this.b = Math.pow( color.b, gammaFactor );

			return this;

		},

		copyLinearToGamma: function ( color, gammaFactor ) {

			if ( gammaFactor === undefined ) gammaFactor = 2.0;

			var safeInverse = ( gammaFactor > 0 ) ? ( 1.0 / gammaFactor ) : 1.0;

			this.r = Math.pow( color.r, safeInverse );
			this.g = Math.pow( color.g, safeInverse );
			this.b = Math.pow( color.b, safeInverse );

			return this;

		},

		convertGammaToLinear: function () {

			var r = this.r, g = this.g, b = this.b;

			this.r = r * r;
			this.g = g * g;
			this.b = b * b;

			return this;

		},

		convertLinearToGamma: function () {

			this.r = Math.sqrt( this.r );
			this.g = Math.sqrt( this.g );
			this.b = Math.sqrt( this.b );

			return this;

		},

		getHex: function () {

			return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

		},

		getHexString: function () {

			return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

		},

		getHSL: function ( optionalTarget ) {

			// h,s,l ranges are in 0.0 - 1.0

			var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

			var r = this.r, g = this.g, b = this.b;

			var max = Math.max( r, g, b );
			var min = Math.min( r, g, b );

			var hue, saturation;
			var lightness = ( min + max ) / 2.0;

			if ( min === max ) {

				hue = 0;
				saturation = 0;

			} else {

				var delta = max - min;

				saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

				switch ( max ) {

					case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
					case g: hue = ( b - r ) / delta + 2; break;
					case b: hue = ( r - g ) / delta + 4; break;

				}

				hue /= 6;

			}

			hsl.h = hue;
			hsl.s = saturation;
			hsl.l = lightness;

			return hsl;

		},

		getStyle: function () {

			return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

		},

		offsetHSL: function ( h, s, l ) {

			var hsl = this.getHSL();

			hsl.h += h; hsl.s += s; hsl.l += l;

			this.setHSL( hsl.h, hsl.s, hsl.l );

			return this;

		},

		add: function ( color ) {

			this.r += color.r;
			this.g += color.g;
			this.b += color.b;

			return this;

		},

		addColors: function ( color1, color2 ) {

			this.r = color1.r + color2.r;
			this.g = color1.g + color2.g;
			this.b = color1.b + color2.b;

			return this;

		},

		addScalar: function ( s ) {

			this.r += s;
			this.g += s;
			this.b += s;

			return this;

		},

		sub: function ( color ) {

			this.r = Math.max( 0, this.r - color.r );
			this.g = Math.max( 0, this.g - color.g );
			this.b = Math.max( 0, this.b - color.b );

			return this;

		},

		multiply: function ( color ) {

			this.r *= color.r;
			this.g *= color.g;
			this.b *= color.b;

			return this;

		},

		multiplyScalar: function ( s ) {

			this.r *= s;
			this.g *= s;
			this.b *= s;

			return this;

		},

		lerp: function ( color, alpha ) {

			this.r += ( color.r - this.r ) * alpha;
			this.g += ( color.g - this.g ) * alpha;
			this.b += ( color.b - this.b ) * alpha;

			return this;

		},

		equals: function ( c ) {

			return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.r = array[ offset ];
			this.g = array[ offset + 1 ];
			this.b = array[ offset + 2 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.r;
			array[ offset + 1 ] = this.g;
			array[ offset + 2 ] = this.b;

			return array;

		},

		toJSON: function () {

			return this.getHex();

		}

	} );

	function Loader() {

		this.onLoadStart = function () {};
		this.onLoadProgress = function () {};
		this.onLoadComplete = function () {};

	}

	Loader.Handlers = {

		handlers: [],

		add: function ( regex, loader ) {

			this.handlers.push( regex, loader );

		},

		get: function ( file ) {

			var handlers = this.handlers;

			for ( var i = 0, l = handlers.length; i < l; i += 2 ) {

				var regex = handlers[ i ];
				var loader = handlers[ i + 1 ];

				if ( regex.test( file ) ) {

					return loader;

				}

			}

			return null;

		}

	};

	Object.assign( Loader.prototype, {

		crossOrigin: undefined,

		initMaterials: function ( materials, texturePath, crossOrigin ) {

			var array = [];

			for ( var i = 0; i < materials.length; ++ i ) {

				array[ i ] = this.createMaterial( materials[ i ], texturePath, crossOrigin );

			}

			return array;

		},

		createMaterial: ( function () {

			var BlendingMode = {
				NoBlending: NoBlending,
				NormalBlending: NormalBlending,
				AdditiveBlending: AdditiveBlending,
				SubtractiveBlending: SubtractiveBlending,
				MultiplyBlending: MultiplyBlending,
				CustomBlending: CustomBlending
			};

			var color = new Color();
			var textureLoader = new TextureLoader();
			var materialLoader = new MaterialLoader();

			return function createMaterial( m, texturePath, crossOrigin ) {

				// convert from old material format

				var textures = {};

				function loadTexture( path, repeat, offset, wrap, anisotropy ) {

					var fullPath = texturePath + path;
					var loader = Loader.Handlers.get( fullPath );

					var texture;

					if ( loader !== null ) {

						texture = loader.load( fullPath );

					} else {

						textureLoader.setCrossOrigin( crossOrigin );
						texture = textureLoader.load( fullPath );

					}

					if ( repeat !== undefined ) {

						texture.repeat.fromArray( repeat );

						if ( repeat[ 0 ] !== 1 ) texture.wrapS = RepeatWrapping;
						if ( repeat[ 1 ] !== 1 ) texture.wrapT = RepeatWrapping;

					}

					if ( offset !== undefined ) {

						texture.offset.fromArray( offset );

					}

					if ( wrap !== undefined ) {

						if ( wrap[ 0 ] === 'repeat' ) texture.wrapS = RepeatWrapping;
						if ( wrap[ 0 ] === 'mirror' ) texture.wrapS = MirroredRepeatWrapping;

						if ( wrap[ 1 ] === 'repeat' ) texture.wrapT = RepeatWrapping;
						if ( wrap[ 1 ] === 'mirror' ) texture.wrapT = MirroredRepeatWrapping;

					}

					if ( anisotropy !== undefined ) {

						texture.anisotropy = anisotropy;

					}

					var uuid = _Math.generateUUID();

					textures[ uuid ] = texture;

					return uuid;

				}

				//

				var json = {
					uuid: _Math.generateUUID(),
					type: 'MeshLambertMaterial'
				};

				for ( var name in m ) {

					var value = m[ name ];

					switch ( name ) {

						case 'DbgColor':
						case 'DbgIndex':
						case 'opticalDensity':
						case 'illumination':
							break;
						case 'DbgName':
							json.name = value;
							break;
						case 'blending':
							json.blending = BlendingMode[ value ];
							break;
						case 'colorAmbient':
						case 'mapAmbient':
							console.warn( 'Loader.createMaterial:', name, 'is no longer supported.' );
							break;
						case 'colorDiffuse':
							json.color = color.fromArray( value ).getHex();
							break;
						case 'colorSpecular':
							json.specular = color.fromArray( value ).getHex();
							break;
						case 'colorEmissive':
							json.emissive = color.fromArray( value ).getHex();
							break;
						case 'specularCoef':
							json.shininess = value;
							break;
						case 'shading':
							if ( value.toLowerCase() === 'basic' ) json.type = 'MeshBasicMaterial';
							if ( value.toLowerCase() === 'phong' ) json.type = 'MeshPhongMaterial';
							if ( value.toLowerCase() === 'standard' ) json.type = 'MeshStandardMaterial';
							break;
						case 'mapDiffuse':
							json.map = loadTexture( value, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy );
							break;
						case 'mapDiffuseRepeat':
						case 'mapDiffuseOffset':
						case 'mapDiffuseWrap':
						case 'mapDiffuseAnisotropy':
							break;
						case 'mapEmissive':
							json.emissiveMap = loadTexture( value, m.mapEmissiveRepeat, m.mapEmissiveOffset, m.mapEmissiveWrap, m.mapEmissiveAnisotropy );
							break;
						case 'mapEmissiveRepeat':
						case 'mapEmissiveOffset':
						case 'mapEmissiveWrap':
						case 'mapEmissiveAnisotropy':
							break;
						case 'mapLight':
							json.lightMap = loadTexture( value, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy );
							break;
						case 'mapLightRepeat':
						case 'mapLightOffset':
						case 'mapLightWrap':
						case 'mapLightAnisotropy':
							break;
						case 'mapAO':
							json.aoMap = loadTexture( value, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy );
							break;
						case 'mapAORepeat':
						case 'mapAOOffset':
						case 'mapAOWrap':
						case 'mapAOAnisotropy':
							break;
						case 'mapBump':
							json.bumpMap = loadTexture( value, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy );
							break;
						case 'mapBumpScale':
							json.bumpScale = value;
							break;
						case 'mapBumpRepeat':
						case 'mapBumpOffset':
						case 'mapBumpWrap':
						case 'mapBumpAnisotropy':
							break;
						case 'mapNormal':
							json.normalMap = loadTexture( value, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy );
							break;
						case 'mapNormalFactor':
							json.normalScale = [ value, value ];
							break;
						case 'mapNormalRepeat':
						case 'mapNormalOffset':
						case 'mapNormalWrap':
						case 'mapNormalAnisotropy':
							break;
						case 'mapSpecular':
							json.specularMap = loadTexture( value, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy );
							break;
						case 'mapSpecularRepeat':
						case 'mapSpecularOffset':
						case 'mapSpecularWrap':
						case 'mapSpecularAnisotropy':
							break;
						case 'mapMetalness':
							json.metalnessMap = loadTexture( value, m.mapMetalnessRepeat, m.mapMetalnessOffset, m.mapMetalnessWrap, m.mapMetalnessAnisotropy );
							break;
						case 'mapMetalnessRepeat':
						case 'mapMetalnessOffset':
						case 'mapMetalnessWrap':
						case 'mapMetalnessAnisotropy':
							break;
						case 'mapRoughness':
							json.roughnessMap = loadTexture( value, m.mapRoughnessRepeat, m.mapRoughnessOffset, m.mapRoughnessWrap, m.mapRoughnessAnisotropy );
							break;
						case 'mapRoughnessRepeat':
						case 'mapRoughnessOffset':
						case 'mapRoughnessWrap':
						case 'mapRoughnessAnisotropy':
							break;
						case 'mapAlpha':
							json.alphaMap = loadTexture( value, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy );
							break;
						case 'mapAlphaRepeat':
						case 'mapAlphaOffset':
						case 'mapAlphaWrap':
						case 'mapAlphaAnisotropy':
							break;
						case 'flipSided':
							json.side = BackSide;
							break;
						case 'doubleSided':
							json.side = DoubleSide;
							break;
						case 'transparency':
							console.warn( 'Loader.createMaterial: transparency has been renamed to opacity' );
							json.opacity = value;
							break;
						case 'depthTest':
						case 'depthWrite':
						case 'colorWrite':
						case 'opacity':
						case 'reflectivity':
						case 'transparent':
						case 'visible':
						case 'wireframe':
							json[ name ] = value;
							break;
						case 'vertexColors':
							if ( value === true ) json.vertexColors = VertexColors;
							if ( value === 'face' ) json.vertexColors = FaceColors;
							break;
						default:
							console.error( 'Loader.createMaterial: Unsupported', name, value );
							break;

					}

				}

				if ( json.type === 'MeshBasicMaterial' ) delete json.emissive;
				if ( json.type !== 'MeshPhongMaterial' ) delete json.specular;

				if ( json.opacity < 1 ) json.transparent = true;

				materialLoader.setTextures( textures );

				return materialLoader.parse( json );

			};

		} )()

	} );

	function StringKeyframeTrack( name, times, values, interpolation ) {

		KeyframeTrack.call( this, name, times, values, interpolation );

	}

	StringKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: StringKeyframeTrack,

		ValueTypeName: 'string',
		ValueBufferType: Array,

		DefaultInterpolation: InterpolateDiscrete,

		InterpolantFactoryMethodLinear: undefined,

		InterpolantFactoryMethodSmooth: undefined

	} );

	function BooleanKeyframeTrack( name, times, values ) {

		KeyframeTrack.call( this, name, times, values );

	}

	BooleanKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: BooleanKeyframeTrack,

		ValueTypeName: 'bool',
		ValueBufferType: Array,

		DefaultInterpolation: InterpolateDiscrete,

		InterpolantFactoryMethodLinear: undefined,
		InterpolantFactoryMethodSmooth: undefined

		// Note: Actually this track could have a optimized / compressed
		// representation of a single value and a custom interpolant that
		// computes "firstValue ^ isOdd( index )".

	} );

	function Interpolant$1( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		this.parameterPositions = parameterPositions;
		this._cachedIndex = 0;

		this.resultBuffer = resultBuffer !== undefined ?
			resultBuffer : new sampleValues.constructor( sampleSize );
		this.sampleValues = sampleValues;
		this.valueSize = sampleSize;

	}

	Object.assign( Interpolant$1.prototype, {

		evaluate: function ( t ) {

			var pp = this.parameterPositions,
				i1 = this._cachedIndex,

				t1 = pp[ i1 ],
				t0 = pp[ i1 - 1 ];

			validate_interval: {

				seek: {

					var right;

					linear_scan: {

						//- See http://jsperf.com/comparison-to-undefined/3
						//- slower code:
						//-
						//- 				if ( t >= t1 || t1 === undefined ) {
						forward_scan: if ( ! ( t < t1 ) ) {

							for ( var giveUpAt = i1 + 2; ; ) {

								if ( t1 === undefined ) {

									if ( t < t0 ) break forward_scan;

									// after end

									i1 = pp.length;
									this._cachedIndex = i1;
									return this.afterEnd_( i1 - 1, t, t0 );

								}

								if ( i1 === giveUpAt ) break; // this loop

								t0 = t1;
								t1 = pp[ ++ i1 ];

								if ( t < t1 ) {

									// we have arrived at the sought interval
									break seek;

								}

							}

							// prepare binary search on the right side of the index
							right = pp.length;
							break linear_scan;

						}

						//- slower code:
						//-					if ( t < t0 || t0 === undefined ) {
						if ( ! ( t >= t0 ) ) {

							// looping?

							var t1global = pp[ 1 ];

							if ( t < t1global ) {

								i1 = 2; // + 1, using the scan for the details
								t0 = t1global;

							}

							// linear reverse scan

							for ( var giveUpAt = i1 - 2; ; ) {

								if ( t0 === undefined ) {

									// before start

									this._cachedIndex = 0;
									return this.beforeStart_( 0, t, t1 );

								}

								if ( i1 === giveUpAt ) break; // this loop

								t1 = t0;
								t0 = pp[ -- i1 - 1 ];

								if ( t >= t0 ) {

									// we have arrived at the sought interval
									break seek;

								}

							}

							// prepare binary search on the left side of the index
							right = i1;
							i1 = 0;
							break linear_scan;

						}

						// the interval is valid

						break validate_interval;

					} // linear scan

					// binary search

					while ( i1 < right ) {

						var mid = ( i1 + right ) >>> 1;

						if ( t < pp[ mid ] ) {

							right = mid;

						} else {

							i1 = mid + 1;

						}

					}

					t1 = pp[ i1 ];
					t0 = pp[ i1 - 1 ];

					// check boundary cases, again

					if ( t0 === undefined ) {

						this._cachedIndex = 0;
						return this.beforeStart_( 0, t, t1 );

					}

					if ( t1 === undefined ) {

						i1 = pp.length;
						this._cachedIndex = i1;
						return this.afterEnd_( i1 - 1, t0, t );

					}

				} // seek

				this._cachedIndex = i1;

				this.intervalChanged_( i1, t0, t1 );

			} // validate_interval

			return this.interpolate_( i1, t0, t, t1 );

		},

		settings: null, // optional, subclass-specific settings structure
		// Note: The indirection allows central control of many interpolants.

		// --- Protected interface

		DefaultSettings_: {},

		getSettings_: function () {

			return this.settings || this.DefaultSettings_;

		},

		copySampleValue_: function ( index ) {

			// copies a sample value to the result buffer

			var result = this.resultBuffer,
				values = this.sampleValues,
				stride = this.valueSize,
				offset = index * stride;

			for ( var i = 0; i !== stride; ++ i ) {

				result[ i ] = values[ offset + i ];

			}

			return result;

		},

		// Template methods for derived classes:

		interpolate_: function (  ) {

			throw new Error( 'call to abstract method' );
			// implementations shall return this.resultBuffer

		},

		intervalChanged_: function (  ) {

			// empty

		}

	} );

	//!\ DECLARE ALIAS AFTER assign prototype !
	Object.assign( Interpolant$1.prototype, {

		//( 0, t, t0 ), returns this.resultBuffer
		beforeStart_: Interpolant$1.prototype.copySampleValue_,

		//( N-1, tN-1, t ), returns this.resultBuffer
		afterEnd_: Interpolant$1.prototype.copySampleValue_,

	} );

	function QuaternionLinearInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		Interpolant$1.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	QuaternionLinearInterpolant.prototype = Object.assign( Object.create( Interpolant$1.prototype ), {

		constructor: QuaternionLinearInterpolant,

		interpolate_: function ( i1, t0, t, t1 ) {

			var result = this.resultBuffer,
				values = this.sampleValues,
				stride = this.valueSize,

				offset = i1 * stride,

				alpha = ( t - t0 ) / ( t1 - t0 );

			for ( var end = offset + stride; offset !== end; offset += 4 ) {

				Quaternion.slerpFlat( result, 0, values, offset - stride, values, offset, alpha );

			}

			return result;

		}

	} );

	function QuaternionKeyframeTrack( name, times, values, interpolation ) {

		KeyframeTrack.call( this, name, times, values, interpolation );

	}

	QuaternionKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: QuaternionKeyframeTrack,

		ValueTypeName: 'quaternion',

		// ValueBufferType is inherited

		DefaultInterpolation: InterpolateLinear,

		InterpolantFactoryMethodLinear: function ( result ) {

			return new QuaternionLinearInterpolant( this.times, this.values, this.getValueSize(), result );

		},

		InterpolantFactoryMethodSmooth: undefined // not yet implemented

	} );

	function ColorKeyframeTrack( name, times, values, interpolation ) {

		KeyframeTrack.call( this, name, times, values, interpolation );

	}

	ColorKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: ColorKeyframeTrack,

		ValueTypeName: 'color'

		// ValueBufferType is inherited

		// DefaultInterpolation is inherited

		// Note: Very basic implementation and nothing special yet.
		// However, this is the place for color space parameterization.

	} );

	function NumberKeyframeTrack( name, times, values, interpolation ) {

		KeyframeTrack.call( this, name, times, values, interpolation );

	}

	NumberKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: NumberKeyframeTrack,

		ValueTypeName: 'number'

		// ValueBufferType is inherited

		// DefaultInterpolation is inherited

	} );

	function CubicInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		Interpolant$1.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

		this._weightPrev = - 0;
		this._offsetPrev = - 0;
		this._weightNext = - 0;
		this._offsetNext = - 0;

	}

	CubicInterpolant.prototype = Object.assign( Object.create( Interpolant$1.prototype ), {

		constructor: CubicInterpolant,

		DefaultSettings_: {

			endingStart: ZeroCurvatureEnding,
			endingEnd: ZeroCurvatureEnding

		},

		intervalChanged_: function ( i1, t0, t1 ) {

			var pp = this.parameterPositions,
				iPrev = i1 - 2,
				iNext = i1 + 1,

				tPrev = pp[ iPrev ],
				tNext = pp[ iNext ];

			if ( tPrev === undefined ) {

				switch ( this.getSettings_().endingStart ) {

					case ZeroSlopeEnding:

						// f'(t0) = 0
						iPrev = i1;
						tPrev = 2 * t0 - t1;

						break;

					case WrapAroundEnding:

						// use the other end of the curve
						iPrev = pp.length - 2;
						tPrev = t0 + pp[ iPrev ] - pp[ iPrev + 1 ];

						break;

					default: // ZeroCurvatureEnding

						// f''(t0) = 0 a.k.a. Natural Spline
						iPrev = i1;
						tPrev = t1;

				}

			}

			if ( tNext === undefined ) {

				switch ( this.getSettings_().endingEnd ) {

					case ZeroSlopeEnding:

						// f'(tN) = 0
						iNext = i1;
						tNext = 2 * t1 - t0;

						break;

					case WrapAroundEnding:

						// use the other end of the curve
						iNext = 1;
						tNext = t1 + pp[ 1 ] - pp[ 0 ];

						break;

					default: // ZeroCurvatureEnding

						// f''(tN) = 0, a.k.a. Natural Spline
						iNext = i1 - 1;
						tNext = t0;

				}

			}

			var halfDt = ( t1 - t0 ) * 0.5,
				stride = this.valueSize;

			this._weightPrev = halfDt / ( t0 - tPrev );
			this._weightNext = halfDt / ( tNext - t1 );
			this._offsetPrev = iPrev * stride;
			this._offsetNext = iNext * stride;

		},

		interpolate_: function ( i1, t0, t, t1 ) {

			var result = this.resultBuffer,
				values = this.sampleValues,
				stride = this.valueSize,

				o1 = i1 * stride,		o0 = o1 - stride,
				oP = this._offsetPrev, 	oN = this._offsetNext,
				wP = this._weightPrev,	wN = this._weightNext,

				p = ( t - t0 ) / ( t1 - t0 ),
				pp = p * p,
				ppp = pp * p;

			// evaluate polynomials

			var sP = - wP * ppp + 2 * wP * pp - wP * p;
			var s0 = ( 1 + wP ) * ppp + ( - 1.5 - 2 * wP ) * pp + ( - 0.5 + wP ) * p + 1;
			var s1 = ( - 1 - wN ) * ppp + ( 1.5 + wN ) * pp + 0.5 * p;
			var sN = wN * ppp - wN * pp;

			// combine data linearly

			for ( var i = 0; i !== stride; ++ i ) {

				result[ i ] =
						sP * values[ oP + i ] +
						s0 * values[ o0 + i ] +
						s1 * values[ o1 + i ] +
						sN * values[ oN + i ];

			}

			return result;

		}

	} );

	function LinearInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		Interpolant$1.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	LinearInterpolant.prototype = Object.assign( Object.create( Interpolant$1.prototype ), {

		constructor: LinearInterpolant,

		interpolate_: function ( i1, t0, t, t1 ) {

			var result = this.resultBuffer,
				values = this.sampleValues,
				stride = this.valueSize,

				offset1 = i1 * stride,
				offset0 = offset1 - stride,

				weight1 = ( t - t0 ) / ( t1 - t0 ),
				weight0 = 1 - weight1;

			for ( var i = 0; i !== stride; ++ i ) {

				result[ i ] =
						values[ offset0 + i ] * weight0 +
						values[ offset1 + i ] * weight1;

			}

			return result;

		}

	} );

	function DiscreteInterpolant( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		Interpolant$1.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	DiscreteInterpolant.prototype = Object.assign( Object.create( Interpolant$1.prototype ), {

		constructor: DiscreteInterpolant,

		interpolate_: function ( i1  ) {

			return this.copySampleValue_( i1 - 1 );

		}

	} );

	var AnimationUtils = {

		// same as Array.prototype.slice, but also works on typed arrays
		arraySlice: function ( array, from, to ) {

			if ( AnimationUtils.isTypedArray( array ) ) {

				// in ios9 array.subarray(from, undefined) will return empty array
				// but array.subarray(from) or array.subarray(from, len) is correct
				return new array.constructor( array.subarray( from, to !== undefined ? to : array.length ) );

			}

			return array.slice( from, to );

		},

		// converts an array to a specific type
		convertArray: function ( array, type, forceClone ) {

			if ( ! array || // let 'undefined' and 'null' pass
					! forceClone && array.constructor === type ) return array;

			if ( typeof type.BYTES_PER_ELEMENT === 'number' ) {

				return new type( array ); // create typed array

			}

			return Array.prototype.slice.call( array ); // create Array

		},

		isTypedArray: function ( object ) {

			return ArrayBuffer.isView( object ) &&
					! ( object instanceof DataView );

		},

		// returns an array by which times and values can be sorted
		getKeyframeOrder: function ( times ) {

			function compareTime( i, j ) {

				return times[ i ] - times[ j ];

			}

			var n = times.length;
			var result = new Array( n );
			for ( var i = 0; i !== n; ++ i ) result[ i ] = i;

			result.sort( compareTime );

			return result;

		},

		// uses the array previously returned by 'getKeyframeOrder' to sort data
		sortedArray: function ( values, stride, order ) {

			var nValues = values.length;
			var result = new values.constructor( nValues );

			for ( var i = 0, dstOffset = 0; dstOffset !== nValues; ++ i ) {

				var srcOffset = order[ i ] * stride;

				for ( var j = 0; j !== stride; ++ j ) {

					result[ dstOffset ++ ] = values[ srcOffset + j ];

				}

			}

			return result;

		},

		// function for parsing AOS keyframe formats
		flattenJSON: function ( jsonKeys, times, values, valuePropertyName ) {

			var i = 1, key = jsonKeys[ 0 ];

			while ( key !== undefined && key[ valuePropertyName ] === undefined ) {

				key = jsonKeys[ i ++ ];

			}

			if ( key === undefined ) return; // no data

			var value = key[ valuePropertyName ];
			if ( value === undefined ) return; // no data

			if ( Array.isArray( value ) ) {

				do {

					value = key[ valuePropertyName ];

					if ( value !== undefined ) {

						times.push( key.time );
						values.push.apply( values, value ); // push all elements

					}

					key = jsonKeys[ i ++ ];

				} while ( key !== undefined );

			} else if ( value.toArray !== undefined ) {

				// ...assume Math-ish

				do {

					value = key[ valuePropertyName ];

					if ( value !== undefined ) {

						times.push( key.time );
						value.toArray( values, values.length );

					}

					key = jsonKeys[ i ++ ];

				} while ( key !== undefined );

			} else {

				// otherwise push as-is

				do {

					value = key[ valuePropertyName ];

					if ( value !== undefined ) {

						times.push( key.time );
						values.push( value );

					}

					key = jsonKeys[ i ++ ];

				} while ( key !== undefined );

			}

		}

	};

	function KeyframeTrack( name, times, values, interpolation ) {

		if ( name === undefined ) throw new Error( 'KeyframeTrack: track name is undefined' );
		if ( times === undefined || times.length === 0 ) throw new Error( 'KeyframeTrack: no keyframes in track named ' + name );

		this.name = name;

		this.times = AnimationUtils.convertArray( times, this.TimeBufferType );
		this.values = AnimationUtils.convertArray( values, this.ValueBufferType );

		this.setInterpolation( interpolation || this.DefaultInterpolation );

		this.validate();
		this.optimize();

	}

	// Static methods:

	Object.assign( KeyframeTrack, {

		// Serialization (in static context, because of constructor invocation
		// and automatic invocation of .toJSON):

		parse: function ( json ) {

			if ( json.type === undefined ) {

				throw new Error( 'KeyframeTrack: track type undefined, can not parse' );

			}

			var trackType = KeyframeTrack._getTrackTypeForValueTypeName( json.type );

			if ( json.times === undefined ) {

				var times = [], values = [];

				AnimationUtils.flattenJSON( json.keys, times, values, 'value' );

				json.times = times;
				json.values = values;

			}

			// derived classes can define a static parse method
			if ( trackType.parse !== undefined ) {

				return trackType.parse( json );

			} else {

				// by default, we assume a constructor compatible with the base
				return new trackType( json.name, json.times, json.values, json.interpolation );

			}

		},

		toJSON: function ( track ) {

			var trackType = track.constructor;

			var json;

			// derived classes can define a static toJSON method
			if ( trackType.toJSON !== undefined ) {

				json = trackType.toJSON( track );

			} else {

				// by default, we assume the data can be serialized as-is
				json = {

					'name': track.name,
					'times': AnimationUtils.convertArray( track.times, Array ),
					'values': AnimationUtils.convertArray( track.values, Array )

				};

				var interpolation = track.getInterpolation();

				if ( interpolation !== track.DefaultInterpolation ) {

					json.interpolation = interpolation;

				}

			}

			json.type = track.ValueTypeName; // mandatory

			return json;

		},

		_getTrackTypeForValueTypeName: function ( typeName ) {

			switch ( typeName.toLowerCase() ) {

				case 'scalar':
				case 'double':
				case 'float':
				case 'number':
				case 'integer':

					return NumberKeyframeTrack;

				case 'vector':
				case 'vector2':
				case 'vector3':
				case 'vector4':

					return VectorKeyframeTrack;

				case 'color':

					return ColorKeyframeTrack;

				case 'quaternion':

					return QuaternionKeyframeTrack;

				case 'bool':
				case 'boolean':

					return BooleanKeyframeTrack;

				case 'string':

					return StringKeyframeTrack;

			}

			throw new Error( 'KeyframeTrack: Unsupported typeName: ' + typeName );

		}

	} );

	Object.assign( KeyframeTrack.prototype, {

		constructor: KeyframeTrack,

		TimeBufferType: Float32Array,

		ValueBufferType: Float32Array,

		DefaultInterpolation: InterpolateLinear,

		InterpolantFactoryMethodDiscrete: function ( result ) {

			return new DiscreteInterpolant( this.times, this.values, this.getValueSize(), result );

		},

		InterpolantFactoryMethodLinear: function ( result ) {

			return new LinearInterpolant( this.times, this.values, this.getValueSize(), result );

		},

		InterpolantFactoryMethodSmooth: function ( result ) {

			return new CubicInterpolant( this.times, this.values, this.getValueSize(), result );

		},

		setInterpolation: function ( interpolation ) {

			var factoryMethod;

			switch ( interpolation ) {

				case InterpolateDiscrete:

					factoryMethod = this.InterpolantFactoryMethodDiscrete;

					break;

				case InterpolateLinear:

					factoryMethod = this.InterpolantFactoryMethodLinear;

					break;

				case InterpolateSmooth:

					factoryMethod = this.InterpolantFactoryMethodSmooth;

					break;

			}

			if ( factoryMethod === undefined ) {

				var message = "unsupported interpolation for " +
					this.ValueTypeName + " keyframe track named " + this.name;

				if ( this.createInterpolant === undefined ) {

					// fall back to default, unless the default itself is messed up
					if ( interpolation !== this.DefaultInterpolation ) {

						this.setInterpolation( this.DefaultInterpolation );

					} else {

						throw new Error( message ); // fatal, in this case

					}

				}

				console.warn( 'KeyframeTrack:', message );
				return;

			}

			this.createInterpolant = factoryMethod;

		},

		getInterpolation: function () {

			switch ( this.createInterpolant ) {

				case this.InterpolantFactoryMethodDiscrete:

					return InterpolateDiscrete;

				case this.InterpolantFactoryMethodLinear:

					return InterpolateLinear;

				case this.InterpolantFactoryMethodSmooth:

					return InterpolateSmooth;

			}

		},

		getValueSize: function () {

			return this.values.length / this.times.length;

		},

		// move all keyframes either forwards or backwards in time
		shift: function ( timeOffset ) {

			if ( timeOffset !== 0.0 ) {

				var times = this.times;

				for ( var i = 0, n = times.length; i !== n; ++ i ) {

					times[ i ] += timeOffset;

				}

			}

			return this;

		},

		// scale all keyframe times by a factor (useful for frame <-> seconds conversions)
		scale: function ( timeScale ) {

			if ( timeScale !== 1.0 ) {

				var times = this.times;

				for ( var i = 0, n = times.length; i !== n; ++ i ) {

					times[ i ] *= timeScale;

				}

			}

			return this;

		},

		// removes keyframes before and after animation without changing any values within the range [startTime, endTime].
		// IMPORTANT: We do not shift around keys to the start of the track time, because for interpolated keys this will change their values
		trim: function ( startTime, endTime ) {

			var times = this.times,
				nKeys = times.length,
				from = 0,
				to = nKeys - 1;

			while ( from !== nKeys && times[ from ] < startTime ) {

				++ from;

			}

			while ( to !== - 1 && times[ to ] > endTime ) {

				-- to;

			}

			++ to; // inclusive -> exclusive bound

			if ( from !== 0 || to !== nKeys ) {

				// empty tracks are forbidden, so keep at least one keyframe
				if ( from >= to ) to = Math.max( to, 1 ), from = to - 1;

				var stride = this.getValueSize();
				this.times = AnimationUtils.arraySlice( times, from, to );
				this.values = AnimationUtils.arraySlice( this.values, from * stride, to * stride );

			}

			return this;

		},

		// ensure we do not get a GarbageInGarbageOut situation, make sure tracks are at least minimally viable
		validate: function () {

			var valid = true;

			var valueSize = this.getValueSize();
			if ( valueSize - Math.floor( valueSize ) !== 0 ) {

				console.error( 'KeyframeTrack: Invalid value size in track.', this );
				valid = false;

			}

			var times = this.times,
				values = this.values,

				nKeys = times.length;

			if ( nKeys === 0 ) {

				console.error( 'KeyframeTrack: Track is empty.', this );
				valid = false;

			}

			var prevTime = null;

			for ( var i = 0; i !== nKeys; i ++ ) {

				var currTime = times[ i ];

				if ( typeof currTime === 'number' && isNaN( currTime ) ) {

					console.error( 'KeyframeTrack: Time is not a valid number.', this, i, currTime );
					valid = false;
					break;

				}

				if ( prevTime !== null && prevTime > currTime ) {

					console.error( 'KeyframeTrack: Out of order keys.', this, i, currTime, prevTime );
					valid = false;
					break;

				}

				prevTime = currTime;

			}

			if ( values !== undefined ) {

				if ( AnimationUtils.isTypedArray( values ) ) {

					for ( var i = 0, n = values.length; i !== n; ++ i ) {

						var value = values[ i ];

						if ( isNaN( value ) ) {

							console.error( 'KeyframeTrack: Value is not a valid number.', this, i, value );
							valid = false;
							break;

						}

					}

				}

			}

			return valid;

		},

		// removes equivalent sequential keys as common in morph target sequences
		// (0,0,0,0,1,1,1,0,0,0,0,0,0,0) --> (0,0,1,1,0,0)
		optimize: function () {

			var times = this.times,
				values = this.values,
				stride = this.getValueSize(),

				smoothInterpolation = this.getInterpolation() === InterpolateSmooth,

				writeIndex = 1,
				lastIndex = times.length - 1;

			for ( var i = 1; i < lastIndex; ++ i ) {

				var keep = false;

				var time = times[ i ];
				var timeNext = times[ i + 1 ];

				// remove adjacent keyframes scheduled at the same time

				if ( time !== timeNext && ( i !== 1 || time !== time[ 0 ] ) ) {

					if ( ! smoothInterpolation ) {

						// remove unnecessary keyframes same as their neighbors

						var offset = i * stride,
							offsetP = offset - stride,
							offsetN = offset + stride;

						for ( var j = 0; j !== stride; ++ j ) {

							var value = values[ offset + j ];

							if ( value !== values[ offsetP + j ] ||
								value !== values[ offsetN + j ] ) {

								keep = true;
								break;

							}

						}

					} else {

						keep = true;

					}

				}

				// in-place compaction

				if ( keep ) {

					if ( i !== writeIndex ) {

						times[ writeIndex ] = times[ i ];

						var readOffset = i * stride,
							writeOffset = writeIndex * stride;

						for ( var j = 0; j !== stride; ++ j ) {

							values[ writeOffset + j ] = values[ readOffset + j ];

						}

					}

					++ writeIndex;

				}

			}

			// flush last keyframe (compaction looks ahead)

			if ( lastIndex > 0 ) {

				times[ writeIndex ] = times[ lastIndex ];

				for ( var readOffset = lastIndex * stride, writeOffset = writeIndex * stride, j = 0; j !== stride; ++ j ) {

					values[ writeOffset + j ] = values[ readOffset + j ];

				}

				++ writeIndex;

			}

			if ( writeIndex !== times.length ) {

				this.times = AnimationUtils.arraySlice( times, 0, writeIndex );
				this.values = AnimationUtils.arraySlice( values, 0, writeIndex * stride );

			}

			return this;

		}

	} );

	function VectorKeyframeTrack( name, times, values, interpolation ) {

		KeyframeTrack.call( this, name, times, values, interpolation );

	}

	VectorKeyframeTrack.prototype = Object.assign( Object.create( KeyframeTrack.prototype ), {

		constructor: VectorKeyframeTrack,

		ValueTypeName: 'vector'

		// ValueBufferType is inherited

		// DefaultInterpolation is inherited

	} );

	function Euler( x, y, z, order ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._order = order || Euler.DefaultOrder;

	}

	Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

	Euler.DefaultOrder = 'XYZ';

	Object.defineProperties( Euler.prototype, {

		x: {

			get: function () {

				return this._x;

			},

			set: function ( value ) {

				this._x = value;
				this.onChangeCallback();

			}

		},

		y: {

			get: function () {

				return this._y;

			},

			set: function ( value ) {

				this._y = value;
				this.onChangeCallback();

			}

		},

		z: {

			get: function () {

				return this._z;

			},

			set: function ( value ) {

				this._z = value;
				this.onChangeCallback();

			}

		},

		order: {

			get: function () {

				return this._order;

			},

			set: function ( value ) {

				this._order = value;
				this.onChangeCallback();

			}

		}

	} );

	Object.assign( Euler.prototype, {

		isEuler: true,

		set: function ( x, y, z, order ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order || this._order;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor( this._x, this._y, this._z, this._order );

		},

		copy: function ( euler ) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function ( m, order, update ) {

			var clamp = _Math.clamp;

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements;
			var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
			var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
			var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			order = order || this._order;

			if ( order === 'XYZ' ) {

				this._y = Math.asin( clamp( m13, - 1, 1 ) );

				if ( Math.abs( m13 ) < 0.99999 ) {

					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );

				} else {

					this._x = Math.atan2( m32, m22 );
					this._z = 0;

				}

			} else if ( order === 'YXZ' ) {

				this._x = Math.asin( - clamp( m23, - 1, 1 ) );

				if ( Math.abs( m23 ) < 0.99999 ) {

					this._y = Math.atan2( m13, m33 );
					this._z = Math.atan2( m21, m22 );

				} else {

					this._y = Math.atan2( - m31, m11 );
					this._z = 0;

				}

			} else if ( order === 'ZXY' ) {

				this._x = Math.asin( clamp( m32, - 1, 1 ) );

				if ( Math.abs( m32 ) < 0.99999 ) {

					this._y = Math.atan2( - m31, m33 );
					this._z = Math.atan2( - m12, m22 );

				} else {

					this._y = 0;
					this._z = Math.atan2( m21, m11 );

				}

			} else if ( order === 'ZYX' ) {

				this._y = Math.asin( - clamp( m31, - 1, 1 ) );

				if ( Math.abs( m31 ) < 0.99999 ) {

					this._x = Math.atan2( m32, m33 );
					this._z = Math.atan2( m21, m11 );

				} else {

					this._x = 0;
					this._z = Math.atan2( - m12, m22 );

				}

			} else if ( order === 'YZX' ) {

				this._z = Math.asin( clamp( m21, - 1, 1 ) );

				if ( Math.abs( m21 ) < 0.99999 ) {

					this._x = Math.atan2( - m23, m22 );
					this._y = Math.atan2( - m31, m11 );

				} else {

					this._x = 0;
					this._y = Math.atan2( m13, m33 );

				}

			} else if ( order === 'XZY' ) {

				this._z = Math.asin( - clamp( m12, - 1, 1 ) );

				if ( Math.abs( m12 ) < 0.99999 ) {

					this._x = Math.atan2( m32, m22 );
					this._y = Math.atan2( m13, m11 );

				} else {

					this._x = Math.atan2( - m23, m33 );
					this._y = 0;

				}

			} else {

				console.warn( 'Euler: .setFromRotationMatrix() given unsupported order: ' + order );

			}

			this._order = order;

			if ( update !== false ) this.onChangeCallback();

			return this;

		},

		setFromQuaternion: function () {

			var matrix = new Matrix4();

			return function setFromQuaternion( q, order, update ) {

				matrix.makeRotationFromQuaternion( q );

				return this.setFromRotationMatrix( matrix, order, update );

			};

		}(),

		setFromVector3: function ( v, order ) {

			return this.set( v.x, v.y, v.z, order || this._order );

		},

		reorder: function () {

			// WARNING: this discards revolution information -bhouston

			var q = new Quaternion();

			return function reorder( newOrder ) {

				q.setFromEuler( this );

				return this.setFromQuaternion( q, newOrder );

			};

		}(),

		equals: function ( euler ) {

			return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

		},

		fromArray: function ( array ) {

			this._x = array[ 0 ];
			this._y = array[ 1 ];
			this._z = array[ 2 ];
			if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

			this.onChangeCallback();

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._order;

			return array;

		},

		toVector3: function ( optionalResult ) {

			if ( optionalResult ) {

				return optionalResult.set( this._x, this._y, this._z );

			} else {

				return new Vector3( this._x, this._y, this._z );

			}

		},

		onChange: function ( callback ) {

			this.onChangeCallback = callback;

			return this;

		},

		onChangeCallback: function () {}

	} );

	function Layers() {

		this.mask = 1 | 0;

	}

	Object.assign( Layers.prototype, {

		set: function ( channel ) {

			this.mask = 1 << channel | 0;

		},

		enable: function ( channel ) {

			this.mask |= 1 << channel | 0;

		},

		toggle: function ( channel ) {

			this.mask ^= 1 << channel | 0;

		},

		disable: function ( channel ) {

			this.mask &= ~ ( 1 << channel | 0 );

		},

		test: function ( layers ) {

			return ( this.mask & layers.mask ) !== 0;

		}

	} );

	var object3DId = 0;

	function Object3D() {

		Object.defineProperty( this, 'id', { value: object3DId ++ } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'Object3D';

		this.parent = null;
		this.children = [];

		this.up = Object3D.DefaultUp.clone();

		var position = new Vector3();
		var rotation = new Euler();
		var quaternion = new Quaternion();
		var scale = new Vector3( 1, 1, 1 );

		function onRotationChange() {

			quaternion.setFromEuler( rotation, false );

		}

		function onQuaternionChange() {

			rotation.setFromQuaternion( quaternion, undefined, false );

		}

		rotation.onChange( onRotationChange );
		quaternion.onChange( onQuaternionChange );

		Object.defineProperties( this, {
			position: {
				enumerable: true,
				value: position
			},
			rotation: {
				enumerable: true,
				value: rotation
			},
			quaternion: {
				enumerable: true,
				value: quaternion
			},
			scale: {
				enumerable: true,
				value: scale
			},
			modelViewMatrix: {
				value: new Matrix4()
			},
			normalMatrix: {
				value: new Matrix3()
			}
		} );

		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();

		this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
		this.matrixWorldNeedsUpdate = false;

		this.layers = new Layers();
		this.visible = true;

		this.castShadow = false;
		this.receiveShadow = false;

		this.frustumCulled = true;
		this.renderOrder = 0;

		this.userData = {};

	}

	Object3D.DefaultUp = new Vector3( 0, 1, 0 );
	Object3D.DefaultMatrixAutoUpdate = true;

	Object3D.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: Object3D,

		isObject3D: true,

		onBeforeRender: function () {},
		onAfterRender: function () {},

		applyMatrix: function ( matrix ) {

			this.matrix.multiplyMatrices( matrix, this.matrix );

			this.matrix.decompose( this.position, this.quaternion, this.scale );

		},

		applyQuaternion: function ( q ) {

			this.quaternion.premultiply( q );

			return this;

		},

		setRotationFromAxisAngle: function ( axis, angle ) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle( axis, angle );

		},

		setRotationFromEuler: function ( euler ) {

			this.quaternion.setFromEuler( euler, true );

		},

		setRotationFromMatrix: function ( m ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix( m );

		},

		setRotationFromQuaternion: function ( q ) {

			// assumes q is normalized

			this.quaternion.copy( q );

		},

		rotateOnAxis: function () {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			var q1 = new Quaternion();

			return function rotateOnAxis( axis, angle ) {

				q1.setFromAxisAngle( axis, angle );

				this.quaternion.multiply( q1 );

				return this;

			};

		}(),

		rotateOnWorldAxis: function () {

			// rotate object on axis in world space
			// axis is assumed to be normalized
			// method assumes no rotated parent

			var q1 = new Quaternion();

			return function rotateOnWorldAxis( axis, angle ) {

				q1.setFromAxisAngle( axis, angle );

				this.quaternion.premultiply( q1 );

				return this;

			};

		}(),

		rotateX: function () {

			var v1 = new Vector3( 1, 0, 0 );

			return function rotateX( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		rotateY: function () {

			var v1 = new Vector3( 0, 1, 0 );

			return function rotateY( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		rotateZ: function () {

			var v1 = new Vector3( 0, 0, 1 );

			return function rotateZ( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		translateOnAxis: function () {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			var v1 = new Vector3();

			return function translateOnAxis( axis, distance ) {

				v1.copy( axis ).applyQuaternion( this.quaternion );

				this.position.add( v1.multiplyScalar( distance ) );

				return this;

			};

		}(),

		translateX: function () {

			var v1 = new Vector3( 1, 0, 0 );

			return function translateX( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		translateY: function () {

			var v1 = new Vector3( 0, 1, 0 );

			return function translateY( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		translateZ: function () {

			var v1 = new Vector3( 0, 0, 1 );

			return function translateZ( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		localToWorld: function ( vector ) {

			return vector.applyMatrix4( this.matrixWorld );

		},

		worldToLocal: function () {

			var m1 = new Matrix4();

			return function worldToLocal( vector ) {

				return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

			};

		}(),

		lookAt: function () {

			// This method does not support objects with rotated and/or translated parent(s)

			var m1 = new Matrix4();
			var vector = new Vector3();

			return function lookAt( x, y, z ) {

				if ( x.isVector3 ) {

					vector.copy( x );

				} else {

					vector.set( x, y, z );

				}

				if ( this.isCamera ) {

					m1.lookAt( this.position, vector, this.up );

				} else {

					m1.lookAt( vector, this.position, this.up );

				}

				this.quaternion.setFromRotationMatrix( m1 );

			};

		}(),

		add: function ( object ) {

			if ( arguments.length > 1 ) {

				for ( var i = 0; i < arguments.length; i ++ ) {

					this.add( arguments[ i ] );

				}

				return this;

			}

			if ( object === this ) {

				console.error( "Object3D.add: object can't be added as a child of itself.", object );
				return this;

			}

			if ( ( object && object.isObject3D ) ) {

				if ( object.parent !== null ) {

					object.parent.remove( object );

				}

				object.parent = this;
				object.dispatchEvent( { type: 'added' } );

				this.children.push( object );

			} else {

				console.error( "Object3D.add: object not an instance of Object3D.", object );

			}

			return this;

		},

		remove: function ( object ) {

			if ( arguments.length > 1 ) {

				for ( var i = 0; i < arguments.length; i ++ ) {

					this.remove( arguments[ i ] );

				}

				return this;

			}

			var index = this.children.indexOf( object );

			if ( index !== - 1 ) {

				object.parent = null;

				object.dispatchEvent( { type: 'removed' } );

				this.children.splice( index, 1 );

			}

			return this;

		},

		getObjectById: function ( id ) {

			return this.getObjectByProperty( 'id', id );

		},

		getObjectByName: function ( name ) {

			return this.getObjectByProperty( 'name', name );

		},

		getObjectByProperty: function ( name, value ) {

			if ( this[ name ] === value ) return this;

			for ( var i = 0, l = this.children.length; i < l; i ++ ) {

				var child = this.children[ i ];
				var object = child.getObjectByProperty( name, value );

				if ( object !== undefined ) {

					return object;

				}

			}

			return undefined;

		},

		getWorldPosition: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();

			this.updateMatrixWorld( true );

			return result.setFromMatrixPosition( this.matrixWorld );

		},

		getWorldQuaternion: function () {

			var position = new Vector3();
			var scale = new Vector3();

			return function getWorldQuaternion( optionalTarget ) {

				var result = optionalTarget || new Quaternion();

				this.updateMatrixWorld( true );

				this.matrixWorld.decompose( position, result, scale );

				return result;

			};

		}(),

		getWorldRotation: function () {

			var quaternion = new Quaternion();

			return function getWorldRotation( optionalTarget ) {

				var result = optionalTarget || new Euler();

				this.getWorldQuaternion( quaternion );

				return result.setFromQuaternion( quaternion, this.rotation.order, false );

			};

		}(),

		getWorldScale: function () {

			var position = new Vector3();
			var quaternion = new Quaternion();

			return function getWorldScale( optionalTarget ) {

				var result = optionalTarget || new Vector3();

				this.updateMatrixWorld( true );

				this.matrixWorld.decompose( position, quaternion, result );

				return result;

			};

		}(),

		getWorldDirection: function () {

			var quaternion = new Quaternion();

			return function getWorldDirection( optionalTarget ) {

				var result = optionalTarget || new Vector3();

				this.getWorldQuaternion( quaternion );

				return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

			};

		}(),

		raycast: function () {},

		traverse: function ( callback ) {

			callback( this );

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverse( callback );

			}

		},

		traverseVisible: function ( callback ) {

			if ( this.visible === false ) return;

			callback( this );

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverseVisible( callback );

			}

		},

		traverseAncestors: function ( callback ) {

			var parent = this.parent;

			if ( parent !== null ) {

				callback( parent );

				parent.traverseAncestors( callback );

			}

		},

		updateMatrix: function () {

			this.matrix.compose( this.position, this.quaternion, this.scale );

			this.matrixWorldNeedsUpdate = true;

		},

		updateMatrixWorld: function ( force ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.matrixWorldNeedsUpdate || force ) {

				if ( this.parent === null ) {

					this.matrixWorld.copy( this.matrix );

				} else {

					this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].updateMatrixWorld( force );

			}

		},

		toJSON: function ( meta ) {

			// meta is a string when called from JSON.stringify
			var isRootObject = ( meta === undefined || typeof meta === 'string' );

			var output = {};

			// meta is a hash used to collect geometries, materials.
			// not providing it implies that this is the root object
			// being serialized.
			if ( isRootObject ) {

				// initialize meta obj
				meta = {
					geometries: {},
					materials: {},
					textures: {},
					images: {},
					shapes: {}
				};

				output.metadata = {
					version: 4.5,
					type: 'Object',
					generator: 'Object3D.toJSON'
				};

			}

			// standard Object3D serialization

			var object = {};

			object.uuid = this.uuid;
			object.type = this.type;

			if ( this.name !== '' ) object.name = this.name;
			if ( this.castShadow === true ) object.castShadow = true;
			if ( this.receiveShadow === true ) object.receiveShadow = true;
			if ( this.visible === false ) object.visible = false;
			if ( JSON.stringify( this.userData ) !== '{}' ) object.userData = this.userData;

			object.matrix = this.matrix.toArray();

			//

			function serialize( library, element ) {

				if ( library[ element.uuid ] === undefined ) {

					library[ element.uuid ] = element.toJSON( meta );

				}

				return element.uuid;

			}

			if ( this.geometry !== undefined ) {

				object.geometry = serialize( meta.geometries, this.geometry );

				var parameters = this.geometry.parameters;

				if ( parameters !== undefined && parameters.shapes !== undefined ) {

					var shapes = parameters.shapes;

					if ( Array.isArray( shapes ) ) {

						for ( var i = 0, l = shapes.length; i < l; i ++ ) {

							var shape = shapes[ i ];

							serialize( meta.shapes, shape );

						}

					} else {

						serialize( meta.shapes, shapes );

					}

				}

			}

			if ( this.material !== undefined ) {

				if ( Array.isArray( this.material ) ) {

					var uuids = [];

					for ( var i = 0, l = this.material.length; i < l; i ++ ) {

						uuids.push( serialize( meta.materials, this.material[ i ] ) );

					}

					object.material = uuids;

				} else {

					object.material = serialize( meta.materials, this.material );

				}

			}

			//

			if ( this.children.length > 0 ) {

				object.children = [];

				for ( var i = 0; i < this.children.length; i ++ ) {

					object.children.push( this.children[ i ].toJSON( meta ).object );

				}

			}

			if ( isRootObject ) {

				var geometries = extractFromCache( meta.geometries );
				var materials = extractFromCache( meta.materials );
				var textures = extractFromCache( meta.textures );
				var images = extractFromCache( meta.images );
				var shapes = extractFromCache( meta.shapes );

				if ( geometries.length > 0 ) output.geometries = geometries;
				if ( materials.length > 0 ) output.materials = materials;
				if ( textures.length > 0 ) output.textures = textures;
				if ( images.length > 0 ) output.images = images;
				if ( shapes.length > 0 ) output.shapes = shapes;

			}

			output.object = object;

			return output;

			// extract data from the cache hash
			// remove metadata on each item
			// and return as array
			function extractFromCache( cache ) {

				var values = [];
				for ( var key in cache ) {

					var data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}
				return values;

			}

		},

		clone: function ( recursive ) {

			return new this.constructor().copy( this, recursive );

		},

		copy: function ( source, recursive ) {

			if ( recursive === undefined ) recursive = true;

			this.name = source.name;

			this.up.copy( source.up );

			this.position.copy( source.position );
			this.quaternion.copy( source.quaternion );
			this.scale.copy( source.scale );

			this.matrix.copy( source.matrix );
			this.matrixWorld.copy( source.matrixWorld );

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

			this.layers.mask = source.layers.mask;
			this.visible = source.visible;

			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;

			this.frustumCulled = source.frustumCulled;
			this.renderOrder = source.renderOrder;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			if ( recursive === true ) {

				for ( var i = 0; i < source.children.length; i ++ ) {

					var child = source.children[ i ];
					this.add( child.clone() );

				}

			}

			return this;

		}

	} );

	var context;

	var AudioContext = {

		getContext: function () {

			if ( context === undefined ) {

				context = new ( window.AudioContext || window.webkitAudioContext )();

			}

			return context;

		},

		setContext: function ( value ) {

			context = value;

		}

	};

	function AudioListener() {

		Object3D.call( this );

		this.type = 'AudioListener';

		this.context = AudioContext.getContext();

		this.gain = this.context.createGain();
		this.gain.connect( this.context.destination );

		this.filter = null;

	}

	AudioListener.prototype = Object.assign( Object.create( Object3D.prototype ), {

		constructor: AudioListener,

		getInput: function () {

			return this.gain;

		},

		removeFilter: function ( ) {

			if ( this.filter !== null ) {

				this.gain.disconnect( this.filter );
				this.filter.disconnect( this.context.destination );
				this.gain.connect( this.context.destination );
				this.filter = null;

			}

		},

		getFilter: function () {

			return this.filter;

		},

		setFilter: function ( value ) {

			if ( this.filter !== null ) {

				this.gain.disconnect( this.filter );
				this.filter.disconnect( this.context.destination );

			} else {

				this.gain.disconnect( this.context.destination );

			}

			this.filter = value;
			this.gain.connect( this.filter );
			this.filter.connect( this.context.destination );

		},

		getMasterVolume: function () {

			return this.gain.gain.value;

		},

		setMasterVolume: function ( value ) {

			this.gain.gain.value = value;

		},

		updateMatrixWorld: ( function () {

			var position = new Vector3();
			var quaternion = new Quaternion();
			var scale = new Vector3();

			var orientation = new Vector3();

			return function updateMatrixWorld( force ) {

				Object3D.prototype.updateMatrixWorld.call( this, force );

				var listener = this.context.listener;
				var up = this.up;

				this.matrixWorld.decompose( position, quaternion, scale );

				orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

				if ( listener.positionX ) {

					listener.positionX.setValueAtTime( position.x, this.context.currentTime );
					listener.positionY.setValueAtTime( position.y, this.context.currentTime );
					listener.positionZ.setValueAtTime( position.z, this.context.currentTime );
					listener.forwardX.setValueAtTime( orientation.x, this.context.currentTime );
					listener.forwardY.setValueAtTime( orientation.y, this.context.currentTime );
					listener.forwardZ.setValueAtTime( orientation.z, this.context.currentTime );
					listener.upX.setValueAtTime( up.x, this.context.currentTime );
					listener.upY.setValueAtTime( up.y, this.context.currentTime );
					listener.upZ.setValueAtTime( up.z, this.context.currentTime );

				} else {

					listener.setPosition( position.x, position.y, position.z );
					listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

				}

			};

		} )()

	} );

	function Audio( listener ) {

		Object3D.call( this );

		this.type = 'Audio';

		this.context = listener.context;

		this.gain = this.context.createGain();
		this.gain.connect( listener.getInput() );

		this.autoplay = false;

		this.buffer = null;
		this.loop = false;
		this.startTime = 0;
		this.offset = 0;
		this.playbackRate = 1;
		this.isPlaying = false;
		this.hasPlaybackControl = true;
		this.sourceType = 'empty';

		this.filters = [];

	}

	Audio.prototype = Object.assign( Object.create( Object3D.prototype ), {

		constructor: Audio,

		getOutput: function () {

			return this.gain;

		},

		setNodeSource: function ( audioNode ) {

			this.hasPlaybackControl = false;
			this.sourceType = 'audioNode';
			this.source = audioNode;
			this.connect();

			return this;

		},

		setBuffer: function ( audioBuffer ) {

			this.buffer = audioBuffer;
			this.sourceType = 'buffer';

			if ( this.autoplay ) this.play();

			return this;

		},

		play: function () {

			if ( this.isPlaying === true ) {

				console.warn( 'Audio: Audio is already playing.' );
				return;

			}

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return;

			}

			var source = this.context.createBufferSource();

			source.buffer = this.buffer;
			source.loop = this.loop;
			source.onended = this.onEnded.bind( this );
			source.playbackRate.setValueAtTime( this.playbackRate, this.startTime );
			this.startTime = this.context.currentTime;
			source.start( this.startTime, this.offset );

			this.isPlaying = true;

			this.source = source;

			return this.connect();

		},

		pause: function () {

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return;

			}

			if ( this.isPlaying === true ) {

				this.source.stop();
				this.offset += ( this.context.currentTime - this.startTime ) * this.playbackRate;
				this.isPlaying = false;

			}

			return this;

		},

		stop: function () {

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return;

			}

			this.source.stop();
			this.offset = 0;
			this.isPlaying = false;

			return this;

		},

		connect: function () {

			if ( this.filters.length > 0 ) {

				this.source.connect( this.filters[ 0 ] );

				for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

					this.filters[ i - 1 ].connect( this.filters[ i ] );

				}

				this.filters[ this.filters.length - 1 ].connect( this.getOutput() );

			} else {

				this.source.connect( this.getOutput() );

			}

			return this;

		},

		disconnect: function () {

			if ( this.filters.length > 0 ) {

				this.source.disconnect( this.filters[ 0 ] );

				for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

					this.filters[ i - 1 ].disconnect( this.filters[ i ] );

				}

				this.filters[ this.filters.length - 1 ].disconnect( this.getOutput() );

			} else {

				this.source.disconnect( this.getOutput() );

			}

			return this;

		},

		getFilters: function () {

			return this.filters;

		},

		setFilters: function ( value ) {

			if ( ! value ) value = [];

			if ( this.isPlaying === true ) {

				this.disconnect();
				this.filters = value;
				this.connect();

			} else {

				this.filters = value;

			}

			return this;

		},

		getFilter: function () {

			return this.getFilters()[ 0 ];

		},

		setFilter: function ( filter ) {

			return this.setFilters( filter ? [ filter ] : [] );

		},

		setPlaybackRate: function ( value ) {

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return;

			}

			this.playbackRate = value;

			if ( this.isPlaying === true ) {

				this.source.playbackRate.setValueAtTime( this.playbackRate, this.context.currentTime );

			}

			return this;

		},

		getPlaybackRate: function () {

			return this.playbackRate;

		},

		onEnded: function () {

			this.isPlaying = false;

		},

		getLoop: function () {

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return false;

			}

			return this.loop;

		},

		setLoop: function ( value ) {

			if ( this.hasPlaybackControl === false ) {

				console.warn( 'Audio: this Audio has no playback control.' );
				return;

			}

			this.loop = value;

			if ( this.isPlaying === true ) {

				this.source.loop = this.loop;

			}

			return this;

		},

		getVolume: function () {

			return this.gain.gain.value;

		},

		setVolume: function ( value ) {

			this.gain.gain.value = value;

			return this;

		}

	} );

	function AudioLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	}

	Object.assign( AudioLoader.prototype, {

		load: function ( url, onLoad, onProgress, onError ) {

			var loader = new FileLoader( this.manager );
			loader.setResponseType( 'arraybuffer' );
			loader.load( url, function ( buffer ) {

				var context = AudioContext.getContext();

				context.decodeAudioData( buffer, function ( audioBuffer ) {

					onLoad( audioBuffer );

				} );

			}, onProgress, onError );

		}

	} );

	function AnimationClip( name, duration, tracks ) {

		this.name = name;
		this.tracks = tracks;
		this.duration = ( duration !== undefined ) ? duration : - 1;

		this.uuid = _Math.generateUUID();

		// this means it should figure out its duration by scanning the tracks
		if ( this.duration < 0 ) {

			this.resetDuration();

		}

		this.optimize();

	}

	Object.assign( AnimationClip, {

		parse: function ( json ) {

			var tracks = [],
				jsonTracks = json.tracks,
				frameTime = 1.0 / ( json.fps || 1.0 );

			for ( var i = 0, n = jsonTracks.length; i !== n; ++ i ) {

				tracks.push( KeyframeTrack.parse( jsonTracks[ i ] ).scale( frameTime ) );

			}

			return new AnimationClip( json.name, json.duration, tracks );

		},

		toJSON: function ( clip ) {

			var tracks = [],
				clipTracks = clip.tracks;

			var json = {

				'name': clip.name,
				'duration': clip.duration,
				'tracks': tracks

			};

			for ( var i = 0, n = clipTracks.length; i !== n; ++ i ) {

				tracks.push( KeyframeTrack.toJSON( clipTracks[ i ] ) );

			}

			return json;

		},

		CreateFromMorphTargetSequence: function ( name, morphTargetSequence, fps, noLoop ) {

			var numMorphTargets = morphTargetSequence.length;
			var tracks = [];

			for ( var i = 0; i < numMorphTargets; i ++ ) {

				var times = [];
				var values = [];

				times.push(
					( i + numMorphTargets - 1 ) % numMorphTargets,
					i,
					( i + 1 ) % numMorphTargets );

				values.push( 0, 1, 0 );

				var order = AnimationUtils.getKeyframeOrder( times );
				times = AnimationUtils.sortedArray( times, 1, order );
				values = AnimationUtils.sortedArray( values, 1, order );

				// if there is a key at the first frame, duplicate it as the
				// last frame as well for perfect loop.
				if ( ! noLoop && times[ 0 ] === 0 ) {

					times.push( numMorphTargets );
					values.push( values[ 0 ] );

				}

				tracks.push(
					new NumberKeyframeTrack(
						'.morphTargetInfluences[' + morphTargetSequence[ i ].name + ']',
						times, values
					).scale( 1.0 / fps ) );

			}

			return new AnimationClip( name, - 1, tracks );

		},

		findByName: function ( objectOrClipArray, name ) {

			var clipArray = objectOrClipArray;

			if ( ! Array.isArray( objectOrClipArray ) ) {

				var o = objectOrClipArray;
				clipArray = o.geometry && o.geometry.animations || o.animations;

			}

			for ( var i = 0; i < clipArray.length; i ++ ) {

				if ( clipArray[ i ].name === name ) {

					return clipArray[ i ];

				}

			}

			return null;

		},

		CreateClipsFromMorphTargetSequences: function ( morphTargets, fps, noLoop ) {

			var animationToMorphTargets = {};

			// tested with https://regex101.com/ on trick sequences
			// such flamingo_flyA_003, flamingo_run1_003, crdeath0059
			var pattern = /^([\w-]*?)([\d]+)$/;

			// sort morph target names into animation groups based
			// patterns like Walk_001, Walk_002, Run_001, Run_002
			for ( var i = 0, il = morphTargets.length; i < il; i ++ ) {

				var morphTarget = morphTargets[ i ];
				var parts = morphTarget.name.match( pattern );

				if ( parts && parts.length > 1 ) {

					var name = parts[ 1 ];

					var animationMorphTargets = animationToMorphTargets[ name ];
					if ( ! animationMorphTargets ) {

						animationToMorphTargets[ name ] = animationMorphTargets = [];

					}

					animationMorphTargets.push( morphTarget );

				}

			}

			var clips = [];

			for ( var name in animationToMorphTargets ) {

				clips.push( AnimationClip.CreateFromMorphTargetSequence( name, animationToMorphTargets[ name ], fps, noLoop ) );

			}

			return clips;

		},

		// parse the animation.hierarchy format
		parseAnimation: function ( animation, bones ) {

			if ( ! animation ) {

				console.error( 'AnimationClip: No animation in JSONLoader data.' );
				return null;

			}

			var addNonemptyTrack = function ( trackType, trackName, animationKeys, propertyName, destTracks ) {

				// only return track if there are actually keys.
				if ( animationKeys.length !== 0 ) {

					var times = [];
					var values = [];

					AnimationUtils.flattenJSON( animationKeys, times, values, propertyName );

					// empty keys are filtered out, so check again
					if ( times.length !== 0 ) {

						destTracks.push( new trackType( trackName, times, values ) );

					}

				}

			};

			var tracks = [];

			var clipName = animation.name || 'default';
			// automatic length determination in AnimationClip.
			var duration = animation.length || - 1;
			var fps = animation.fps || 30;

			var hierarchyTracks = animation.hierarchy || [];

			for ( var h = 0; h < hierarchyTracks.length; h ++ ) {

				var animationKeys = hierarchyTracks[ h ].keys;

				// skip empty tracks
				if ( ! animationKeys || animationKeys.length === 0 ) continue;

				// process morph targets
				if ( animationKeys[ 0 ].morphTargets ) {

					// figure out all morph targets used in this track
					var morphTargetNames = {};

					for ( var k = 0; k < animationKeys.length; k ++ ) {

						if ( animationKeys[ k ].morphTargets ) {

							for ( var m = 0; m < animationKeys[ k ].morphTargets.length; m ++ ) {

								morphTargetNames[ animationKeys[ k ].morphTargets[ m ] ] = - 1;

							}

						}

					}

					// create a track for each morph target with all zero
					// morphTargetInfluences except for the keys in which
					// the morphTarget is named.
					for ( var morphTargetName in morphTargetNames ) {

						var times = [];
						var values = [];

						for ( var m = 0; m !== animationKeys[ k ].morphTargets.length; ++ m ) {

							var animationKey = animationKeys[ k ];

							times.push( animationKey.time );
							values.push( ( animationKey.morphTarget === morphTargetName ) ? 1 : 0 );

						}

						tracks.push( new NumberKeyframeTrack( '.morphTargetInfluence[' + morphTargetName + ']', times, values ) );

					}

					duration = morphTargetNames.length * ( fps || 1.0 );

				} else {

					// ...assume skeletal animation

					var boneName = '.bones[' + bones[ h ].name + ']';

					addNonemptyTrack(
						VectorKeyframeTrack, boneName + '.position',
						animationKeys, 'pos', tracks );

					addNonemptyTrack(
						QuaternionKeyframeTrack, boneName + '.quaternion',
						animationKeys, 'rot', tracks );

					addNonemptyTrack(
						VectorKeyframeTrack, boneName + '.scale',
						animationKeys, 'scl', tracks );

				}

			}

			if ( tracks.length === 0 ) {

				return null;

			}

			var clip = new AnimationClip( clipName, duration, tracks );

			return clip;

		}

	} );

	Object.assign( AnimationClip.prototype, {

		resetDuration: function () {

			var tracks = this.tracks, duration = 0;

			for ( var i = 0, n = tracks.length; i !== n; ++ i ) {

				var track = this.tracks[ i ];

				duration = Math.max( duration, track.times[ track.times.length - 1 ] );

			}

			this.duration = duration;

		},

		trim: function () {

			for ( var i = 0; i < this.tracks.length; i ++ ) {

				this.tracks[ i ].trim( 0, this.duration );

			}

			return this;

		},

		optimize: function () {

			for ( var i = 0; i < this.tracks.length; i ++ ) {

				this.tracks[ i ].optimize();

			}

			return this;

		}

	} );

	function Sphere( center, radius ) {

		this.center = ( center !== undefined ) ? center : new Vector3();
		this.radius = ( radius !== undefined ) ? radius : 0;

	}

	Object.assign( Sphere.prototype, {

		set: function ( center, radius ) {

			this.center.copy( center );
			this.radius = radius;

			return this;

		},

		setFromPoints: function () {

			var box = new Box3();

			return function setFromPoints( points, optionalCenter ) {

				var center = this.center;

				if ( optionalCenter !== undefined ) {

					center.copy( optionalCenter );

				} else {

					box.setFromPoints( points ).getCenter( center );

				}

				var maxRadiusSq = 0;

				for ( var i = 0, il = points.length; i < il; i ++ ) {

					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

				}

				this.radius = Math.sqrt( maxRadiusSq );

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( sphere ) {

			this.center.copy( sphere.center );
			this.radius = sphere.radius;

			return this;

		},

		empty: function () {

			return ( this.radius <= 0 );

		},

		containsPoint: function ( point ) {

			return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

		},

		distanceToPoint: function ( point ) {

			return ( point.distanceTo( this.center ) - this.radius );

		},

		intersectsSphere: function ( sphere ) {

			var radiusSum = this.radius + sphere.radius;

			return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

		},

		intersectsBox: function ( box ) {

			return box.intersectsSphere( this );

		},

		intersectsPlane: function ( plane ) {

			return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

		},

		clampPoint: function ( point, optionalTarget ) {

			var deltaLengthSq = this.center.distanceToSquared( point );

			var result = optionalTarget || new Vector3();

			result.copy( point );

			if ( deltaLengthSq > ( this.radius * this.radius ) ) {

				result.sub( this.center ).normalize();
				result.multiplyScalar( this.radius ).add( this.center );

			}

			return result;

		},

		getBoundingBox: function ( optionalTarget ) {

			var box = optionalTarget || new Box3();

			box.set( this.center, this.center );
			box.expandByScalar( this.radius );

			return box;

		},

		applyMatrix4: function ( matrix ) {

			this.center.applyMatrix4( matrix );
			this.radius = this.radius * matrix.getMaxScaleOnAxis();

			return this;

		},

		translate: function ( offset ) {

			this.center.add( offset );

			return this;

		},

		equals: function ( sphere ) {

			return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

		}

	} );

	function Box3( min, max ) {

		this.min = ( min !== undefined ) ? min : new Vector3( + Infinity, + Infinity, + Infinity );
		this.max = ( max !== undefined ) ? max : new Vector3( - Infinity, - Infinity, - Infinity );

	}

	Object.assign( Box3.prototype, {

		isBox3: true,

		set: function ( min, max ) {

			this.min.copy( min );
			this.max.copy( max );

			return this;

		},

		setFromArray: function ( array ) {

			var minX = + Infinity;
			var minY = + Infinity;
			var minZ = + Infinity;

			var maxX = - Infinity;
			var maxY = - Infinity;
			var maxZ = - Infinity;

			for ( var i = 0, l = array.length; i < l; i += 3 ) {

				var x = array[ i ];
				var y = array[ i + 1 ];
				var z = array[ i + 2 ];

				if ( x < minX ) minX = x;
				if ( y < minY ) minY = y;
				if ( z < minZ ) minZ = z;

				if ( x > maxX ) maxX = x;
				if ( y > maxY ) maxY = y;
				if ( z > maxZ ) maxZ = z;

			}

			this.min.set( minX, minY, minZ );
			this.max.set( maxX, maxY, maxZ );

			return this;

		},

		setFromBufferAttribute: function ( attribute ) {

			var minX = + Infinity;
			var minY = + Infinity;
			var minZ = + Infinity;

			var maxX = - Infinity;
			var maxY = - Infinity;
			var maxZ = - Infinity;

			for ( var i = 0, l = attribute.count; i < l; i ++ ) {

				var x = attribute.getX( i );
				var y = attribute.getY( i );
				var z = attribute.getZ( i );

				if ( x < minX ) minX = x;
				if ( y < minY ) minY = y;
				if ( z < minZ ) minZ = z;

				if ( x > maxX ) maxX = x;
				if ( y > maxY ) maxY = y;
				if ( z > maxZ ) maxZ = z;

			}

			this.min.set( minX, minY, minZ );
			this.max.set( maxX, maxY, maxZ );

			return this;

		},

		setFromPoints: function ( points ) {

			this.makeEmpty();

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				this.expandByPoint( points[ i ] );

			}

			return this;

		},

		setFromCenterAndSize: function () {

			var v1 = new Vector3();

			return function setFromCenterAndSize( center, size ) {

				var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

				this.min.copy( center ).sub( halfSize );
				this.max.copy( center ).add( halfSize );

				return this;

			};

		}(),

		setFromObject: function ( object ) {

			this.makeEmpty();

			return this.expandByObject( object );

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( box ) {

			this.min.copy( box.min );
			this.max.copy( box.max );

			return this;

		},

		makeEmpty: function () {

			this.min.x = this.min.y = this.min.z = + Infinity;
			this.max.x = this.max.y = this.max.z = - Infinity;

			return this;

		},

		isEmpty: function () {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

		},

		getCenter: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return this.isEmpty() ? result.set( 0, 0, 0 ) : result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

		},

		getSize: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return this.isEmpty() ? result.set( 0, 0, 0 ) : result.subVectors( this.max, this.min );

		},

		expandByPoint: function ( point ) {

			this.min.min( point );
			this.max.max( point );

			return this;

		},

		expandByVector: function ( vector ) {

			this.min.sub( vector );
			this.max.add( vector );

			return this;

		},

		expandByScalar: function ( scalar ) {

			this.min.addScalar( - scalar );
			this.max.addScalar( scalar );

			return this;

		},

		expandByObject: function () {

			// Computes the world-axis-aligned bounding box of an object (including its children),
			// accounting for both the object's, and children's, world transforms

			var scope, i, l;

			var v1 = new Vector3();

			function traverse( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry.isGeometry ) {

						var vertices = geometry.vertices;

						for ( i = 0, l = vertices.length; i < l; i ++ ) {

							v1.copy( vertices[ i ] );
							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry.isBufferGeometry ) {

						var attribute = geometry.attributes.position;

						if ( attribute !== undefined ) {

							for ( i = 0, l = attribute.count; i < l; i ++ ) {

								v1.fromBufferAttribute( attribute, i ).applyMatrix4( node.matrixWorld );

								scope.expandByPoint( v1 );

							}

						}

					}

				}

			}

			return function expandByObject( object ) {

				scope = this;

				object.updateMatrixWorld( true );

				object.traverse( traverse );

				return this;

			};

		}(),

		containsPoint: function ( point ) {

			return point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ||
				point.z < this.min.z || point.z > this.max.z ? false : true;

		},

		containsBox: function ( box ) {

			return this.min.x <= box.min.x && box.max.x <= this.max.x &&
				this.min.y <= box.min.y && box.max.y <= this.max.y &&
				this.min.z <= box.min.z && box.max.z <= this.max.z;

		},

		getParameter: function ( point, optionalTarget ) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			var result = optionalTarget || new Vector3();

			return result.set(
				( point.x - this.min.x ) / ( this.max.x - this.min.x ),
				( point.y - this.min.y ) / ( this.max.y - this.min.y ),
				( point.z - this.min.z ) / ( this.max.z - this.min.z )
			);

		},

		intersectsBox: function ( box ) {

			// using 6 splitting planes to rule out intersections.
			return box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z ? false : true;

		},

		intersectsSphere: ( function () {

			var closestPoint = new Vector3();

			return function intersectsSphere( sphere ) {

				// Find the point on the AABB closest to the sphere center.
				this.clampPoint( sphere.center, closestPoint );

				// If that point is inside the sphere, the AABB and sphere intersect.
				return closestPoint.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

			};

		} )(),

		intersectsPlane: function ( plane ) {

			// We compute the minimum and maximum dot product values. If those values
			// are on the same side (back or front) of the plane, then there is no intersection.

			var min, max;

			if ( plane.normal.x > 0 ) {

				min = plane.normal.x * this.min.x;
				max = plane.normal.x * this.max.x;

			} else {

				min = plane.normal.x * this.max.x;
				max = plane.normal.x * this.min.x;

			}

			if ( plane.normal.y > 0 ) {

				min += plane.normal.y * this.min.y;
				max += plane.normal.y * this.max.y;

			} else {

				min += plane.normal.y * this.max.y;
				max += plane.normal.y * this.min.y;

			}

			if ( plane.normal.z > 0 ) {

				min += plane.normal.z * this.min.z;
				max += plane.normal.z * this.max.z;

			} else {

				min += plane.normal.z * this.max.z;
				max += plane.normal.z * this.min.z;

			}

			return ( min <= plane.constant && max >= plane.constant );

		},

		intersectsTriangle: ( function () {

			// triangle centered vertices
			var v0 = new Vector3();
			var v1 = new Vector3();
			var v2 = new Vector3();

			// triangle edge vectors
			var f0 = new Vector3();
			var f1 = new Vector3();
			var f2 = new Vector3();

			var testAxis = new Vector3();

			var center = new Vector3();
			var extents = new Vector3();

			var triangleNormal = new Vector3();

			function satForAxes( axes ) {

				var i, j;

				for ( i = 0, j = axes.length - 3; i <= j; i += 3 ) {

					testAxis.fromArray( axes, i );
					// project the aabb onto the seperating axis
					var r = extents.x * Math.abs( testAxis.x ) + extents.y * Math.abs( testAxis.y ) + extents.z * Math.abs( testAxis.z );
					// project all 3 vertices of the triangle onto the seperating axis
					var p0 = v0.dot( testAxis );
					var p1 = v1.dot( testAxis );
					var p2 = v2.dot( testAxis );
					// actual test, basically see if either of the most extreme of the triangle points intersects r
					if ( Math.max( - Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

						// points of the projected triangle are outside the projected half-length of the aabb
						// the axis is seperating and we can exit
						return false;

					}

				}

				return true;

			}

			return function intersectsTriangle( triangle ) {

				if ( this.isEmpty() ) {

					return false;

				}

				// compute box center and extents
				this.getCenter( center );
				extents.subVectors( this.max, center );

				// translate triangle to aabb origin
				v0.subVectors( triangle.a, center );
				v1.subVectors( triangle.b, center );
				v2.subVectors( triangle.c, center );

				// compute edge vectors for triangle
				f0.subVectors( v1, v0 );
				f1.subVectors( v2, v1 );
				f2.subVectors( v0, v2 );

				// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
				// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
				// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
				var axes = [
					0, - f0.z, f0.y, 0, - f1.z, f1.y, 0, - f2.z, f2.y,
					f0.z, 0, - f0.x, f1.z, 0, - f1.x, f2.z, 0, - f2.x,
					- f0.y, f0.x, 0, - f1.y, f1.x, 0, - f2.y, f2.x, 0
				];
				if ( ! satForAxes( axes ) ) {

					return false;

				}

				// test 3 face normals from the aabb
				axes = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
				if ( ! satForAxes( axes ) ) {

					return false;

				}

				// finally testing the face normal of the triangle
				// use already existing triangle edge vectors here
				triangleNormal.crossVectors( f0, f1 );
				axes = [ triangleNormal.x, triangleNormal.y, triangleNormal.z ];
				return satForAxes( axes );

			};

		} )(),

		clampPoint: function ( point, optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.copy( point ).clamp( this.min, this.max );

		},

		distanceToPoint: function () {

			var v1 = new Vector3();

			return function distanceToPoint( point ) {

				var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
				return clampedPoint.sub( point ).length();

			};

		}(),

		getBoundingSphere: function () {

			var v1 = new Vector3();

			return function getBoundingSphere( optionalTarget ) {

				var result = optionalTarget || new Sphere();

				this.getCenter( result.center );

				result.radius = this.getSize( v1 ).length() * 0.5;

				return result;

			};

		}(),

		intersect: function ( box ) {

			this.min.max( box.min );
			this.max.min( box.max );

			// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
			if ( this.isEmpty() ) this.makeEmpty();

			return this;

		},

		union: function ( box ) {

			this.min.min( box.min );
			this.max.max( box.max );

			return this;

		},

		applyMatrix4: function () {

			var points = [
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3()
			];

			return function applyMatrix4( matrix ) {

				// transform of empty box is an empty box.
				if ( this.isEmpty() ) return this;

				// NOTE: I am using a binary pattern to specify all 2^3 combinations below
				points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
				points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
				points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
				points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
				points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
				points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
				points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
				points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );	// 111

				this.setFromPoints( points );

				return this;

			};

		}(),

		translate: function ( offset ) {

			this.min.add( offset );
			this.max.add( offset );

			return this;

		},

		equals: function ( box ) {

			return box.min.equals( this.min ) && box.max.equals( this.max );

		}

	} );

	function Vector4( x, y, z, w ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = ( w !== undefined ) ? w : 1;

	}

	Object.assign( Vector4.prototype, {

		isVector4: true,

		set: function ( x, y, z, w ) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;
			this.w = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setZ: function ( z ) {

			this.z = z;

			return this;

		},

		setW: function ( w ) {

			this.w = w;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				case 3: this.w = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				case 3: return this.w;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y, this.z, this.w );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = ( v.w !== undefined ) ? v.w : 1;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;

			return this;

		},

		applyMatrix4: function ( m ) {

			var x = this.x, y = this.y, z = this.z, w = this.w;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
			this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		setAxisAngleFromQuaternion: function ( q ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

			// q is assumed to be normalized

			this.w = 2 * Math.acos( q.w );

			var s = Math.sqrt( 1 - q.w * q.w );

			if ( s < 0.0001 ) {

				this.x = 1;
				this.y = 0;
				this.z = 0;

			} else {

				this.x = q.x / s;
				this.y = q.y / s;
				this.z = q.z / s;

			}

			return this;

		},

		setAxisAngleFromRotationMatrix: function ( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var angle, x, y, z,		// variables for result
				epsilon = 0.01,		// margin to allow for rounding errors
				epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

				te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			if ( ( Math.abs( m12 - m21 ) < epsilon ) &&
			     ( Math.abs( m13 - m31 ) < epsilon ) &&
			     ( Math.abs( m23 - m32 ) < epsilon ) ) {

				// singularity found
				// first check for identity matrix which must have +1 for all terms
				// in leading diagonal and zero in other terms

				if ( ( Math.abs( m12 + m21 ) < epsilon2 ) &&
				     ( Math.abs( m13 + m31 ) < epsilon2 ) &&
				     ( Math.abs( m23 + m32 ) < epsilon2 ) &&
				     ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

					// this singularity is identity matrix so angle = 0

					this.set( 1, 0, 0, 0 );

					return this; // zero angle, arbitrary axis

				}

				// otherwise this singularity is angle = 180

				angle = Math.PI;

				var xx = ( m11 + 1 ) / 2;
				var yy = ( m22 + 1 ) / 2;
				var zz = ( m33 + 1 ) / 2;
				var xy = ( m12 + m21 ) / 4;
				var xz = ( m13 + m31 ) / 4;
				var yz = ( m23 + m32 ) / 4;

				if ( ( xx > yy ) && ( xx > zz ) ) {

					// m11 is the largest diagonal term

					if ( xx < epsilon ) {

						x = 0;
						y = 0.707106781;
						z = 0.707106781;

					} else {

						x = Math.sqrt( xx );
						y = xy / x;
						z = xz / x;

					}

				} else if ( yy > zz ) {

					// m22 is the largest diagonal term

					if ( yy < epsilon ) {

						x = 0.707106781;
						y = 0;
						z = 0.707106781;

					} else {

						y = Math.sqrt( yy );
						x = xy / y;
						z = yz / y;

					}

				} else {

					// m33 is the largest diagonal term so base result on this

					if ( zz < epsilon ) {

						x = 0.707106781;
						y = 0.707106781;
						z = 0;

					} else {

						z = Math.sqrt( zz );
						x = xz / z;
						y = yz / z;

					}

				}

				this.set( x, y, z, angle );

				return this; // return 180 deg rotation

			}

			// as we have reached here there are no singularities so we can handle normally

			var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 ) +
			                   ( m13 - m31 ) * ( m13 - m31 ) +
			                   ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

			if ( Math.abs( s ) < 0.001 ) s = 1;

			// prevent divide by zero, should not happen if matrix is orthogonal and should be
			// caught by singularity test above, but I've left it in just in case

			this.x = ( m32 - m23 ) / s;
			this.y = ( m13 - m31 ) / s;
			this.z = ( m21 - m12 ) / s;
			this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

			return this;

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );
			this.w = Math.min( this.w, v.w );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );
			this.w = Math.max( this.w, v.w );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );
			this.w = Math.max( min.w, Math.min( max.w, this.w ) );

			return this;

		},

		clampScalar: function () {

			var min, max;

			return function clampScalar( minVal, maxVal ) {

				if ( min === undefined ) {

					min = new Vector4();
					max = new Vector4();

				}

				min.set( minVal, minVal, minVal, minVal );
				max.set( maxVal, maxVal, maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );
			this.w = Math.floor( this.w );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );
			this.w = Math.ceil( this.w );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );
			this.w = Math.round( this.w );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
			this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;
			this.w = - this.w;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;
			this.w += ( v.w - this.w ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];
			this.w = array[ offset + 3 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;
			array[ offset + 3 ] = this.w;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'Vector4: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );
			this.w = attribute.getW( index );

			return this;

		}

	} );

	function BufferAttribute( array, itemSize, normalized ) {

		if ( Array.isArray( array ) ) {

			throw new TypeError( 'BufferAttribute: array should be a Typed Array.' );

		}

		this.uuid = _Math.generateUUID();
		this.name = '';

		this.array = array;
		this.itemSize = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized === true;

		this.dynamic = false;
		this.updateRange = { offset: 0, count: - 1 };

		this.onUploadCallback = function () {};

		this.version = 0;

	}

	Object.defineProperty( BufferAttribute.prototype, 'needsUpdate', {

		set: function ( value ) {

			if ( value === true ) this.version ++;

		}

	} );

	Object.assign( BufferAttribute.prototype, {

		isBufferAttribute: true,

		setArray: function ( array ) {

			if ( Array.isArray( array ) ) {

				throw new TypeError( 'BufferAttribute: array should be a Typed Array.' );

			}

			this.count = array !== undefined ? array.length / this.itemSize : 0;
			this.array = array;

		},

		setDynamic: function ( value ) {

			this.dynamic = value;

			return this;

		},

		copy: function ( source ) {

			this.array = new source.array.constructor( source.array );
			this.itemSize = source.itemSize;
			this.count = source.count;
			this.normalized = source.normalized;

			this.dynamic = source.dynamic;

			return this;

		},

		copyAt: function ( index1, attribute, index2 ) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

				this.array[ index1 + i ] = attribute.array[ index2 + i ];

			}

			return this;

		},

		copyArray: function ( array ) {

			this.array.set( array );

			return this;

		},

		copyColorsArray: function ( colors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = colors.length; i < l; i ++ ) {

				var color = colors[ i ];

				if ( color === undefined ) {

					console.warn( 'BufferAttribute.copyColorsArray(): color is undefined', i );
					color = new Color();

				}

				array[ offset ++ ] = color.r;
				array[ offset ++ ] = color.g;
				array[ offset ++ ] = color.b;

			}

			return this;

		},

		copyIndicesArray: function ( indices ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = indices.length; i < l; i ++ ) {

				var index = indices[ i ];

				array[ offset ++ ] = index.a;
				array[ offset ++ ] = index.b;
				array[ offset ++ ] = index.c;

			}

			return this;

		},

		copyVector2sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'BufferAttribute.copyVector2sArray(): vector is undefined', i );
					vector = new Vector2();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;

			}

			return this;

		},

		copyVector3sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'BufferAttribute.copyVector3sArray(): vector is undefined', i );
					vector = new Vector3();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;

			}

			return this;

		},

		copyVector4sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'BufferAttribute.copyVector4sArray(): vector is undefined', i );
					vector = new Vector4();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;
				array[ offset ++ ] = vector.w;

			}

			return this;

		},

		set: function ( value, offset ) {

			if ( offset === undefined ) offset = 0;

			this.array.set( value, offset );

			return this;

		},

		getX: function ( index ) {

			return this.array[ index * this.itemSize ];

		},

		setX: function ( index, x ) {

			this.array[ index * this.itemSize ] = x;

			return this;

		},

		getY: function ( index ) {

			return this.array[ index * this.itemSize + 1 ];

		},

		setY: function ( index, y ) {

			this.array[ index * this.itemSize + 1 ] = y;

			return this;

		},

		getZ: function ( index ) {

			return this.array[ index * this.itemSize + 2 ];

		},

		setZ: function ( index, z ) {

			this.array[ index * this.itemSize + 2 ] = z;

			return this;

		},

		getW: function ( index ) {

			return this.array[ index * this.itemSize + 3 ];

		},

		setW: function ( index, w ) {

			this.array[ index * this.itemSize + 3 ] = w;

			return this;

		},

		setXY: function ( index, x, y ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;

			return this;

		},

		setXYZ: function ( index, x, y, z ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;

			return this;

		},

		setXYZW: function ( index, x, y, z, w ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;
			this.array[ index + 3 ] = w;

			return this;

		},

		onUpload: function ( callback ) {

			this.onUploadCallback = callback;

			return this;

		},

		clone: function () {

			return new this.constructor( this.array, this.itemSize ).copy( this );

		}

	} );

	//

	function Int8BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int8Array( array ), itemSize, normalized );

	}

	Int8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;


	function Uint8BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint8Array( array ), itemSize, normalized );

	}

	Uint8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;


	function Uint8ClampedBufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint8ClampedArray( array ), itemSize, normalized );

	}

	Uint8ClampedBufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;


	function Int16BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int16Array( array ), itemSize, normalized );

	}

	Int16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;


	function Uint16BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );

	}

	Uint16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;


	function Int32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int32Array( array ), itemSize, normalized );

	}

	Int32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;


	function Uint32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint32Array( array ), itemSize, normalized );

	}

	Uint32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;


	function Float32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );

	}

	Float32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;


	function Float64BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Float64Array( array ), itemSize, normalized );

	}

	Float64BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;

	//

	function DirectGeometry() {

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.colors = [];
		this.uvs = [];
		this.uvs2 = [];

		this.groups = [];

		this.morphTargets = {};

		this.skinWeights = [];
		this.skinIndices = [];

		// this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.verticesNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.groupsNeedUpdate = false;

	}

	Object.assign( DirectGeometry.prototype, {

		computeGroups: function ( geometry ) {

			var group;
			var groups = [];
			var materialIndex = undefined;

			var faces = geometry.faces;

			for ( var i = 0; i < faces.length; i ++ ) {

				var face = faces[ i ];

				// materials

				if ( face.materialIndex !== materialIndex ) {

					materialIndex = face.materialIndex;

					if ( group !== undefined ) {

						group.count = ( i * 3 ) - group.start;
						groups.push( group );

					}

					group = {
						start: i * 3,
						materialIndex: materialIndex
					};

				}

			}

			if ( group !== undefined ) {

				group.count = ( i * 3 ) - group.start;
				groups.push( group );

			}

			this.groups = groups;

		},

		fromGeometry: function ( geometry ) {

			var faces = geometry.faces;
			var vertices = geometry.vertices;
			var faceVertexUvs = geometry.faceVertexUvs;

			var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
			var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

			// morphs

			var morphTargets = geometry.morphTargets;
			var morphTargetsLength = morphTargets.length;

			var morphTargetsPosition;

			if ( morphTargetsLength > 0 ) {

				morphTargetsPosition = [];

				for ( var i = 0; i < morphTargetsLength; i ++ ) {

					morphTargetsPosition[ i ] = [];

				}

				this.morphTargets.position = morphTargetsPosition;

			}

			var morphNormals = geometry.morphNormals;
			var morphNormalsLength = morphNormals.length;

			var morphTargetsNormal;

			if ( morphNormalsLength > 0 ) {

				morphTargetsNormal = [];

				for ( var i = 0; i < morphNormalsLength; i ++ ) {

					morphTargetsNormal[ i ] = [];

				}

				this.morphTargets.normal = morphTargetsNormal;

			}

			// skins

			var skinIndices = geometry.skinIndices;
			var skinWeights = geometry.skinWeights;

			var hasSkinIndices = skinIndices.length === vertices.length;
			var hasSkinWeights = skinWeights.length === vertices.length;

			//

			for ( var i = 0; i < faces.length; i ++ ) {

				var face = faces[ i ];

				this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

				} else {

					var normal = face.normal;

					this.normals.push( normal, normal, normal );

				}

				var vertexColors = face.vertexColors;

				if ( vertexColors.length === 3 ) {

					this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

				} else {

					var color = face.color;

					this.colors.push( color, color, color );

				}

				if ( hasFaceVertexUv === true ) {

					var vertexUvs = faceVertexUvs[ 0 ][ i ];

					if ( vertexUvs !== undefined ) {

						this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

					} else {

						console.warn( 'DirectGeometry.fromGeometry(): Undefined vertexUv ', i );

						this.uvs.push( new Vector2(), new Vector2(), new Vector2() );

					}

				}

				if ( hasFaceVertexUv2 === true ) {

					var vertexUvs = faceVertexUvs[ 1 ][ i ];

					if ( vertexUvs !== undefined ) {

						this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

					} else {

						console.warn( 'DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );

						this.uvs2.push( new Vector2(), new Vector2(), new Vector2() );

					}

				}

				// morphs

				for ( var j = 0; j < morphTargetsLength; j ++ ) {

					var morphTarget = morphTargets[ j ].vertices;

					morphTargetsPosition[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

				}

				for ( var j = 0; j < morphNormalsLength; j ++ ) {

					var morphNormal = morphNormals[ j ].vertexNormals[ i ];

					morphTargetsNormal[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );

				}

				// skins

				if ( hasSkinIndices ) {

					this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

				}

				if ( hasSkinWeights ) {

					this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

				}

			}

			this.computeGroups( geometry );

			this.verticesNeedUpdate = geometry.verticesNeedUpdate;
			this.normalsNeedUpdate = geometry.normalsNeedUpdate;
			this.colorsNeedUpdate = geometry.colorsNeedUpdate;
			this.uvsNeedUpdate = geometry.uvsNeedUpdate;
			this.groupsNeedUpdate = geometry.groupsNeedUpdate;

			return this;

		}

	} );

	function arrayMax( array ) {

		if ( array.length === 0 ) return - Infinity;

		var max = array[ 0 ];

		for ( var i = 1, l = array.length; i < l; ++ i ) {

			if ( array[ i ] > max ) max = array[ i ];

		}

		return max;

	}

	var bufferGeometryId = 1; // BufferGeometry uses odd numbers as Id

	function BufferGeometry() {

		Object.defineProperty( this, 'id', { value: bufferGeometryId += 2 } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'BufferGeometry';

		this.index = null;
		this.attributes = {};

		this.morphAttributes = {};

		this.groups = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		this.drawRange = { start: 0, count: Infinity };

	}

	BufferGeometry.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: BufferGeometry,

		isBufferGeometry: true,

		getIndex: function () {

			return this.index;

		},

		setIndex: function ( index ) {

			if ( Array.isArray( index ) ) {

				this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

			} else {

				this.index = index;

			}

		},

		addAttribute: function ( name, attribute ) {

			if ( ! ( attribute && attribute.isBufferAttribute ) && ! ( attribute && attribute.isInterleavedBufferAttribute ) ) {

				console.warn( 'BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

				this.addAttribute( name, new BufferAttribute( arguments[ 1 ], arguments[ 2 ] ) );

				return;

			}

			if ( name === 'index' ) {

				console.warn( 'BufferGeometry.addAttribute: Use .setIndex() for index attribute.' );
				this.setIndex( attribute );

				return;

			}

			this.attributes[ name ] = attribute;

			return this;

		},

		getAttribute: function ( name ) {

			return this.attributes[ name ];

		},

		removeAttribute: function ( name ) {

			delete this.attributes[ name ];

			return this;

		},

		addGroup: function ( start, count, materialIndex ) {

			this.groups.push( {

				start: start,
				count: count,
				materialIndex: materialIndex !== undefined ? materialIndex : 0

			} );

		},

		clearGroups: function () {

			this.groups = [];

		},

		setDrawRange: function ( start, count ) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		},

		applyMatrix: function ( matrix ) {

			var position = this.attributes.position;

			if ( position !== undefined ) {

				matrix.applyToBufferAttribute( position );
				position.needsUpdate = true;

			}

			var normal = this.attributes.normal;

			if ( normal !== undefined ) {

				var normalMatrix = new Matrix3().getNormalMatrix( matrix );

				normalMatrix.applyToBufferAttribute( normal );
				normal.needsUpdate = true;

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1 = new Matrix4();

			return function rotateX( angle ) {

				m1.makeRotationX( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1 = new Matrix4();

			return function rotateY( angle ) {

				m1.makeRotationY( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1 = new Matrix4();

			return function rotateZ( angle ) {

				m1.makeRotationZ( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1 = new Matrix4();

			return function translate( x, y, z ) {

				m1.makeTranslation( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1 = new Matrix4();

			return function scale( x, y, z ) {

				m1.makeScale( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		lookAt: function () {

			var obj = new Object3D();

			return function lookAt( vector ) {

				obj.lookAt( vector );

				obj.updateMatrix();

				this.applyMatrix( obj.matrix );

			};

		}(),

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.getCenter().negate();

			this.translate( offset.x, offset.y, offset.z );

			return offset;

		},

		setFromObject: function ( object ) {

			// console.log( 'BufferGeometry.setFromObject(). Converting', object, this );

			var geometry = object.geometry;

			if ( object.isPoints || object.isLine ) {

				var positions = new Float32BufferAttribute( geometry.vertices.length * 3, 3 );
				var colors = new Float32BufferAttribute( geometry.colors.length * 3, 3 );

				this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
				this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

				if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

					var lineDistances = new Float32BufferAttribute( geometry.lineDistances.length, 1 );

					this.addAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

				}

				if ( geometry.boundingSphere !== null ) {

					this.boundingSphere = geometry.boundingSphere.clone();

				}

				if ( geometry.boundingBox !== null ) {

					this.boundingBox = geometry.boundingBox.clone();

				}

			} else if ( object.isMesh ) {

				if ( geometry && geometry.isGeometry ) {

					this.fromGeometry( geometry );

				}

			}

			return this;

		},

		setFromPoints: function ( points ) {

			var position = [];

			for ( var i = 0, l = points.length; i < l; i ++ ) {

				var point = points[ i ];
				position.push( point.x, point.y, point.z || 0 );

			}

			this.addAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

			return this;

		},

		updateFromObject: function ( object ) {

			var geometry = object.geometry;

			if ( object.isMesh ) {

				var direct = geometry.__directGeometry;

				if ( geometry.elementsNeedUpdate === true ) {

					direct = undefined;
					geometry.elementsNeedUpdate = false;

				}

				if ( direct === undefined ) {

					return this.fromGeometry( geometry );

				}

				direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
				direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
				direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
				direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
				direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

				geometry.verticesNeedUpdate = false;
				geometry.normalsNeedUpdate = false;
				geometry.colorsNeedUpdate = false;
				geometry.uvsNeedUpdate = false;
				geometry.groupsNeedUpdate = false;

				geometry = direct;

			}

			var attribute;

			if ( geometry.verticesNeedUpdate === true ) {

				attribute = this.attributes.position;

				if ( attribute !== undefined ) {

					attribute.copyVector3sArray( geometry.vertices );
					attribute.needsUpdate = true;

				}

				geometry.verticesNeedUpdate = false;

			}

			if ( geometry.normalsNeedUpdate === true ) {

				attribute = this.attributes.normal;

				if ( attribute !== undefined ) {

					attribute.copyVector3sArray( geometry.normals );
					attribute.needsUpdate = true;

				}

				geometry.normalsNeedUpdate = false;

			}

			if ( geometry.colorsNeedUpdate === true ) {

				attribute = this.attributes.color;

				if ( attribute !== undefined ) {

					attribute.copyColorsArray( geometry.colors );
					attribute.needsUpdate = true;

				}

				geometry.colorsNeedUpdate = false;

			}

			if ( geometry.uvsNeedUpdate ) {

				attribute = this.attributes.uv;

				if ( attribute !== undefined ) {

					attribute.copyVector2sArray( geometry.uvs );
					attribute.needsUpdate = true;

				}

				geometry.uvsNeedUpdate = false;

			}

			if ( geometry.lineDistancesNeedUpdate ) {

				attribute = this.attributes.lineDistance;

				if ( attribute !== undefined ) {

					attribute.copyArray( geometry.lineDistances );
					attribute.needsUpdate = true;

				}

				geometry.lineDistancesNeedUpdate = false;

			}

			if ( geometry.groupsNeedUpdate ) {

				geometry.computeGroups( object.geometry );
				this.groups = geometry.groups;

				geometry.groupsNeedUpdate = false;

			}

			return this;

		},

		fromGeometry: function ( geometry ) {

			geometry.__directGeometry = new DirectGeometry().fromGeometry( geometry );

			return this.fromDirectGeometry( geometry.__directGeometry );

		},

		fromDirectGeometry: function ( geometry ) {

			var positions = new Float32Array( geometry.vertices.length * 3 );
			this.addAttribute( 'position', new BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

			if ( geometry.normals.length > 0 ) {

				var normals = new Float32Array( geometry.normals.length * 3 );
				this.addAttribute( 'normal', new BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

			}

			if ( geometry.colors.length > 0 ) {

				var colors = new Float32Array( geometry.colors.length * 3 );
				this.addAttribute( 'color', new BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

			}

			if ( geometry.uvs.length > 0 ) {

				var uvs = new Float32Array( geometry.uvs.length * 2 );
				this.addAttribute( 'uv', new BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

			}

			if ( geometry.uvs2.length > 0 ) {

				var uvs2 = new Float32Array( geometry.uvs2.length * 2 );
				this.addAttribute( 'uv2', new BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

			}

			if ( geometry.indices.length > 0 ) {

				var TypeArray = arrayMax( geometry.indices ) > 65535 ? Uint32Array : Uint16Array;
				var indices = new TypeArray( geometry.indices.length * 3 );
				this.setIndex( new BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

			}

			// groups

			this.groups = geometry.groups;

			// morphs

			for ( var name in geometry.morphTargets ) {

				var array = [];
				var morphTargets = geometry.morphTargets[ name ];

				for ( var i = 0, l = morphTargets.length; i < l; i ++ ) {

					var morphTarget = morphTargets[ i ];

					var attribute = new Float32BufferAttribute( morphTarget.length * 3, 3 );

					array.push( attribute.copyVector3sArray( morphTarget ) );

				}

				this.morphAttributes[ name ] = array;

			}

			// skinning

			if ( geometry.skinIndices.length > 0 ) {

				var skinIndices = new Float32BufferAttribute( geometry.skinIndices.length * 4, 4 );
				this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

			}

			if ( geometry.skinWeights.length > 0 ) {

				var skinWeights = new Float32BufferAttribute( geometry.skinWeights.length * 4, 4 );
				this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

			}

			//

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			return this;

		},

		computeBoundingBox: function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			var position = this.attributes.position;

			if ( position !== undefined ) {

				this.boundingBox.setFromBufferAttribute( position );

			} else {

				this.boundingBox.makeEmpty();

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

			}

		},

		computeBoundingSphere: function () {

			var box = new Box3();
			var vector = new Vector3();

			return function computeBoundingSphere() {

				if ( this.boundingSphere === null ) {

					this.boundingSphere = new Sphere();

				}

				var position = this.attributes.position;

				if ( position ) {

					var center = this.boundingSphere.center;

					box.setFromBufferAttribute( position );
					box.getCenter( center );

					// hoping to find a boundingSphere with a radius smaller than the
					// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

					var maxRadiusSq = 0;

					for ( var i = 0, il = position.count; i < il; i ++ ) {

						vector.x = position.getX( i );
						vector.y = position.getY( i );
						vector.z = position.getZ( i );
						maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

					}

					this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

					if ( isNaN( this.boundingSphere.radius ) ) {

						console.error( 'BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

					}

				}

			};

		}(),

		computeFaceNormals: function () {

			// backwards compatibility

		},

		computeVertexNormals: function () {

			var index = this.index;
			var attributes = this.attributes;
			var groups = this.groups;

			if ( attributes.position ) {

				var positions = attributes.position.array;

				if ( attributes.normal === undefined ) {

					this.addAttribute( 'normal', new BufferAttribute( new Float32Array( positions.length ), 3 ) );

				} else {

					// reset existing normals to zero

					var array = attributes.normal.array;

					for ( var i = 0, il = array.length; i < il; i ++ ) {

						array[ i ] = 0;

					}

				}

				var normals = attributes.normal.array;

				var vA, vB, vC;
				var pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
				var cb = new Vector3(), ab = new Vector3();

				// indexed elements

				if ( index ) {

					var indices = index.array;

					if ( groups.length === 0 ) {

						this.addGroup( 0, indices.length );

					}

					for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

						var group = groups[ j ];

						var start = group.start;
						var count = group.count;

						for ( var i = start, il = start + count; i < il; i += 3 ) {

							vA = indices[ i + 0 ] * 3;
							vB = indices[ i + 1 ] * 3;
							vC = indices[ i + 2 ] * 3;

							pA.fromArray( positions, vA );
							pB.fromArray( positions, vB );
							pC.fromArray( positions, vC );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							normals[ vA ] += cb.x;
							normals[ vA + 1 ] += cb.y;
							normals[ vA + 2 ] += cb.z;

							normals[ vB ] += cb.x;
							normals[ vB + 1 ] += cb.y;
							normals[ vB + 2 ] += cb.z;

							normals[ vC ] += cb.x;
							normals[ vC + 1 ] += cb.y;
							normals[ vC + 2 ] += cb.z;

						}

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for ( var i = 0, il = positions.length; i < il; i += 9 ) {

						pA.fromArray( positions, i );
						pB.fromArray( positions, i + 3 );
						pC.fromArray( positions, i + 6 );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ i ] = cb.x;
						normals[ i + 1 ] = cb.y;
						normals[ i + 2 ] = cb.z;

						normals[ i + 3 ] = cb.x;
						normals[ i + 4 ] = cb.y;
						normals[ i + 5 ] = cb.z;

						normals[ i + 6 ] = cb.x;
						normals[ i + 7 ] = cb.y;
						normals[ i + 8 ] = cb.z;

					}

				}

				this.normalizeNormals();

				attributes.normal.needsUpdate = true;

			}

		},

		merge: function ( geometry, offset ) {

			if ( ! ( geometry && geometry.isBufferGeometry ) ) {

				console.error( 'BufferGeometry.merge(): geometry not an instance of BufferGeometry.', geometry );
				return;

			}

			if ( offset === undefined ) offset = 0;

			var attributes = this.attributes;

			for ( var key in attributes ) {

				if ( geometry.attributes[ key ] === undefined ) continue;

				var attribute1 = attributes[ key ];
				var attributeArray1 = attribute1.array;

				var attribute2 = geometry.attributes[ key ];
				var attributeArray2 = attribute2.array;

				var attributeSize = attribute2.itemSize;

				for ( var i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

					attributeArray1[ j ] = attributeArray2[ i ];

				}

			}

			return this;

		},

		normalizeNormals: function () {

			var vector = new Vector3();

			return function normalizeNormals() {

				var normals = this.attributes.normal;

				for ( var i = 0, il = normals.count; i < il; i ++ ) {

					vector.x = normals.getX( i );
					vector.y = normals.getY( i );
					vector.z = normals.getZ( i );

					vector.normalize();

					normals.setXYZ( i, vector.x, vector.y, vector.z );

				}

			};

		}(),

		toNonIndexed: function () {

			if ( this.index === null ) {

				console.warn( 'BufferGeometry.toNonIndexed(): Geometry is already non-indexed.' );
				return this;

			}

			var geometry2 = new BufferGeometry();

			var indices = this.index.array;
			var attributes = this.attributes;

			for ( var name in attributes ) {

				var attribute = attributes[ name ];

				var array = attribute.array;
				var itemSize = attribute.itemSize;

				var array2 = new array.constructor( indices.length * itemSize );

				var index = 0, index2 = 0;

				for ( var i = 0, l = indices.length; i < l; i ++ ) {

					index = indices[ i ] * itemSize;

					for ( var j = 0; j < itemSize; j ++ ) {

						array2[ index2 ++ ] = array[ index ++ ];

					}

				}

				geometry2.addAttribute( name, new BufferAttribute( array2, itemSize ) );

			}

			return geometry2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.5,
					type: 'BufferGeometry',
					generator: 'BufferGeometry.toJSON'
				}
			};

			// standard BufferGeometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;

			if ( this.parameters !== undefined ) {

				var parameters = this.parameters;

				for ( var key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			data.data = { attributes: {} };

			var index = this.index;

			if ( index !== null ) {

				var array = Array.prototype.slice.call( index.array );

				data.data.index = {
					type: index.array.constructor.name,
					array: array
				};

			}

			var attributes = this.attributes;

			for ( var key in attributes ) {

				var attribute = attributes[ key ];

				var array = Array.prototype.slice.call( attribute.array );

				data.data.attributes[ key ] = {
					itemSize: attribute.itemSize,
					type: attribute.array.constructor.name,
					array: array,
					normalized: attribute.normalized
				};

			}

			var groups = this.groups;

			if ( groups.length > 0 ) {

				data.data.groups = JSON.parse( JSON.stringify( groups ) );

			}

			var boundingSphere = this.boundingSphere;

			if ( boundingSphere !== null ) {

				data.data.boundingSphere = {
					center: boundingSphere.center.toArray(),
					radius: boundingSphere.radius
				};

			}

			return data;

		},

		clone: function () {

			

			return new BufferGeometry().copy( this );

		},

		copy: function ( source ) {

			var name, i, l;

			// reset

			this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// name

			this.name = source.name;

			// index

			var index = source.index;

			if ( index !== null ) {

				this.setIndex( index.clone() );

			}

			// attributes

			var attributes = source.attributes;

			for ( name in attributes ) {

				var attribute = attributes[ name ];
				this.addAttribute( name, attribute.clone() );

			}

			// morph attributes

			var morphAttributes = source.morphAttributes;

			for ( name in morphAttributes ) {

				var array = [];
				var morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( i = 0, l = morphAttribute.length; i < l; i ++ ) {

					array.push( morphAttribute[ i ].clone() );

				}

				this.morphAttributes[ name ] = array;

			}

			// groups

			var groups = source.groups;

			for ( i = 0, l = groups.length; i < l; i ++ ) {

				var group = groups[ i ];
				this.addGroup( group.start, group.count, group.materialIndex );

			}

			// bounding box

			var boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			var boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// draw range

			this.drawRange.start = source.drawRange.start;
			this.drawRange.count = source.drawRange.count;

			return this;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		}

	} );

	var TGALoader = function ( manager ) {

		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

	};

	TGALoader.prototype = {

		constructor: TGALoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var texture = new Texture();

			var loader = new FileLoader( this.manager );
			loader.setResponseType( 'arraybuffer' );

			loader.load( url, function ( buffer ) {

				texture.image = scope.parse( buffer );
				texture.needsUpdate = true;

				if ( onLoad !== undefined ) {

					onLoad( texture );

				}

			}, onProgress, onError );

			return texture;

		},

		parse: function ( buffer ) {

			// reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js

			function tgaCheckHeader( header ) {

				switch ( header.image_type ) {

					// check indexed type

					case TGA_TYPE_INDEXED:
					case TGA_TYPE_RLE_INDEXED:
						if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1 ) {

							console.error( 'TGALoader: Invalid type colormap data for indexed type.' );

						}
						break;

					// check colormap type

					case TGA_TYPE_RGB:
					case TGA_TYPE_GREY:
					case TGA_TYPE_RLE_RGB:
					case TGA_TYPE_RLE_GREY:
						if ( header.colormap_type ) {

							console.error( 'TGALoader: Invalid type colormap data for colormap type.' );

						}
						break;

					// What the need of a file without data ?

					case TGA_TYPE_NO_DATA:
						console.error( 'TGALoader: No data.' );

					// Invalid type ?

					default:
						console.error( 'TGALoader: Invalid type "%s".', header.image_type );

				}

				// check image width and height

				if ( header.width <= 0 || header.height <= 0 ) {

					console.error( 'TGALoader: Invalid image size.' );

				}

				// check image pixel size

				if ( header.pixel_size !== 8 && header.pixel_size !== 16 &&
					header.pixel_size !== 24 && header.pixel_size !== 32 ) {

					console.error( 'TGALoader: Invalid pixel size "%s".', header.pixel_size );

				}

			}

			// parse tga image buffer

			function tgaParse( use_rle, use_pal, header, offset, data ) {

				var pixel_data,
					pixel_size,
					pixel_total,
					palettes;

				pixel_size = header.pixel_size >> 3;
				pixel_total = header.width * header.height * pixel_size;

				 // read palettes

				 if ( use_pal ) {

					 palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );

				 }

				 // read RLE

				 if ( use_rle ) {

					 pixel_data = new Uint8Array( pixel_total );

					var c, count, i;
					var shift = 0;
					var pixels = new Uint8Array( pixel_size );

					while ( shift < pixel_total ) {

						c = data[ offset ++ ];
						count = ( c & 0x7f ) + 1;

						// RLE pixels

						if ( c & 0x80 ) {

							// bind pixel tmp array

							for ( i = 0; i < pixel_size; ++ i ) {

								pixels[ i ] = data[ offset ++ ];

							}

							// copy pixel array

							for ( i = 0; i < count; ++ i ) {

								pixel_data.set( pixels, shift + i * pixel_size );

							}

							shift += pixel_size * count;

						} else {

							// raw pixels

							count *= pixel_size;
							for ( i = 0; i < count; ++ i ) {

								pixel_data[ shift + i ] = data[ offset ++ ];

							}
							shift += count;

						}

					}

				 } else {

					// raw pixels

					pixel_data = data.subarray(
						 offset, offset += ( use_pal ? header.width * header.height : pixel_total )
					);

				 }

				 return {
					pixel_data: pixel_data,
					palettes: palettes
				 };

			}

			function tgaGetImageData8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) {

				var colormap = palettes;
				var color, i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

						color = image[ i ];
						imageData[ ( x + width * y ) * 4 + 3 ] = 255;
						imageData[ ( x + width * y ) * 4 + 2 ] = colormap[ ( color * 3 ) + 0 ];
						imageData[ ( x + width * y ) * 4 + 1 ] = colormap[ ( color * 3 ) + 1 ];
						imageData[ ( x + width * y ) * 4 + 0 ] = colormap[ ( color * 3 ) + 2 ];

					}

				}

				return imageData;

			}

			function tgaGetImageData16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

				var color, i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

						color = image[ i + 0 ] + ( image[ i + 1 ] << 8 ); // Inversed ?
						imageData[ ( x + width * y ) * 4 + 0 ] = ( color & 0x7C00 ) >> 7;
						imageData[ ( x + width * y ) * 4 + 1 ] = ( color & 0x03E0 ) >> 2;
						imageData[ ( x + width * y ) * 4 + 2 ] = ( color & 0x001F ) >> 3;
						imageData[ ( x + width * y ) * 4 + 3 ] = ( color & 0x8000 ) ? 0 : 255;

					}

				}

				return imageData;

			}

			function tgaGetImageData24bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

				var i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i += 3 ) {

						imageData[ ( x + width * y ) * 4 + 3 ] = 255;
						imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
						imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
						imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];

					}

				}

				return imageData;

			}

			function tgaGetImageData32bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

				var i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i += 4 ) {

						imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
						imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
						imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];
						imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 3 ];

					}

				}

				return imageData;

			}

			function tgaGetImageDataGrey8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

				var color, i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

						color = image[ i ];
						imageData[ ( x + width * y ) * 4 + 0 ] = color;
						imageData[ ( x + width * y ) * 4 + 1 ] = color;
						imageData[ ( x + width * y ) * 4 + 2 ] = color;
						imageData[ ( x + width * y ) * 4 + 3 ] = 255;

					}

				}

				return imageData;

			}

			function tgaGetImageDataGrey16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

				var i = 0, x, y;
				var width = header.width;

				for ( y = y_start; y !== y_end; y += y_step ) {

					for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

						imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 0 ];
						imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 0 ];
						imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
						imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 1 ];

					}

				}

				return imageData;

			}

			function getTgaRGBA( data, width, height, image, palette ) {

				var x_start,
					y_start,
					x_step,
					y_step,
					x_end,
					y_end;

				switch ( ( header.flags & TGA_ORIGIN_MASK ) >> TGA_ORIGIN_SHIFT ) {

					default:
					case TGA_ORIGIN_UL:
						x_start = 0;
						x_step = 1;
						x_end = width;
						y_start = 0;
						y_step = 1;
						y_end = height;
						break;

					case TGA_ORIGIN_BL:
						x_start = 0;
						x_step = 1;
						x_end = width;
						y_start = height - 1;
						y_step = - 1;
						y_end = - 1;
						break;

					case TGA_ORIGIN_UR:
						x_start = width - 1;
						x_step = - 1;
						x_end = - 1;
						y_start = 0;
						y_step = 1;
						y_end = height;
						break;

					case TGA_ORIGIN_BR:
						x_start = width - 1;
						x_step = - 1;
						x_end = - 1;
						y_start = height - 1;
						y_step = - 1;
						y_end = - 1;
						break;

				}

				if ( use_grey ) {

					switch ( header.pixel_size ) {

						case 8:
							tgaGetImageDataGrey8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
							break;

						case 16:
							tgaGetImageDataGrey16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
							break;

						default:
							console.error( 'TGALoader: Format not supported.' );
							break;

					}

				} else {

					switch ( header.pixel_size ) {

						case 8:
							tgaGetImageData8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
							break;

						case 16:
							tgaGetImageData16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
							break;

						case 24:
							tgaGetImageData24bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
							break;

						case 32:
							tgaGetImageData32bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
							break;

						default:
							console.error( 'TGALoader: Format not supported.' );
							break;

					}

				}

				// Load image data according to specific method
				// var func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
				// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
				return data;

			}

			// TGA constants

			var TGA_TYPE_NO_DATA = 0,
				TGA_TYPE_INDEXED = 1,
				TGA_TYPE_RGB = 2,
				TGA_TYPE_GREY = 3,
				TGA_TYPE_RLE_INDEXED = 9,
				TGA_TYPE_RLE_RGB = 10,
				TGA_TYPE_RLE_GREY = 11,

				TGA_ORIGIN_MASK = 0x30,
				TGA_ORIGIN_SHIFT = 0x04,
				TGA_ORIGIN_BL = 0x00,
				TGA_ORIGIN_BR = 0x01,
				TGA_ORIGIN_UL = 0x02,
				TGA_ORIGIN_UR = 0x03;

			if ( buffer.length < 19 ) console.error( 'TGALoader: Not enough data to contain header.' );

			var content = new Uint8Array( buffer ),
				offset = 0,
				header = {
					id_length: content[ offset ++ ],
					colormap_type: content[ offset ++ ],
					image_type: content[ offset ++ ],
					colormap_index: content[ offset ++ ] | content[ offset ++ ] << 8,
					colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
					colormap_size: content[ offset ++ ],
					origin: [
						content[ offset ++ ] | content[ offset ++ ] << 8,
						content[ offset ++ ] | content[ offset ++ ] << 8
					],
					width: content[ offset ++ ] | content[ offset ++ ] << 8,
					height: content[ offset ++ ] | content[ offset ++ ] << 8,
					pixel_size: content[ offset ++ ],
					flags: content[ offset ++ ]
				};

				// check tga if it is valid format

			tgaCheckHeader( header );

			if ( header.id_length + offset > buffer.length ) {

				console.error( 'TGALoader: No data.' );

			}

			// skip the needn't data

			offset += header.id_length;

			// get targa information about RLE compression and palette

			var use_rle = false,
				use_pal = false,
				use_grey = false;

			switch ( header.image_type ) {

				case TGA_TYPE_RLE_INDEXED:
					use_rle = true;
					use_pal = true;
					break;

				case TGA_TYPE_INDEXED:
					use_pal = true;
					break;

				case TGA_TYPE_RLE_RGB:
					use_rle = true;
					break;

				case TGA_TYPE_RGB:
					break;

				case TGA_TYPE_RLE_GREY:
					use_rle = true;
					use_grey = true;
					break;

				case TGA_TYPE_GREY:
					use_grey = true;
					break;

			}

			//

			var canvas = document.createElement( 'canvas' );
			canvas.width = header.width;
			canvas.height = header.height;

			var context = canvas.getContext( '2d' );
			var imageData = context.createImageData( header.width, header.height );

			var result = tgaParse( use_rle, use_pal, header, offset, content );
			var rgbaData = getTgaRGBA( imageData.data, header.width, header.height, result.pixel_data, result.palettes );

			context.putImageData( imageData, 0, 0 );

			return canvas;

		}

	};

	var materialId = 0;

	function Material() {

		Object.defineProperty( this, 'id', { value: materialId ++ } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'Material';

		this.fog = true;
		this.lights = true;

		this.blending = NormalBlending;
		this.side = FrontSide;
		this.flatShading = false;
		this.vertexColors = NoColors; // NoColors, VertexColors, FaceColors

		this.opacity = 1;
		this.transparent = false;

		this.blendSrc = SrcAlphaFactor;
		this.blendDst = OneMinusSrcAlphaFactor;
		this.blendEquation = AddEquation;
		this.blendSrcAlpha = null;
		this.blendDstAlpha = null;
		this.blendEquationAlpha = null;

		this.depthFunc = LessEqualDepth;
		this.depthTest = true;
		this.depthWrite = true;

		this.clippingPlanes = null;
		this.clipIntersection = false;
		this.clipShadows = false;

		this.shadowSide = null;

		this.colorWrite = true;

		this.precision = null; // override the renderer's default precision for this material

		this.polygonOffset = false;
		this.polygonOffsetFactor = 0;
		this.polygonOffsetUnits = 0;

		this.dithering = false;

		this.alphaTest = 0;
		this.premultipliedAlpha = false;

		this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

		this.visible = true;

		this.userData = {};

		this.needsUpdate = true;

	}

	Material.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: Material,

		isMaterial: true,

		onBeforeCompile: function () {},

		setValues: function ( values ) {

			if ( values === undefined ) return;

			for ( var key in values ) {

				var newValue = values[ key ];

				if ( newValue === undefined ) {

					console.warn( "Material: '" + key + "' parameter is undefined." );
					continue;

				}

				// for backward compatability if shading is set in the constructor
				if ( key === 'shading' ) {

					console.warn( '' + this.type + ': .shading has been removed. Use the boolean .flatShading instead.' );
					this.flatShading = ( newValue === FlatShading ) ? true : false;
					continue;

				}

				var currentValue = this[ key ];

				if ( currentValue === undefined ) {

					console.warn( "" + this.type + ": '" + key + "' is not a property of this material." );
					continue;

				}

				if ( currentValue && currentValue.isColor ) {

					currentValue.set( newValue );

				} else if ( ( currentValue && currentValue.isVector3 ) && ( newValue && newValue.isVector3 ) ) {

					currentValue.copy( newValue );

				} else if ( key === 'overdraw' ) {

					// ensure overdraw is backwards-compatible with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		},

		toJSON: function ( meta ) {

			var isRoot = ( meta === undefined || typeof meta === 'string' );

			if ( isRoot ) {

				meta = {
					textures: {},
					images: {}
				};

			}

			var data = {
				metadata: {
					version: 4.5,
					type: 'Material',
					generator: 'Material.toJSON'
				}
			};

			// standard Material serialization
			data.uuid = this.uuid;
			data.type = this.type;

			if ( this.name !== '' ) data.name = this.name;

			if ( this.color && this.color.isColor ) data.color = this.color.getHex();

			if ( this.roughness !== undefined ) data.roughness = this.roughness;
			if ( this.metalness !== undefined ) data.metalness = this.metalness;

			if ( this.emissive && this.emissive.isColor ) data.emissive = this.emissive.getHex();
			if ( this.emissiveIntensity !== 1 ) data.emissiveIntensity = this.emissiveIntensity;

			if ( this.specular && this.specular.isColor ) data.specular = this.specular.getHex();
			if ( this.shininess !== undefined ) data.shininess = this.shininess;
			if ( this.clearCoat !== undefined ) data.clearCoat = this.clearCoat;
			if ( this.clearCoatRoughness !== undefined ) data.clearCoatRoughness = this.clearCoatRoughness;

			if ( this.map && this.map.isTexture ) data.map = this.map.toJSON( meta ).uuid;
			if ( this.alphaMap && this.alphaMap.isTexture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
			if ( this.lightMap && this.lightMap.isTexture ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
			if ( this.bumpMap && this.bumpMap.isTexture ) {

				data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
				data.bumpScale = this.bumpScale;

			}
			if ( this.normalMap && this.normalMap.isTexture ) {

				data.normalMap = this.normalMap.toJSON( meta ).uuid;
				data.normalScale = this.normalScale.toArray();

			}
			if ( this.displacementMap && this.displacementMap.isTexture ) {

				data.displacementMap = this.displacementMap.toJSON( meta ).uuid;
				data.displacementScale = this.displacementScale;
				data.displacementBias = this.displacementBias;

			}
			if ( this.roughnessMap && this.roughnessMap.isTexture ) data.roughnessMap = this.roughnessMap.toJSON( meta ).uuid;
			if ( this.metalnessMap && this.metalnessMap.isTexture ) data.metalnessMap = this.metalnessMap.toJSON( meta ).uuid;

			if ( this.emissiveMap && this.emissiveMap.isTexture ) data.emissiveMap = this.emissiveMap.toJSON( meta ).uuid;
			if ( this.specularMap && this.specularMap.isTexture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;

			if ( this.envMap && this.envMap.isTexture ) {

				data.envMap = this.envMap.toJSON( meta ).uuid;
				data.reflectivity = this.reflectivity; // Scale behind envMap

			}

			if ( this.gradientMap && this.gradientMap.isTexture ) {

				data.gradientMap = this.gradientMap.toJSON( meta ).uuid;

			}

			if ( this.size !== undefined ) data.size = this.size;
			if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

			if ( this.blending !== NormalBlending ) data.blending = this.blending;
			if ( this.flatShading === true ) data.flatShading = this.flatShading;
			if ( this.side !== FrontSide ) data.side = this.side;
			if ( this.vertexColors !== NoColors ) data.vertexColors = this.vertexColors;

			if ( this.opacity < 1 ) data.opacity = this.opacity;
			if ( this.transparent === true ) data.transparent = this.transparent;

			data.depthFunc = this.depthFunc;
			data.depthTest = this.depthTest;
			data.depthWrite = this.depthWrite;

			// rotation (SpriteMaterial)
			if ( this.rotation !== 0 ) data.rotation = this.rotation;

			if ( this.linewidth !== 1 ) data.linewidth = this.linewidth;
			if ( this.dashSize !== undefined ) data.dashSize = this.dashSize;
			if ( this.gapSize !== undefined ) data.gapSize = this.gapSize;
			if ( this.scale !== undefined ) data.scale = this.scale;

			if ( this.dithering === true ) data.dithering = true;

			if ( this.alphaTest > 0 ) data.alphaTest = this.alphaTest;
			if ( this.premultipliedAlpha === true ) data.premultipliedAlpha = this.premultipliedAlpha;

			if ( this.wireframe === true ) data.wireframe = this.wireframe;
			if ( this.wireframeLinewidth > 1 ) data.wireframeLinewidth = this.wireframeLinewidth;
			if ( this.wireframeLinecap !== 'round' ) data.wireframeLinecap = this.wireframeLinecap;
			if ( this.wireframeLinejoin !== 'round' ) data.wireframeLinejoin = this.wireframeLinejoin;

			if ( this.morphTargets === true ) data.morphTargets = true;
			if ( this.skinning === true ) data.skinning = true;

			if ( this.visible === false ) data.visible = false;
			if ( JSON.stringify( this.userData ) !== '{}' ) data.userData = this.userData;

			// TODO: Copied from Object3D.toJSON

			function extractFromCache( cache ) {

				var values = [];

				for ( var key in cache ) {

					var data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}

				return values;

			}

			if ( isRoot ) {

				var textures = extractFromCache( meta.textures );
				var images = extractFromCache( meta.images );

				if ( textures.length > 0 ) data.textures = textures;
				if ( images.length > 0 ) data.images = images;

			}

			return data;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( source ) {

			this.name = source.name;

			this.fog = source.fog;
			this.lights = source.lights;

			this.blending = source.blending;
			this.side = source.side;
			this.flatShading = source.flatShading;
			this.vertexColors = source.vertexColors;

			this.opacity = source.opacity;
			this.transparent = source.transparent;

			this.blendSrc = source.blendSrc;
			this.blendDst = source.blendDst;
			this.blendEquation = source.blendEquation;
			this.blendSrcAlpha = source.blendSrcAlpha;
			this.blendDstAlpha = source.blendDstAlpha;
			this.blendEquationAlpha = source.blendEquationAlpha;

			this.depthFunc = source.depthFunc;
			this.depthTest = source.depthTest;
			this.depthWrite = source.depthWrite;

			this.colorWrite = source.colorWrite;

			this.precision = source.precision;

			this.polygonOffset = source.polygonOffset;
			this.polygonOffsetFactor = source.polygonOffsetFactor;
			this.polygonOffsetUnits = source.polygonOffsetUnits;

			this.dithering = source.dithering;

			this.alphaTest = source.alphaTest;
			this.premultipliedAlpha = source.premultipliedAlpha;

			this.overdraw = source.overdraw;

			this.visible = source.visible;
			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			this.clipShadows = source.clipShadows;
			this.clipIntersection = source.clipIntersection;

			var srcPlanes = source.clippingPlanes,
				dstPlanes = null;

			if ( srcPlanes !== null ) {

				var n = srcPlanes.length;
				dstPlanes = new Array( n );

				for ( var i = 0; i !== n; ++ i )
					dstPlanes[ i ] = srcPlanes[ i ].clone();

			}

			this.clippingPlanes = dstPlanes;

			this.shadowSide = source.shadowSide;

			return this;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		}

	} );

	function MeshPhongMaterial( parameters ) {

		Material.call( this );

		this.type = 'MeshPhongMaterial';

		this.color = new Color( 0xffffff ); // diffuse
		this.specular = new Color( 0x111111 );
		this.shininess = 30;

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new Color( 0x000000 );
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalScale = new Vector2( 1, 1 );

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.setValues( parameters );

	}

	MeshPhongMaterial.prototype = Object.create( Material.prototype );
	MeshPhongMaterial.prototype.constructor = MeshPhongMaterial;

	MeshPhongMaterial.prototype.isMeshPhongMaterial = true;

	MeshPhongMaterial.prototype.copy = function ( source ) {

		Material.prototype.copy.call( this, source );

		this.color.copy( source.color );
		this.specular.copy( source.specular );
		this.shininess = source.shininess;

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy( source.emissive );
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalScale.copy( source.normalScale );

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.specularMap = source.specularMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.combine = source.combine;
		this.reflectivity = source.reflectivity;
		this.refractionRatio = source.refractionRatio;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		return this;

	};

	function MeshToonMaterial( parameters ) {

		MeshPhongMaterial.call( this );

		this.defines = { 'TOON': '' };

		this.type = 'MeshToonMaterial';

		this.gradientMap = null;

		this.setValues( parameters );

	}

	MeshToonMaterial.prototype = Object.create( MeshPhongMaterial.prototype );
	MeshToonMaterial.prototype.constructor = MeshToonMaterial;

	MeshToonMaterial.prototype.isMeshToonMaterial = true;

	MeshToonMaterial.prototype.copy = function ( source ) {

		MeshPhongMaterial.prototype.copy.call( this, source );

		this.gradientMap = source.gradientMap;

		return this;

	};

	function Ray( origin, direction ) {

		this.origin = ( origin !== undefined ) ? origin : new Vector3();
		this.direction = ( direction !== undefined ) ? direction : new Vector3();

	}

	Object.assign( Ray.prototype, {

		set: function ( origin, direction ) {

			this.origin.copy( origin );
			this.direction.copy( direction );

			return this;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( ray ) {

			this.origin.copy( ray.origin );
			this.direction.copy( ray.direction );

			return this;

		},

		at: function ( t, optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return result.copy( this.direction ).multiplyScalar( t ).add( this.origin );

		},

		lookAt: function ( v ) {

			this.direction.copy( v ).sub( this.origin ).normalize();

			return this;

		},

		recast: function () {

			var v1 = new Vector3();

			return function recast( t ) {

				this.origin.copy( this.at( t, v1 ) );

				return this;

			};

		}(),

		closestPointToPoint: function ( point, optionalTarget ) {

			var result = optionalTarget || new Vector3();
			result.subVectors( point, this.origin );
			var directionDistance = result.dot( this.direction );

			if ( directionDistance < 0 ) {

				return result.copy( this.origin );

			}

			return result.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

		},

		distanceToPoint: function ( point ) {

			return Math.sqrt( this.distanceSqToPoint( point ) );

		},

		distanceSqToPoint: function () {

			var v1 = new Vector3();

			return function distanceSqToPoint( point ) {

				var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

				// point behind the ray

				if ( directionDistance < 0 ) {

					return this.origin.distanceToSquared( point );

				}

				v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

				return v1.distanceToSquared( point );

			};

		}(),

		distanceSqToSegment: function () {

			var segCenter = new Vector3();
			var segDir = new Vector3();
			var diff = new Vector3();

			return function distanceSqToSegment( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

				// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
				// It returns the min distance between the ray and the segment
				// defined by v0 and v1
				// It can also set two optional targets :
				// - The closest point on the ray
				// - The closest point on the segment

				segCenter.copy( v0 ).add( v1 ).multiplyScalar( 0.5 );
				segDir.copy( v1 ).sub( v0 ).normalize();
				diff.copy( this.origin ).sub( segCenter );

				var segExtent = v0.distanceTo( v1 ) * 0.5;
				var a01 = - this.direction.dot( segDir );
				var b0 = diff.dot( this.direction );
				var b1 = - diff.dot( segDir );
				var c = diff.lengthSq();
				var det = Math.abs( 1 - a01 * a01 );
				var s0, s1, sqrDist, extDet;

				if ( det > 0 ) {

					// The ray and segment are not parallel.

					s0 = a01 * b1 - b0;
					s1 = a01 * b0 - b1;
					extDet = segExtent * det;

					if ( s0 >= 0 ) {

						if ( s1 >= - extDet ) {

							if ( s1 <= extDet ) {

								// region 0
								// Minimum at interior points of ray and segment.

								var invDet = 1 / det;
								s0 *= invDet;
								s1 *= invDet;
								sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

							} else {

								// region 1

								s1 = segExtent;
								s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
								sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

							}

						} else {

							// region 5

							s1 = - segExtent;
							s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					} else {

						if ( s1 <= - extDet ) {

							// region 4

							s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
							s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						} else if ( s1 <= extDet ) {

							// region 3

							s0 = 0;
							s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
							sqrDist = s1 * ( s1 + 2 * b1 ) + c;

						} else {

							// region 2

							s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
							s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					}

				} else {

					// Ray and segment are parallel.

					s1 = ( a01 > 0 ) ? - segExtent : segExtent;
					s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
					sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

				}

				if ( optionalPointOnRay ) {

					optionalPointOnRay.copy( this.direction ).multiplyScalar( s0 ).add( this.origin );

				}

				if ( optionalPointOnSegment ) {

					optionalPointOnSegment.copy( segDir ).multiplyScalar( s1 ).add( segCenter );

				}

				return sqrDist;

			};

		}(),

		intersectSphere: function () {

			var v1 = new Vector3();

			return function intersectSphere( sphere, optionalTarget ) {

				v1.subVectors( sphere.center, this.origin );
				var tca = v1.dot( this.direction );
				var d2 = v1.dot( v1 ) - tca * tca;
				var radius2 = sphere.radius * sphere.radius;

				if ( d2 > radius2 ) return null;

				var thc = Math.sqrt( radius2 - d2 );

				// t0 = first intersect point - entrance on front of sphere
				var t0 = tca - thc;

				// t1 = second intersect point - exit point on back of sphere
				var t1 = tca + thc;

				// test to see if both t0 and t1 are behind the ray - if so, return null
				if ( t0 < 0 && t1 < 0 ) return null;

				// test to see if t0 is behind the ray:
				// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
				// in order to always return an intersect point that is in front of the ray.
				if ( t0 < 0 ) return this.at( t1, optionalTarget );

				// else t0 is in front of the ray, so return the first collision point scaled by t0
				return this.at( t0, optionalTarget );

			};

		}(),

		intersectsSphere: function ( sphere ) {

			return this.distanceToPoint( sphere.center ) <= sphere.radius;

		},

		distanceToPlane: function ( plane ) {

			var denominator = plane.normal.dot( this.direction );

			if ( denominator === 0 ) {

				// line is coplanar, return origin
				if ( plane.distanceToPoint( this.origin ) === 0 ) {

					return 0;

				}

				// Null is preferable to undefined since undefined means.... it is undefined

				return null;

			}

			var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

			// Return if the ray never intersects the plane

			return t >= 0 ? t : null;

		},

		intersectPlane: function ( plane, optionalTarget ) {

			var t = this.distanceToPlane( plane );

			if ( t === null ) {

				return null;

			}

			return this.at( t, optionalTarget );

		},

		intersectsPlane: function ( plane ) {

			// check if the ray lies on the plane first

			var distToPoint = plane.distanceToPoint( this.origin );

			if ( distToPoint === 0 ) {

				return true;

			}

			var denominator = plane.normal.dot( this.direction );

			if ( denominator * distToPoint < 0 ) {

				return true;

			}

			// ray origin is behind the plane (and is pointing behind it)

			return false;

		},

		intersectBox: function ( box, optionalTarget ) {

			var tmin, tmax, tymin, tymax, tzmin, tzmax;

			var invdirx = 1 / this.direction.x,
				invdiry = 1 / this.direction.y,
				invdirz = 1 / this.direction.z;

			var origin = this.origin;

			if ( invdirx >= 0 ) {

				tmin = ( box.min.x - origin.x ) * invdirx;
				tmax = ( box.max.x - origin.x ) * invdirx;

			} else {

				tmin = ( box.max.x - origin.x ) * invdirx;
				tmax = ( box.min.x - origin.x ) * invdirx;

			}

			if ( invdiry >= 0 ) {

				tymin = ( box.min.y - origin.y ) * invdiry;
				tymax = ( box.max.y - origin.y ) * invdiry;

			} else {

				tymin = ( box.max.y - origin.y ) * invdiry;
				tymax = ( box.min.y - origin.y ) * invdiry;

			}

			if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

			// These lines also handle the case where tmin or tmax is NaN
			// (result of 0 * Infinity). x !== x returns true if x is NaN

			if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

			if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

			if ( invdirz >= 0 ) {

				tzmin = ( box.min.z - origin.z ) * invdirz;
				tzmax = ( box.max.z - origin.z ) * invdirz;

			} else {

				tzmin = ( box.max.z - origin.z ) * invdirz;
				tzmax = ( box.min.z - origin.z ) * invdirz;

			}

			if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

			if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

			if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

			//return point closest to the ray (positive side)

			if ( tmax < 0 ) return null;

			return this.at( tmin >= 0 ? tmin : tmax, optionalTarget );

		},

		intersectsBox: ( function () {

			var v = new Vector3();

			return function intersectsBox( box ) {

				return this.intersectBox( box, v ) !== null;

			};

		} )(),

		intersectTriangle: function () {

			// Compute the offset origin, edges, and normal.
			var diff = new Vector3();
			var edge1 = new Vector3();
			var edge2 = new Vector3();
			var normal = new Vector3();

			return function intersectTriangle( a, b, c, backfaceCulling, optionalTarget ) {

				// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

				edge1.subVectors( b, a );
				edge2.subVectors( c, a );
				normal.crossVectors( edge1, edge2 );

				// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
				// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
				//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
				//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
				//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
				var DdN = this.direction.dot( normal );
				var sign;

				if ( DdN > 0 ) {

					if ( backfaceCulling ) return null;
					sign = 1;

				} else if ( DdN < 0 ) {

					sign = - 1;
					DdN = - DdN;

				} else {

					return null;

				}

				diff.subVectors( this.origin, a );
				var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

				// b1 < 0, no intersection
				if ( DdQxE2 < 0 ) {

					return null;

				}

				var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

				// b2 < 0, no intersection
				if ( DdE1xQ < 0 ) {

					return null;

				}

				// b1+b2 > 1, no intersection
				if ( DdQxE2 + DdE1xQ > DdN ) {

					return null;

				}

				// Line intersects triangle, check if ray does.
				var QdN = - sign * diff.dot( normal );

				// t < 0, no intersection
				if ( QdN < 0 ) {

					return null;

				}

				// Ray intersects triangle.
				return this.at( QdN / DdN, optionalTarget );

			};

		}(),

		applyMatrix4: function ( matrix4 ) {

			this.origin.applyMatrix4( matrix4 );
			this.direction.transformDirection( matrix4 );

			return this;

		},

		equals: function ( ray ) {

			return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

		}

	} );

	function Line3( start, end ) {

		this.start = ( start !== undefined ) ? start : new Vector3();
		this.end = ( end !== undefined ) ? end : new Vector3();

	}

	Object.assign( Line3.prototype, {

		set: function ( start, end ) {

			this.start.copy( start );
			this.end.copy( end );

			return this;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( line ) {

			this.start.copy( line.start );
			this.end.copy( line.end );

			return this;

		},

		getCenter: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

		},

		delta: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.subVectors( this.end, this.start );

		},

		distanceSq: function () {

			return this.start.distanceToSquared( this.end );

		},

		distance: function () {

			return this.start.distanceTo( this.end );

		},

		at: function ( t, optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return this.delta( result ).multiplyScalar( t ).add( this.start );

		},

		closestPointToPointParameter: function () {

			var startP = new Vector3();
			var startEnd = new Vector3();

			return function closestPointToPointParameter( point, clampToLine ) {

				startP.subVectors( point, this.start );
				startEnd.subVectors( this.end, this.start );

				var startEnd2 = startEnd.dot( startEnd );
				var startEnd_startP = startEnd.dot( startP );

				var t = startEnd_startP / startEnd2;

				if ( clampToLine ) {

					t = _Math.clamp( t, 0, 1 );

				}

				return t;

			};

		}(),

		closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

			var t = this.closestPointToPointParameter( point, clampToLine );

			var result = optionalTarget || new Vector3();

			return this.delta( result ).multiplyScalar( t ).add( this.start );

		},

		applyMatrix4: function ( matrix ) {

			this.start.applyMatrix4( matrix );
			this.end.applyMatrix4( matrix );

			return this;

		},

		equals: function ( line ) {

			return line.start.equals( this.start ) && line.end.equals( this.end );

		}

	} );

	function Plane( normal, constant ) {

		// normal is assumed to be normalized

		this.normal = ( normal !== undefined ) ? normal : new Vector3( 1, 0, 0 );
		this.constant = ( constant !== undefined ) ? constant : 0;

	}

	Object.assign( Plane.prototype, {

		set: function ( normal, constant ) {

			this.normal.copy( normal );
			this.constant = constant;

			return this;

		},

		setComponents: function ( x, y, z, w ) {

			this.normal.set( x, y, z );
			this.constant = w;

			return this;

		},

		setFromNormalAndCoplanarPoint: function ( normal, point ) {

			this.normal.copy( normal );
			this.constant = - point.dot( this.normal );

			return this;

		},

		setFromCoplanarPoints: function () {

			var v1 = new Vector3();
			var v2 = new Vector3();

			return function setFromCoplanarPoints( a, b, c ) {

				var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

				// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

				this.setFromNormalAndCoplanarPoint( normal, a );

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( plane ) {

			this.normal.copy( plane.normal );
			this.constant = plane.constant;

			return this;

		},

		normalize: function () {

			// Note: will lead to a divide by zero if the plane is invalid.

			var inverseNormalLength = 1.0 / this.normal.length();
			this.normal.multiplyScalar( inverseNormalLength );
			this.constant *= inverseNormalLength;

			return this;

		},

		negate: function () {

			this.constant *= - 1;
			this.normal.negate();

			return this;

		},

		distanceToPoint: function ( point ) {

			return this.normal.dot( point ) + this.constant;

		},

		distanceToSphere: function ( sphere ) {

			return this.distanceToPoint( sphere.center ) - sphere.radius;

		},

		projectPoint: function ( point, optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return result.copy( this.normal ).multiplyScalar( - this.distanceToPoint( point ) ).add( point );

		},

		intersectLine: function () {

			var v1 = new Vector3();

			return function intersectLine( line, optionalTarget ) {

				var result = optionalTarget || new Vector3();

				var direction = line.delta( v1 );

				var denominator = this.normal.dot( direction );

				if ( denominator === 0 ) {

					// line is coplanar, return origin
					if ( this.distanceToPoint( line.start ) === 0 ) {

						return result.copy( line.start );

					}

					// Unsure if this is the correct method to handle this case.
					return undefined;

				}

				var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

				if ( t < 0 || t > 1 ) {

					return undefined;

				}

				return result.copy( direction ).multiplyScalar( t ).add( line.start );

			};

		}(),

		intersectsLine: function ( line ) {

			// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

			var startSign = this.distanceToPoint( line.start );
			var endSign = this.distanceToPoint( line.end );

			return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

		},

		intersectsBox: function ( box ) {

			return box.intersectsPlane( this );

		},

		intersectsSphere: function ( sphere ) {

			return sphere.intersectsPlane( this );

		},

		coplanarPoint: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return result.copy( this.normal ).multiplyScalar( - this.constant );

		},

		applyMatrix4: function () {

			var v1 = new Vector3();
			var m1 = new Matrix3();

			return function applyMatrix4( matrix, optionalNormalMatrix ) {

				var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );

				var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

				var normal = this.normal.applyMatrix3( normalMatrix ).normalize();

				this.constant = - referencePoint.dot( normal );

				return this;

			};

		}(),

		translate: function ( offset ) {

			this.constant -= offset.dot( this.normal );

			return this;

		},

		equals: function ( plane ) {

			return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

		}

	} );

	function Triangle( a, b, c ) {

		this.a = ( a !== undefined ) ? a : new Vector3();
		this.b = ( b !== undefined ) ? b : new Vector3();
		this.c = ( c !== undefined ) ? c : new Vector3();

	}

	Object.assign( Triangle, {

		normal: function () {

			var v0 = new Vector3();

			return function normal( a, b, c, optionalTarget ) {

				var result = optionalTarget || new Vector3();

				result.subVectors( c, b );
				v0.subVectors( a, b );
				result.cross( v0 );

				var resultLengthSq = result.lengthSq();
				if ( resultLengthSq > 0 ) {

					return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

				}

				return result.set( 0, 0, 0 );

			};

		}(),

		// static/instance method to calculate barycentric coordinates
		// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
		barycoordFromPoint: function () {

			var v0 = new Vector3();
			var v1 = new Vector3();
			var v2 = new Vector3();

			return function barycoordFromPoint( point, a, b, c, optionalTarget ) {

				v0.subVectors( c, a );
				v1.subVectors( b, a );
				v2.subVectors( point, a );

				var dot00 = v0.dot( v0 );
				var dot01 = v0.dot( v1 );
				var dot02 = v0.dot( v2 );
				var dot11 = v1.dot( v1 );
				var dot12 = v1.dot( v2 );

				var denom = ( dot00 * dot11 - dot01 * dot01 );

				var result = optionalTarget || new Vector3();

				// collinear or singular triangle
				if ( denom === 0 ) {

					// arbitrary location outside of triangle?
					// not sure if this is the best idea, maybe should be returning undefined
					return result.set( - 2, - 1, - 1 );

				}

				var invDenom = 1 / denom;
				var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
				var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

				// barycentric coordinates must always sum to 1
				return result.set( 1 - u - v, v, u );

			};

		}(),

		containsPoint: function () {

			var v1 = new Vector3();

			return function containsPoint( point, a, b, c ) {

				var result = Triangle.barycoordFromPoint( point, a, b, c, v1 );

				return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

			};

		}()

	} );

	Object.assign( Triangle.prototype, {

		set: function ( a, b, c ) {

			this.a.copy( a );
			this.b.copy( b );
			this.c.copy( c );

			return this;

		},

		setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

			this.a.copy( points[ i0 ] );
			this.b.copy( points[ i1 ] );
			this.c.copy( points[ i2 ] );

			return this;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( triangle ) {

			this.a.copy( triangle.a );
			this.b.copy( triangle.b );
			this.c.copy( triangle.c );

			return this;

		},

		area: function () {

			var v0 = new Vector3();
			var v1 = new Vector3();

			return function area() {

				v0.subVectors( this.c, this.b );
				v1.subVectors( this.a, this.b );

				return v0.cross( v1 ).length() * 0.5;

			};

		}(),

		midpoint: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

		},

		normal: function ( optionalTarget ) {

			return Triangle.normal( this.a, this.b, this.c, optionalTarget );

		},

		plane: function ( optionalTarget ) {

			var result = optionalTarget || new Plane();

			return result.setFromCoplanarPoints( this.a, this.b, this.c );

		},

		barycoordFromPoint: function ( point, optionalTarget ) {

			return Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

		},

		containsPoint: function ( point ) {

			return Triangle.containsPoint( point, this.a, this.b, this.c );

		},

		intersectsBox: function ( box ) {

			return box.intersectsTriangle( this );

		},

		closestPointToPoint: function () {

			var plane = new Plane();
			var edgeList = [ new Line3(), new Line3(), new Line3() ];
			var projectedPoint = new Vector3();
			var closestPoint = new Vector3();

			return function closestPointToPoint( point, optionalTarget ) {

				var result = optionalTarget || new Vector3();
				var minDistance = Infinity;

				// project the point onto the plane of the triangle

				plane.setFromCoplanarPoints( this.a, this.b, this.c );
				plane.projectPoint( point, projectedPoint );

				// check if the projection lies within the triangle

				if ( this.containsPoint( projectedPoint ) === true ) {

					// if so, this is the closest point

					result.copy( projectedPoint );

				} else {

					// if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

					edgeList[ 0 ].set( this.a, this.b );
					edgeList[ 1 ].set( this.b, this.c );
					edgeList[ 2 ].set( this.c, this.a );

					for ( var i = 0; i < edgeList.length; i ++ ) {

						edgeList[ i ].closestPointToPoint( projectedPoint, true, closestPoint );

						var distance = projectedPoint.distanceToSquared( closestPoint );

						if ( distance < minDistance ) {

							minDistance = distance;

							result.copy( closestPoint );

						}

					}

				}

				return result;

			};

		}(),

		equals: function ( triangle ) {

			return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

		}

	} );

	function Face3( a, b, c, normal, color, materialIndex ) {

		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = ( normal && normal.isVector3 ) ? normal : new Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color && color.isColor ) ? color : new Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

	}

	Object.assign( Face3.prototype, {

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( source ) {

			this.a = source.a;
			this.b = source.b;
			this.c = source.c;

			this.normal.copy( source.normal );
			this.color.copy( source.color );

			this.materialIndex = source.materialIndex;

			for ( var i = 0, il = source.vertexNormals.length; i < il; i ++ ) {

				this.vertexNormals[ i ] = source.vertexNormals[ i ].clone();

			}

			for ( var i = 0, il = source.vertexColors.length; i < il; i ++ ) {

				this.vertexColors[ i ] = source.vertexColors[ i ].clone();

			}

			return this;

		}

	} );

	function MeshBasicMaterial( parameters ) {

		Material.call( this );

		this.type = 'MeshBasicMaterial';

		this.color = new Color( 0xffffff ); // emissive

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = 'round';
		this.wireframeLinejoin = 'round';

		this.skinning = false;
		this.morphTargets = false;

		this.lights = false;

		this.setValues( parameters );

	}

	MeshBasicMaterial.prototype = Object.create( Material.prototype );
	MeshBasicMaterial.prototype.constructor = MeshBasicMaterial;

	MeshBasicMaterial.prototype.isMeshBasicMaterial = true;

	MeshBasicMaterial.prototype.copy = function ( source ) {

		Material.prototype.copy.call( this, source );

		this.color.copy( source.color );

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.specularMap = source.specularMap;

		this.alphaMap = source.alphaMap;

		this.envMap = source.envMap;
		this.combine = source.combine;
		this.reflectivity = source.reflectivity;
		this.refractionRatio = source.refractionRatio;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;
		this.wireframeLinecap = source.wireframeLinecap;
		this.wireframeLinejoin = source.wireframeLinejoin;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;

		return this;

	};

	function Mesh( geometry, material ) {

		Object3D.call( this );

		this.type = 'Mesh';

		this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
		this.material = material !== undefined ? material : new MeshBasicMaterial( { color: Math.random() * 0xffffff } );

		this.drawMode = TrianglesDrawMode;

		this.updateMorphTargets();

	}

	Mesh.prototype = Object.assign( Object.create( Object3D.prototype ), {

		constructor: Mesh,

		isMesh: true,

		setDrawMode: function ( value ) {

			this.drawMode = value;

		},

		copy: function ( source ) {

			Object3D.prototype.copy.call( this, source );

			this.drawMode = source.drawMode;

			if ( source.morphTargetInfluences !== undefined ) {

				this.morphTargetInfluences = source.morphTargetInfluences.slice();

			}

			if ( source.morphTargetDictionary !== undefined ) {

				this.morphTargetDictionary = Object.assign( {}, source.morphTargetDictionary );

			}

			return this;

		},

		updateMorphTargets: function () {

			var geometry = this.geometry;
			var m, ml, name;

			if ( geometry.isBufferGeometry ) {

				var morphAttributes = geometry.morphAttributes;
				var keys = Object.keys( morphAttributes );

				if ( keys.length > 0 ) {

					var morphAttribute = morphAttributes[ keys[ 0 ] ];

					if ( morphAttribute !== undefined ) {

						this.morphTargetInfluences = [];
						this.morphTargetDictionary = {};

						for ( m = 0, ml = morphAttribute.length; m < ml; m ++ ) {

							name = morphAttribute[ m ].name || String( m );

							this.morphTargetInfluences.push( 0 );
							this.morphTargetDictionary[ name ] = m;

						}

					}

				}

			} else {

				var morphTargets = geometry.morphTargets;

				if ( morphTargets !== undefined && morphTargets.length > 0 ) {

					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for ( m = 0, ml = morphTargets.length; m < ml; m ++ ) {

						name = morphTargets[ m ].name || String( m );

						this.morphTargetInfluences.push( 0 );
						this.morphTargetDictionary[ name ] = m;

					}

				}

			}

		},

		raycast: ( function () {

			var inverseMatrix = new Matrix4();
			var ray = new Ray();
			var sphere = new Sphere();

			var vA = new Vector3();
			var vB = new Vector3();
			var vC = new Vector3();

			var tempA = new Vector3();
			var tempB = new Vector3();
			var tempC = new Vector3();

			var uvA = new Vector2();
			var uvB = new Vector2();
			var uvC = new Vector2();

			var barycoord = new Vector3();

			var intersectionPoint = new Vector3();
			var intersectionPointWorld = new Vector3();

			function uvIntersection( point, p1, p2, p3, uv1, uv2, uv3 ) {

				Triangle.barycoordFromPoint( point, p1, p2, p3, barycoord );

				uv1.multiplyScalar( barycoord.x );
				uv2.multiplyScalar( barycoord.y );
				uv3.multiplyScalar( barycoord.z );

				uv1.add( uv2 ).add( uv3 );

				return uv1.clone();

			}

			function checkIntersection( object, material, raycaster, ray, pA, pB, pC, point ) {

				var intersect;

				if ( material.side === BackSide ) {

					intersect = ray.intersectTriangle( pC, pB, pA, true, point );

				} else {

					intersect = ray.intersectTriangle( pA, pB, pC, material.side !== DoubleSide, point );

				}

				if ( intersect === null ) return null;

				intersectionPointWorld.copy( point );
				intersectionPointWorld.applyMatrix4( object.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

				if ( distance < raycaster.near || distance > raycaster.far ) return null;

				return {
					distance: distance,
					point: intersectionPointWorld.clone(),
					object: object
				};

			}

			function checkBufferGeometryIntersection( object, raycaster, ray, position, uv, a, b, c ) {

				vA.fromBufferAttribute( position, a );
				vB.fromBufferAttribute( position, b );
				vC.fromBufferAttribute( position, c );

				var intersection = checkIntersection( object, object.material, raycaster, ray, vA, vB, vC, intersectionPoint );

				if ( intersection ) {

					if ( uv ) {

						uvA.fromBufferAttribute( uv, a );
						uvB.fromBufferAttribute( uv, b );
						uvC.fromBufferAttribute( uv, c );

						intersection.uv = uvIntersection( intersectionPoint, vA, vB, vC, uvA, uvB, uvC );

					}

					intersection.face = new Face3( a, b, c, Triangle.normal( vA, vB, vC ) );
					intersection.faceIndex = a;

				}

				return intersection;

			}

			return function raycast( raycaster, intersects ) {

				var geometry = this.geometry;
				var material = this.material;
				var matrixWorld = this.matrixWorld;

				if ( material === undefined ) return;

				// Checking boundingSphere distance to ray

				if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

				sphere.copy( geometry.boundingSphere );
				sphere.applyMatrix4( matrixWorld );

				if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

				//

				inverseMatrix.getInverse( matrixWorld );
				ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

				// Check boundingBox before continuing

				if ( geometry.boundingBox !== null ) {

					if ( ray.intersectsBox( geometry.boundingBox ) === false ) return;

				}

				var intersection;

				if ( geometry.isBufferGeometry ) {

					var a, b, c;
					var index = geometry.index;
					var position = geometry.attributes.position;
					var uv = geometry.attributes.uv;
					var i, l;

					if ( index !== null ) {

						// indexed buffer geometry

						for ( i = 0, l = index.count; i < l; i += 3 ) {

							a = index.getX( i );
							b = index.getX( i + 1 );
							c = index.getX( i + 2 );

							intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

							if ( intersection ) {

								intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indices buffer semantics
								intersects.push( intersection );

							}

						}

					} else if ( position !== undefined ) {

						// non-indexed buffer geometry

						for ( i = 0, l = position.count; i < l; i += 3 ) {

							a = i;
							b = i + 1;
							c = i + 2;

							intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

							if ( intersection ) {

								intersection.index = a; // triangle number in positions buffer semantics
								intersects.push( intersection );

							}

						}

					}

				} else if ( geometry.isGeometry ) {

					var fvA, fvB, fvC;
					var isMultiMaterial = Array.isArray( material );

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var uvs;

					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
					if ( faceVertexUvs.length > 0 ) uvs = faceVertexUvs;

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];
						var faceMaterial = isMultiMaterial ? material[ face.materialIndex ] : material;

						if ( faceMaterial === undefined ) continue;

						fvA = vertices[ face.a ];
						fvB = vertices[ face.b ];
						fvC = vertices[ face.c ];

						if ( faceMaterial.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = this.morphTargetInfluences;

							vA.set( 0, 0, 0 );
							vB.set( 0, 0, 0 );
							vC.set( 0, 0, 0 );

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var targets = morphTargets[ t ].vertices;

								vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
								vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
								vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

							}

							vA.add( fvA );
							vB.add( fvB );
							vC.add( fvC );

							fvA = vA;
							fvB = vB;
							fvC = vC;

						}

						intersection = checkIntersection( this, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint );

						if ( intersection ) {

							if ( uvs && uvs[ f ] ) {

								var uvs_f = uvs[ f ];
								uvA.copy( uvs_f[ 0 ] );
								uvB.copy( uvs_f[ 1 ] );
								uvC.copy( uvs_f[ 2 ] );

								intersection.uv = uvIntersection( intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC );

							}

							intersection.face = face;
							intersection.faceIndex = f;
							intersects.push( intersection );

						}

					}

				}

			};

		}() ),

		clone: function () {

			return new this.constructor( this.geometry, this.material ).copy( this );

		}

	} );

	function Skeleton( bones, boneInverses ) {

		// copy the bone array

		bones = bones || [];

		this.bones = bones.slice( 0 );
		this.boneMatrices = new Float32Array( this.bones.length * 16 );

		// use the supplied bone inverses or calculate the inverses

		if ( boneInverses === undefined ) {

			this.calculateInverses();

		} else {

			if ( this.bones.length === boneInverses.length ) {

				this.boneInverses = boneInverses.slice( 0 );

			} else {

				console.warn( 'Skeleton boneInverses is the wrong length.' );

				this.boneInverses = [];

				for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

					this.boneInverses.push( new Matrix4() );

				}

			}

		}

	}

	Object.assign( Skeleton.prototype, {

		calculateInverses: function () {

			this.boneInverses = [];

			for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

				var inverse = new Matrix4();

				if ( this.bones[ i ] ) {

					inverse.getInverse( this.bones[ i ].matrixWorld );

				}

				this.boneInverses.push( inverse );

			}

		},

		pose: function () {

			var bone, i, il;

			// recover the bind-time world matrices

			for ( i = 0, il = this.bones.length; i < il; i ++ ) {

				bone = this.bones[ i ];

				if ( bone ) {

					bone.matrixWorld.getInverse( this.boneInverses[ i ] );

				}

			}

			// compute the local matrices, positions, rotations and scales

			for ( i = 0, il = this.bones.length; i < il; i ++ ) {

				bone = this.bones[ i ];

				if ( bone ) {

					if ( bone.parent && bone.parent.isBone ) {

						bone.matrix.getInverse( bone.parent.matrixWorld );
						bone.matrix.multiply( bone.matrixWorld );

					} else {

						bone.matrix.copy( bone.matrixWorld );

					}

					bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

				}

			}

		},

		update: ( function () {

			var offsetMatrix = new Matrix4();
			var identityMatrix = new Matrix4();

			return function update() {

				var bones = this.bones;
				var boneInverses = this.boneInverses;
				var boneMatrices = this.boneMatrices;
				var boneTexture = this.boneTexture;

				// flatten bone matrices to array

				for ( var i = 0, il = bones.length; i < il; i ++ ) {

					// compute the offset between the current and the original transform

					var matrix = bones[ i ] ? bones[ i ].matrixWorld : identityMatrix;

					offsetMatrix.multiplyMatrices( matrix, boneInverses[ i ] );
					offsetMatrix.toArray( boneMatrices, i * 16 );

				}

				if ( boneTexture !== undefined ) {

					boneTexture.needsUpdate = true;

				}

			};

		} )(),

		clone: function () {

			return new Skeleton( this.bones, this.boneInverses );

		},

		getBoneByName: function ( name ) {

			for ( var i = 0, il = this.bones.length; i < il; i ++ ) {

				var bone = this.bones[ i ];

				if ( bone.name === name ) {

					return bone;

				}

			}

			return undefined;

		}

	} );

	function Bone() {

		Object3D.call( this );

		this.type = 'Bone';

	}

	Bone.prototype = Object.assign( Object.create( Object3D.prototype ), {

		constructor: Bone,

		isBone: true

	} );

	function SkinnedMesh( geometry, material ) {

		Mesh.call( this, geometry, material );

		this.type = 'SkinnedMesh';

		this.bindMode = 'attached';
		this.bindMatrix = new Matrix4();
		this.bindMatrixInverse = new Matrix4();

		var bones = this.initBones();
		var skeleton = new Skeleton( bones );

		this.bind( skeleton, this.matrixWorld );

		this.normalizeSkinWeights();

	}

	SkinnedMesh.prototype = Object.assign( Object.create( Mesh.prototype ), {

		constructor: SkinnedMesh,

		isSkinnedMesh: true,

		initBones: function () {

			var bones = [], bone, gbone;
			var i, il;

			if ( this.geometry && this.geometry.bones !== undefined ) {

				// first, create array of 'Bone' objects from geometry data

				for ( i = 0, il = this.geometry.bones.length; i < il; i ++ ) {

					gbone = this.geometry.bones[ i ];

					// create new 'Bone' object

					bone = new Bone();
					bones.push( bone );

					// apply values

					bone.name = gbone.name;
					bone.position.fromArray( gbone.pos );
					bone.quaternion.fromArray( gbone.rotq );
					if ( gbone.scl !== undefined ) bone.scale.fromArray( gbone.scl );

				}

				// second, create bone hierarchy

				for ( i = 0, il = this.geometry.bones.length; i < il; i ++ ) {

					gbone = this.geometry.bones[ i ];

					if ( ( gbone.parent !== - 1 ) && ( gbone.parent !== null ) && ( bones[ gbone.parent ] !== undefined ) ) {

						// subsequent bones in the hierarchy

						bones[ gbone.parent ].add( bones[ i ] );

					} else {

						// topmost bone, immediate child of the skinned mesh

						this.add( bones[ i ] );

					}

				}

			}

			// now the bones are part of the scene graph and children of the skinned mesh.
			// let's update the corresponding matrices

			this.updateMatrixWorld( true );

			return bones;

		},

		bind: function ( skeleton, bindMatrix ) {

			this.skeleton = skeleton;

			if ( bindMatrix === undefined ) {

				this.updateMatrixWorld( true );

				this.skeleton.calculateInverses();

				bindMatrix = this.matrixWorld;

			}

			this.bindMatrix.copy( bindMatrix );
			this.bindMatrixInverse.getInverse( bindMatrix );

		},

		pose: function () {

			this.skeleton.pose();

		},

		normalizeSkinWeights: function () {

			var scale, i;

			if ( this.geometry && this.geometry.isGeometry ) {

				for ( i = 0; i < this.geometry.skinWeights.length; i ++ ) {

					var sw = this.geometry.skinWeights[ i ];

					scale = 1.0 / sw.manhattanLength();

					if ( scale !== Infinity ) {

						sw.multiplyScalar( scale );

					} else {

						sw.set( 1, 0, 0, 0 ); // do something reasonable

					}

				}

			} else if ( this.geometry && this.geometry.isBufferGeometry ) {

				var vec = new Vector4();

				var skinWeight = this.geometry.attributes.skinWeight;

				for ( i = 0; i < skinWeight.count; i ++ ) {

					vec.x = skinWeight.getX( i );
					vec.y = skinWeight.getY( i );
					vec.z = skinWeight.getZ( i );
					vec.w = skinWeight.getW( i );

					scale = 1.0 / vec.manhattanLength();

					if ( scale !== Infinity ) {

						vec.multiplyScalar( scale );

					} else {

						vec.set( 1, 0, 0, 0 ); // do something reasonable

					}

					skinWeight.setXYZW( i, vec.x, vec.y, vec.z, vec.w );

				}

			}

		},

		updateMatrixWorld: function ( force ) {

			Mesh.prototype.updateMatrixWorld.call( this, force );

			if ( this.bindMode === 'attached' ) {

				this.bindMatrixInverse.getInverse( this.matrixWorld );

			} else if ( this.bindMode === 'detached' ) {

				this.bindMatrixInverse.getInverse( this.bindMatrix );

			} else {

				console.warn( 'SkinnedMesh: Unrecognized bindMode: ' + this.bindMode );

			}

		},

		clone: function () {

			return new this.constructor( this.geometry, this.material ).copy( this );

		}

	} );

	var geometryId = 0; // Geometry uses even numbers as Id

	function Geometry() {

		Object.defineProperty( this, 'id', { value: geometryId += 2 } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'Geometry';

		this.vertices = [];
		this.colors = [];
		this.faces = [];
		this.faceVertexUvs = [[]];

		this.morphTargets = [];
		this.morphNormals = [];

		this.skinWeights = [];
		this.skinIndices = [];

		this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.elementsNeedUpdate = false;
		this.verticesNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.lineDistancesNeedUpdate = false;
		this.groupsNeedUpdate = false;

	}

	Geometry.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: Geometry,

		isGeometry: true,

		applyMatrix: function ( matrix ) {

			var normalMatrix = new Matrix3().getNormalMatrix( matrix );

			for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

				var vertex = this.vertices[ i ];
				vertex.applyMatrix4( matrix );

			}

			for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

				var face = this.faces[ i ];
				face.normal.applyMatrix3( normalMatrix ).normalize();

				for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

					face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

				}

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			this.verticesNeedUpdate = true;
			this.normalsNeedUpdate = true;

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1 = new Matrix4();

			return function rotateX( angle ) {

				m1.makeRotationX( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1 = new Matrix4();

			return function rotateY( angle ) {

				m1.makeRotationY( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1 = new Matrix4();

			return function rotateZ( angle ) {

				m1.makeRotationZ( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1 = new Matrix4();

			return function translate( x, y, z ) {

				m1.makeTranslation( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1 = new Matrix4();

			return function scale( x, y, z ) {

				m1.makeScale( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		lookAt: function () {

			var obj = new Object3D();

			return function lookAt( vector ) {

				obj.lookAt( vector );

				obj.updateMatrix();

				this.applyMatrix( obj.matrix );

			};

		}(),

		fromBufferGeometry: function ( geometry ) {

			var scope = this;

			var indices = geometry.index !== null ? geometry.index.array : undefined;
			var attributes = geometry.attributes;

			var positions = attributes.position.array;
			var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
			var colors = attributes.color !== undefined ? attributes.color.array : undefined;
			var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
			var uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

			if ( uvs2 !== undefined ) this.faceVertexUvs[ 1 ] = [];

			var tempNormals = [];
			var tempUVs = [];
			var tempUVs2 = [];

			for ( var i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {

				scope.vertices.push( new Vector3( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] ) );

				if ( normals !== undefined ) {

					tempNormals.push( new Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

				}

				if ( colors !== undefined ) {

					scope.colors.push( new Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

				}

				if ( uvs !== undefined ) {

					tempUVs.push( new Vector2( uvs[ j ], uvs[ j + 1 ] ) );

				}

				if ( uvs2 !== undefined ) {

					tempUVs2.push( new Vector2( uvs2[ j ], uvs2[ j + 1 ] ) );

				}

			}

			function addFace( a, b, c, materialIndex ) {

				var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
				var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

				var face = new Face3( a, b, c, vertexNormals, vertexColors, materialIndex );

				scope.faces.push( face );

				if ( uvs !== undefined ) {

					scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );

				}

				if ( uvs2 !== undefined ) {

					scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );

				}

			}

			var groups = geometry.groups;

			if ( groups.length > 0 ) {

				for ( var i = 0; i < groups.length; i ++ ) {

					var group = groups[ i ];

					var start = group.start;
					var count = group.count;

					for ( var j = start, jl = start + count; j < jl; j += 3 ) {

						if ( indices !== undefined ) {

							addFace( indices[ j ], indices[ j + 1 ], indices[ j + 2 ], group.materialIndex );

						} else {

							addFace( j, j + 1, j + 2, group.materialIndex );

						}

					}

				}

			} else {

				if ( indices !== undefined ) {

					for ( var i = 0; i < indices.length; i += 3 ) {

						addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

					}

				} else {

					for ( var i = 0; i < positions.length / 3; i += 3 ) {

						addFace( i, i + 1, i + 2 );

					}

				}

			}

			this.computeFaceNormals();

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			return this;

		},

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.getCenter().negate();

			this.translate( offset.x, offset.y, offset.z );

			return offset;

		},

		normalize: function () {

			this.computeBoundingSphere();

			var center = this.boundingSphere.center;
			var radius = this.boundingSphere.radius;

			var s = radius === 0 ? 1 : 1.0 / radius;

			var matrix = new Matrix4();
			matrix.set(
				s, 0, 0, - s * center.x,
				0, s, 0, - s * center.y,
				0, 0, s, - s * center.z,
				0, 0, 0, 1
			);

			this.applyMatrix( matrix );

			return this;

		},

		computeFaceNormals: function () {

			var cb = new Vector3(), ab = new Vector3();

			for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

				var face = this.faces[ f ];

				var vA = this.vertices[ face.a ];
				var vB = this.vertices[ face.b ];
				var vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				cb.normalize();

				face.normal.copy( cb );

			}

		},

		computeVertexNormals: function ( areaWeighted ) {

			if ( areaWeighted === undefined ) areaWeighted = true;

			var v, vl, f, fl, face, vertices;

			vertices = new Array( this.vertices.length );

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ] = new Vector3();

			}

			if ( areaWeighted ) {

				// vertex normals weighted by triangle areas
				// http://www.iquilezles.org/www/articles/normals/normals.htm

				var vA, vB, vC;
				var cb = new Vector3(), ab = new Vector3();

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					vA = this.vertices[ face.a ];
					vB = this.vertices[ face.b ];
					vC = this.vertices[ face.c ];

					cb.subVectors( vC, vB );
					ab.subVectors( vA, vB );
					cb.cross( ab );

					vertices[ face.a ].add( cb );
					vertices[ face.b ].add( cb );
					vertices[ face.c ].add( cb );

				}

			} else {

				this.computeFaceNormals();

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					vertices[ face.a ].add( face.normal );
					vertices[ face.b ].add( face.normal );
					vertices[ face.c ].add( face.normal );

				}

			}

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ].normalize();

			}

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					vertexNormals[ 0 ].copy( vertices[ face.a ] );
					vertexNormals[ 1 ].copy( vertices[ face.b ] );
					vertexNormals[ 2 ].copy( vertices[ face.c ] );

				} else {

					vertexNormals[ 0 ] = vertices[ face.a ].clone();
					vertexNormals[ 1 ] = vertices[ face.b ].clone();
					vertexNormals[ 2 ] = vertices[ face.c ].clone();

				}

			}

			if ( this.faces.length > 0 ) {

				this.normalsNeedUpdate = true;

			}

		},

		computeFlatVertexNormals: function () {

			var f, fl, face;

			this.computeFaceNormals();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					vertexNormals[ 0 ].copy( face.normal );
					vertexNormals[ 1 ].copy( face.normal );
					vertexNormals[ 2 ].copy( face.normal );

				} else {

					vertexNormals[ 0 ] = face.normal.clone();
					vertexNormals[ 1 ] = face.normal.clone();
					vertexNormals[ 2 ] = face.normal.clone();

				}

			}

			if ( this.faces.length > 0 ) {

				this.normalsNeedUpdate = true;

			}

		},

		computeMorphNormals: function () {

			var i, il, f, fl, face;

			// save original normals
			// - create temp variables on first access
			//   otherwise just copy (for faster repeated calls)

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				if ( ! face.__originalFaceNormal ) {

					face.__originalFaceNormal = face.normal.clone();

				} else {

					face.__originalFaceNormal.copy( face.normal );

				}

				if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

				for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

					if ( ! face.__originalVertexNormals[ i ] ) {

						face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

					} else {

						face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

					}

				}

			}

			// use temp geometry to compute face and vertex normals for each morph

			var tmpGeo = new Geometry();
			tmpGeo.faces = this.faces;

			for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

				// create on first access

				if ( ! this.morphNormals[ i ] ) {

					this.morphNormals[ i ] = {};
					this.morphNormals[ i ].faceNormals = [];
					this.morphNormals[ i ].vertexNormals = [];

					var dstNormalsFace = this.morphNormals[ i ].faceNormals;
					var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

					var faceNormal, vertexNormals;

					for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

						faceNormal = new Vector3();
						vertexNormals = { a: new Vector3(), b: new Vector3(), c: new Vector3() };

						dstNormalsFace.push( faceNormal );
						dstNormalsVertex.push( vertexNormals );

					}

				}

				var morphNormals = this.morphNormals[ i ];

				// set vertices to morph target

				tmpGeo.vertices = this.morphTargets[ i ].vertices;

				// compute morph normals

				tmpGeo.computeFaceNormals();
				tmpGeo.computeVertexNormals();

				// store morph normals

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					faceNormal = morphNormals.faceNormals[ f ];
					vertexNormals = morphNormals.vertexNormals[ f ];

					faceNormal.copy( face.normal );

					vertexNormals.a.copy( face.vertexNormals[ 0 ] );
					vertexNormals.b.copy( face.vertexNormals[ 1 ] );
					vertexNormals.c.copy( face.vertexNormals[ 2 ] );

				}

			}

			// restore original normals

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				face.normal = face.__originalFaceNormal;
				face.vertexNormals = face.__originalVertexNormals;

			}

		},

		computeBoundingBox: function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			this.boundingBox.setFromPoints( this.vertices );

		},

		computeBoundingSphere: function () {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new Sphere();

			}

			this.boundingSphere.setFromPoints( this.vertices );

		},

		merge: function ( geometry, matrix, materialIndexOffset ) {

			if ( ! ( geometry && geometry.isGeometry ) ) {

				console.error( 'Geometry.merge(): geometry not an instance of Geometry.', geometry );
				return;

			}

			var normalMatrix,
				vertexOffset = this.vertices.length,
				vertices1 = this.vertices,
				vertices2 = geometry.vertices,
				faces1 = this.faces,
				faces2 = geometry.faces,
				uvs1 = this.faceVertexUvs[ 0 ],
				uvs2 = geometry.faceVertexUvs[ 0 ],
				colors1 = this.colors,
				colors2 = geometry.colors;

			if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

			if ( matrix !== undefined ) {

				normalMatrix = new Matrix3().getNormalMatrix( matrix );

			}

			// vertices

			for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

				var vertex = vertices2[ i ];

				var vertexCopy = vertex.clone();

				if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

				vertices1.push( vertexCopy );

			}

			// colors

			for ( var i = 0, il = colors2.length; i < il; i ++ ) {

				colors1.push( colors2[ i ].clone() );

			}

			// faces

			for ( i = 0, il = faces2.length; i < il; i ++ ) {

				var face = faces2[ i ], faceCopy, normal, color,
					faceVertexNormals = face.vertexNormals,
					faceVertexColors = face.vertexColors;

				faceCopy = new Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
				faceCopy.normal.copy( face.normal );

				if ( normalMatrix !== undefined ) {

					faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

				}

				for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

					normal = faceVertexNormals[ j ].clone();

					if ( normalMatrix !== undefined ) {

						normal.applyMatrix3( normalMatrix ).normalize();

					}

					faceCopy.vertexNormals.push( normal );

				}

				faceCopy.color.copy( face.color );

				for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

					color = faceVertexColors[ j ];
					faceCopy.vertexColors.push( color.clone() );

				}

				faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

				faces1.push( faceCopy );

			}

			// uvs

			for ( i = 0, il = uvs2.length; i < il; i ++ ) {

				var uv = uvs2[ i ], uvCopy = [];

				if ( uv === undefined ) {

					continue;

				}

				for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

					uvCopy.push( uv[ j ].clone() );

				}

				uvs1.push( uvCopy );

			}

		},

		mergeMesh: function ( mesh ) {

			if ( ! ( mesh && mesh.isMesh ) ) {

				console.error( 'Geometry.mergeMesh(): mesh not an instance of Mesh.', mesh );
				return;

			}

			mesh.matrixAutoUpdate && mesh.updateMatrix();

			this.merge( mesh.geometry, mesh.matrix );

		},

		

		mergeVertices: function () {

			var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
			var unique = [], changes = [];

			var v, key;
			var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
			var precision = Math.pow( 10, precisionPoints );
			var i, il, face;
			var indices, j, jl;

			for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

				v = this.vertices[ i ];
				key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

				if ( verticesMap[ key ] === undefined ) {

					verticesMap[ key ] = i;
					unique.push( this.vertices[ i ] );
					changes[ i ] = unique.length - 1;

				} else {

					//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
					changes[ i ] = changes[ verticesMap[ key ] ];

				}

			}


			// if faces are completely degenerate after merging vertices, we
			// have to remove them from the geometry.
			var faceIndicesToRemove = [];

			for ( i = 0, il = this.faces.length; i < il; i ++ ) {

				face = this.faces[ i ];

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];

				indices = [ face.a, face.b, face.c ];

				// if any duplicate vertices are found in a Face3
				// we have to remove the face as nothing can be saved
				for ( var n = 0; n < 3; n ++ ) {

					if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

						faceIndicesToRemove.push( i );
						break;

					}

				}

			}

			for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

				var idx = faceIndicesToRemove[ i ];

				this.faces.splice( idx, 1 );

				for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

					this.faceVertexUvs[ j ].splice( idx, 1 );

				}

			}

			// Use unique set of vertices

			var diff = this.vertices.length - unique.length;
			this.vertices = unique;
			return diff;

		},

		setFromPoints: function ( points ) {

			this.vertices = [];

			for ( var i = 0, l = points.length; i < l; i ++ ) {

				var point = points[ i ];
				this.vertices.push( new Vector3( point.x, point.y, point.z || 0 ) );

			}

			return this;

		},

		sortFacesByMaterialIndex: function () {

			var faces = this.faces;
			var length = faces.length;

			// tag faces

			for ( var i = 0; i < length; i ++ ) {

				faces[ i ]._id = i;

			}

			// sort faces

			function materialIndexSort( a, b ) {

				return a.materialIndex - b.materialIndex;

			}

			faces.sort( materialIndexSort );

			// sort uvs

			var uvs1 = this.faceVertexUvs[ 0 ];
			var uvs2 = this.faceVertexUvs[ 1 ];

			var newUvs1, newUvs2;

			if ( uvs1 && uvs1.length === length ) newUvs1 = [];
			if ( uvs2 && uvs2.length === length ) newUvs2 = [];

			for ( var i = 0; i < length; i ++ ) {

				var id = faces[ i ]._id;

				if ( newUvs1 ) newUvs1.push( uvs1[ id ] );
				if ( newUvs2 ) newUvs2.push( uvs2[ id ] );

			}

			if ( newUvs1 ) this.faceVertexUvs[ 0 ] = newUvs1;
			if ( newUvs2 ) this.faceVertexUvs[ 1 ] = newUvs2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.5,
					type: 'Geometry',
					generator: 'Geometry.toJSON'
				}
			};

			// standard Geometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;

			if ( this.parameters !== undefined ) {

				var parameters = this.parameters;

				for ( var key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			var vertices = [];

			for ( var i = 0; i < this.vertices.length; i ++ ) {

				var vertex = this.vertices[ i ];
				vertices.push( vertex.x, vertex.y, vertex.z );

			}

			var faces = [];
			var normals = [];
			var normalsHash = {};
			var colors = [];
			var colorsHash = {};
			var uvs = [];
			var uvsHash = {};

			for ( var i = 0; i < this.faces.length; i ++ ) {

				var face = this.faces[ i ];

				var hasMaterial = true;
				var hasFaceUv = false; // deprecated
				var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
				var hasFaceNormal = face.normal.length() > 0;
				var hasFaceVertexNormal = face.vertexNormals.length > 0;
				var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
				var hasFaceVertexColor = face.vertexColors.length > 0;

				var faceType = 0;

				faceType = setBit( faceType, 0, 0 ); // isQuad
				faceType = setBit( faceType, 1, hasMaterial );
				faceType = setBit( faceType, 2, hasFaceUv );
				faceType = setBit( faceType, 3, hasFaceVertexUv );
				faceType = setBit( faceType, 4, hasFaceNormal );
				faceType = setBit( faceType, 5, hasFaceVertexNormal );
				faceType = setBit( faceType, 6, hasFaceColor );
				faceType = setBit( faceType, 7, hasFaceVertexColor );

				faces.push( faceType );
				faces.push( face.a, face.b, face.c );
				faces.push( face.materialIndex );

				if ( hasFaceVertexUv ) {

					var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

					faces.push(
						getUvIndex( faceVertexUvs[ 0 ] ),
						getUvIndex( faceVertexUvs[ 1 ] ),
						getUvIndex( faceVertexUvs[ 2 ] )
					);

				}

				if ( hasFaceNormal ) {

					faces.push( getNormalIndex( face.normal ) );

				}

				if ( hasFaceVertexNormal ) {

					var vertexNormals = face.vertexNormals;

					faces.push(
						getNormalIndex( vertexNormals[ 0 ] ),
						getNormalIndex( vertexNormals[ 1 ] ),
						getNormalIndex( vertexNormals[ 2 ] )
					);

				}

				if ( hasFaceColor ) {

					faces.push( getColorIndex( face.color ) );

				}

				if ( hasFaceVertexColor ) {

					var vertexColors = face.vertexColors;

					faces.push(
						getColorIndex( vertexColors[ 0 ] ),
						getColorIndex( vertexColors[ 1 ] ),
						getColorIndex( vertexColors[ 2 ] )
					);

				}

			}

			function setBit( value, position, enabled ) {

				return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position ) );

			}

			function getNormalIndex( normal ) {

				var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

				if ( normalsHash[ hash ] !== undefined ) {

					return normalsHash[ hash ];

				}

				normalsHash[ hash ] = normals.length / 3;
				normals.push( normal.x, normal.y, normal.z );

				return normalsHash[ hash ];

			}

			function getColorIndex( color ) {

				var hash = color.r.toString() + color.g.toString() + color.b.toString();

				if ( colorsHash[ hash ] !== undefined ) {

					return colorsHash[ hash ];

				}

				colorsHash[ hash ] = colors.length;
				colors.push( color.getHex() );

				return colorsHash[ hash ];

			}

			function getUvIndex( uv ) {

				var hash = uv.x.toString() + uv.y.toString();

				if ( uvsHash[ hash ] !== undefined ) {

					return uvsHash[ hash ];

				}

				uvsHash[ hash ] = uvs.length / 2;
				uvs.push( uv.x, uv.y );

				return uvsHash[ hash ];

			}

			data.data = {};

			data.data.vertices = vertices;
			data.data.normals = normals;
			if ( colors.length > 0 ) data.data.colors = colors;
			if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
			data.data.faces = faces;

			return data;

		},

		clone: function () {

			

			return new Geometry().copy( this );

		},

		copy: function ( source ) {

			var i, il, j, jl, k, kl;

			// reset

			this.vertices = [];
			this.colors = [];
			this.faces = [];
			this.faceVertexUvs = [[]];
			this.morphTargets = [];
			this.morphNormals = [];
			this.skinWeights = [];
			this.skinIndices = [];
			this.lineDistances = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// name

			this.name = source.name;

			// vertices

			var vertices = source.vertices;

			for ( i = 0, il = vertices.length; i < il; i ++ ) {

				this.vertices.push( vertices[ i ].clone() );

			}

			// colors

			var colors = source.colors;

			for ( i = 0, il = colors.length; i < il; i ++ ) {

				this.colors.push( colors[ i ].clone() );

			}

			// faces

			var faces = source.faces;

			for ( i = 0, il = faces.length; i < il; i ++ ) {

				this.faces.push( faces[ i ].clone() );

			}

			// face vertex uvs

			for ( i = 0, il = source.faceVertexUvs.length; i < il; i ++ ) {

				var faceVertexUvs = source.faceVertexUvs[ i ];

				if ( this.faceVertexUvs[ i ] === undefined ) {

					this.faceVertexUvs[ i ] = [];

				}

				for ( j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

					var uvs = faceVertexUvs[ j ], uvsCopy = [];

					for ( k = 0, kl = uvs.length; k < kl; k ++ ) {

						var uv = uvs[ k ];

						uvsCopy.push( uv.clone() );

					}

					this.faceVertexUvs[ i ].push( uvsCopy );

				}

			}

			// morph targets

			var morphTargets = source.morphTargets;

			for ( i = 0, il = morphTargets.length; i < il; i ++ ) {

				var morphTarget = {};
				morphTarget.name = morphTargets[ i ].name;

				// vertices

				if ( morphTargets[ i ].vertices !== undefined ) {

					morphTarget.vertices = [];

					for ( j = 0, jl = morphTargets[ i ].vertices.length; j < jl; j ++ ) {

						morphTarget.vertices.push( morphTargets[ i ].vertices[ j ].clone() );

					}

				}

				// normals

				if ( morphTargets[ i ].normals !== undefined ) {

					morphTarget.normals = [];

					for ( j = 0, jl = morphTargets[ i ].normals.length; j < jl; j ++ ) {

						morphTarget.normals.push( morphTargets[ i ].normals[ j ].clone() );

					}

				}

				this.morphTargets.push( morphTarget );

			}

			// morph normals

			var morphNormals = source.morphNormals;

			for ( i = 0, il = morphNormals.length; i < il; i ++ ) {

				var morphNormal = {};

				// vertex normals

				if ( morphNormals[ i ].vertexNormals !== undefined ) {

					morphNormal.vertexNormals = [];

					for ( j = 0, jl = morphNormals[ i ].vertexNormals.length; j < jl; j ++ ) {

						var srcVertexNormal = morphNormals[ i ].vertexNormals[ j ];
						var destVertexNormal = {};

						destVertexNormal.a = srcVertexNormal.a.clone();
						destVertexNormal.b = srcVertexNormal.b.clone();
						destVertexNormal.c = srcVertexNormal.c.clone();

						morphNormal.vertexNormals.push( destVertexNormal );

					}

				}

				// face normals

				if ( morphNormals[ i ].faceNormals !== undefined ) {

					morphNormal.faceNormals = [];

					for ( j = 0, jl = morphNormals[ i ].faceNormals.length; j < jl; j ++ ) {

						morphNormal.faceNormals.push( morphNormals[ i ].faceNormals[ j ].clone() );

					}

				}

				this.morphNormals.push( morphNormal );

			}

			// skin weights

			var skinWeights = source.skinWeights;

			for ( i = 0, il = skinWeights.length; i < il; i ++ ) {

				this.skinWeights.push( skinWeights[ i ].clone() );

			}

			// skin indices

			var skinIndices = source.skinIndices;

			for ( i = 0, il = skinIndices.length; i < il; i ++ ) {

				this.skinIndices.push( skinIndices[ i ].clone() );

			}

			// line distances

			var lineDistances = source.lineDistances;

			for ( i = 0, il = lineDistances.length; i < il; i ++ ) {

				this.lineDistances.push( lineDistances[ i ] );

			}

			// bounding box

			var boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			var boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// update flags

			this.elementsNeedUpdate = source.elementsNeedUpdate;
			this.verticesNeedUpdate = source.verticesNeedUpdate;
			this.uvsNeedUpdate = source.uvsNeedUpdate;
			this.normalsNeedUpdate = source.normalsNeedUpdate;
			this.colorsNeedUpdate = source.colorsNeedUpdate;
			this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
			this.groupsNeedUpdate = source.groupsNeedUpdate;

			return this;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		}

	} );

	// SphereGeometry

	function SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

		Geometry.call( this );

		this.type = 'SphereGeometry';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		this.fromBufferGeometry( new SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) );
		this.mergeVertices();

	}

	SphereGeometry.prototype = Object.create( Geometry.prototype );
	SphereGeometry.prototype.constructor = SphereGeometry;

	// SphereBufferGeometry

	function SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

		BufferGeometry.call( this );

		this.type = 'SphereBufferGeometry';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		radius = radius || 1;

		widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

		phiStart = phiStart !== undefined ? phiStart : 0;
		phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

		thetaStart = thetaStart !== undefined ? thetaStart : 0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

		var thetaEnd = thetaStart + thetaLength;

		var ix, iy;

		var index = 0;
		var grid = [];

		var vertex = new Vector3();
		var normal = new Vector3();

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// generate vertices, normals and uvs

		for ( iy = 0; iy <= heightSegments; iy ++ ) {

			var verticesRow = [];

			var v = iy / heightSegments;

			for ( ix = 0; ix <= widthSegments; ix ++ ) {

				var u = ix / widthSegments;

				// vertex

				vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
				vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
				vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normal.set( vertex.x, vertex.y, vertex.z ).normalize();
				normals.push( normal.x, normal.y, normal.z );

				// uv

				uvs.push( u, 1 - v );

				verticesRow.push( index ++ );

			}

			grid.push( verticesRow );

		}

		// indices

		for ( iy = 0; iy < heightSegments; iy ++ ) {

			for ( ix = 0; ix < widthSegments; ix ++ ) {

				var a = grid[ iy ][ ix + 1 ];
				var b = grid[ iy ][ ix ];
				var c = grid[ iy + 1 ][ ix ];
				var d = grid[ iy + 1 ][ ix + 1 ];

				if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
				if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );

			}

		}

		// build geometry

		this.setIndex( indices );
		this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	}

	SphereBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
	SphereBufferGeometry.prototype.constructor = SphereBufferGeometry;

	// BoxGeometry

	function BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

		Geometry.call( this );

		this.type = 'BoxGeometry';

		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};

		this.fromBufferGeometry( new BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) );
		this.mergeVertices();

	}

	BoxGeometry.prototype = Object.create( Geometry.prototype );
	BoxGeometry.prototype.constructor = BoxGeometry;

	// BoxBufferGeometry

	function BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

		BufferGeometry.call( this );

		this.type = 'BoxBufferGeometry';

		this.parameters = {
			width: width,
			height: height,
			depth: depth,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			depthSegments: depthSegments
		};

		var scope = this;

		width = width || 1;
		height = height || 1;
		depth = depth || 1;

		// segments

		widthSegments = Math.floor( widthSegments ) || 1;
		heightSegments = Math.floor( heightSegments ) || 1;
		depthSegments = Math.floor( depthSegments ) || 1;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// helper variables

		var numberOfVertices = 0;
		var groupStart = 0;

		// build each side of the box geometry

		buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
		buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
		buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
		buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
		buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
		buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

		// build geometry

		this.setIndex( indices );
		this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

		function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

			var segmentWidth = width / gridX;
			var segmentHeight = height / gridY;

			var widthHalf = width / 2;
			var heightHalf = height / 2;
			var depthHalf = depth / 2;

			var gridX1 = gridX + 1;
			var gridY1 = gridY + 1;

			var vertexCounter = 0;
			var groupCount = 0;

			var ix, iy;

			var vector = new Vector3();

			// generate vertices, normals and uvs

			for ( iy = 0; iy < gridY1; iy ++ ) {

				var y = iy * segmentHeight - heightHalf;

				for ( ix = 0; ix < gridX1; ix ++ ) {

					var x = ix * segmentWidth - widthHalf;

					// set values to correct vector component

					vector[ u ] = x * udir;
					vector[ v ] = y * vdir;
					vector[ w ] = depthHalf;

					// now apply vector to vertex buffer

					vertices.push( vector.x, vector.y, vector.z );

					// set values to correct vector component

					vector[ u ] = 0;
					vector[ v ] = 0;
					vector[ w ] = depth > 0 ? 1 : - 1;

					// now apply vector to normal buffer

					normals.push( vector.x, vector.y, vector.z );

					// uvs

					uvs.push( ix / gridX );
					uvs.push( 1 - ( iy / gridY ) );

					// counters

					vertexCounter += 1;

				}

			}

			// indices

			// 1. you need three indices to draw a single face
			// 2. a single segment consists of two faces
			// 3. so we need to generate six (2*3) indices per segment

			for ( iy = 0; iy < gridY; iy ++ ) {

				for ( ix = 0; ix < gridX; ix ++ ) {

					var a = numberOfVertices + ix + gridX1 * iy;
					var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
					var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
					var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

					// faces

					indices.push( a, b, d );
					indices.push( b, c, d );

					// increase counter

					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup( groupStart, groupCount, materialIndex );

			// calculate new start value for groups

			groupStart += groupCount;

			// update total number of vertices

			numberOfVertices += vertexCounter;

		}

	}

	BoxBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
	BoxBufferGeometry.prototype.constructor = BoxBufferGeometry;

	// CylinderGeometry

	function CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

		Geometry.call( this );

		this.type = 'CylinderGeometry';

		this.parameters = {
			radiusTop: radiusTop,
			radiusBottom: radiusBottom,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		this.fromBufferGeometry( new CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) );
		this.mergeVertices();

	}

	CylinderGeometry.prototype = Object.create( Geometry.prototype );
	CylinderGeometry.prototype.constructor = CylinderGeometry;

	// CylinderBufferGeometry

	function CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

		BufferGeometry.call( this );

		this.type = 'CylinderBufferGeometry';

		this.parameters = {
			radiusTop: radiusTop,
			radiusBottom: radiusBottom,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		var scope = this;

		radiusTop = radiusTop !== undefined ? radiusTop : 1;
		radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
		height = height || 1;

		radialSegments = Math.floor( radialSegments ) || 8;
		heightSegments = Math.floor( heightSegments ) || 1;

		openEnded = openEnded !== undefined ? openEnded : false;
		thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// helper variables

		var index = 0;
		var indexArray = [];
		var halfHeight = height / 2;
		var groupStart = 0;

		// generate geometry

		generateTorso();

		if ( openEnded === false ) {

			if ( radiusTop > 0 ) generateCap( true );
			if ( radiusBottom > 0 ) generateCap( false );

		}

		// build geometry

		this.setIndex( indices );
		this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

		function generateTorso() {

			var x, y;
			var normal = new Vector3();
			var vertex = new Vector3();

			var groupCount = 0;

			// this will be used to calculate the normal
			var slope = ( radiusBottom - radiusTop ) / height;

			// generate vertices, normals and uvs

			for ( y = 0; y <= heightSegments; y ++ ) {

				var indexRow = [];

				var v = y / heightSegments;

				// calculate the radius of the current row

				var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

				for ( x = 0; x <= radialSegments; x ++ ) {

					var u = x / radialSegments;

					var theta = u * thetaLength + thetaStart;

					var sinTheta = Math.sin( theta );
					var cosTheta = Math.cos( theta );

					// vertex

					vertex.x = radius * sinTheta;
					vertex.y = - v * height + halfHeight;
					vertex.z = radius * cosTheta;
					vertices.push( vertex.x, vertex.y, vertex.z );

					// normal

					normal.set( sinTheta, slope, cosTheta ).normalize();
					normals.push( normal.x, normal.y, normal.z );

					// uv

					uvs.push( u, 1 - v );

					// save index of vertex in respective row

					indexRow.push( index ++ );

				}

				// now save vertices of the row in our index array

				indexArray.push( indexRow );

			}

			// generate indices

			for ( x = 0; x < radialSegments; x ++ ) {

				for ( y = 0; y < heightSegments; y ++ ) {

					// we use the index array to access the correct indices

					var a = indexArray[ y ][ x ];
					var b = indexArray[ y + 1 ][ x ];
					var c = indexArray[ y + 1 ][ x + 1 ];
					var d = indexArray[ y ][ x + 1 ];

					// faces

					indices.push( a, b, d );
					indices.push( b, c, d );

					// update group counter

					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup( groupStart, groupCount, 0 );

			// calculate new start value for groups

			groupStart += groupCount;

		}

		function generateCap( top ) {

			var x, centerIndexStart, centerIndexEnd;

			var uv = new Vector2();
			var vertex = new Vector3();

			var groupCount = 0;

			var radius = ( top === true ) ? radiusTop : radiusBottom;
			var sign = ( top === true ) ? 1 : - 1;

			// save the index of the first center vertex
			centerIndexStart = index;

			// first we generate the center vertex data of the cap.
			// because the geometry needs one set of uvs per face,
			// we must generate a center vertex per face/segment

			for ( x = 1; x <= radialSegments; x ++ ) {

				// vertex

				vertices.push( 0, halfHeight * sign, 0 );

				// normal

				normals.push( 0, sign, 0 );

				// uv

				uvs.push( 0.5, 0.5 );

				// increase index

				index ++;

			}

			// save the index of the last center vertex

			centerIndexEnd = index;

			// now we generate the surrounding vertices, normals and uvs

			for ( x = 0; x <= radialSegments; x ++ ) {

				var u = x / radialSegments;
				var theta = u * thetaLength + thetaStart;

				var cosTheta = Math.cos( theta );
				var sinTheta = Math.sin( theta );

				// vertex

				vertex.x = radius * sinTheta;
				vertex.y = halfHeight * sign;
				vertex.z = radius * cosTheta;
				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normals.push( 0, sign, 0 );

				// uv

				uv.x = ( cosTheta * 0.5 ) + 0.5;
				uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
				uvs.push( uv.x, uv.y );

				// increase index

				index ++;

			}

			// generate indices

			for ( x = 0; x < radialSegments; x ++ ) {

				var c = centerIndexStart + x;
				var i = centerIndexEnd + x;

				if ( top === true ) {

					// face top

					indices.push( i, i + 1, c );

				} else {

					// face bottom

					indices.push( i + 1, i, c );

				}

				groupCount += 3;

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup( groupStart, groupCount, top === true ? 1 : 2 );

			// calculate new start value for groups

			groupStart += groupCount;

		}

	}

	CylinderBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
	CylinderBufferGeometry.prototype.constructor = CylinderBufferGeometry;

	var MMDPhysics = function ( mesh, params ) {

		if ( params === undefined ) params = {};

		this.mesh = mesh;
		this.helper = new MMDPhysics.ResourceHelper();

		
		this.unitStep = ( params.unitStep !== undefined ) ? params.unitStep : 1 / 65;
		this.maxStepNum = ( params.maxStepNum !== undefined ) ? params.maxStepNum : 3;

		this.world = params.world !== undefined ? params.world : null;
		this.bodies = [];
		this.constraints = [];

		this.init( mesh );

	};

	MMDPhysics.prototype = {

		constructor: MMDPhysics,

		init: function ( mesh ) {

			var parent = mesh.parent;

			if ( parent !== null ) {

				parent.remove( mesh );

			}

			var helper = this.helper;
			var currentPosition = helper.allocThreeVector3();
			var currentRotation = helper.allocThreeEuler();
			var currentScale = helper.allocThreeVector3();

			currentPosition.copy( mesh.position );
			currentRotation.copy( mesh.rotation );
			currentScale.copy( mesh.scale );

			mesh.position.set( 0, 0, 0 );
			mesh.rotation.set( 0, 0, 0 );
			mesh.scale.set( 1, 1, 1 );

			mesh.updateMatrixWorld( true );

			if ( this.world === null ) this.initWorld();
			this.initRigidBodies();
			this.initConstraints();

			if ( parent !== null ) {

				parent.add( mesh );

			}

			mesh.position.copy( currentPosition );
			mesh.rotation.copy( currentRotation );
			mesh.scale.copy( currentScale );

			mesh.updateMatrixWorld( true );

			this.reset();

			helper.freeThreeVector3( currentPosition );
			helper.freeThreeEuler( currentRotation );
			helper.freeThreeVector3( currentScale );

		},

		initWorld: function () {

			var config = new Ammo.btDefaultCollisionConfiguration();
			var dispatcher = new Ammo.btCollisionDispatcher( config );
			var cache = new Ammo.btDbvtBroadphase();
			var solver = new Ammo.btSequentialImpulseConstraintSolver();
			var world = new Ammo.btDiscreteDynamicsWorld( dispatcher, cache, solver, config );
			world.setGravity( new Ammo.btVector3( 0, -9.8 * 10, 0 ) );
			this.world = world;

		},

		initRigidBodies: function () {

			var bodies = this.mesh.geometry.rigidBodies;

			for ( var i = 0; i < bodies.length; i++ ) {

				var b = new MMDPhysics.RigidBody( this.mesh, this.world, bodies[ i ], this.helper );
				this.bodies.push( b );

			}

		},

		initConstraints: function () {

			var constraints = this.mesh.geometry.constraints;

			for ( var i = 0; i < constraints.length; i++ ) {

				var params = constraints[ i ];
				var bodyA = this.bodies[ params.rigidBodyIndex1 ];
				var bodyB = this.bodies[ params.rigidBodyIndex2 ];
				var c = new MMDPhysics.Constraint( this.mesh, this.world, bodyA, bodyB, params, this.helper );
				this.constraints.push( c );

			}


		},

		update: function ( delta ) {

			this.updateRigidBodies();
			this.stepSimulation( delta );
			this.updateBones();

		},

		stepSimulation: function ( delta ) {

			var unitStep = this.unitStep;
			var stepTime = delta;
			var maxStepNum = ( ( delta / unitStep ) | 0 ) + 1;

			if ( stepTime < unitStep ) {

				stepTime = unitStep;
				maxStepNum = 1;

			}

			if ( maxStepNum > this.maxStepNum ) {

				maxStepNum = this.maxStepNum;

			}

			this.world.stepSimulation( stepTime, maxStepNum, unitStep );

		},

		updateRigidBodies: function () {

			for ( var i = 0; i < this.bodies.length; i++ ) {

				this.bodies[ i ].updateFromBone();

			}

		},

		updateBones: function () {

			for ( var i = 0; i < this.bodies.length; i++ ) {

				this.bodies[ i ].updateBone();

			}

		},

		reset: function () {

			for ( var i = 0; i < this.bodies.length; i++ ) {

				this.bodies[ i ].reset();

			}

		},

		warmup: function ( cycles ) {

			for ( var i = 0; i < cycles; i++ ) {

				this.update( 1 / 60 );

			}

		}

	};


	MMDPhysics.ResourceHelper = function () {

		// for Three.js
		this.threeVector3s = [];
		this.threeMatrix4s = [];
		this.threeQuaternions = [];
		this.threeEulers = [];

		// for Ammo.js
		this.transforms = [];
		this.quaternions = [];
		this.vector3s = [];

	};

	MMDPhysics.ResourceHelper.prototype = {

		allocThreeVector3: function () {

			return ( this.threeVector3s.length > 0 ) ? this.threeVector3s.pop() : new Vector3();

		},

		freeThreeVector3: function ( v ) {

			this.threeVector3s.push( v );

		},

		allocThreeMatrix4: function () {

			return ( this.threeMatrix4s.length > 0 ) ? this.threeMatrix4s.pop() : new Matrix4();

		},

		freeThreeMatrix4: function ( m ) {

			this.threeMatrix4s.push( m );

		},

		allocThreeQuaternion: function () {

			return ( this.threeQuaternions.length > 0 ) ? this.threeQuaternions.pop() : new Quaternion();

		},

		freeThreeQuaternion: function ( q ) {

			this.threeQuaternions.push( q );

		},

		allocThreeEuler: function () {

			return ( this.threeEulers.length > 0 ) ? this.threeEulers.pop() : new Euler();

		},

		freeThreeEuler: function ( e ) {

			this.threeEulers.push( e );

		},

		allocTransform: function () {

			return ( this.transforms.length > 0 ) ? this.transforms.pop() : new Ammo.btTransform();

		},

		freeTransform: function ( t ) {

			this.transforms.push( t );

		},

		allocQuaternion: function () {

			return ( this.quaternions.length > 0 ) ? this.quaternions.pop() : new Ammo.btQuaternion();

		},

		freeQuaternion: function ( q ) {

			this.quaternions.push( q );

		},

		allocVector3: function () {

			return ( this.vector3s.length > 0 ) ? this.vector3s.pop() : new Ammo.btVector3();

		},

		freeVector3: function ( v ) {

			this.vector3s.push( v );

		},

		setIdentity: function ( t ) {

			t.setIdentity();

		},

		getBasis: function ( t ) {

			var q = this.allocQuaternion();
			t.getBasis().getRotation( q );
			return q;

		},

		getBasisAsMatrix3: function ( t ) {

			var q = this.getBasis( t );
			var m = this.quaternionToMatrix3( q );
			this.freeQuaternion( q );
			return m;

		},

		getOrigin: function( t ) {

			return t.getOrigin();

		},

		setOrigin: function( t, v ) {

			t.getOrigin().setValue( v.x(), v.y(), v.z() );

		},

		copyOrigin: function( t1, t2 ) {

			var o = t2.getOrigin();
			this.setOrigin( t1, o );

		},

		setBasis: function( t, q ) {

			t.setRotation( q );

		},

		setBasisFromMatrix3: function( t, m ) {

			var q = this.matrix3ToQuaternion( m );
			this.setBasis( t, q );
			this.freeQuaternion( q );

		},

		setOriginFromArray3: function ( t, a ) {

			t.getOrigin().setValue( a[ 0 ], a[ 1 ], a[ 2 ] );

		},

		setOriginFromThreeVector3: function ( t, v ) {

			t.getOrigin().setValue( v.x, v.y, v.z );

		},

		setBasisFromArray3: function ( t, a ) {

			var thQ = this.allocThreeQuaternion();
			var thE = this.allocThreeEuler();
			thE.set( a[ 0 ], a[ 1 ], a[ 2 ] );
			this.setBasisFromThreeQuaternion( t, thQ.setFromEuler( thE ) );

			this.freeThreeEuler( thE );
			this.freeThreeQuaternion( thQ );

		},

		setBasisFromThreeQuaternion: function ( t, a ) {

			var q = this.allocQuaternion();

			q.setX( a.x );
			q.setY( a.y );
			q.setZ( a.z );
			q.setW( a.w );
			this.setBasis( t, q );

			this.freeQuaternion( q );

		},

		multiplyTransforms: function ( t1, t2 ) {

			var t = this.allocTransform();
			this.setIdentity( t );

			var m1 = this.getBasisAsMatrix3( t1 );
			var m2 = this.getBasisAsMatrix3( t2 );

			var o1 = this.getOrigin( t1 );
			var o2 = this.getOrigin( t2 );

			var v1 = this.multiplyMatrix3ByVector3( m1, o2 );
			var v2 = this.addVector3( v1, o1 );
			this.setOrigin( t, v2 );

			var m3 = this.multiplyMatrices3( m1, m2 );
			this.setBasisFromMatrix3( t, m3 );

			this.freeVector3( v1 );
			this.freeVector3( v2 );

			return t;

		},

		inverseTransform: function ( t ) {

			var t2 = this.allocTransform();

			var m1 = this.getBasisAsMatrix3( t );
			var o = this.getOrigin( t );

			var m2 = this.transposeMatrix3( m1 );
			var v1 = this.negativeVector3( o );
			var v2 = this.multiplyMatrix3ByVector3( m2, v1 );

			this.setOrigin( t2, v2 );
			this.setBasisFromMatrix3( t2, m2 );

			this.freeVector3( v1 );
			this.freeVector3( v2 );

			return t2;

		},

		multiplyMatrices3: function ( m1, m2 ) {

			var m3 = [];

			var v10 = this.rowOfMatrix3( m1, 0 );
			var v11 = this.rowOfMatrix3( m1, 1 );
			var v12 = this.rowOfMatrix3( m1, 2 );

			var v20 = this.columnOfMatrix3( m2, 0 );
			var v21 = this.columnOfMatrix3( m2, 1 );
			var v22 = this.columnOfMatrix3( m2, 2 );

			m3[ 0 ] = this.dotVectors3( v10, v20 );
			m3[ 1 ] = this.dotVectors3( v10, v21 );
			m3[ 2 ] = this.dotVectors3( v10, v22 );
			m3[ 3 ] = this.dotVectors3( v11, v20 );
			m3[ 4 ] = this.dotVectors3( v11, v21 );
			m3[ 5 ] = this.dotVectors3( v11, v22 );
			m3[ 6 ] = this.dotVectors3( v12, v20 );
			m3[ 7 ] = this.dotVectors3( v12, v21 );
			m3[ 8 ] = this.dotVectors3( v12, v22 );

			this.freeVector3( v10 );
			this.freeVector3( v11 );
			this.freeVector3( v12 );
			this.freeVector3( v20 );
			this.freeVector3( v21 );
			this.freeVector3( v22 );

			return m3;

		},

		addVector3: function( v1, v2 ) {

			var v = this.allocVector3();
			v.setValue( v1.x() + v2.x(), v1.y() + v2.y(), v1.z() + v2.z() );
			return v;

		},

		dotVectors3: function( v1, v2 ) {

			return v1.x() * v2.x() + v1.y() * v2.y() + v1.z() * v2.z();

		},

		rowOfMatrix3: function( m, i ) {

			var v = this.allocVector3();
			v.setValue( m[ i * 3 + 0 ], m[ i * 3 + 1 ], m[ i * 3 + 2 ] );
			return v;

		},

		columnOfMatrix3: function( m, i ) {

			var v = this.allocVector3();
			v.setValue( m[ i + 0 ], m[ i + 3 ], m[ i + 6 ] );
			return v;

		},

		negativeVector3: function( v ) {

			var v2 = this.allocVector3();
			v2.setValue( -v.x(), -v.y(), -v.z() );
			return v2;

		},

		multiplyMatrix3ByVector3: function ( m, v ) {

			var v4 = this.allocVector3();

			var v0 = this.rowOfMatrix3( m, 0 );
			var v1 = this.rowOfMatrix3( m, 1 );
			var v2 = this.rowOfMatrix3( m, 2 );
			var x = this.dotVectors3( v0, v );
			var y = this.dotVectors3( v1, v );
			var z = this.dotVectors3( v2, v );

			v4.setValue( x, y, z );

			this.freeVector3( v0 );
			this.freeVector3( v1 );
			this.freeVector3( v2 );

			return v4;

		},

		transposeMatrix3: function( m ) {

			var m2 = [];
			m2[ 0 ] = m[ 0 ];
			m2[ 1 ] = m[ 3 ];
			m2[ 2 ] = m[ 6 ];
			m2[ 3 ] = m[ 1 ];
			m2[ 4 ] = m[ 4 ];
			m2[ 5 ] = m[ 7 ];
			m2[ 6 ] = m[ 2 ];
			m2[ 7 ] = m[ 5 ];
			m2[ 8 ] = m[ 8 ];
			return m2;

		},

		quaternionToMatrix3: function ( q ) {

			var m = [];

			var x = q.x();
			var y = q.y();
			var z = q.z();
			var w = q.w();

			var xx = x * x;
			var yy = y * y;
			var zz = z * z;

			var xy = x * y;
			var yz = y * z;
			var zx = z * x;

			var xw = x * w;
			var yw = y * w;
			var zw = z * w;

			m[ 0 ] = 1 - 2 * ( yy + zz );
			m[ 1 ] = 2 * ( xy - zw );
			m[ 2 ] = 2 * ( zx + yw );
			m[ 3 ] = 2 * ( xy + zw );
			m[ 4 ] = 1 - 2 * ( zz + xx );
			m[ 5 ] = 2 * ( yz - xw );
			m[ 6 ] = 2 * ( zx - yw );
			m[ 7 ] = 2 * ( yz + xw );
			m[ 8 ] = 1 - 2 * ( xx + yy );

			return m;

		},

		matrix3ToQuaternion: function( m ) {

			var t = m[ 0 ] + m[ 4 ] + m[ 8 ];
			var s, x, y, z, w;

			if( t > 0 ) {

				s = Math.sqrt( t + 1.0 ) * 2;
				w = 0.25 * s;
				x = ( m[ 7 ] - m[ 5 ] ) / s;
				y = ( m[ 2 ] - m[ 6 ] ) / s; 
				z = ( m[ 3 ] - m[ 1 ] ) / s; 

			} else if( ( m[ 0 ] > m[ 4 ] ) && ( m[ 0 ] > m[ 8 ] ) ) {

				s = Math.sqrt( 1.0 + m[ 0 ] - m[ 4 ] - m[ 8 ] ) * 2;
				w = ( m[ 7 ] - m[ 5 ] ) / s;
				x = 0.25 * s;
				y = ( m[ 1 ] + m[ 3 ] ) / s;
				z = ( m[ 2 ] + m[ 6 ] ) / s;

			} else if( m[ 4 ] > m[ 8 ] ) {

				s = Math.sqrt( 1.0 + m[ 4 ] - m[ 0 ] - m[ 8 ] ) * 2;
				w = ( m[ 2 ] - m[ 6 ] ) / s;
				x = ( m[ 1 ] + m[ 3 ] ) / s;
				y = 0.25 * s;
				z = ( m[ 5 ] + m[ 7 ] ) / s;

			} else {

				s = Math.sqrt( 1.0 + m[ 8 ] - m[ 0 ] - m[ 4 ] ) * 2;
				w = ( m[ 3 ] - m[ 1 ] ) / s;
				x = ( m[ 2 ] + m[ 6 ] ) / s;
				y = ( m[ 5 ] + m[ 7 ] ) / s;
				z = 0.25 * s;

			}

			var q = this.allocQuaternion();
			q.setX( x );
			q.setY( y );
			q.setZ( z );
			q.setW( w );
			return q;

		}

	};

	MMDPhysics.RigidBody = function ( mesh, world, params, helper ) {

		this.mesh  = mesh;
		this.world = world;
		this.params = params;
		this.helper = helper;

		this.body = null;
		this.bone = null;
		this.boneOffsetForm = null;
		this.boneOffsetFormInverse = null;

		this.init();

	};

	MMDPhysics.RigidBody.prototype = {

		constructor: MMDPhysics.RigidBody,

		init: function () {

			function generateShape( p ) {

				switch( p.shapeType ) {

					case 0:
						return new Ammo.btSphereShape( p.width );

					case 1:
						return new Ammo.btBoxShape( new Ammo.btVector3( p.width, p.height, p.depth ) );

					case 2:
						return new Ammo.btCapsuleShape( p.width, p.height );

					default:
						throw 'unknown shape type ' + p.shapeType;

				}

			}

			var helper = this.helper;
			var params = this.params;
			var bones = this.mesh.skeleton.bones;
			var bone = ( params.boneIndex === -1 ) ? new Bone() : bones[ params.boneIndex ];

			var shape = generateShape( params );
			var weight = ( params.type === 0 ) ? 0 : params.weight;
			var localInertia = helper.allocVector3();
			localInertia.setValue( 0, 0, 0 );

			if( weight !== 0 ) {

				shape.calculateLocalInertia( weight, localInertia );

			}

			var boneOffsetForm = helper.allocTransform();
			helper.setIdentity( boneOffsetForm );
			helper.setOriginFromArray3( boneOffsetForm, params.position );
			helper.setBasisFromArray3( boneOffsetForm, params.rotation );

			var vector = helper.allocThreeVector3();
			var boneForm = helper.allocTransform();
			helper.setIdentity( boneForm );
			helper.setOriginFromThreeVector3( boneForm, bone.getWorldPosition( vector ) );

			var form = helper.multiplyTransforms( boneForm, boneOffsetForm );
			var state = new Ammo.btDefaultMotionState( form );

			var info = new Ammo.btRigidBodyConstructionInfo( weight, state, shape, localInertia );
			info.set_m_friction( params.friction );
			info.set_m_restitution( params.restitution );

			var body = new Ammo.btRigidBody( info );

			if ( params.type === 0 ) {

				body.setCollisionFlags( body.getCollisionFlags() | 2 );

				
				body.setActivationState( 4 );

			}

			body.setDamping( params.positionDamping, params.rotationDamping );
			body.setSleepingThresholds( 0, 0 );

			this.world.addRigidBody( body, 1 << params.groupIndex, params.groupTarget );

			this.body = body;
			this.bone = bone;
			this.boneOffsetForm = boneOffsetForm;
			this.boneOffsetFormInverse = helper.inverseTransform( boneOffsetForm );

			helper.freeVector3( localInertia );
			helper.freeTransform( form );
			helper.freeTransform( boneForm );
			helper.freeThreeVector3( vector );

		},

		reset: function () {

			this.setTransformFromBone();

		},

		updateFromBone: function () {

			if ( this.params.boneIndex === -1 ) {

				return;

			}

			if ( this.params.type === 0 ) {

				this.setTransformFromBone();

			}

		},

		updateBone: function () {

			if ( this.params.type === 0 || this.params.boneIndex === -1 ) {

				return;

			}

			this.updateBoneRotation();

			if ( this.params.type === 1 ) {

				this.updateBonePosition();

			}

			this.bone.updateMatrixWorld( true );

			if ( this.params.type === 2 ) {

				this.setPositionFromBone();

			}

		},

		getBoneTransform: function () {

			var helper = this.helper;
			var p = helper.allocThreeVector3();
			var q = helper.allocThreeQuaternion();

			this.bone.getWorldPosition( p );
			this.bone.getWorldQuaternion( q );

			var tr = helper.allocTransform();
			helper.setOriginFromThreeVector3( tr, p );
			helper.setBasisFromThreeQuaternion( tr, q );

			var form = helper.multiplyTransforms( tr, this.boneOffsetForm );

			helper.freeTransform( tr );
			helper.freeThreeQuaternion( q );
			helper.freeThreeVector3( p );

			return form;

		},

		getWorldTransformForBone: function () {

			var helper = this.helper;

			var tr = helper.allocTransform();
			this.body.getMotionState().getWorldTransform( tr );
			var tr2 = helper.multiplyTransforms( tr, this.boneOffsetFormInverse );

			helper.freeTransform( tr );

			return tr2;

		},

		setTransformFromBone: function () {

			var helper = this.helper;
			var form = this.getBoneTransform();

			// TODO: check the most appropriate way to set
			//this.body.setWorldTransform( form );
			this.body.setCenterOfMassTransform( form );
			this.body.getMotionState().setWorldTransform( form );

			helper.freeTransform( form );

		},

		setPositionFromBone: function () {

			var helper = this.helper;
			var form = this.getBoneTransform();

			var tr = helper.allocTransform();
			this.body.getMotionState().getWorldTransform( tr );
			helper.copyOrigin( tr, form );

			// TODO: check the most appropriate way to set
			//this.body.setWorldTransform( tr );
			this.body.setCenterOfMassTransform( tr );
			this.body.getMotionState().setWorldTransform( tr );

			helper.freeTransform( tr );
			helper.freeTransform( form );

		},

		updateBoneRotation: function () {

			this.bone.updateMatrixWorld( true );

			var helper = this.helper;

			var tr = this.getWorldTransformForBone();
			var q = helper.getBasis( tr );

			var thQ = helper.allocThreeQuaternion();
			var thQ2 = helper.allocThreeQuaternion();
			var thQ3 = helper.allocThreeQuaternion();

			thQ.set( q.x(), q.y(), q.z(), q.w() );
			thQ2.setFromRotationMatrix( this.bone.matrixWorld );
			thQ2.conjugate();
			thQ2.multiply( thQ );

			//this.bone.quaternion.multiply( thQ2 );

			thQ3.setFromRotationMatrix( this.bone.matrix );
			this.bone.quaternion.copy( thQ2.multiply( thQ3 ) );

			helper.freeThreeQuaternion( thQ );
			helper.freeThreeQuaternion( thQ2 );
			helper.freeThreeQuaternion( thQ3 );

			helper.freeQuaternion( q );
			helper.freeTransform( tr );

		},

		updateBonePosition: function () {

			var helper = this.helper;

			var tr = this.getWorldTransformForBone();

			var thV = helper.allocThreeVector3();

			var o = helper.getOrigin( tr );
			thV.set( o.x(), o.y(), o.z() );

			var v = this.bone.worldToLocal( thV );
			this.bone.position.add( v );

			helper.freeThreeVector3( thV );

			helper.freeTransform( tr );

		}

	};

	MMDPhysics.Constraint = function ( mesh, world, bodyA, bodyB, params, helper ) {

		this.mesh  = mesh;
		this.world = world;
		this.bodyA = bodyA;
		this.bodyB = bodyB;
		this.params = params;
		this.helper = helper;

		this.constraint = null;

		this.init();

	};

	MMDPhysics.Constraint.prototype = {

		constructor: MMDPhysics.Constraint,

		init: function () {

			var helper = this.helper;
			var params = this.params;
			var bodyA = this.bodyA;
			var bodyB = this.bodyB;

			var form = helper.allocTransform();
			helper.setIdentity( form );
			helper.setOriginFromArray3( form, params.position );
			helper.setBasisFromArray3( form, params.rotation );

			var formA = helper.allocTransform();
			var formB = helper.allocTransform();

			bodyA.body.getMotionState().getWorldTransform( formA );
			bodyB.body.getMotionState().getWorldTransform( formB );

			var formInverseA = helper.inverseTransform( formA );
			var formInverseB = helper.inverseTransform( formB );

			var formA2 = helper.multiplyTransforms( formInverseA, form );
			var formB2 = helper.multiplyTransforms( formInverseB, form );

			var constraint = new Ammo.btGeneric6DofSpringConstraint( bodyA.body, bodyB.body, formA2, formB2, true );

			var lll = helper.allocVector3();
			var lul = helper.allocVector3();
			var all = helper.allocVector3();
			var aul = helper.allocVector3();

			lll.setValue( params.translationLimitation1[ 0 ],
			              params.translationLimitation1[ 1 ],
			              params.translationLimitation1[ 2 ] );
			lul.setValue( params.translationLimitation2[ 0 ],
			              params.translationLimitation2[ 1 ],
			              params.translationLimitation2[ 2 ] );
			all.setValue( params.rotationLimitation1[ 0 ],
			              params.rotationLimitation1[ 1 ],
			              params.rotationLimitation1[ 2 ] );
			aul.setValue( params.rotationLimitation2[ 0 ],
			              params.rotationLimitation2[ 1 ],
			              params.rotationLimitation2[ 2 ] );

			constraint.setLinearLowerLimit( lll );
			constraint.setLinearUpperLimit( lul );
			constraint.setAngularLowerLimit( all );
			constraint.setAngularUpperLimit( aul );

			for ( var i = 0; i < 3; i++ ) {

				if( params.springPosition[ i ] !== 0 ) {

					constraint.enableSpring( i, true );
					constraint.setStiffness( i, params.springPosition[ i ] );

				}

			}

			for ( var i = 0; i < 3; i++ ) {

				if( params.springRotation[ i ] !== 0 ) {

					constraint.enableSpring( i + 3, true );
					constraint.setStiffness( i + 3, params.springRotation[ i ] );

				}

			}

			
			if ( constraint.setParam !== undefined ) {

				for ( var i = 0; i < 6; i ++ ) {

					// this parameter is from http://www20.atpages.jp/katwat/three.js_r58/examples/mytest37/mmd.three.js
					constraint.setParam( 2, 0.475, i );

				}

			}

			this.world.addConstraint( constraint, true );
			this.constraint = constraint;

			helper.freeTransform( form );
			helper.freeTransform( formA );
			helper.freeTransform( formB );
			helper.freeTransform( formInverseA );
			helper.freeTransform( formInverseB );
			helper.freeTransform( formA2 );
			helper.freeTransform( formB2 );
			helper.freeVector3( lll );
			helper.freeVector3( lul );
			helper.freeVector3( all );
			helper.freeVector3( aul );

		}

	};


	var MMDPhysicsHelper = function ( mesh ) {

		if ( mesh.physics === undefined || mesh.geometry.rigidBodies === undefined ) {

			throw 'MMDPhysicsHelper requires physics in mesh and rigidBodies in mesh.geometry.';

		}

		Object3D.call( this );

		this.root = mesh;

		this.matrix = mesh.matrixWorld;
		this.matrixAutoUpdate = false;

		this.materials = [];

		this.materials.push(
			new MeshBasicMaterial( {
				color: new Color( 0xff8888 ),
				wireframe: true,
				depthTest: false,
				depthWrite: false,
				opacity: 0.25,
				transparent: true
			} )
		);

		this.materials.push(
			new MeshBasicMaterial( {
				color: new Color( 0x88ff88 ),
				wireframe: true,
				depthTest: false,
				depthWrite: false,
				opacity: 0.25,
				transparent: true
			} )
		);

		this.materials.push(
			new MeshBasicMaterial( {
				color: new Color( 0x8888ff ),
				wireframe: true,
				depthTest: false,
				depthWrite: false,
				opacity: 0.25,
				transparent: true
			} )
		);

		this._init();
		this.update();

	};

	MMDPhysicsHelper.prototype = Object.create( Object3D.prototype );
	MMDPhysicsHelper.prototype.constructor = MMDPhysicsHelper;

	MMDPhysicsHelper.prototype._init = function () {

		var mesh = this.root;
		var rigidBodies = mesh.geometry.rigidBodies;

		function createGeometry( param ) {

			switch ( param.shapeType ) {

				case 0:
					return new SphereBufferGeometry( param.width, 16, 8 );

				case 1:
					return new BoxBufferGeometry( param.width * 2, param.height * 2, param.depth * 2, 8, 8, 8 );

				case 2:
					return new createCapsuleGeometry( param.width, param.height, 16, 8 );

				default:
					return null;

			}

		}

		// copy from http://www20.atpages.jp/katwat/three.js_r58/examples/mytest37/mytest37.js?ver=20160815
		function createCapsuleGeometry( radius, cylinderHeight, segmentsRadius, segmentsHeight ) {

			var geometry = new CylinderBufferGeometry( radius, radius, cylinderHeight, segmentsRadius, segmentsHeight, true );
			var upperSphere = new Mesh( new SphereBufferGeometry( radius, segmentsRadius, segmentsHeight, 0, Math.PI * 2, 0, Math.PI / 2 ) );
			var lowerSphere = new Mesh( new SphereBufferGeometry( radius, segmentsRadius, segmentsHeight, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2 ) );

			upperSphere.position.set( 0, cylinderHeight / 2, 0 );
			lowerSphere.position.set( 0, -cylinderHeight / 2, 0 );

			upperSphere.updateMatrix();
			lowerSphere.updateMatrix();

			geometry.merge( upperSphere.geometry, upperSphere.matrix );
			geometry.merge( lowerSphere.geometry, lowerSphere.matrix );

			return geometry;

		}

		for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

			var param = rigidBodies[ i ];
			this.add( new Mesh( createGeometry( param ), this.materials[ param.type ] ) );

		}

	};

	MMDPhysicsHelper.prototype.update = function () {

		var mesh = this.root;
		var rigidBodies = mesh.geometry.rigidBodies;
		var bodies = mesh.physics.bodies;

		var matrixWorldInv = new Matrix4().getInverse( mesh.matrixWorld );
		var vector = new Vector3();
		var quaternion = new Quaternion();
		var quaternion2 = new Quaternion();

		function getPosition( origin ) {

			vector.set( origin.x(), origin.y(), origin.z() );
			vector.applyMatrix4( matrixWorldInv );

			return vector;

		}

		function getQuaternion( rotation ) {

			quaternion.set( rotation.x(), rotation.y(), rotation.z(), rotation.w() );
			quaternion2.setFromRotationMatrix( matrixWorldInv );
			quaternion2.multiply( quaternion );

			return quaternion2;

		}

		for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

			var body = bodies[ i ].body;
			var mesh = this.children[ i ];

			var tr = body.getCenterOfMassTransform();

			mesh.position.copy( getPosition( tr.getOrigin() ) );
			mesh.quaternion.copy( getQuaternion( tr.getRotation() ) );

		}

	};

	function AnimationAction( mixer, clip, localRoot ) {

		this._mixer = mixer;
		this._clip = clip;
		this._localRoot = localRoot || null;

		var tracks = clip.tracks,
			nTracks = tracks.length,
			interpolants = new Array( nTracks );

		var interpolantSettings = {
			endingStart: ZeroCurvatureEnding,
			endingEnd: ZeroCurvatureEnding
		};

		for ( var i = 0; i !== nTracks; ++ i ) {

			var interpolant = tracks[ i ].createInterpolant( null );
			interpolants[ i ] = interpolant;
			interpolant.settings = interpolantSettings;

		}

		this._interpolantSettings = interpolantSettings;

		this._interpolants = interpolants;	// bound by the mixer

		// inside: PropertyMixer (managed by the mixer)
		this._propertyBindings = new Array( nTracks );

		this._cacheIndex = null;			// for the memory manager
		this._byClipCacheIndex = null;		// for the memory manager

		this._timeScaleInterpolant = null;
		this._weightInterpolant = null;

		this.loop = LoopRepeat;
		this._loopCount = - 1;

		// global mixer time when the action is to be started
		// it's set back to 'null' upon start of the action
		this._startTime = null;

		// scaled local time of the action
		// gets clamped or wrapped to 0..clip.duration according to loop
		this.time = 0;

		this.timeScale = 1;
		this._effectiveTimeScale = 1;

		this.weight = 1;
		this._effectiveWeight = 1;

		this.repetitions = Infinity; 		// no. of repetitions when looping

		this.paused = false;				// true -> zero effective time scale
		this.enabled = true;				// false -> zero effective weight

		this.clampWhenFinished 	= false;	// keep feeding the last frame?

		this.zeroSlopeAtStart 	= true;		// for smooth interpolation w/o separate
		this.zeroSlopeAtEnd		= true;		// clips for start, loop and end

	}

	Object.assign( AnimationAction.prototype, {

		// State & Scheduling

		play: function () {

			this._mixer._activateAction( this );

			return this;

		},

		stop: function () {

			this._mixer._deactivateAction( this );

			return this.reset();

		},

		reset: function () {

			this.paused = false;
			this.enabled = true;

			this.time = 0;			// restart clip
			this._loopCount = - 1;	// forget previous loops
			this._startTime = null;	// forget scheduling

			return this.stopFading().stopWarping();

		},

		isRunning: function () {

			return this.enabled && ! this.paused && this.timeScale !== 0 &&
					this._startTime === null && this._mixer._isActiveAction( this );

		},

		// return true when play has been called
		isScheduled: function () {

			return this._mixer._isActiveAction( this );

		},

		startAt: function ( time ) {

			this._startTime = time;

			return this;

		},

		setLoop: function ( mode, repetitions ) {

			this.loop = mode;
			this.repetitions = repetitions;

			return this;

		},

		// Weight

		// set the weight stopping any scheduled fading
		// although .enabled = false yields an effective weight of zero, this
		// method does *not* change .enabled, because it would be confusing
		setEffectiveWeight: function ( weight ) {

			this.weight = weight;

			// note: same logic as when updated at runtime
			this._effectiveWeight = this.enabled ? weight : 0;

			return this.stopFading();

		},

		// return the weight considering fading and .enabled
		getEffectiveWeight: function () {

			return this._effectiveWeight;

		},

		fadeIn: function ( duration ) {

			return this._scheduleFading( duration, 0, 1 );

		},

		fadeOut: function ( duration ) {

			return this._scheduleFading( duration, 1, 0 );

		},

		crossFadeFrom: function ( fadeOutAction, duration, warp ) {

			fadeOutAction.fadeOut( duration );
			this.fadeIn( duration );

			if ( warp ) {

				var fadeInDuration = this._clip.duration,
					fadeOutDuration = fadeOutAction._clip.duration,

					startEndRatio = fadeOutDuration / fadeInDuration,
					endStartRatio = fadeInDuration / fadeOutDuration;

				fadeOutAction.warp( 1.0, startEndRatio, duration );
				this.warp( endStartRatio, 1.0, duration );

			}

			return this;

		},

		crossFadeTo: function ( fadeInAction, duration, warp ) {

			return fadeInAction.crossFadeFrom( this, duration, warp );

		},

		stopFading: function () {

			var weightInterpolant = this._weightInterpolant;

			if ( weightInterpolant !== null ) {

				this._weightInterpolant = null;
				this._mixer._takeBackControlInterpolant( weightInterpolant );

			}

			return this;

		},

		// Time Scale Control

		// set the time scale stopping any scheduled warping
		// although .paused = true yields an effective time scale of zero, this
		// method does *not* change .paused, because it would be confusing
		setEffectiveTimeScale: function ( timeScale ) {

			this.timeScale = timeScale;
			this._effectiveTimeScale = this.paused ? 0 : timeScale;

			return this.stopWarping();

		},

		// return the time scale considering warping and .paused
		getEffectiveTimeScale: function () {

			return this._effectiveTimeScale;

		},

		setDuration: function ( duration ) {

			this.timeScale = this._clip.duration / duration;

			return this.stopWarping();

		},

		syncWith: function ( action ) {

			this.time = action.time;
			this.timeScale = action.timeScale;

			return this.stopWarping();

		},

		halt: function ( duration ) {

			return this.warp( this._effectiveTimeScale, 0, duration );

		},

		warp: function ( startTimeScale, endTimeScale, duration ) {

			var mixer = this._mixer, now = mixer.time,
				interpolant = this._timeScaleInterpolant,

				timeScale = this.timeScale;

			if ( interpolant === null ) {

				interpolant = mixer._lendControlInterpolant();
				this._timeScaleInterpolant = interpolant;

			}

			var times = interpolant.parameterPositions,
				values = interpolant.sampleValues;

			times[ 0 ] = now;
			times[ 1 ] = now + duration;

			values[ 0 ] = startTimeScale / timeScale;
			values[ 1 ] = endTimeScale / timeScale;

			return this;

		},

		stopWarping: function () {

			var timeScaleInterpolant = this._timeScaleInterpolant;

			if ( timeScaleInterpolant !== null ) {

				this._timeScaleInterpolant = null;
				this._mixer._takeBackControlInterpolant( timeScaleInterpolant );

			}

			return this;

		},

		// Object Accessors

		getMixer: function () {

			return this._mixer;

		},

		getClip: function () {

			return this._clip;

		},

		getRoot: function () {

			return this._localRoot || this._mixer._root;

		},

		// Interna

		_update: function ( time, deltaTime, timeDirection, accuIndex ) {

			// called by the mixer

			if ( ! this.enabled ) {

				// call ._updateWeight() to update ._effectiveWeight

				this._updateWeight( time );
				return;

			}

			var startTime = this._startTime;

			if ( startTime !== null ) {

				// check for scheduled start of action

				var timeRunning = ( time - startTime ) * timeDirection;
				if ( timeRunning < 0 || timeDirection === 0 ) {

					return; // yet to come / don't decide when delta = 0

				}

				// start

				this._startTime = null; // unschedule
				deltaTime = timeDirection * timeRunning;

			}

			// apply time scale and advance time

			deltaTime *= this._updateTimeScale( time );
			var clipTime = this._updateTime( deltaTime );

			// note: _updateTime may disable the action resulting in
			// an effective weight of 0

			var weight = this._updateWeight( time );

			if ( weight > 0 ) {

				var interpolants = this._interpolants;
				var propertyMixers = this._propertyBindings;

				for ( var j = 0, m = interpolants.length; j !== m; ++ j ) {

					interpolants[ j ].evaluate( clipTime );
					propertyMixers[ j ].accumulate( accuIndex, weight );

				}

			}

		},

		_updateWeight: function ( time ) {

			var weight = 0;

			if ( this.enabled ) {

				weight = this.weight;
				var interpolant = this._weightInterpolant;

				if ( interpolant !== null ) {

					var interpolantValue = interpolant.evaluate( time )[ 0 ];

					weight *= interpolantValue;

					if ( time > interpolant.parameterPositions[ 1 ] ) {

						this.stopFading();

						if ( interpolantValue === 0 ) {

							// faded out, disable
							this.enabled = false;

						}

					}

				}

			}

			this._effectiveWeight = weight;
			return weight;

		},

		_updateTimeScale: function ( time ) {

			var timeScale = 0;

			if ( ! this.paused ) {

				timeScale = this.timeScale;

				var interpolant = this._timeScaleInterpolant;

				if ( interpolant !== null ) {

					var interpolantValue = interpolant.evaluate( time )[ 0 ];

					timeScale *= interpolantValue;

					if ( time > interpolant.parameterPositions[ 1 ] ) {

						this.stopWarping();

						if ( timeScale === 0 ) {

							// motion has halted, pause
							this.paused = true;

						} else {

							// warp done - apply final time scale
							this.timeScale = timeScale;

						}

					}

				}

			}

			this._effectiveTimeScale = timeScale;
			return timeScale;

		},

		_updateTime: function ( deltaTime ) {

			var time = this.time + deltaTime;

			if ( deltaTime === 0 ) return time;

			var duration = this._clip.duration,

				loop = this.loop,
				loopCount = this._loopCount;

			if ( loop === LoopOnce ) {

				if ( loopCount === - 1 ) {

					// just started

					this._loopCount = 0;
					this._setEndings( true, true, false );

				}

				handle_stop: {

					if ( time >= duration ) {

						time = duration;

					} else if ( time < 0 ) {

						time = 0;

					} else break handle_stop;

					if ( this.clampWhenFinished ) this.paused = true;
					else this.enabled = false;

					this._mixer.dispatchEvent( {
						type: 'finished', action: this,
						direction: deltaTime < 0 ? - 1 : 1
					} );

				}

			} else { // repetitive Repeat or PingPong

				var pingPong = ( loop === LoopPingPong );

				if ( loopCount === - 1 ) {

					// just started

					if ( deltaTime >= 0 ) {

						loopCount = 0;

						this._setEndings( true, this.repetitions === 0, pingPong );

					} else {

						// when looping in reverse direction, the initial
						// transition through zero counts as a repetition,
						// so leave loopCount at -1

						this._setEndings( this.repetitions === 0, true, pingPong );

					}

				}

				if ( time >= duration || time < 0 ) {

					// wrap around

					var loopDelta = Math.floor( time / duration ); // signed
					time -= duration * loopDelta;

					loopCount += Math.abs( loopDelta );

					var pending = this.repetitions - loopCount;

					if ( pending < 0 ) {

						// have to stop (switch state, clamp time, fire event)

						if ( this.clampWhenFinished ) this.paused = true;
						else this.enabled = false;

						time = deltaTime > 0 ? duration : 0;

						this._mixer.dispatchEvent( {
							type: 'finished', action: this,
							direction: deltaTime > 0 ? 1 : - 1
						} );

					} else {

						// keep running

						if ( pending === 0 ) {

							// entering the last round

							var atStart = deltaTime < 0;
							this._setEndings( atStart, ! atStart, pingPong );

						} else {

							this._setEndings( false, false, pingPong );

						}

						this._loopCount = loopCount;

						this._mixer.dispatchEvent( {
							type: 'loop', action: this, loopDelta: loopDelta
						} );

					}

				}

				if ( pingPong && ( loopCount & 1 ) === 1 ) {

					// invert time for the "pong round"

					this.time = time;
					return duration - time;

				}

			}

			this.time = time;
			return time;

		},

		_setEndings: function ( atStart, atEnd, pingPong ) {

			var settings = this._interpolantSettings;

			if ( pingPong ) {

				settings.endingStart 	= ZeroSlopeEnding;
				settings.endingEnd		= ZeroSlopeEnding;

			} else {

				// assuming for LoopOnce atStart == atEnd == true

				if ( atStart ) {

					settings.endingStart = this.zeroSlopeAtStart ? ZeroSlopeEnding : ZeroCurvatureEnding;

				} else {

					settings.endingStart = WrapAroundEnding;

				}

				if ( atEnd ) {

					settings.endingEnd = this.zeroSlopeAtEnd ? ZeroSlopeEnding : ZeroCurvatureEnding;

				} else {

					settings.endingEnd 	 = WrapAroundEnding;

				}

			}

		},

		_scheduleFading: function ( duration, weightNow, weightThen ) {

			var mixer = this._mixer, now = mixer.time,
				interpolant = this._weightInterpolant;

			if ( interpolant === null ) {

				interpolant = mixer._lendControlInterpolant();
				this._weightInterpolant = interpolant;

			}

			var times = interpolant.parameterPositions,
				values = interpolant.sampleValues;

			times[ 0 ] = now; 				values[ 0 ] = weightNow;
			times[ 1 ] = now + duration;	values[ 1 ] = weightThen;

			return this;

		}

	} );

	// Characters [].:/ are reserved for track binding syntax.
	var RESERVED_CHARS_RE = '\\[\\]\\.:\\/';

	function Composite( targetGroup, path, optionalParsedPath ) {

		var parsedPath = optionalParsedPath || PropertyBinding.parseTrackName( path );

		this._targetGroup = targetGroup;
		this._bindings = targetGroup.subscribe_( path, parsedPath );

	}

	Object.assign( Composite.prototype, {

		getValue: function ( array, offset ) {

			this.bind(); // bind all binding

			var firstValidIndex = this._targetGroup.nCachedObjects_,
				binding = this._bindings[ firstValidIndex ];

			// and only call .getValue on the first
			if ( binding !== undefined ) binding.getValue( array, offset );

		},

		setValue: function ( array, offset ) {

			var bindings = this._bindings;

			for ( var i = this._targetGroup.nCachedObjects_,
					  n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].setValue( array, offset );

			}

		},

		bind: function () {

			var bindings = this._bindings;

			for ( var i = this._targetGroup.nCachedObjects_,
					  n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].bind();

			}

		},

		unbind: function () {

			var bindings = this._bindings;

			for ( var i = this._targetGroup.nCachedObjects_,
					  n = bindings.length; i !== n; ++ i ) {

				bindings[ i ].unbind();

			}

		}

	} );


	function PropertyBinding( rootNode, path, parsedPath ) {

		this.path = path;
		this.parsedPath = parsedPath || PropertyBinding.parseTrackName( path );

		this.node = PropertyBinding.findNode( rootNode, this.parsedPath.nodeName ) || rootNode;

		this.rootNode = rootNode;

	}

	Object.assign( PropertyBinding, {

		Composite: Composite,

		create: function ( root, path, parsedPath ) {

			if ( ! ( root && root.isAnimationObjectGroup ) ) {

				return new PropertyBinding( root, path, parsedPath );

			} else {

				return new PropertyBinding.Composite( root, path, parsedPath );

			}

		},

		
		sanitizeNodeName: ( function () {

			var reservedRe = new RegExp( '[' + RESERVED_CHARS_RE + ']', 'g' );

			return function sanitizeNodeName( name ) {

				return name.replace( /\s/g, '_' ).replace( reservedRe, '' );

			};

		}() ),

		parseTrackName: function () {

			// Attempts to allow node names from any language. ES5's `\w` regexp matches
			// only latin characters, and the unicode \p{L} is not yet supported. So
			// instead, we exclude reserved characters and match everything else.
			var wordChar = '[^' + RESERVED_CHARS_RE + ']';
			var wordCharOrDot = '[^' + RESERVED_CHARS_RE.replace( '\\.', '' ) + ']';

			// Parent directories, delimited by '/' or ':'. Currently unused, but must
			// be matched to parse the rest of the track name.
			var directoryRe = /((?:WC+[\/:])*)/.source.replace( 'WC', wordChar );

			// Target node. May contain word characters (a-zA-Z0-9_) and '.' or '-'.
			var nodeRe = /(WCOD+)?/.source.replace( 'WCOD', wordCharOrDot );

			// Object on target node, and accessor. May not contain reserved
			// characters. Accessor may contain any character except closing bracket.
			var objectRe = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace( 'WC', wordChar );

			// Property and accessor. May not contain reserved characters. Accessor may
			// contain any non-bracket characters.
			var propertyRe = /\.(WC+)(?:\[(.+)\])?/.source.replace( 'WC', wordChar );

			var trackRe = new RegExp( ''
				+ '^'
				+ directoryRe
				+ nodeRe
				+ objectRe
				+ propertyRe
				+ '$'
			);

			var supportedObjectNames = [ 'material', 'materials', 'bones' ];

			return function parseTrackName( trackName ) {

				var matches = trackRe.exec( trackName );

				if ( ! matches ) {

					throw new Error( 'PropertyBinding: Cannot parse trackName: ' + trackName );

				}

				var results = {
					// directoryName: matches[ 1 ], // (tschw) currently unused
					nodeName: matches[ 2 ],
					objectName: matches[ 3 ],
					objectIndex: matches[ 4 ],
					propertyName: matches[ 5 ], // required
					propertyIndex: matches[ 6 ]
				};

				var lastDot = results.nodeName && results.nodeName.lastIndexOf( '.' );

				if ( lastDot !== undefined && lastDot !== - 1 ) {

					var objectName = results.nodeName.substring( lastDot + 1 );

					// Object names must be checked against a whitelist. Otherwise, there
					// is no way to parse 'foo.bar.baz': 'baz' must be a property, but
					// 'bar' could be the objectName, or part of a nodeName (which can
					// include '.' characters).
					if ( supportedObjectNames.indexOf( objectName ) !== - 1 ) {

						results.nodeName = results.nodeName.substring( 0, lastDot );
						results.objectName = objectName;

					}

				}

				if ( results.propertyName === null || results.propertyName.length === 0 ) {

					throw new Error( 'PropertyBinding: can not parse propertyName from trackName: ' + trackName );

				}

				return results;

			};

		}(),

		findNode: function ( root, nodeName ) {

			if ( ! nodeName || nodeName === "" || nodeName === "root" || nodeName === "." || nodeName === - 1 || nodeName === root.name || nodeName === root.uuid ) {

				return root;

			}

			// search into skeleton bones.
			if ( root.skeleton ) {

				var bone = root.skeleton.getBoneByName( nodeName );

				if ( bone !== undefined ) {

					return bone;

				}

			}

			// search into node subtree.
			if ( root.children ) {

				var searchNodeSubtree = function ( children ) {

					for ( var i = 0; i < children.length; i ++ ) {

						var childNode = children[ i ];

						if ( childNode.name === nodeName || childNode.uuid === nodeName ) {

							return childNode;

						}

						var result = searchNodeSubtree( childNode.children );

						if ( result ) return result;

					}

					return null;

				};

				var subTreeNode = searchNodeSubtree( root.children );

				if ( subTreeNode ) {

					return subTreeNode;

				}

			}

			return null;

		}

	} );

	Object.assign( PropertyBinding.prototype, { // prototype, continued

		// these are used to "bind" a nonexistent property
		_getValue_unavailable: function () {},
		_setValue_unavailable: function () {},

		BindingType: {
			Direct: 0,
			EntireArray: 1,
			ArrayElement: 2,
			HasFromToArray: 3
		},

		Versioning: {
			None: 0,
			NeedsUpdate: 1,
			MatrixWorldNeedsUpdate: 2
		},

		GetterByBindingType: [

			function getValue_direct( buffer, offset ) {

				buffer[ offset ] = this.node[ this.propertyName ];

			},

			function getValue_array( buffer, offset ) {

				var source = this.resolvedProperty;

				for ( var i = 0, n = source.length; i !== n; ++ i ) {

					buffer[ offset ++ ] = source[ i ];

				}

			},

			function getValue_arrayElement( buffer, offset ) {

				buffer[ offset ] = this.resolvedProperty[ this.propertyIndex ];

			},

			function getValue_toArray( buffer, offset ) {

				this.resolvedProperty.toArray( buffer, offset );

			}

		],

		SetterByBindingTypeAndVersioning: [

			[
				// Direct

				function setValue_direct( buffer, offset ) {

					this.targetObject[ this.propertyName ] = buffer[ offset ];

				},

				function setValue_direct_setNeedsUpdate( buffer, offset ) {

					this.targetObject[ this.propertyName ] = buffer[ offset ];
					this.targetObject.needsUpdate = true;

				},

				function setValue_direct_setMatrixWorldNeedsUpdate( buffer, offset ) {

					this.targetObject[ this.propertyName ] = buffer[ offset ];
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			], [

				// EntireArray

				function setValue_array( buffer, offset ) {

					var dest = this.resolvedProperty;

					for ( var i = 0, n = dest.length; i !== n; ++ i ) {

						dest[ i ] = buffer[ offset ++ ];

					}

				},

				function setValue_array_setNeedsUpdate( buffer, offset ) {

					var dest = this.resolvedProperty;

					for ( var i = 0, n = dest.length; i !== n; ++ i ) {

						dest[ i ] = buffer[ offset ++ ];

					}

					this.targetObject.needsUpdate = true;

				},

				function setValue_array_setMatrixWorldNeedsUpdate( buffer, offset ) {

					var dest = this.resolvedProperty;

					for ( var i = 0, n = dest.length; i !== n; ++ i ) {

						dest[ i ] = buffer[ offset ++ ];

					}

					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			], [

				// ArrayElement

				function setValue_arrayElement( buffer, offset ) {

					this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];

				},

				function setValue_arrayElement_setNeedsUpdate( buffer, offset ) {

					this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
					this.targetObject.needsUpdate = true;

				},

				function setValue_arrayElement_setMatrixWorldNeedsUpdate( buffer, offset ) {

					this.resolvedProperty[ this.propertyIndex ] = buffer[ offset ];
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			], [

				// HasToFromArray

				function setValue_fromArray( buffer, offset ) {

					this.resolvedProperty.fromArray( buffer, offset );

				},

				function setValue_fromArray_setNeedsUpdate( buffer, offset ) {

					this.resolvedProperty.fromArray( buffer, offset );
					this.targetObject.needsUpdate = true;

				},

				function setValue_fromArray_setMatrixWorldNeedsUpdate( buffer, offset ) {

					this.resolvedProperty.fromArray( buffer, offset );
					this.targetObject.matrixWorldNeedsUpdate = true;

				}

			]

		],

		getValue: function getValue_unbound( targetArray, offset ) {

			this.bind();
			this.getValue( targetArray, offset );

			// Note: This class uses a State pattern on a per-method basis:
			// 'bind' sets 'this.getValue' / 'setValue' and shadows the
			// prototype version of these methods with one that represents
			// the bound state. When the property is not found, the methods
			// become no-ops.

		},

		setValue: function getValue_unbound( sourceArray, offset ) {

			this.bind();
			this.setValue( sourceArray, offset );

		},

		// create getter / setter pair for a property in the scene graph
		bind: function () {

			var targetObject = this.node,
				parsedPath = this.parsedPath,

				objectName = parsedPath.objectName,
				propertyName = parsedPath.propertyName,
				propertyIndex = parsedPath.propertyIndex;

			if ( ! targetObject ) {

				targetObject = PropertyBinding.findNode( this.rootNode, parsedPath.nodeName ) || this.rootNode;

				this.node = targetObject;

			}

			// set fail state so we can just 'return' on error
			this.getValue = this._getValue_unavailable;
			this.setValue = this._setValue_unavailable;

			// ensure there is a value node
			if ( ! targetObject ) {

				console.error( 'PropertyBinding: Trying to update node for track: ' + this.path + ' but it wasn\'t found.' );
				return;

			}

			if ( objectName ) {

				var objectIndex = parsedPath.objectIndex;

				// special cases were we need to reach deeper into the hierarchy to get the face materials....
				switch ( objectName ) {

					case 'materials':

						if ( ! targetObject.material ) {

							console.error( 'PropertyBinding: Can not bind to material as node does not have a material.', this );
							return;

						}

						if ( ! targetObject.material.materials ) {

							console.error( 'PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.', this );
							return;

						}

						targetObject = targetObject.material.materials;

						break;

					case 'bones':

						if ( ! targetObject.skeleton ) {

							console.error( 'PropertyBinding: Can not bind to bones as node does not have a skeleton.', this );
							return;

						}

						// potential future optimization: skip this if propertyIndex is already an integer
						// and convert the integer string to a true integer.

						targetObject = targetObject.skeleton.bones;

						// support resolving morphTarget names into indices.
						for ( var i = 0; i < targetObject.length; i ++ ) {

							if ( targetObject[ i ].name === objectIndex ) {

								objectIndex = i;
								break;

							}

						}

						break;

					default:

						if ( targetObject[ objectName ] === undefined ) {

							console.error( 'PropertyBinding: Can not bind to objectName of node undefined.', this );
							return;

						}

						targetObject = targetObject[ objectName ];

				}


				if ( objectIndex !== undefined ) {

					if ( targetObject[ objectIndex ] === undefined ) {

						console.error( 'PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.', this, targetObject );
						return;

					}

					targetObject = targetObject[ objectIndex ];

				}

			}

			// resolve property
			var nodeProperty = targetObject[ propertyName ];

			if ( nodeProperty === undefined ) {

				var nodeName = parsedPath.nodeName;

				console.error( 'PropertyBinding: Trying to update property for track: ' + nodeName +
					'.' + propertyName + ' but it wasn\'t found.', targetObject );
				return;

			}

			// determine versioning scheme
			var versioning = this.Versioning.None;

			if ( targetObject.needsUpdate !== undefined ) { // material

				versioning = this.Versioning.NeedsUpdate;
				this.targetObject = targetObject;

			} else if ( targetObject.matrixWorldNeedsUpdate !== undefined ) { // node transform

				versioning = this.Versioning.MatrixWorldNeedsUpdate;
				this.targetObject = targetObject;

			}

			// determine how the property gets bound
			var bindingType = this.BindingType.Direct;

			if ( propertyIndex !== undefined ) {

				// access a sub element of the property array (only primitives are supported right now)

				if ( propertyName === "morphTargetInfluences" ) {

					// potential optimization, skip this if propertyIndex is already an integer, and convert the integer string to a true integer.

					// support resolving morphTarget names into indices.
					if ( ! targetObject.geometry ) {

						console.error( 'PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.', this );
						return;

					}

					if ( targetObject.geometry.isBufferGeometry ) {

						if ( ! targetObject.geometry.morphAttributes ) {

							console.error( 'PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.', this );
							return;

						}

						for ( var i = 0; i < this.node.geometry.morphAttributes.position.length; i ++ ) {

							if ( targetObject.geometry.morphAttributes.position[ i ].name === propertyIndex ) {

								propertyIndex = i;
								break;

							}

						}


					} else {

						if ( ! targetObject.geometry.morphTargets ) {

							console.error( 'PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphTargets.', this );
							return;

						}

						for ( var i = 0; i < this.node.geometry.morphTargets.length; i ++ ) {

							if ( targetObject.geometry.morphTargets[ i ].name === propertyIndex ) {

								propertyIndex = i;
								break;

							}

						}

					}

				}

				bindingType = this.BindingType.ArrayElement;

				this.resolvedProperty = nodeProperty;
				this.propertyIndex = propertyIndex;

			} else if ( nodeProperty.fromArray !== undefined && nodeProperty.toArray !== undefined ) {

				// must use copy for Object3D.Euler/Quaternion

				bindingType = this.BindingType.HasFromToArray;

				this.resolvedProperty = nodeProperty;

			} else if ( Array.isArray( nodeProperty ) ) {

				bindingType = this.BindingType.EntireArray;

				this.resolvedProperty = nodeProperty;

			} else {

				this.propertyName = propertyName;

			}

			// select getter / setter
			this.getValue = this.GetterByBindingType[ bindingType ];
			this.setValue = this.SetterByBindingTypeAndVersioning[ bindingType ][ versioning ];

		},

		unbind: function () {

			this.node = null;

			// back to the prototype version of getValue / setValue
			// note: avoiding to mutate the shape of 'this' via 'delete'
			this.getValue = this._getValue_unbound;
			this.setValue = this._setValue_unbound;

		}

	} );

	//!\ DECLARE ALIAS AFTER assign prototype !
	Object.assign( PropertyBinding.prototype, {

		// initial state of these methods that calls 'bind'
		_getValue_unbound: PropertyBinding.prototype.getValue,
		_setValue_unbound: PropertyBinding.prototype.setValue,

	} );

	function PropertyMixer( binding, typeName, valueSize ) {

		this.binding = binding;
		this.valueSize = valueSize;

		var bufferType = Float64Array,
			mixFunction;

		switch ( typeName ) {

			case 'quaternion':
				mixFunction = this._slerp;
				break;

			case 'string':
			case 'bool':
				bufferType = Array;
				mixFunction = this._select;
				break;

			default:
				mixFunction = this._lerp;

		}

		this.buffer = new bufferType( valueSize * 4 );
		// layout: [ incoming | accu0 | accu1 | orig ]
		//
		// interpolators can use .buffer as their .result
		// the data then goes to 'incoming'
		//
		// 'accu0' and 'accu1' are used frame-interleaved for
		// the cumulative result and are compared to detect
		// changes
		//
		// 'orig' stores the original state of the property

		this._mixBufferRegion = mixFunction;

		this.cumulativeWeight = 0;

		this.useCount = 0;
		this.referenceCount = 0;

	}

	Object.assign( PropertyMixer.prototype, {

		// accumulate data in the 'incoming' region into 'accu<i>'
		accumulate: function ( accuIndex, weight ) {

			// note: happily accumulating nothing when weight = 0, the caller knows
			// the weight and shouldn't have made the call in the first place

			var buffer = this.buffer,
				stride = this.valueSize,
				offset = accuIndex * stride + stride,

				currentWeight = this.cumulativeWeight;

			if ( currentWeight === 0 ) {

				// accuN := incoming * weight

				for ( var i = 0; i !== stride; ++ i ) {

					buffer[ offset + i ] = buffer[ i ];

				}

				currentWeight = weight;

			} else {

				// accuN := accuN + incoming * weight

				currentWeight += weight;
				var mix = weight / currentWeight;
				this._mixBufferRegion( buffer, offset, 0, mix, stride );

			}

			this.cumulativeWeight = currentWeight;

		},

		// apply the state of 'accu<i>' to the binding when accus differ
		apply: function ( accuIndex ) {

			var stride = this.valueSize,
				buffer = this.buffer,
				offset = accuIndex * stride + stride,

				weight = this.cumulativeWeight,

				binding = this.binding;

			this.cumulativeWeight = 0;

			if ( weight < 1 ) {

				// accuN := accuN + original * ( 1 - cumulativeWeight )

				var originalValueOffset = stride * 3;

				this._mixBufferRegion(
					buffer, offset, originalValueOffset, 1 - weight, stride );

			}

			for ( var i = stride, e = stride + stride; i !== e; ++ i ) {

				if ( buffer[ i ] !== buffer[ i + stride ] ) {

					// value has changed -> update scene graph

					binding.setValue( buffer, offset );
					break;

				}

			}

		},

		// remember the state of the bound property and copy it to both accus
		saveOriginalState: function () {

			var binding = this.binding;

			var buffer = this.buffer,
				stride = this.valueSize,

				originalValueOffset = stride * 3;

			binding.getValue( buffer, originalValueOffset );

			// accu[0..1] := orig -- initially detect changes against the original
			for ( var i = stride, e = originalValueOffset; i !== e; ++ i ) {

				buffer[ i ] = buffer[ originalValueOffset + ( i % stride ) ];

			}

			this.cumulativeWeight = 0;

		},

		// apply the state previously taken via 'saveOriginalState' to the binding
		restoreOriginalState: function () {

			var originalValueOffset = this.valueSize * 3;
			this.binding.setValue( this.buffer, originalValueOffset );

		},


		// mix functions

		_select: function ( buffer, dstOffset, srcOffset, t, stride ) {

			if ( t >= 0.5 ) {

				for ( var i = 0; i !== stride; ++ i ) {

					buffer[ dstOffset + i ] = buffer[ srcOffset + i ];

				}

			}

		},

		_slerp: function ( buffer, dstOffset, srcOffset, t ) {

			Quaternion.slerpFlat( buffer, dstOffset, buffer, dstOffset, buffer, srcOffset, t );

		},

		_lerp: function ( buffer, dstOffset, srcOffset, t, stride ) {

			var s = 1 - t;

			for ( var i = 0; i !== stride; ++ i ) {

				var j = dstOffset + i;

				buffer[ j ] = buffer[ j ] * s + buffer[ srcOffset + i ] * t;

			}

		}

	} );

	function AnimationMixer( root ) {

		this._root = root;
		this._initMemoryManager();
		this._accuIndex = 0;

		this.time = 0;

		this.timeScale = 1.0;

	}

	AnimationMixer.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {

		constructor: AnimationMixer,

		_bindAction: function ( action, prototypeAction ) {

			var root = action._localRoot || this._root,
				tracks = action._clip.tracks,
				nTracks = tracks.length,
				bindings = action._propertyBindings,
				interpolants = action._interpolants,
				rootUuid = root.uuid,
				bindingsByRoot = this._bindingsByRootAndName,
				bindingsByName = bindingsByRoot[ rootUuid ];

			if ( bindingsByName === undefined ) {

				bindingsByName = {};
				bindingsByRoot[ rootUuid ] = bindingsByName;

			}

			for ( var i = 0; i !== nTracks; ++ i ) {

				var track = tracks[ i ],
					trackName = track.name,
					binding = bindingsByName[ trackName ];

				if ( binding !== undefined ) {

					bindings[ i ] = binding;

				} else {

					binding = bindings[ i ];

					if ( binding !== undefined ) {

						// existing binding, make sure the cache knows

						if ( binding._cacheIndex === null ) {

							++ binding.referenceCount;
							this._addInactiveBinding( binding, rootUuid, trackName );

						}

						continue;

					}

					var path = prototypeAction && prototypeAction.
						_propertyBindings[ i ].binding.parsedPath;

					binding = new PropertyMixer(
						PropertyBinding.create( root, trackName, path ),
						track.ValueTypeName, track.getValueSize() );

					++ binding.referenceCount;
					this._addInactiveBinding( binding, rootUuid, trackName );

					bindings[ i ] = binding;

				}

				interpolants[ i ].resultBuffer = binding.buffer;

			}

		},

		_activateAction: function ( action ) {

			if ( ! this._isActiveAction( action ) ) {

				if ( action._cacheIndex === null ) {

					// this action has been forgotten by the cache, but the user
					// appears to be still using it -> rebind

					var rootUuid = ( action._localRoot || this._root ).uuid,
						clipUuid = action._clip.uuid,
						actionsForClip = this._actionsByClip[ clipUuid ];

					this._bindAction( action,
						actionsForClip && actionsForClip.knownActions[ 0 ] );

					this._addInactiveAction( action, clipUuid, rootUuid );

				}

				var bindings = action._propertyBindings;

				// increment reference counts / sort out state
				for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

					var binding = bindings[ i ];

					if ( binding.useCount ++ === 0 ) {

						this._lendBinding( binding );
						binding.saveOriginalState();

					}

				}

				this._lendAction( action );

			}

		},

		_deactivateAction: function ( action ) {

			if ( this._isActiveAction( action ) ) {

				var bindings = action._propertyBindings;

				// decrement reference counts / sort out state
				for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

					var binding = bindings[ i ];

					if ( -- binding.useCount === 0 ) {

						binding.restoreOriginalState();
						this._takeBackBinding( binding );

					}

				}

				this._takeBackAction( action );

			}

		},

		// Memory manager

		_initMemoryManager: function () {

			this._actions = []; // 'nActiveActions' followed by inactive ones
			this._nActiveActions = 0;

			this._actionsByClip = {};
			// inside:
			// {
			// 		knownActions: Array< AnimationAction >	- used as prototypes
			// 		actionByRoot: AnimationAction			- lookup
			// }


			this._bindings = []; // 'nActiveBindings' followed by inactive ones
			this._nActiveBindings = 0;

			this._bindingsByRootAndName = {}; // inside: Map< name, PropertyMixer >


			this._controlInterpolants = []; // same game as above
			this._nActiveControlInterpolants = 0;

			var scope = this;

			this.stats = {

				actions: {
					get total() {

						return scope._actions.length;

					},
					get inUse() {

						return scope._nActiveActions;

					}
				},
				bindings: {
					get total() {

						return scope._bindings.length;

					},
					get inUse() {

						return scope._nActiveBindings;

					}
				},
				controlInterpolants: {
					get total() {

						return scope._controlInterpolants.length;

					},
					get inUse() {

						return scope._nActiveControlInterpolants;

					}
				}

			};

		},

		// Memory management for AnimationAction objects

		_isActiveAction: function ( action ) {

			var index = action._cacheIndex;
			return index !== null && index < this._nActiveActions;

		},

		_addInactiveAction: function ( action, clipUuid, rootUuid ) {

			var actions = this._actions,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[ clipUuid ];

			if ( actionsForClip === undefined ) {

				actionsForClip = {

					knownActions: [ action ],
					actionByRoot: {}

				};

				action._byClipCacheIndex = 0;

				actionsByClip[ clipUuid ] = actionsForClip;

			} else {

				var knownActions = actionsForClip.knownActions;

				action._byClipCacheIndex = knownActions.length;
				knownActions.push( action );

			}

			action._cacheIndex = actions.length;
			actions.push( action );

			actionsForClip.actionByRoot[ rootUuid ] = action;

		},

		_removeInactiveAction: function ( action ) {

			var actions = this._actions,
				lastInactiveAction = actions[ actions.length - 1 ],
				cacheIndex = action._cacheIndex;

			lastInactiveAction._cacheIndex = cacheIndex;
			actions[ cacheIndex ] = lastInactiveAction;
			actions.pop();

			action._cacheIndex = null;


			var clipUuid = action._clip.uuid,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[ clipUuid ],
				knownActionsForClip = actionsForClip.knownActions,

				lastKnownAction =
					knownActionsForClip[ knownActionsForClip.length - 1 ],

				byClipCacheIndex = action._byClipCacheIndex;

			lastKnownAction._byClipCacheIndex = byClipCacheIndex;
			knownActionsForClip[ byClipCacheIndex ] = lastKnownAction;
			knownActionsForClip.pop();

			action._byClipCacheIndex = null;


			var actionByRoot = actionsForClip.actionByRoot,
				rootUuid = ( action._localRoot || this._root ).uuid;

			delete actionByRoot[ rootUuid ];

			if ( knownActionsForClip.length === 0 ) {

				delete actionsByClip[ clipUuid ];

			}

			this._removeInactiveBindingsForAction( action );

		},

		_removeInactiveBindingsForAction: function ( action ) {

			var bindings = action._propertyBindings;
			for ( var i = 0, n = bindings.length; i !== n; ++ i ) {

				var binding = bindings[ i ];

				if ( -- binding.referenceCount === 0 ) {

					this._removeInactiveBinding( binding );

				}

			}

		},

		_lendAction: function ( action ) {

			// [ active actions |  inactive actions  ]
			// [  active actions >| inactive actions ]
			//                 s        a
			//                  <-swap->
			//                 a        s

			var actions = this._actions,
				prevIndex = action._cacheIndex,

				lastActiveIndex = this._nActiveActions ++,

				firstInactiveAction = actions[ lastActiveIndex ];

			action._cacheIndex = lastActiveIndex;
			actions[ lastActiveIndex ] = action;

			firstInactiveAction._cacheIndex = prevIndex;
			actions[ prevIndex ] = firstInactiveAction;

		},

		_takeBackAction: function ( action ) {

			// [  active actions  | inactive actions ]
			// [ active actions |< inactive actions  ]
			//        a        s
			//         <-swap->
			//        s        a

			var actions = this._actions,
				prevIndex = action._cacheIndex,

				firstInactiveIndex = -- this._nActiveActions,

				lastActiveAction = actions[ firstInactiveIndex ];

			action._cacheIndex = firstInactiveIndex;
			actions[ firstInactiveIndex ] = action;

			lastActiveAction._cacheIndex = prevIndex;
			actions[ prevIndex ] = lastActiveAction;

		},

		// Memory management for PropertyMixer objects

		_addInactiveBinding: function ( binding, rootUuid, trackName ) {

			var bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[ rootUuid ],

				bindings = this._bindings;

			if ( bindingByName === undefined ) {

				bindingByName = {};
				bindingsByRoot[ rootUuid ] = bindingByName;

			}

			bindingByName[ trackName ] = binding;

			binding._cacheIndex = bindings.length;
			bindings.push( binding );

		},

		_removeInactiveBinding: function ( binding ) {

			var bindings = this._bindings,
				propBinding = binding.binding,
				rootUuid = propBinding.rootNode.uuid,
				trackName = propBinding.path,
				bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[ rootUuid ],

				lastInactiveBinding = bindings[ bindings.length - 1 ],
				cacheIndex = binding._cacheIndex;

			lastInactiveBinding._cacheIndex = cacheIndex;
			bindings[ cacheIndex ] = lastInactiveBinding;
			bindings.pop();

			delete bindingByName[ trackName ];

			remove_empty_map: {

				for ( var _ in bindingByName ) break remove_empty_map; // eslint-disable-line no-unused-vars

				delete bindingsByRoot[ rootUuid ];

			}

		},

		_lendBinding: function ( binding ) {

			var bindings = this._bindings,
				prevIndex = binding._cacheIndex,

				lastActiveIndex = this._nActiveBindings ++,

				firstInactiveBinding = bindings[ lastActiveIndex ];

			binding._cacheIndex = lastActiveIndex;
			bindings[ lastActiveIndex ] = binding;

			firstInactiveBinding._cacheIndex = prevIndex;
			bindings[ prevIndex ] = firstInactiveBinding;

		},

		_takeBackBinding: function ( binding ) {

			var bindings = this._bindings,
				prevIndex = binding._cacheIndex,

				firstInactiveIndex = -- this._nActiveBindings,

				lastActiveBinding = bindings[ firstInactiveIndex ];

			binding._cacheIndex = firstInactiveIndex;
			bindings[ firstInactiveIndex ] = binding;

			lastActiveBinding._cacheIndex = prevIndex;
			bindings[ prevIndex ] = lastActiveBinding;

		},


		// Memory management of Interpolants for weight and time scale

		_lendControlInterpolant: function () {

			var interpolants = this._controlInterpolants,
				lastActiveIndex = this._nActiveControlInterpolants ++,
				interpolant = interpolants[ lastActiveIndex ];

			if ( interpolant === undefined ) {

				interpolant = new LinearInterpolant(
					new Float32Array( 2 ), new Float32Array( 2 ),
					1, this._controlInterpolantsResultBuffer );

				interpolant.__cacheIndex = lastActiveIndex;
				interpolants[ lastActiveIndex ] = interpolant;

			}

			return interpolant;

		},

		_takeBackControlInterpolant: function ( interpolant ) {

			var interpolants = this._controlInterpolants,
				prevIndex = interpolant.__cacheIndex,

				firstInactiveIndex = -- this._nActiveControlInterpolants,

				lastActiveInterpolant = interpolants[ firstInactiveIndex ];

			interpolant.__cacheIndex = firstInactiveIndex;
			interpolants[ firstInactiveIndex ] = interpolant;

			lastActiveInterpolant.__cacheIndex = prevIndex;
			interpolants[ prevIndex ] = lastActiveInterpolant;

		},

		_controlInterpolantsResultBuffer: new Float32Array( 1 ),

		// return an action for a clip optionally using a custom root target
		// object (this method allocates a lot of dynamic memory in case a
		// previously unknown clip/root combination is specified)
		clipAction: function ( clip, optionalRoot ) {

			var root = optionalRoot || this._root,
				rootUuid = root.uuid,

				clipObject = typeof clip === 'string' ?
					AnimationClip.findByName( root, clip ) : clip,

				clipUuid = clipObject !== null ? clipObject.uuid : clip,

				actionsForClip = this._actionsByClip[ clipUuid ],
				prototypeAction = null;

			if ( actionsForClip !== undefined ) {

				var existingAction =
						actionsForClip.actionByRoot[ rootUuid ];

				if ( existingAction !== undefined ) {

					return existingAction;

				}

				// we know the clip, so we don't have to parse all
				// the bindings again but can just copy
				prototypeAction = actionsForClip.knownActions[ 0 ];

				// also, take the clip from the prototype action
				if ( clipObject === null )
					clipObject = prototypeAction._clip;

			}

			// clip must be known when specified via string
			if ( clipObject === null ) return null;

			// allocate all resources required to run it
			var newAction = new AnimationAction( this, clipObject, optionalRoot );

			this._bindAction( newAction, prototypeAction );

			// and make the action known to the memory manager
			this._addInactiveAction( newAction, clipUuid, rootUuid );

			return newAction;

		},

		// get an existing action
		existingAction: function ( clip, optionalRoot ) {

			var root = optionalRoot || this._root,
				rootUuid = root.uuid,

				clipObject = typeof clip === 'string' ?
					AnimationClip.findByName( root, clip ) : clip,

				clipUuid = clipObject ? clipObject.uuid : clip,

				actionsForClip = this._actionsByClip[ clipUuid ];

			if ( actionsForClip !== undefined ) {

				return actionsForClip.actionByRoot[ rootUuid ] || null;

			}

			return null;

		},

		// deactivates all previously scheduled actions
		stopAllAction: function () {

			var actions = this._actions,
				nActions = this._nActiveActions,
				bindings = this._bindings,
				nBindings = this._nActiveBindings;

			this._nActiveActions = 0;
			this._nActiveBindings = 0;

			for ( var i = 0; i !== nActions; ++ i ) {

				actions[ i ].reset();

			}

			for ( var i = 0; i !== nBindings; ++ i ) {

				bindings[ i ].useCount = 0;

			}

			return this;

		},

		// advance the time and update apply the animation
		update: function ( deltaTime ) {

			deltaTime *= this.timeScale;

			var actions = this._actions,
				nActions = this._nActiveActions,

				time = this.time += deltaTime,
				timeDirection = Math.sign( deltaTime ),

				accuIndex = this._accuIndex ^= 1;

			// run active actions

			for ( var i = 0; i !== nActions; ++ i ) {

				var action = actions[ i ];

				action._update( time, deltaTime, timeDirection, accuIndex );

			}

			// update scene graph

			var bindings = this._bindings,
				nBindings = this._nActiveBindings;

			for ( var i = 0; i !== nBindings; ++ i ) {

				bindings[ i ].apply( accuIndex );

			}

			return this;

		},

		// return this mixer's root target object
		getRoot: function () {

			return this._root;

		},

		// free all resources specific to a particular clip
		uncacheClip: function ( clip ) {

			var actions = this._actions,
				clipUuid = clip.uuid,
				actionsByClip = this._actionsByClip,
				actionsForClip = actionsByClip[ clipUuid ];

			if ( actionsForClip !== undefined ) {

				// note: just calling _removeInactiveAction would mess up the
				// iteration state and also require updating the state we can
				// just throw away

				var actionsToRemove = actionsForClip.knownActions;

				for ( var i = 0, n = actionsToRemove.length; i !== n; ++ i ) {

					var action = actionsToRemove[ i ];

					this._deactivateAction( action );

					var cacheIndex = action._cacheIndex,
						lastInactiveAction = actions[ actions.length - 1 ];

					action._cacheIndex = null;
					action._byClipCacheIndex = null;

					lastInactiveAction._cacheIndex = cacheIndex;
					actions[ cacheIndex ] = lastInactiveAction;
					actions.pop();

					this._removeInactiveBindingsForAction( action );

				}

				delete actionsByClip[ clipUuid ];

			}

		},

		// free all resources specific to a particular root target object
		uncacheRoot: function ( root ) {

			var rootUuid = root.uuid,
				actionsByClip = this._actionsByClip;

			for ( var clipUuid in actionsByClip ) {

				var actionByRoot = actionsByClip[ clipUuid ].actionByRoot,
					action = actionByRoot[ rootUuid ];

				if ( action !== undefined ) {

					this._deactivateAction( action );
					this._removeInactiveAction( action );

				}

			}

			var bindingsByRoot = this._bindingsByRootAndName,
				bindingByName = bindingsByRoot[ rootUuid ];

			if ( bindingByName !== undefined ) {

				for ( var trackName in bindingByName ) {

					var binding = bindingByName[ trackName ];
					binding.restoreOriginalState();
					this._removeInactiveBinding( binding );

				}

			}

		},

		// remove a targeted clip from the cache
		uncacheAction: function ( clip, optionalRoot ) {

			var action = this.existingAction( clip, optionalRoot );

			if ( action !== null ) {

				this._deactivateAction( action );
				this._removeInactiveAction( action );

			}

		}

	} );

	function LineBasicMaterial( parameters ) {

		Material.call( this );

		this.type = 'LineBasicMaterial';

		this.color = new Color( 0xffffff );

		this.linewidth = 1;
		this.linecap = 'round';
		this.linejoin = 'round';

		this.lights = false;

		this.setValues( parameters );

	}

	LineBasicMaterial.prototype = Object.create( Material.prototype );
	LineBasicMaterial.prototype.constructor = LineBasicMaterial;

	LineBasicMaterial.prototype.isLineBasicMaterial = true;

	LineBasicMaterial.prototype.copy = function ( source ) {

		Material.prototype.copy.call( this, source );

		this.color.copy( source.color );

		this.linewidth = source.linewidth;
		this.linecap = source.linecap;
		this.linejoin = source.linejoin;

		return this;

	};

	function Line( geometry, material, mode ) {

		if ( mode === 1 ) {

			console.error( 'Line: parameter LinePieces no longer supported. Created LineSegments instead.' );
			

		}

		Object3D.call( this );

		this.type = 'Line';

		this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
		this.material = material !== undefined ? material : new LineBasicMaterial( { color: Math.random() * 0xffffff } );

	}

	Line.prototype = Object.assign( Object.create( Object3D.prototype ), {

		constructor: Line,

		isLine: true,

		computeLineDistances: ( function () {

			var start = new Vector3();
			var end = new Vector3();

			return function computeLineDistances() {

				var geometry = this.geometry;

				if ( geometry.isBufferGeometry ) {

					// we assume non-indexed geometry

					if ( geometry.index === null ) {

						var positionAttribute = geometry.attributes.position;
						var lineDistances = [ 0 ];

						for ( var i = 1, l = positionAttribute.count; i < l; i ++ ) {

							start.fromBufferAttribute( positionAttribute, i - 1 );
							end.fromBufferAttribute( positionAttribute, i );

							lineDistances[ i ] = lineDistances[ i - 1 ];
							lineDistances[ i ] += start.distanceTo( end );

						}

						geometry.addAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

					} else {

						console.error( 'Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

					}

				} else if ( geometry.isGeometry ) {

					var vertices = geometry.vertices;
					var lineDistances = geometry.lineDistances;

					lineDistances[ 0 ] = 0;

					for ( var i = 1, l = vertices.length; i < l; i ++ ) {

						lineDistances[ i ] = lineDistances[ i - 1 ];
						lineDistances[ i ] += vertices[ i - 1 ].distanceTo( vertices[ i ] );

					}

				}

				return this;

			};

		}() ),

		raycast: ( function () {

			var inverseMatrix = new Matrix4();
			var ray = new Ray();
			var sphere = new Sphere();

			return function raycast( raycaster, intersects ) {

				var precision = raycaster.linePrecision;
				var precisionSq = precision * precision;

				var geometry = this.geometry;
				var matrixWorld = this.matrixWorld;

				// Checking boundingSphere distance to ray

				if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

				sphere.copy( geometry.boundingSphere );
				sphere.applyMatrix4( matrixWorld );

				if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

				//

				inverseMatrix.getInverse( matrixWorld );
				ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

				var vStart = new Vector3();
				var vEnd = new Vector3();
				var interSegment = new Vector3();
				var interRay = new Vector3();
				var step = ( this && this.isLineSegments ) ? 2 : 1;

				if ( geometry.isBufferGeometry ) {

					var index = geometry.index;
					var attributes = geometry.attributes;
					var positions = attributes.position.array;

					if ( index !== null ) {

						var indices = index.array;

						for ( var i = 0, l = indices.length - 1; i < l; i += step ) {

							var a = indices[ i ];
							var b = indices[ i + 1 ];

							vStart.fromArray( positions, a * 3 );
							vEnd.fromArray( positions, b * 3 );

							var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

							if ( distSq > precisionSq ) continue;

							interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

							var distance = raycaster.ray.origin.distanceTo( interRay );

							if ( distance < raycaster.near || distance > raycaster.far ) continue;

							intersects.push( {

								distance: distance,
								// What do we want? intersection point on the ray or on the segment??
								// point: raycaster.ray.at( distance ),
								point: interSegment.clone().applyMatrix4( this.matrixWorld ),
								index: i,
								face: null,
								faceIndex: null,
								object: this

							} );

						}

					} else {

						for ( var i = 0, l = positions.length / 3 - 1; i < l; i += step ) {

							vStart.fromArray( positions, 3 * i );
							vEnd.fromArray( positions, 3 * i + 3 );

							var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

							if ( distSq > precisionSq ) continue;

							interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

							var distance = raycaster.ray.origin.distanceTo( interRay );

							if ( distance < raycaster.near || distance > raycaster.far ) continue;

							intersects.push( {

								distance: distance,
								// What do we want? intersection point on the ray or on the segment??
								// point: raycaster.ray.at( distance ),
								point: interSegment.clone().applyMatrix4( this.matrixWorld ),
								index: i,
								face: null,
								faceIndex: null,
								object: this

							} );

						}

					}

				} else if ( geometry.isGeometry ) {

					var vertices = geometry.vertices;
					var nbVertices = vertices.length;

					for ( var i = 0; i < nbVertices - 1; i += step ) {

						var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

						if ( distSq > precisionSq ) continue;

						interRay.applyMatrix4( this.matrixWorld ); //Move back to world space for distance calculation

						var distance = raycaster.ray.origin.distanceTo( interRay );

						if ( distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4( this.matrixWorld ),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						} );

					}

				}

			};

		}() ),

		clone: function () {

			return new this.constructor( this.geometry, this.material ).copy( this );

		}

	} );

	var CCDIKSolver = function ( mesh ) {

		this.mesh = mesh;

		this._valid();

	};

	CCDIKSolver.prototype = {

		constructor: CCDIKSolver,

		_valid: function () {

			var iks = this.mesh.geometry.iks;
			var bones = this.mesh.skeleton.bones;

			for ( var i = 0, il = iks.length; i < il; i ++ ) {

				var ik = iks[ i ];

				var effector = bones[ ik.effector ];

				var links = ik.links;

				var link0, link1;

				link0 = effector;

				for ( var j = 0, jl = links.length; j < jl; j ++ ) {

					link1 = bones[ links[ j ].index ];

					if ( link0.parent !== link1 ) {

						console.warn( 'CCDIKSolver: bone ' + link0.name + ' is not the child of bone ' + link1.name );

					}

					link0 = link1;

				}

			}

		},

		
		_saveOriginalBonesInfo: function () {

			var bones = this.mesh.skeleton.bones;

			for ( var i = 0, il = bones.length; i < il; i ++ ) {

				var bone = bones[ i ];

				if ( bone.userData.ik === undefined ) bone.userData.ik = {};

				bone.userData.ik.originalMatrix = bone.matrix.toArray();

			}

		},

		update: function ( saveOriginalBones ) {

			var q = new Quaternion();

			var targetPos = new Vector3();
			var targetVec = new Vector3();
			var effectorPos = new Vector3();
			var effectorVec = new Vector3();
			var linkPos = new Vector3();
			var invLinkQ = new Quaternion();
			var linkScale = new Vector3();
			var axis = new Vector3();

			var bones = this.mesh.skeleton.bones;
			var iks = this.mesh.geometry.iks;

			var boneParams = this.mesh.geometry.bones;

			// for reference overhead reduction in loop
			var math = Math;

			this.mesh.updateMatrixWorld( true );

			if ( saveOriginalBones === true ) this._saveOriginalBonesInfo();

			for ( var i = 0, il = iks.length; i < il; i++ ) {

				var ik = iks[ i ];
				var effector = bones[ ik.effector ];
				var target = bones[ ik.target ];

				// don't use getWorldPosition() here for the performance
				// because it calls updateMatrixWorld( true ) inside.
				targetPos.setFromMatrixPosition( target.matrixWorld );

				var links = ik.links;
				var iteration = ik.iteration !== undefined ? ik.iteration : 1;

				for ( var j = 0; j < iteration; j++ ) {

					var rotated = false;

					for ( var k = 0, kl = links.length; k < kl; k++ ) {

						var link = bones[ links[ k ].index ];

						// skip this link and following links.
						// this skip is used for MMD performance optimization.
						if ( links[ k ].enabled === false ) break;

						var limitation = links[ k ].limitation;

						// don't use getWorldPosition/Quaternion() here for the performance
						// because they call updateMatrixWorld( true ) inside.
						link.matrixWorld.decompose( linkPos, invLinkQ, linkScale );
						invLinkQ.inverse();
						effectorPos.setFromMatrixPosition( effector.matrixWorld );

						// work in link world
						effectorVec.subVectors( effectorPos, linkPos );
						effectorVec.applyQuaternion( invLinkQ );
						effectorVec.normalize();

						targetVec.subVectors( targetPos, linkPos );
						targetVec.applyQuaternion( invLinkQ );
						targetVec.normalize();

						var angle = targetVec.dot( effectorVec );

						if ( angle > 1.0 ) {

							angle = 1.0;

						} else if ( angle < -1.0 ) {

							angle = -1.0;

						}

						angle = math.acos( angle );

						// skip if changing angle is too small to prevent vibration of bone
						// Refer to http://www20.atpages.jp/katwat/three.js_r58/examples/mytest37/mmd.three.js
						if ( angle < 1e-5 ) continue;

						if ( ik.minAngle !== undefined && angle < ik.minAngle ) {

							angle = ik.minAngle;

						}

						if ( ik.maxAngle !== undefined && angle > ik.maxAngle ) {

							angle = ik.maxAngle;

						}

						axis.crossVectors( effectorVec, targetVec );
						axis.normalize();

						q.setFromAxisAngle( axis, angle );
						link.quaternion.multiply( q );

						// TODO: re-consider the limitation specification
						if ( limitation !== undefined ) {

							var c = link.quaternion.w;

							if ( c > 1.0 ) {

								c = 1.0;

							}

							var c2 = math.sqrt( 1 - c * c );
							link.quaternion.set( limitation.x * c2,
							                     limitation.y * c2,
							                     limitation.z * c2,
							                     c );

						}

						link.updateMatrixWorld( true );
						rotated = true;

					}

					if ( ! rotated ) break;

				}

			}

			// just in case
			this.mesh.updateMatrixWorld( true );

		}

	};


	var CCDIKHelper = function ( mesh ) {

		if ( mesh.geometry.iks === undefined || mesh.skeleton === undefined ) {

			throw 'CCDIKHelper requires iks in mesh.geometry and skeleton in mesh.';

		}

		Object3D.call( this );

		this.root = mesh;

		this.matrix = mesh.matrixWorld;
		this.matrixAutoUpdate = false;

		this.sphereGeometry = new SphereBufferGeometry( 0.25, 16, 8 );

		this.targetSphereMaterial = new MeshBasicMaterial( {
			color: new Color( 0xff8888 ),
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this.effectorSphereMaterial = new MeshBasicMaterial( {
			color: new Color( 0x88ff88 ),
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this.linkSphereMaterial = new MeshBasicMaterial( {
			color: new Color( 0x8888ff ),
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this.lineMaterial = new LineBasicMaterial( {
			color: new Color( 0xff0000 ),
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this._init();
		this.update();

	};

	CCDIKHelper.prototype = Object.create( Object3D.prototype );
	CCDIKHelper.prototype.constructor = CCDIKHelper;

	CCDIKHelper.prototype._init = function () {

		var self = this;
		var mesh = this.root;
		var iks = mesh.geometry.iks;

		function createLineGeometry( ik ) {

			var geometry = new BufferGeometry();
			var vertices = new Float32Array( ( 2 + ik.links.length ) * 3 );
			geometry.addAttribute( 'position', new BufferAttribute( vertices, 3 ) );

			return geometry;

		}

		function createTargetMesh() {

			return new Mesh( self.sphereGeometry, self.targetSphereMaterial );

		}

		function createEffectorMesh() {

			return new Mesh( self.sphereGeometry, self.effectorSphereMaterial );

		}

		function createLinkMesh() {

			return new Mesh( self.sphereGeometry, self.linkSphereMaterial );

		}

		function createLine( ik ) {

			return new Line( createLineGeometry( ik ), self.lineMaterial );

		}

		for ( var i = 0, il = iks.length; i < il; i ++ ) {

			var ik = iks[ i ];

			this.add( createTargetMesh() );
			this.add( createEffectorMesh() );

			for ( var j = 0, jl = ik.links.length; j < jl; j ++ ) {

				this.add( createLinkMesh() );

			}

			this.add( createLine( ik ) );

		}

	};

	CCDIKHelper.prototype.update = function () {

		var offset = 0;

		var mesh = this.root;
		var iks = mesh.geometry.iks;
		var bones = mesh.skeleton.bones;

		var matrixWorldInv = new Matrix4().getInverse( mesh.matrixWorld );
		var vector = new Vector3();

		function getPosition( bone ) {

			vector.setFromMatrixPosition( bone.matrixWorld );
			vector.applyMatrix4( matrixWorldInv );

			return vector;

		}

		function setPositionOfBoneToAttributeArray( array, index, bone ) {

			var v = getPosition( bone );

			array[ index * 3 + 0 ] = v.x;
			array[ index * 3 + 1 ] = v.y;
			array[ index * 3 + 2 ] = v.z;

		}

		for ( var i = 0, il = iks.length; i < il; i ++ ) {

			var ik = iks[ i ];

			var targetBone = bones[ ik.target ];
			var effectorBone = bones[ ik.effector ];

			var targetMesh = this.children[ offset ++ ];
			var effectorMesh = this.children[ offset ++ ];

			targetMesh.position.copy( getPosition( targetBone ) );
			effectorMesh.position.copy( getPosition( effectorBone ) );

			for ( var j = 0, jl = ik.links.length; j < jl; j ++ ) {

				var link = ik.links[ j ];
				var linkBone = bones[ link.index ];

				var linkMesh = this.children[ offset ++ ];

				linkMesh.position.copy( getPosition( linkBone ) );

			}

			var line = this.children[ offset ++ ];
			var array = line.geometry.attributes.position.array;

			setPositionOfBoneToAttributeArray( array, 0, targetBone );
			setPositionOfBoneToAttributeArray( array, 1, effectorBone );

			for ( var j = 0, jl = ik.links.length; j < jl; j ++ ) {

				var link = ik.links[ j ];
				var linkBone = bones[ link.index ];
				setPositionOfBoneToAttributeArray( array, j + 2, linkBone );

			}

			line.geometry.attributes.position.needsUpdate = true;

		}

	};

	var LoaderUtils = {

		decodeText: function ( array ) {

			if ( typeof TextDecoder !== 'undefined' ) {

				return new TextDecoder().decode( array );

			}

			// Avoid the String.fromCharCode.apply(null, array) shortcut, which
			// throws a "maximum call stack size exceeded" error for large arrays.

			var s = '';

			for ( var i = 0, il = array.length; i < il; i ++ ) {

				// Implicitly assumes little-endian.
				s += String.fromCharCode( array[ i ] );

			}

			// Merges multi-byte utf-8 characters.
			return decodeURIComponent( escape( s ) );

		},

		extractUrlBase: function ( url ) {

			var parts = url.split( '/' );

			if ( parts.length === 1 ) return './';

			parts.pop();

			return parts.join( '/' ) + '/';

		}

	};

	var MMDLoader = function ( manager ) {

		Loader.call( this );
		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
		this.parser = new MMDParser.Parser();
		this.textureCrossOrigin = null;

	};

	MMDLoader.prototype = Object.create( Loader.prototype );
	MMDLoader.prototype.constructor = MMDLoader;


	MMDLoader.prototype.defaultToonTextures = [
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAN0lEQVRYR+3WQREAMBACsZ5/bWiiMvgEBTt5cW37hjsBBAgQIECAwFwgyfYPCCBAgAABAgTWAh8aBHZBl14e8wAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOUlEQVRYR+3WMREAMAwDsYY/yoDI7MLwIiP40+RJklfcCCBAgAABAgTqArfb/QMCCBAgQIAAgbbAB3z/e0F3js2cAAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAN0lEQVRYR+3WQREAMBACsZ5/B5ilMvgEBTt5cW37hjsBBAgQIECAwFwgyfYPCCBAgAABAgTWAh81dWyx0gFwKAAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOklEQVRYR+3WoREAMAwDsWb/UQtCy9wxTOQJ/oQ8SXKKGwEECBAgQIBAXeDt7f4BAQQIECBAgEBb4AOz8Hzx7WLY4wAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABPUlEQVRYR+1XwW7CMAy1+f9fZOMysSEOEweEOPRNdm3HbdOyIhAcklPrOs/PLy9RygBALxzcCDQFmgJNgaZAU6Ap0BR4PwX8gsRMVLssMRH5HcpzJEaWL7EVg9F1IHRlyqQohgVr4FGUlUcMJSjcUlDw0zvjeun70cLWmneoyf7NgBTQSniBTQQSuJAZsOnnaczjIMb5hCiuHKxokCrJfVnrctyZL0PkJAJe1HMil4nxeyi3Ypfn1kX51jpPvo/JeCNC4PhVdHdJw2XjBR8brF8PEIhNVn12AgP7uHsTBguBn53MUZCqv7Lp07Pn5k1Ro+uWmUNn7D+M57rtk7aG0Vo73xyF/fbFf0bPJjDXngnGocDTdFhygZjwUQrMNrDcmZlQT50VJ/g/UwNyHpu778+yW+/ksOz/BFo54P4AsUXMfRq7XWsAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMElEQVRYR+2Xv4pTQRTGf2dubhLdICiii2KnYKHVolhauKWPoGAnNr6BD6CvIVaihYuI2i1ia0BY0MZGRHQXjZj/mSPnnskfNWiWZUlzJ5k7M2cm833nO5Mziej2DWWJRUoCpQKlAntSQCqgw39/iUWAGmh37jrRnVsKlgpiqmkoGVABA7E57fvY+pJDdgKqF6HzFCSADkDq+F6AHABtQ+UMVE5D7zXod7fFNhTEckTbj5XQgHzNN+5tQvc5NG7C6BNkp6D3EmpXHDR+dQAjFLchW3VS9rlw3JBh+B7ys5Cf9z0GW1C/7P32AyBAOAz1q4jGliIH3YPuBnSfQX4OGreTIgEYQb/pBDtPnEQ4CivXYPAWBk13oHrB54yA9QuSn2H4AcKRpEILDt0BUzj+RLR1V5EqjD66NPRBVpLcQwjHoHYJOhsQv6U4mnzmrIXJCFr4LDwm/xBUoboG9XX4cc9VKdYoSA2yk5NQLJaKDUjTBoveG3Z2TElTxwjNK4M3LEZgUdDdruvcXzKBpStgp2NPiWi3ks9ZXxIoFVi+AvHLdc9TqtjL3/aYjpPlrzOcEnK62Szhimdd7xX232zFDTgtxezOu3WNMRLjiKgjtOhHVMd1loynVHvOgjuIIJMaELEqhJAV/RCSLbWTcfPFakFgFlALTRRvx+ok6Hlp/Q+v3fmx90bMyUzaEAhmM3KvHlXTL5DxnbGf/1M8RNNACLL5MNtPxP/mypJAqcDSFfgFhpYqWUzhTEAAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAL0lEQVRYR+3QQREAAAzCsOFfNJPBJ1XQS9r2hsUAAQIECBAgQIAAAQIECBAgsBZ4MUx/ofm2I/kAAAAASUVORK5CYII='
	];


	MMDLoader.prototype.setTextureCrossOrigin = function ( value ) {

		this.textureCrossOrigin = value;

	};

	MMDLoader.prototype.load = function ( modelUrl, vmdUrls, callback, onProgress, onError ) {

		var scope = this;

		this.loadModel( modelUrl, function ( mesh ) {

			scope.loadVmds( vmdUrls, function ( vmd ) {

				scope.pourVmdIntoModel( mesh, vmd );
				callback( mesh );

			}, onProgress, onError );

		}, onProgress, onError );

	};

	MMDLoader.prototype.loadModel = function ( url, callback, onProgress, onError ) {

		var scope = this;

		var texturePath = LoaderUtils.extractUrlBase( url );
		var modelExtension = this.extractExtension( url );

		this.loadFileAsBuffer( url, function ( buffer ) {

			callback( scope.createModel( buffer, modelExtension, texturePath, onProgress, onError ) );

		}, onProgress, onError );

	};

	MMDLoader.prototype.createModel = function ( buffer, modelExtension, texturePath, onProgress, onError ) {

		return this.createMesh( this.parseModel( buffer, modelExtension ), texturePath, onProgress, onError );

	};

	MMDLoader.prototype.loadVmd = function ( url, callback, onProgress, onError ) {

		var scope = this;

		this.loadFileAsBuffer( url, function ( buffer ) {

			callback( scope.parseVmd( buffer ) );

		}, onProgress, onError );

	};

	MMDLoader.prototype.loadVmds = function ( urls, callback, onProgress, onError ) {

		var scope = this;

		var vmds = [];
		urls = urls.slice();

		function run() {

			var url = urls.shift();

			scope.loadVmd( url, function ( vmd ) {

				vmds.push( vmd );

				if ( urls.length > 0 ) {

					run();

				} else {

					callback( scope.mergeVmds( vmds ) );

				}

			}, onProgress, onError );

		}

		run();

	};

	MMDLoader.prototype.loadAudio = function ( url, callback, onProgress, onError ) {

		var listener = new AudioListener();
		var audio = new Audio( listener );
		var loader = new AudioLoader( this.manager );

		loader.load( url, function ( buffer ) {

			audio.setBuffer( buffer );
			callback( audio, listener );

		}, onProgress, onError );

	};

	MMDLoader.prototype.loadVpd = function ( url, callback, onProgress, onError, params ) {

		var scope = this;

		var func = ( ( params && params.charcode === 'unicode' ) ? this.loadFileAsText : this.loadFileAsShiftJISText ).bind( this );

		func( url, function ( text ) {

			callback( scope.parseVpd( text ) );

		}, onProgress, onError );

	};

	MMDLoader.prototype.parseModel = function ( buffer, modelExtension ) {

		// Should I judge from model data header?
		switch ( modelExtension.toLowerCase() ) {

			case 'pmd':
				return this.parsePmd( buffer );

			case 'pmx':
				return this.parsePmx( buffer );

			default:
				throw 'extension ' + modelExtension + ' is not supported.';

		}

	};

	MMDLoader.prototype.parsePmd = function ( buffer ) {

		return this.parser.parsePmd( buffer, true );

	};

	MMDLoader.prototype.parsePmx = function ( buffer ) {

		return this.parser.parsePmx( buffer, true );

	};

	MMDLoader.prototype.parseVmd = function ( buffer ) {

		return this.parser.parseVmd( buffer, true );

	};

	MMDLoader.prototype.parseVpd = function ( text ) {

		return this.parser.parseVpd( text, true );

	};

	MMDLoader.prototype.mergeVmds = function ( vmds ) {

		return this.parser.mergeVmds( vmds );

	};

	MMDLoader.prototype.pourVmdIntoModel = function ( mesh, vmd, name ) {

		this.createAnimation( mesh, vmd, name );

	};

	MMDLoader.prototype.pourVmdIntoCamera = function ( camera, vmd, name ) {

		var helper = new MMDLoader.DataCreationHelper();

		var initAnimation = function () {

			var orderedMotions = helper.createOrderedMotionArray( vmd.cameras );

			var times = [];
			var centers = [];
			var quaternions = [];
			var positions = [];
			var fovs = [];

			var cInterpolations = [];
			var qInterpolations = [];
			var pInterpolations = [];
			var fInterpolations = [];

			var quaternion = new Quaternion();
			var euler = new Euler();
			var position = new Vector3();
			var center = new Vector3();

			var pushVector3 = function ( array, vec ) {

				array.push( vec.x );
				array.push( vec.y );
				array.push( vec.z );

			};

			var pushQuaternion = function ( array, q ) {

				array.push( q.x );
				array.push( q.y );
				array.push( q.z );
				array.push( q.w );

			};

			var pushInterpolation = function ( array, interpolation, index ) {

				array.push( interpolation[ index * 4 + 0 ] / 127 ); // x1
				array.push( interpolation[ index * 4 + 1 ] / 127 ); // x2
				array.push( interpolation[ index * 4 + 2 ] / 127 ); // y1
				array.push( interpolation[ index * 4 + 3 ] / 127 ); // y2

			};

			var createTrack = function ( node, type, times, values, interpolations ) {

				
				if ( times.length > 2 ) {

					times = times.slice();
					values = values.slice();
					interpolations = interpolations.slice();

					var stride = values.length / times.length;
					var interpolateStride = ( stride === 3 ) ? 12 : 4; // 3: Vector3, others: Quaternion or Number

					var index = 1;

					for ( var aheadIndex = 2, endIndex = times.length; aheadIndex < endIndex; aheadIndex ++ ) {

						for ( var i = 0; i < stride; i ++ ) {

							if ( values[ index * stride + i ] !== values[ ( index - 1 ) * stride + i ] ||
								values[ index * stride + i ] !== values[ aheadIndex * stride + i ] ) {

								index ++;
								break;

							}

						}

						if ( aheadIndex > index ) {

							times[ index ] = times[ aheadIndex ];

							for ( var i = 0; i < stride; i ++ ) {

								values[ index * stride + i ] = values[ aheadIndex * stride + i ];

							}

							for ( var i = 0; i < interpolateStride; i ++ ) {

								interpolations[ index * interpolateStride + i ] = interpolations[ aheadIndex * interpolateStride + i ];

							}

						}

					}

					times.length = index + 1;
					values.length = ( index + 1 ) * stride;
					interpolations.length = ( index + 1 ) * interpolateStride;

				}

				return new MMDLoader[ type ]( node, times, values, interpolations );

			};

			for ( var i = 0; i < orderedMotions.length; i ++ ) {

				var m = orderedMotions[ i ];

				var time = m.frameNum / 30;
				var pos = m.position;
				var rot = m.rotation;
				var distance = m.distance;
				var fov = m.fov;
				var interpolation = m.interpolation;

				position.set( 0, 0, - distance );
				center.set( pos[ 0 ], pos[ 1 ], pos[ 2 ] );

				euler.set( - rot[ 0 ], - rot[ 1 ], - rot[ 2 ] );
				quaternion.setFromEuler( euler );

				position.add( center );
				position.applyQuaternion( quaternion );

				
				if ( times.length > 0 && time < times[ times.length - 1 ] + ( 1 / 30 ) * 1.5 ) {

					times[ times.length - 1 ] = time - 1e-13;

				}

				times.push( time );

				pushVector3( centers, center );
				pushQuaternion( quaternions, quaternion );
				pushVector3( positions, position );

				fovs.push( fov );

				for ( var j = 0; j < 3; j ++ ) {

					pushInterpolation( cInterpolations, interpolation, j );

				}

				pushInterpolation( qInterpolations, interpolation, 3 );

				// use same one parameter for x, y, z axis.
				for ( var j = 0; j < 3; j ++ ) {

					pushInterpolation( pInterpolations, interpolation, 4 );

				}

				pushInterpolation( fInterpolations, interpolation, 5 );

			}

			if ( times.length === 0 ) return;

			var tracks = [];

			tracks.push( createTrack( '.center', 'VectorKeyframeTrackEx', times, centers, cInterpolations ) );
			tracks.push( createTrack( '.quaternion', 'QuaternionKeyframeTrackEx', times, quaternions, qInterpolations ) );
			tracks.push( createTrack( '.position', 'VectorKeyframeTrackEx', times, positions, pInterpolations ) );
			tracks.push( createTrack( '.fov', 'NumberKeyframeTrackEx', times, fovs, fInterpolations ) );

			var clip = new AnimationClip( name === undefined ? _Math.generateUUID() : name, - 1, tracks );

			if ( camera.center === undefined ) camera.center = new Vector3( 0, 0, 0 );
			if ( camera.animations === undefined ) camera.animations = [];
			camera.animations.push( clip );

		};

		initAnimation();

	};

	MMDLoader.prototype.extractExtension = function ( url ) {

		var index = url.lastIndexOf( '.' );

		if ( index < 0 ) {

			return null;

		}

		return url.slice( index + 1 );

	};

	MMDLoader.prototype.loadFile = function ( url, onLoad, onProgress, onError, responseType, mimeType ) {

		var loader = new FileLoader( this.manager );

		if ( mimeType !== undefined ) loader.setMimeType( mimeType );

		loader.setResponseType( responseType );

		var request = loader.load( url, function ( result ) {

			onLoad( result );

		}, onProgress, onError );

		return request;

	};

	MMDLoader.prototype.loadFileAsBuffer = function ( url, onLoad, onProgress, onError ) {

		this.loadFile( url, onLoad, onProgress, onError, 'arraybuffer' );

	};

	MMDLoader.prototype.loadFileAsText = function ( url, onLoad, onProgress, onError ) {

		this.loadFile( url, onLoad, onProgress, onError, 'text' );

	};

	MMDLoader.prototype.loadFileAsShiftJISText = function ( url, onLoad, onProgress, onError ) {

		this.loadFile( url, onLoad, onProgress, onError, 'text', 'text/plain; charset=shift_jis' );

	};

	MMDLoader.prototype.createMesh = function ( model, texturePath, onProgress, onError ) {

		var scope = this;
		var geometry = new BufferGeometry();
		var materials = [];

		var buffer = {};

		buffer.vertices = [];
		buffer.uvs = [];
		buffer.normals = [];
		buffer.skinIndices = [];
		buffer.skinWeights = [];
		buffer.indices = [];

		var initVartices = function () {

			for ( var i = 0; i < model.metadata.vertexCount; i ++ ) {

				var v = model.vertices[ i ];

				for ( var j = 0, jl = v.position.length; j < jl; j ++ ) {

					buffer.vertices.push( v.position[ j ] );

				}

				for ( var j = 0, jl = v.normal.length; j < jl; j ++ ) {

					buffer.normals.push( v.normal[ j ] );

				}

				for ( var j = 0, jl = v.uv.length; j < jl; j ++ ) {

					buffer.uvs.push( v.uv[ j ] );

				}

				for ( var j = 0; j < 4; j ++ ) {

					buffer.skinIndices.push( v.skinIndices.length - 1 >= j ? v.skinIndices[ j ] : 0.0 );

				}

				for ( var j = 0; j < 4; j ++ ) {

					buffer.skinWeights.push( v.skinWeights.length - 1 >= j ? v.skinWeights[ j ] : 0.0 );

				}

			}

		};

		var initFaces = function () {

			for ( var i = 0; i < model.metadata.faceCount; i ++ ) {

				var f = model.faces[ i ];

				for ( var j = 0, jl = f.indices.length; j < jl; j ++ ) {

					buffer.indices.push( f.indices[ j ] );

				}

			}

		};

		var initBones = function () {

			var bones = [];

			var rigidBodies = model.rigidBodies;
			var dictionary = {};

			for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

				var body = rigidBodies[ i ];
				var value = dictionary[ body.boneIndex ];

				// keeps greater number if already value is set without any special reasons
				value = value === undefined ? body.type : Math.max( body.type, value );

				dictionary[ body.boneIndex ] = value;

			}

			for ( var i = 0; i < model.metadata.boneCount; i ++ ) {

				var bone = {};
				var b = model.bones[ i ];

				bone.parent = b.parentIndex;
				bone.name = b.name;
				bone.pos = [ b.position[ 0 ], b.position[ 1 ], b.position[ 2 ] ];
				bone.rotq = [ 0, 0, 0, 1 ];
				bone.scl = [ 1, 1, 1 ];

				if ( bone.parent !== - 1 ) {

					bone.pos[ 0 ] -= model.bones[ bone.parent ].position[ 0 ];
					bone.pos[ 1 ] -= model.bones[ bone.parent ].position[ 1 ];
					bone.pos[ 2 ] -= model.bones[ bone.parent ].position[ 2 ];

				}

				bone.rigidBodyType = dictionary[ i ] !== undefined ? dictionary[ i ] : - 1;

				bones.push( bone );

			}

			geometry.bones = bones;

		};

		var initIKs = function () {

			var iks = [];

			// TODO: remove duplicated codes between PMD and PMX
			if ( model.metadata.format === 'pmd' ) {

				for ( var i = 0; i < model.metadata.ikCount; i ++ ) {

					var ik = model.iks[ i ];
					var param = {};

					param.target = ik.target;
					param.effector = ik.effector;
					param.iteration = ik.iteration;
					param.maxAngle = ik.maxAngle * 4;
					param.links = [];

					for ( var j = 0; j < ik.links.length; j ++ ) {

						var link = {};
						link.index = ik.links[ j ].index;

						if ( model.bones[ link.index ].name.indexOf( 'ひざ' ) >= 0 ) {

							link.limitation = new Vector3( 1.0, 0.0, 0.0 );

						}

						param.links.push( link );

					}

					iks.push( param );

				}

			} else {

				for ( var i = 0; i < model.metadata.boneCount; i ++ ) {

					var b = model.bones[ i ];
					var ik = b.ik;

					if ( ik === undefined ) {

						continue;

					}

					var param = {};

					param.target = i;
					param.effector = ik.effector;
					param.iteration = ik.iteration;
					param.maxAngle = ik.maxAngle;
					param.links = [];

					for ( var j = 0; j < ik.links.length; j ++ ) {

						var link = {};
						link.index = ik.links[ j ].index;
						link.enabled = true;

						if ( ik.links[ j ].angleLimitation === 1 ) {

							link.limitation = new Vector3( 1.0, 0.0, 0.0 );
							// TODO: use limitation angles
							// link.lowerLimitationAngle;
							// link.upperLimitationAngle;

						}

						param.links.push( link );

					}

					iks.push( param );

				}

			}

			geometry.iks = iks;

		};

		var initGrants = function () {

			if ( model.metadata.format === 'pmd' ) {

				return;

			}

			var grants = [];

			for ( var i = 0; i < model.metadata.boneCount; i ++ ) {

				var b = model.bones[ i ];
				var grant = b.grant;

				if ( grant === undefined ) {

					continue;

				}

				var param = {};

				param.index = i;
				param.parentIndex = grant.parentIndex;
				param.ratio = grant.ratio;
				param.isLocal = grant.isLocal;
				param.affectRotation = grant.affectRotation;
				param.affectPosition = grant.affectPosition;
				param.transformationClass = b.transformationClass;

				grants.push( param );

			}

			grants.sort( function ( a, b ) {

				return a.transformationClass - b.transformationClass;

			} );

			geometry.grants = grants;

		};

		var initMorphs = function () {

			function updateVertex( attribute, index, v, ratio ) {

				attribute.array[ index * 3 + 0 ] += v.position[ 0 ] * ratio;
				attribute.array[ index * 3 + 1 ] += v.position[ 1 ] * ratio;
				attribute.array[ index * 3 + 2 ] += v.position[ 2 ] * ratio;

			}

			function updateVertices( attribute, m, ratio ) {

				for ( var i = 0; i < m.elementCount; i ++ ) {

					var v = m.elements[ i ];

					var index;

					if ( model.metadata.format === 'pmd' ) {

						index = model.morphs[ 0 ].elements[ v.index ].index;

					} else {

						index = v.index;

					}

					updateVertex( attribute, index, v, ratio );

				}

			}

			var morphTargets = [];
			var attributes = [];

			for ( var i = 0; i < model.metadata.morphCount; i ++ ) {

				var m = model.morphs[ i ];
				var params = { name: m.name };

				var attribute = new Float32BufferAttribute( model.metadata.vertexCount * 3, 3 );
				attribute.name = m.name;

				for ( var j = 0; j < model.metadata.vertexCount * 3; j ++ ) {

					attribute.array[ j ] = buffer.vertices[ j ];

				}

				if ( model.metadata.format === 'pmd' ) {

					if ( i !== 0 ) {

						updateVertices( attribute, m, 1.0 );

					}

				} else {

					if ( m.type === 0 ) { // group

						for ( var j = 0; j < m.elementCount; j ++ ) {

							var m2 = model.morphs[ m.elements[ j ].index ];
							var ratio = m.elements[ j ].ratio;

							if ( m2.type === 1 ) {

								updateVertices( attribute, m2, ratio );

							} else {

								// TODO: implement

							}

						}

					} else if ( m.type === 1 ) { // vertex

						updateVertices( attribute, m, 1.0 );

					} else if ( m.type === 2 ) { // bone

						// TODO: implement

					} else if ( m.type === 3 ) { // uv

						// TODO: implement

					} else if ( m.type === 4 ) { // additional uv1

						// TODO: implement

					} else if ( m.type === 5 ) { // additional uv2

						// TODO: implement

					} else if ( m.type === 6 ) { // additional uv3

						// TODO: implement

					} else if ( m.type === 7 ) { // additional uv4

						// TODO: implement

					} else if ( m.type === 8 ) { // material

						// TODO: implement

					}

				}

				morphTargets.push( params );
				attributes.push( attribute );

			}

			geometry.morphTargets = morphTargets;
			geometry.morphAttributes.position = attributes;

		};

		var initMaterials = function () {

			var textures = {};
			var textureLoader = new TextureLoader( scope.manager );
			var tgaLoader = new TGALoader( scope.manager );
			var canvas = document.createElement( 'canvas' );
			var context = canvas.getContext( '2d' );
			var offset = 0;
			var materialParams = [];

			if ( scope.textureCrossOrigin !== null ) textureLoader.setCrossOrigin( scope.textureCrossOrigin );

			function loadTexture( filePath, params ) {

				if ( params === undefined ) {

					params = {};

				}

				var fullPath;

				if ( params.defaultTexturePath === true ) {

					try {

						fullPath = scope.defaultToonTextures[ parseInt( filePath.match( 'toon([0-9]{2})\.bmp$' )[ 1 ] ) ];

					} catch ( e ) {

						console.warn( 'MMDLoader: ' + filePath + ' seems like not right default texture path. Using toon00.bmp instead.' );
						fullPath = scope.defaultToonTextures[ 0 ];

					}

				} else {

					fullPath = texturePath + filePath;

				}

				if ( textures[ fullPath ] !== undefined ) return fullPath;

				var loader = Loader.Handlers.get( fullPath );

				if ( loader === null ) {

					loader = ( filePath.indexOf( '.tga' ) >= 0 ) ? tgaLoader : textureLoader;

				}

				var texture = loader.load( fullPath, function ( t ) {

					// MMD toon texture is Axis-Y oriented
					// but Three.js gradient map is Axis-X oriented.
					// So here replaces the toon texture image with the rotated one.
					if ( params.isToonTexture === true ) {

						var image = t.image;
						var width = image.width;
						var height = image.height;

						canvas.width = width;
						canvas.height = height;

						context.clearRect( 0, 0, width, height );
						context.translate( width / 2.0, height / 2.0 );
						context.rotate( 0.5 * Math.PI ); // 90.0 * Math.PI / 180.0
						context.translate( - width / 2.0, - height / 2.0 );
						context.drawImage( image, 0, 0 );

						t.image = context.getImageData( 0, 0, width, height );

					}

					t.flipY = false;
					t.wrapS = RepeatWrapping;
					t.wrapT = RepeatWrapping;

					for ( var i = 0; i < texture.readyCallbacks.length; i ++ ) {

						texture.readyCallbacks[ i ]( texture );

					}

					delete texture.readyCallbacks;

				}, onProgress, onError );

				if ( params.sphericalReflectionMapping === true ) {

					texture.mapping = SphericalReflectionMapping;

				}

				texture.readyCallbacks = [];

				textures[ fullPath ] = texture;

				return fullPath;

			}

			function getTexture( name, textures ) {

				if ( textures[ name ] === undefined ) {

					console.warn( 'MMDLoader: Undefined texture', name );

				}

				return textures[ name ];

			}

			for ( var i = 0; i < model.metadata.materialCount; i ++ ) {

				var m = model.materials[ i ];
				var params = {};

				params.faceOffset = offset;
				params.faceNum = m.faceCount;

				offset += m.faceCount;

				params.name = m.name;

				
				params.color = new Color( m.diffuse[ 0 ], m.diffuse[ 1 ], m.diffuse[ 2 ] );
				params.opacity = m.diffuse[ 3 ];
				params.specular = new Color( m.specular[ 0 ], m.specular[ 1 ], m.specular[ 2 ] );
				params.shininess = m.shininess;

				if ( params.opacity === 1.0 ) {

					params.side = FrontSide;
					params.transparent = false;

				} else {

					params.side = DoubleSide;
					params.transparent = true;

				}

				if ( model.metadata.format === 'pmd' ) {

					if ( m.fileName ) {

						var fileName = m.fileName;
						var fileNames = [];

						var index = fileName.lastIndexOf( '*' );

						if ( index >= 0 ) {

							fileNames.push( fileName.slice( 0, index ) );
							fileNames.push( fileName.slice( index + 1 ) );

						} else {

							fileNames.push( fileName );

						}

						for ( var j = 0; j < fileNames.length; j ++ ) {

							var n = fileNames[ j ];

							if ( n.indexOf( '.sph' ) >= 0 || n.indexOf( '.spa' ) >= 0 ) {

								params.envMap = loadTexture( n, { sphericalReflectionMapping: true } );

								if ( n.indexOf( '.sph' ) >= 0 ) {

									params.envMapType = MultiplyOperation;

								} else {

									params.envMapType = AddOperation;

								}

							} else {

								params.map = loadTexture( n );

							}

						}

					}

				} else {

					if ( m.textureIndex !== - 1 ) {

						var n = model.textures[ m.textureIndex ];
						params.map = loadTexture( n );

					}

					// TODO: support m.envFlag === 3
					if ( m.envTextureIndex !== - 1 && ( m.envFlag === 1 || m.envFlag == 2 ) ) {

						var n = model.textures[ m.envTextureIndex ];
						params.envMap = loadTexture( n, { sphericalReflectionMapping: true } );

						if ( m.envFlag === 1 ) {

							params.envMapType = MultiplyOperation;

						} else {

							params.envMapType = AddOperation;

						}

					}

				}

				var coef = ( params.map === undefined ) ? 1.0 : 0.2;
				params.emissive = new Color( m.ambient[ 0 ] * coef, m.ambient[ 1 ] * coef, m.ambient[ 2 ] * coef );

				materialParams.push( params );

			}

			for ( var i = 0; i < materialParams.length; i ++ ) {

				var p = materialParams[ i ];
				var p2 = model.materials[ i ];
				var m = new MeshToonMaterial();

				geometry.addGroup( p.faceOffset * 3, p.faceNum * 3, i );

				if ( p.name !== undefined ) m.name = p.name;

				m.skinning = geometry.bones.length > 0 ? true : false;
				m.morphTargets = geometry.morphTargets.length > 0 ? true : false;
				m.lights = true;
				m.side = ( model.metadata.format === 'pmx' && ( p2.flag & 0x1 ) === 1 ) ? DoubleSide : p.side;
				m.transparent = p.transparent;
				m.fog = true;

				m.blending = CustomBlending;
				m.blendSrc = SrcAlphaFactor;
				m.blendDst = OneMinusSrcAlphaFactor;
				m.blendSrcAlpha = SrcAlphaFactor;
				m.blendDstAlpha = DstAlphaFactor;

				if ( p.map !== undefined ) {

					m.faceOffset = p.faceOffset;
					m.faceNum = p.faceNum;

					// Check if this part of the texture image the material uses requires transparency
					function checkTextureTransparency( m ) {

						m.map.readyCallbacks.push( function ( t ) {

							// Is there any efficient ways?
							function createImageData( image ) {

								var c = document.createElement( 'canvas' );
								c.width = image.width;
								c.height = image.height;

								var ctx = c.getContext( '2d' );
								ctx.drawImage( image, 0, 0 );

								return ctx.getImageData( 0, 0, c.width, c.height );

							}

							function detectTextureTransparency( image, uvs, indices ) {

								var width = image.width;
								var height = image.height;
								var data = image.data;
								var threshold = 253;

								if ( data.length / ( width * height ) !== 4 ) {

									return false;

								}

								for ( var i = 0; i < indices.length; i += 3 ) {

									var centerUV = { x: 0.0, y: 0.0 };

									for ( var j = 0; j < 3; j ++ ) {

										var index = indices[ i * 3 + j ];
										var uv = { x: uvs[ index * 2 + 0 ], y: uvs[ index * 2 + 1 ] };

										if ( getAlphaByUv( image, uv ) < threshold ) {

											return true;

										}

										centerUV.x += uv.x;
										centerUV.y += uv.y;

									}

									centerUV.x /= 3;
									centerUV.y /= 3;

									if ( getAlphaByUv( image, centerUV ) < threshold ) {

										return true;

									}

								}

								return false;

							}

							
							function getAlphaByUv( image, uv ) {

								var width = image.width;
								var height = image.height;

								var x = Math.round( uv.x * width ) % width;
								var y = Math.round( uv.y * height ) % height;

								if ( x < 0 ) {

									x += width;

								}

								if ( y < 0 ) {

									y += height;

								}

								var index = y * width + x;

								return image.data[ index * 4 + 3 ];

							}

							var imageData = t.image.data !== undefined ? t.image : createImageData( t.image );
							var indices = geometry.index.array.slice( m.faceOffset * 3, m.faceOffset * 3 + m.faceNum * 3 );

							if ( detectTextureTransparency( imageData, geometry.attributes.uv.array, indices ) ) m.transparent = true;

							delete m.faceOffset;
							delete m.faceNum;

						} );

					}

					m.map = getTexture( p.map, textures );
					checkTextureTransparency( m );

				}

				if ( p.envMap !== undefined ) {

					m.envMap = getTexture( p.envMap, textures );
					m.combine = p.envMapType;

				}

				m.opacity = p.opacity;
				m.color = p.color;

				if ( p.emissive !== undefined ) {

					m.emissive = p.emissive;

				}

				m.specular = p.specular;
				m.shininess = Math.max( p.shininess, 1e-4 ); // to prevent pow( 0.0, 0.0 )

				if ( model.metadata.format === 'pmd' ) {

					function isDefaultToonTexture( n ) {

						if ( n.length !== 10 ) {

							return false;

						}

						return n.match( /toon(10|0[0-9]).bmp/ ) === null ? false : true;

					}

					// parameters for OutlineEffect
					m.outlineParameters = {
						thickness: p2.edgeFlag === 1 ? 0.003 : 0.0,
						color: new Color( 0.0, 0.0, 0.0 ),
						alpha: 1.0
					};

					if ( m.outlineParameters.thickness === 0.0 ) m.outlineParameters.visible = false;

					var toonFileName = ( p2.toonIndex === - 1 ) ? 'toon00.bmp' : model.toonTextures[ p2.toonIndex ].fileName;
					var uuid = loadTexture( toonFileName, { isToonTexture: true, defaultTexturePath: isDefaultToonTexture( toonFileName ) } );
					m.gradientMap = getTexture( uuid, textures );

				} else {

					// parameters for OutlineEffect
					m.outlineParameters = {
						thickness: p2.edgeSize / 300,
						color: new Color( p2.edgeColor[ 0 ], p2.edgeColor[ 1 ], p2.edgeColor[ 2 ] ),
						alpha: p2.edgeColor[ 3 ]
					};

					if ( ( p2.flag & 0x10 ) === 0 || m.outlineParameters.thickness === 0.0 ) m.outlineParameters.visible = false;

					var toonFileName, isDefaultToon;

					if ( p2.toonIndex === - 1 || p2.toonFlag !== 0 ) {

						var num = p2.toonIndex + 1;
						toonFileName = 'toon' + ( num < 10 ? '0' + num : num ) + '.bmp';
						isDefaultToon = true;

					} else {

						toonFileName = model.textures[ p2.toonIndex ];
						isDefaultToon = false;

					}

					var uuid = loadTexture( toonFileName, { isToonTexture: true, defaultTexturePath: isDefaultToon } );
					m.gradientMap = getTexture( uuid, textures );

				}

				materials.push( m );

			}

			if ( model.metadata.format === 'pmx' ) {

				function checkAlphaMorph( morph, elements ) {

					if ( morph.type !== 8 ) {

						return;

					}

					for ( var i = 0; i < elements.length; i ++ ) {

						var e = elements[ i ];

						if ( e.index === - 1 ) {

							continue;

						}

						var m = materials[ e.index ];

						if ( m.opacity !== e.diffuse[ 3 ] ) {

							m.transparent = true;

						}

					}

				}

				for ( var i = 0; i < model.morphs.length; i ++ ) {

					var morph = model.morphs[ i ];
					var elements = morph.elements;

					if ( morph.type === 0 ) {

						for ( var j = 0; j < elements.length; j ++ ) {

							var morph2 = model.morphs[ elements[ j ].index ];
							var elements2 = morph2.elements;

							checkAlphaMorph( morph2, elements2 );

						}

					} else {

						checkAlphaMorph( morph, elements );

					}

				}

			}

		};

		var initPhysics = function () {

			var rigidBodies = [];
			var constraints = [];

			for ( var i = 0; i < model.metadata.rigidBodyCount; i ++ ) {

				var b = model.rigidBodies[ i ];
				var keys = Object.keys( b );

				var p = {};

				for ( var j = 0; j < keys.length; j ++ ) {

					var key = keys[ j ];
					p[ key ] = b[ key ];

				}

				
				if ( model.metadata.format === 'pmx' ) {

					if ( p.boneIndex !== - 1 ) {

						var bone = model.bones[ p.boneIndex ];
						p.position[ 0 ] -= bone.position[ 0 ];
						p.position[ 1 ] -= bone.position[ 1 ];
						p.position[ 2 ] -= bone.position[ 2 ];

					}

				}

				rigidBodies.push( p );

			}

			for ( var i = 0; i < model.metadata.constraintCount; i ++ ) {

				var c = model.constraints[ i ];
				var keys = Object.keys( c );

				var p = {};

				for ( var j = 0; j < keys.length; j ++ ) {

					var key = keys[ j ];
					p[ key ] = c[ key ];

				}

				var bodyA = rigidBodies[ p.rigidBodyIndex1 ];
				var bodyB = rigidBodies[ p.rigidBodyIndex2 ];

				
				if ( bodyA.type !== 0 && bodyB.type === 2 ) {

					if ( bodyA.boneIndex !== - 1 && bodyB.boneIndex !== - 1 &&
					     model.bones[ bodyB.boneIndex ].parentIndex === bodyA.boneIndex ) {

						bodyB.type = 1;

					}

				}

				constraints.push( p );

			}

			geometry.rigidBodies = rigidBodies;
			geometry.constraints = constraints;

		};

		var initGeometry = function () {

			geometry.setIndex( buffer.indices );
			geometry.addAttribute( 'position', new Float32BufferAttribute( buffer.vertices, 3 ) );
			geometry.addAttribute( 'normal', new Float32BufferAttribute( buffer.normals, 3 ) );
			geometry.addAttribute( 'uv', new Float32BufferAttribute( buffer.uvs, 2 ) );
			geometry.addAttribute( 'skinIndex', new Float32BufferAttribute( buffer.skinIndices, 4 ) );
			geometry.addAttribute( 'skinWeight', new Float32BufferAttribute( buffer.skinWeights, 4 ) );

			geometry.computeBoundingSphere();
			geometry.mmdFormat = model.metadata.format;

		};

		initVartices();
		initFaces();
		initBones();
		initIKs();
		initGrants();
		initMorphs();
		initMaterials();
		initPhysics();
		initGeometry();

		var mesh = new SkinnedMesh( geometry, materials );

		// console.log( mesh ); // for console debug

		return mesh;

	};

	MMDLoader.prototype.createAnimation = function ( mesh, vmd, name ) {

		var helper = new MMDLoader.DataCreationHelper();

		var initMotionAnimations = function () {

			if ( vmd.metadata.motionCount === 0 ) {

				return;

			}

			var bones = mesh.geometry.bones;
			var orderedMotions = helper.createOrderedMotionArrays( bones, vmd.motions, 'boneName' );

			var tracks = [];

			var pushInterpolation = function ( array, interpolation, index ) {

				array.push( interpolation[ index + 0 ] / 127 ); // x1
				array.push( interpolation[ index + 8 ] / 127 ); // x2
				array.push( interpolation[ index + 4 ] / 127 ); // y1
				array.push( interpolation[ index + 12 ] / 127 ); // y2

			};

			for ( var i = 0; i < orderedMotions.length; i ++ ) {

				var times = [];
				var positions = [];
				var rotations = [];
				var pInterpolations = [];
				var rInterpolations = [];

				var bone = bones[ i ];
				var array = orderedMotions[ i ];

				for ( var j = 0; j < array.length; j ++ ) {

					var time = array[ j ].frameNum / 30;
					var pos = array[ j ].position;
					var rot = array[ j ].rotation;
					var interpolation = array[ j ].interpolation;

					times.push( time );

					for ( var k = 0; k < 3; k ++ ) {

						positions.push( bone.pos[ k ] + pos[ k ] );

					}

					for ( var k = 0; k < 4; k ++ ) {

						rotations.push( rot[ k ] );

					}

					for ( var k = 0; k < 3; k ++ ) {

						pushInterpolation( pInterpolations, interpolation, k );

					}

					pushInterpolation( rInterpolations, interpolation, 3 );

				}

				if ( times.length === 0 ) continue;

				var boneName = '.bones[' + bone.name + ']';

				tracks.push( new MMDLoader.VectorKeyframeTrackEx( boneName + '.position', times, positions, pInterpolations ) );
				tracks.push( new MMDLoader.QuaternionKeyframeTrackEx( boneName + '.quaternion', times, rotations, rInterpolations ) );

			}

			var clip = new AnimationClip( name === undefined ? _Math.generateUUID() : name, - 1, tracks );

			if ( mesh.geometry.animations === undefined ) mesh.geometry.animations = [];
			mesh.geometry.animations.push( clip );

		};

		var initMorphAnimations = function () {

			if ( vmd.metadata.morphCount === 0 ) {

				return;

			}

			var orderedMorphs = helper.createOrderedMotionArrays( mesh.geometry.morphTargets, vmd.morphs, 'morphName' );

			var tracks = [];

			for ( var i = 0; i < orderedMorphs.length; i ++ ) {

				var times = [];
				var values = [];
				var array = orderedMorphs[ i ];

				for ( var j = 0; j < array.length; j ++ ) {

					times.push( array[ j ].frameNum / 30 );
					values.push( array[ j ].weight );

				}

				if ( times.length === 0 ) continue;

				tracks.push( new NumberKeyframeTrack( '.morphTargetInfluences[' + i + ']', times, values ) );

			}

			var clip = new AnimationClip( name === undefined ? _Math.generateUUID() : name + 'Morph', - 1, tracks );

			if ( mesh.geometry.animations === undefined ) mesh.geometry.animations = [];
			mesh.geometry.animations.push( clip );

		};

		initMotionAnimations();
		initMorphAnimations();

	};

	MMDLoader.DataCreationHelper = function () {

	};

	MMDLoader.DataCreationHelper.prototype = {

		constructor: MMDLoader.DataCreationHelper,

		

		toCharcodeStrings: function ( s ) {

			var str = '';

			for ( var i = 0; i < s.length; i ++ ) {

				str += '0x' + ( '0000' + s[ i ].charCodeAt().toString( 16 ) ).substr( - 4 );

			}

			return str;

		},

		createDictionary: function ( array ) {

			var dict = {};

			for ( var i = 0; i < array.length; i ++ ) {

				dict[ array[ i ].name ] = i;

			}

			return dict;

		},

		initializeMotionArrays: function ( array ) {

			var result = [];

			for ( var i = 0; i < array.length; i ++ ) {

				result[ i ] = [];

			}

			return result;

		},

		sortMotionArray: function ( array ) {

			array.sort( function ( a, b ) {

				return a.frameNum - b.frameNum;

			} );

		},

		sortMotionArrays: function ( arrays ) {

			for ( var i = 0; i < arrays.length; i ++ ) {

				this.sortMotionArray( arrays[ i ] );

			}

		},

		createMotionArray: function ( array ) {

			var result = [];

			for ( var i = 0; i < array.length; i ++ ) {

				result.push( array[ i ] );

			}

			return result;

		},

		createMotionArrays: function ( array, result, dict, key ) {

			for ( var i = 0; i < array.length; i ++ ) {

				var a = array[ i ];
				var num = dict[ a[ key ] ];

				if ( num === undefined ) {

					continue;

				}

				result[ num ].push( a );

			}

		},

		createOrderedMotionArray: function ( array ) {

			var result = this.createMotionArray( array );
			this.sortMotionArray( result );
			return result;

		},

		createOrderedMotionArrays: function ( targetArray, motionArray, key ) {

			var dict = this.createDictionary( targetArray );
			var result = this.initializeMotionArrays( targetArray );
			this.createMotionArrays( motionArray, result, dict, key );
			this.sortMotionArrays( result );

			return result;

		}

	};


	MMDLoader.VectorKeyframeTrackEx = function ( name, times, values, interpolationParameterArray ) {

		this.interpolationParameters = new Float32Array( interpolationParameterArray );

		VectorKeyframeTrack.call( this, name, times, values );

	};

	MMDLoader.VectorKeyframeTrackEx.prototype = Object.create( VectorKeyframeTrack.prototype );
	MMDLoader.VectorKeyframeTrackEx.prototype.constructor = MMDLoader.VectorKeyframeTrackEx;
	MMDLoader.VectorKeyframeTrackEx.prototype.TimeBufferType = Float64Array;

	MMDLoader.VectorKeyframeTrackEx.prototype.InterpolantFactoryMethodCubicBezier = function ( result ) {

		return new MMDLoader.CubicBezierInterpolation( this.times, this.values, this.getValueSize(), result, this.interpolationParameters );

	};

	MMDLoader.VectorKeyframeTrackEx.prototype.setInterpolation = function ( interpolation ) {

		this.createInterpolant = this.InterpolantFactoryMethodCubicBezier;

	};

	MMDLoader.QuaternionKeyframeTrackEx = function ( name, times, values, interpolationParameterArray ) {

		this.interpolationParameters = new Float32Array( interpolationParameterArray );

		QuaternionKeyframeTrack.call( this, name, times, values );

	};

	MMDLoader.QuaternionKeyframeTrackEx.prototype = Object.create( QuaternionKeyframeTrack.prototype );
	MMDLoader.QuaternionKeyframeTrackEx.prototype.constructor = MMDLoader.QuaternionKeyframeTrackEx;
	MMDLoader.QuaternionKeyframeTrackEx.prototype.TimeBufferType = Float64Array;

	MMDLoader.QuaternionKeyframeTrackEx.prototype.InterpolantFactoryMethodCubicBezier = function ( result ) {

		return new MMDLoader.CubicBezierInterpolation( this.times, this.values, this.getValueSize(), result, this.interpolationParameters );

	};

	MMDLoader.QuaternionKeyframeTrackEx.prototype.setInterpolation = function ( interpolation ) {

		this.createInterpolant = this.InterpolantFactoryMethodCubicBezier;

	};

	MMDLoader.NumberKeyframeTrackEx = function ( name, times, values, interpolationParameterArray ) {

		this.interpolationParameters = new Float32Array( interpolationParameterArray );

		NumberKeyframeTrack.call( this, name, times, values );

	};

	MMDLoader.NumberKeyframeTrackEx.prototype = Object.create( NumberKeyframeTrack.prototype );
	MMDLoader.NumberKeyframeTrackEx.prototype.constructor = MMDLoader.NumberKeyframeTrackEx;
	MMDLoader.NumberKeyframeTrackEx.prototype.TimeBufferType = Float64Array;

	MMDLoader.NumberKeyframeTrackEx.prototype.InterpolantFactoryMethodCubicBezier = function ( result ) {

		return new MMDLoader.CubicBezierInterpolation( this.times, this.values, this.getValueSize(), result, this.interpolationParameters );

	};

	MMDLoader.NumberKeyframeTrackEx.prototype.setInterpolation = function ( interpolation ) {

		this.createInterpolant = this.InterpolantFactoryMethodCubicBezier;

	};

	MMDLoader.CubicBezierInterpolation = function ( parameterPositions, sampleValues, sampleSize, resultBuffer, params ) {

		Interpolant.call( this, parameterPositions, sampleValues, sampleSize, resultBuffer );

		this.params = params;

	};

	MMDLoader.CubicBezierInterpolation.prototype = Object.create( LinearInterpolant.prototype );
	MMDLoader.CubicBezierInterpolation.prototype.constructor = MMDLoader.CubicBezierInterpolation;

	MMDLoader.CubicBezierInterpolation.prototype.interpolate_ = function ( i1, t0, t, t1 ) {

		var result = this.resultBuffer;
		var values = this.sampleValues;
		var stride = this.valueSize;

		var offset1 = i1 * stride;
		var offset0 = offset1 - stride;

		var weight1 = ( t - t0 ) / ( t1 - t0 );

		if ( stride === 4 ) { // Quaternion

			var x1 = this.params[ i1 * 4 + 0 ];
			var x2 = this.params[ i1 * 4 + 1 ];
			var y1 = this.params[ i1 * 4 + 2 ];
			var y2 = this.params[ i1 * 4 + 3 ];

			var ratio = this._calculate( x1, x2, y1, y2, weight1 );

			Quaternion.slerpFlat( result, 0, values, offset0, values, offset1, ratio );

		} else if ( stride === 3 ) { // Vector3

			for ( var i = 0; i !== stride; ++ i ) {

				var x1 = this.params[ i1 * 12 + i * 4 + 0 ];
				var x2 = this.params[ i1 * 12 + i * 4 + 1 ];
				var y1 = this.params[ i1 * 12 + i * 4 + 2 ];
				var y2 = this.params[ i1 * 12 + i * 4 + 3 ];

				var ratio = this._calculate( x1, x2, y1, y2, weight1 );

				result[ i ] = values[ offset0 + i ] * ( 1 - ratio ) + values[ offset1 + i ] * ratio;

			}

		} else { // Number

			var x1 = this.params[ i1 * 4 + 0 ];
			var x2 = this.params[ i1 * 4 + 1 ];
			var y1 = this.params[ i1 * 4 + 2 ];
			var y2 = this.params[ i1 * 4 + 3 ];

			var ratio = this._calculate( x1, x2, y1, y2, weight1 );

			result[ 0 ] = values[ offset0 ] * ( 1 - ratio ) + values[ offset1 ] * ratio;

		}

		return result;

	};

	MMDLoader.CubicBezierInterpolation.prototype._calculate = function ( x1, x2, y1, y2, x ) {

		

		var c = 0.5;
		var t = c;
		var s = 1.0 - t;
		var loop = 15;
		var eps = 1e-5;
		var math = Math;

		var sst3, stt3, ttt;

		for ( var i = 0; i < loop; i ++ ) {

			sst3 = 3.0 * s * s * t;
			stt3 = 3.0 * s * t * t;
			ttt = t * t * t;

			var ft = ( sst3 * x1 ) + ( stt3 * x2 ) + ( ttt ) - x;

			if ( math.abs( ft ) < eps ) break;

			c /= 2.0;

			t += ( ft < 0 ) ? c : - c;
			s = 1.0 - t;

		}

		return ( sst3 * y1 ) + ( stt3 * y2 ) + ttt;

	};

	var MMDAudioManager = function ( audio, listener, p ) {

		var params = ( p === null || p === undefined ) ? {} : p;

		this.audio = audio;
		this.listener = listener;

		this.elapsedTime = 0.0;
		this.currentTime = 0.0;
		this.delayTime = params.delayTime !== undefined ? params.delayTime : 0.0;

		this.audioDuration = this.audio.buffer.duration;
		this.duration = this.audioDuration + this.delayTime;

	};

	MMDAudioManager.prototype = {

		constructor: MMDAudioManager,

		control: function ( delta ) {

			this.elapsed += delta;
			this.currentTime += delta;

			if ( this.checkIfStopAudio() ) {

				this.audio.stop();

			}

			if ( this.checkIfStartAudio() ) {

				this.audio.play();

			}

		},

		checkIfStartAudio: function () {

			if ( this.audio.isPlaying ) {

				return false;

			}

			while ( this.currentTime >= this.duration ) {

				this.currentTime -= this.duration;

			}

			if ( this.currentTime < this.delayTime ) {

				return false;

			}

			this.audio.startTime = this.currentTime - this.delayTime;

			return true;

		},

		checkIfStopAudio: function () {

			if ( ! this.audio.isPlaying ) {

				return false;

			}

			if ( this.currentTime >= this.duration ) {

				return true;

			}

			return false;

		}

	};

	var MMDGrantSolver = function ( mesh ) {

		this.mesh = mesh;

	};

	MMDGrantSolver.prototype = {

		constructor: MMDGrantSolver,

		update: function () {

			var q = new Quaternion();

			return function () {

				for ( var i = 0; i < this.mesh.geometry.grants.length; i ++ ) {

					var g = this.mesh.geometry.grants[ i ];
					var b = this.mesh.skeleton.bones[ g.index ];
					var pb = this.mesh.skeleton.bones[ g.parentIndex ];

					if ( g.isLocal ) {

						// TODO: implement
						if ( g.affectPosition ) {

						}

						// TODO: implement
						if ( g.affectRotation ) {

						}

					} else {

						// TODO: implement
						if ( g.affectPosition ) {

						}

						if ( g.affectRotation ) {

							q.set( 0, 0, 0, 1 );
							q.slerp( pb.quaternion, g.ratio );
							b.quaternion.multiply( q );

						}

					}

				}

			};

		}()

	};

	var MMDHelper = function () {

		this.meshes = [];

		this.doAnimation = true;
		this.doIk = true;
		this.doGrant = true;
		this.doPhysics = true;
		this.doCameraAnimation = true;

		this.sharedPhysics = false;
		this.masterPhysics = null;

		this.audioManager = null;
		this.camera = null;

	};

	MMDHelper.prototype = {

		constructor: MMDHelper,

		add: function ( mesh ) {

			if ( ! ( mesh instanceof SkinnedMesh ) ) {

				throw new Error( 'MMDHelper.add() accepts only SkinnedMesh instance.' );

			}

			if ( mesh.mixer === undefined ) mesh.mixer = null;
			if ( mesh.ikSolver === undefined ) mesh.ikSolver = null;
			if ( mesh.grantSolver === undefined ) mesh.grantSolver = null;
			if ( mesh.physics === undefined ) mesh.physics = null;
			if ( mesh.looped === undefined ) mesh.looped = false;

			this.meshes.push( mesh );

			// workaround until I make IK and Physics Animation plugin
			this.initBackupBones( mesh );

		},

		setAudio: function ( audio, listener, params ) {

			this.audioManager = new MMDAudioManager( audio, listener, params );

		},

		setCamera: function ( camera ) {

			camera.mixer = null;
			this.camera = camera;

		},

		setPhysicses: function ( params ) {

			for ( var i = 0; i < this.meshes.length; i ++ ) {

				this.setPhysics( this.meshes[ i ], params );

			}

		},

		setPhysics: function ( mesh, params ) {

			params = ( params === undefined ) ? {} : Object.assign( {}, params );

			if ( params.world === undefined && this.sharedPhysics ) {

				var masterPhysics = this.getMasterPhysics();

				if ( masterPhysics !== null ) params.world = masterPhysics.world;

			}

			var warmup = params.warmup !== undefined ? params.warmup : 60;

			var physics = new MMDPhysics( mesh, params );

			if ( mesh.mixer !== null && mesh.mixer !== undefined && params.preventAnimationWarmup !== true ) {

				this.animateOneMesh( 0, mesh );
				physics.reset();

			}

			physics.warmup( warmup );

			this.updateIKParametersDependingOnPhysicsEnabled( mesh, true );

			mesh.physics = physics;

		},

		getMasterPhysics: function () {

			if ( this.masterPhysics !== null ) return this.masterPhysics;

			for ( var i = 0, il = this.meshes.length; i < il; i ++ ) {

				var physics = this.meshes[ i ].physics;

				if ( physics !== undefined && physics !== null ) {

					this.masterPhysics = physics;
					return this.masterPhysics;

				}

			}

			return null;

		},

		enablePhysics: function ( enabled ) {

			if ( enabled === true ) {

				this.doPhysics = true;

			} else {

				this.doPhysics = false;

			}

			for ( var i = 0, il = this.meshes.length; i < il; i ++ ) {

				this.updateIKParametersDependingOnPhysicsEnabled( this.meshes[ i ], enabled );

			}

		},

		updateIKParametersDependingOnPhysicsEnabled: function ( mesh, physicsEnabled ) {

			var iks = mesh.geometry.iks;
			var bones = mesh.geometry.bones;

			for ( var j = 0, jl = iks.length; j < jl; j ++ ) {

				var ik = iks[ j ];
				var links = ik.links;

				for ( var k = 0, kl = links.length; k < kl; k ++ ) {

					var link = links[ k ];

					if ( physicsEnabled === true ) {

						// disable IK of the bone the corresponding rigidBody type of which is 1 or 2
						// because its rotation will be overriden by physics
						link.enabled = bones[ link.index ].rigidBodyType > 0 ? false : true;

					} else {

						link.enabled = true;

					}

				}

			}

		},

		setAnimations: function () {

			for ( var i = 0; i < this.meshes.length; i ++ ) {

				this.setAnimation( this.meshes[ i ] );

			}

		},

		setAnimation: function ( mesh ) {

			if ( mesh.geometry.animations !== undefined ) {

				mesh.mixer = new AnimationMixer( mesh );

				// TODO: find a workaround not to access (seems like) private properties
				//       the name of them begins with "_".
				mesh.mixer.addEventListener( 'loop', function ( e ) {

					if ( e.action._clip.tracks.length > 0 &&
					     e.action._clip.tracks[ 0 ].name.indexOf( '.bones' ) !== 0 ) return;

					var mesh = e.target._root;
					mesh.looped = true;

				} );

				var foundAnimation = false;
				var foundMorphAnimation = false;

				for ( var i = 0; i < mesh.geometry.animations.length; i ++ ) {

					var clip = mesh.geometry.animations[ i ];

					var action = mesh.mixer.clipAction( clip );

					if ( clip.tracks.length > 0 && clip.tracks[ 0 ].name.indexOf( '.morphTargetInfluences' ) === 0 ) {

						if ( ! foundMorphAnimation ) {

							action.play();
							foundMorphAnimation = true;

						}

					} else {

						if ( ! foundAnimation ) {

							action.play();
							foundAnimation = true;

						}

					}

				}

				if ( foundAnimation ) {

					mesh.ikSolver = new CCDIKSolver( mesh );

					if ( mesh.geometry.grants !== undefined ) {

						mesh.grantSolver = new MMDGrantSolver( mesh );

					}

				}

			}

		},

		setCameraAnimation: function ( camera ) {

			if ( camera.animations !== undefined ) {

				camera.mixer = new AnimationMixer( camera );
				camera.mixer.clipAction( camera.animations[ 0 ] ).play();

			}

		},

		
		unifyAnimationDuration: function ( params ) {

			params = params === undefined ? {} : params;

			var max = 0.0;

			var camera = this.camera;
			var audioManager = this.audioManager;

			// check the longest duration
			for ( var i = 0; i < this.meshes.length; i ++ ) {

				var mesh = this.meshes[ i ];
				var mixer = mesh.mixer;

				if ( mixer === null ) {

					continue;

				}

				for ( var j = 0; j < mixer._actions.length; j ++ ) {

					var action = mixer._actions[ j ];
					max = Math.max( max, action._clip.duration );

				}

			}

			if ( camera !== null && camera.mixer !== null ) {

				var mixer = camera.mixer;

				for ( var i = 0; i < mixer._actions.length; i ++ ) {

					var action = mixer._actions[ i ];
					max = Math.max( max, action._clip.duration );

				}

			}

			if ( audioManager !== null ) {

				max = Math.max( max, audioManager.duration );

			}

			if ( params.afterglow !== undefined ) {

				max += params.afterglow;

			}

			// set the duration
			for ( var i = 0; i < this.meshes.length; i ++ ) {

				var mesh = this.meshes[ i ];
				var mixer = mesh.mixer;

				if ( mixer === null ) {

					continue;

				}

				for ( var j = 0; j < mixer._actions.length; j ++ ) {

					var action = mixer._actions[ j ];
					action._clip.duration = max;

				}

			}

			if ( camera !== null && camera.mixer !== null ) {

				var mixer = camera.mixer;

				for ( var i = 0; i < mixer._actions.length; i ++ ) {

					var action = mixer._actions[ i ];
					action._clip.duration = max;

				}

			}

			if ( audioManager !== null ) {

				audioManager.duration = max;

			}

		},

		controlAudio: function ( delta ) {

			if ( this.audioManager === null ) {

				return;

			}

			this.audioManager.control( delta );

		},

		animate: function ( delta ) {

			this.controlAudio( delta );

			for ( var i = 0; i < this.meshes.length; i ++ ) {

				this.animateOneMesh( delta, this.meshes[ i ] );

			}

			if ( this.sharedPhysics ) this.updateSharedPhysics( delta );

			this.animateCamera( delta );

		},

		animateOneMesh: function ( delta, mesh ) {

			var mixer = mesh.mixer;
			var ikSolver = mesh.ikSolver;
			var grantSolver = mesh.grantSolver;
			var physics = mesh.physics;

			if ( mixer !== null && this.doAnimation === true ) {

				// restore/backupBones are workaround
				// until I make IK, Grant, and Physics Animation plugin
				this.restoreBones( mesh );

				mixer.update( delta );

				this.backupBones( mesh );

			}

			if ( ikSolver !== null && this.doIk === true ) {

				ikSolver.update();

			}

			if ( grantSolver !== null && this.doGrant === true ) {

				grantSolver.update();

			}

			if ( mesh.looped === true ) {

				if ( physics !== null ) physics.reset();

				mesh.looped = false;

			}

			if ( physics !== null && this.doPhysics && ! this.sharedPhysics ) {

				physics.update( delta );

			}

		},

		updateSharedPhysics: function ( delta ) {

			if ( this.meshes.length === 0 || ! this.doPhysics || ! this.sharedPhysics ) return;

			var physics = this.getMasterPhysics();

			if ( physics === null ) return;

			for ( var i = 0, il = this.meshes.length; i < il; i ++ ) {

				var p = this.meshes[ i ].physics;

				if ( p !== null && p !== undefined ) {

					p.updateRigidBodies();

				}

			}

			physics.stepSimulation( delta );

			for ( var i = 0, il = this.meshes.length; i < il; i ++ ) {

				var p = this.meshes[ i ].physics;

				if ( p !== null && p !== undefined ) {

					p.updateBones();

				}

			}

		},

		animateCamera: function ( delta ) {

			if ( this.camera === null ) {

				return;

			}

			var mixer = this.camera.mixer;

			if ( mixer !== null && this.camera.center !== undefined && this.doCameraAnimation === true ) {

				mixer.update( delta );

				// TODO: Let PerspectiveCamera automatically update?
				this.camera.updateProjectionMatrix();

				this.camera.up.set( 0, 1, 0 );
				this.camera.up.applyQuaternion( this.camera.quaternion );
				this.camera.lookAt( this.camera.center );

			}

		},

		poseAsVpd: function ( mesh, vpd, params ) {

			if ( params === undefined ) params = {};

			if ( params.preventResetPose !== true ) mesh.pose();

			var bones = mesh.skeleton.bones;
			var bones2 = vpd.bones;

			var table = {};

			for ( var i = 0; i < bones.length; i ++ ) {

				table[ bones[ i ].name ] = i;

			}

			var thV = new Vector3();
			var thQ = new Quaternion();

			for ( var i = 0; i < bones2.length; i ++ ) {

				var b = bones2[ i ];
				var index = table[ b.name ];

				if ( index === undefined ) continue;

				var b2 = bones[ index ];
				var t = b.translation;
				var q = b.quaternion;

				thV.set( t[ 0 ], t[ 1 ], t[ 2 ] );
				thQ.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

				b2.position.add( thV );
				b2.quaternion.multiply( thQ );

			}

			mesh.updateMatrixWorld( true );

			if ( params.preventIk !== true ) {

				var solver = new CCDIKSolver( mesh );
				solver.update( params.saveOriginalBonesBeforeIK );

			}

			if ( params.preventGrant !== true && mesh.geometry.grants !== undefined ) {

				var solver = new MMDGrantSolver( mesh );
				solver.update();

			}

		},

		
		initBackupBones: function ( mesh ) {

			mesh.skeleton.backupBones = [];

			for ( var i = 0; i < mesh.skeleton.bones.length; i ++ ) {

				mesh.skeleton.backupBones.push( mesh.skeleton.bones[ i ].clone() );

			}

		},

		backupBones: function ( mesh ) {

			mesh.skeleton.backupBoneIsSaved = true;

			for ( var i = 0; i < mesh.skeleton.bones.length; i ++ ) {

				var b = mesh.skeleton.backupBones[ i ];
				var b2 = mesh.skeleton.bones[ i ];
				b.position.copy( b2.position );
				b.quaternion.copy( b2.quaternion );

			}

		},

		restoreBones: function ( mesh ) {

			if ( mesh.skeleton.backupBoneIsSaved !== true ) {

				return;

			}

			mesh.skeleton.backupBoneIsSaved = false;

			for ( var i = 0; i < mesh.skeleton.bones.length; i ++ ) {

				var b = mesh.skeleton.bones[ i ];
				var b2 = mesh.skeleton.backupBones[ i ];
				b.position.copy( b2.position );
				b.quaternion.copy( b2.quaternion );

			}

		}

	};

	exports.MMDLoader = MMDLoader;
	exports.MMDAudioManager = MMDAudioManager;
	exports.MMDGrantSolver = MMDGrantSolver;
	exports.MMDHelper = MMDHelper;

	return exports;

}({}));
