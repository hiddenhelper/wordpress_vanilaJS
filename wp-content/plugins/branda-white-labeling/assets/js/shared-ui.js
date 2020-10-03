/*! Branda - v3.3.2
 * https://premium.wpmudev.org/project/ultimate-branding/
 * Copyright (c) 2020; * Licensed GPLv2+ */
( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Create the defaults once
	var pluginName = 'SUIAccordion',
		defaults = {};

	// The actual plugin constructor
	function SUIAccordion( element, options ) {
		this.element = element;
		this.$element = $( this.element );

		this.settings = $.extend({}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend( SUIAccordion.prototype, {

		init: function() {

			var self = this;

			this.$element.on( 'click', 'div.sui-accordion-item-header, tr.sui-accordion-item', function( event ) {

				var getItem       = $( this ).closest( '.sui-accordion-item' ),
					getContent    = getItem.nextUntil( '.sui-accordion-item' ).filter( '.sui-accordion-item-content' ),
					getParent     = getItem.closest( '.sui-accordion' ),
					getChart      = getItem.find( '.sui-chartjs-animated' )
					;

				var clickedTarget = $( event.target );

				var flexHeader = $( this ),
					flexItem   = flexHeader.parent(),
					flexChart  = flexItem.find( '.sui-chartjs-animated' ),
					flexParent = flexItem.parent()
					;

				var tableItem    = $( this ),
					tableContent = tableItem.nextUntil( '.sui-accordion-item' ).filter( '.sui-accordion-item-content' )
					;

				if ( clickedTarget.closest( '.sui-accordion-item-action' ).length ) {
					return true;
				}

				// CHECK: Flexbox
				if ( flexHeader.hasClass( 'sui-accordion-item-header' ) ) {

					if ( flexItem.hasClass( 'sui-accordion-item--disabled' ) ) {
						flexItem.removeClass( 'sui-accordion-item--open' );
					} else {

						if ( flexItem.hasClass( 'sui-accordion-item--open' ) ) {
							flexItem.removeClass( 'sui-accordion-item--open' );
						} else {
							flexItem.addClass( 'sui-accordion-item--open' );
						}
					}

					// CHECK: Accordion Blocks
					if ( flexParent.hasClass( 'sui-accordion-block' ) && ( 0 !== flexChart.length ) ) {

						flexItem.find( '.sui-accordion-item-data' ).addClass( 'sui-onload' );
						flexChart.removeClass( 'sui-chartjs-loaded' );

						if ( flexItem.hasClass( 'sui-accordion-item--open' ) ) {

							setTimeout( function() {
								flexItem.find( '.sui-accordion-item-data' ).removeClass( 'sui-onload' );
								flexChart.addClass( 'sui-chartjs-loaded' );
							}, 1200 );
						}
					}
				}

				// CHECK: Table
				if ( tableItem.hasClass( 'sui-accordion-item' ) ) {

					if ( tableItem.hasClass( 'sui-accordion-item--disabled' ) ) {
						tableContent.removeClass( 'sui-accordion-item--open' );
					} else {

						if ( tableItem.hasClass( 'sui-accordion-item--open' ) ) {
							tableItem.removeClass( 'sui-accordion-item--open' );
							tableContent.removeClass( 'sui-accordion-item--open' );
						} else {
							tableItem.addClass( 'sui-accordion-item--open' );
							tableContent.addClass( 'sui-accordion-item--open' );
						}
					}
				}

				event.stopPropagation();

			});
		}
	});

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {

			// instance of SUIAccordion can be called with $(element).data('SUIAccordion')
			if ( ! $.data( this, pluginName ) ) {
				$.data( this, pluginName, new SUIAccordion( this, options ) );
			}
		});
	};

}( jQuery, window, document ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.suiAccordion = function( el ) {
		var accordionTable = $( el );

		function init() {
			accordionTable.SUIAccordion({});
		}

		init();

		return this;
	};

	if ( 0 !== $( '.sui-2-3-31 .sui-accordion' ).length ) {

		$( '.sui-2-3-31 .sui-accordion' ).each( function() {
			SUI.suiAccordion( this );
		});
	}

}( jQuery ) );


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
( function( $, ClipboardJS, window, document, undefined ) {

    'use strict';

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'SUICodeSnippet',
        defaults   = {
            copyText: 'Copy',
            copiedText: 'Copied!'
        };

    // The actual plugin constructor
    function SUICodeSnippet( element, options ) {
        this.element = element;
        this.$element = $( this.element );


        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._clipboardJs = null;
        this._clipboardId = '';
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( SUICodeSnippet.prototype, {
        init: function() {
            var self   = this,
                button = '';

            // check if its already wrapped
            if ( 0 === this.$element.parent( 'sui-code-snippet-wrapper' ).length ) {

                // build markup
                this.$element.wrap( '<div class="sui-code-snippet-wrapper"></div>' );
                this._clipboardId = this.generateUniqueId();
                button            = '<button class="sui-button" id="sui-code-snippet-button-' + this._clipboardId + '" data-clipboard-target="#sui-code-snippet-' + this._clipboardId + '">' + this.settings.copyText + '</button>';
                this.$element.attr( 'id', 'sui-code-snippet-' + this._clipboardId ).after( button );
                this._clipboardJs = new ClipboardJS( '#sui-code-snippet-button-' + this._clipboardId );

                // attach events
                this._clipboardJs.on( 'success', function( e ) {
                    e.clearSelection();
                    self.showTooltip( e.trigger, self.settings.copiedText );
                });

                $( '#sui-code-snippet-button-' + this._clipboardId ).on( 'mouseleave.SUICodeSnippet', function() {
                    $( this ).removeClass( 'sui-tooltip' );
                    $( this ).removeAttr( 'aria-label' );
                    $( this ).removeAttr( 'data-tooltip' );
                });
            }
        },

        getClipboardJs: function() {
            return this._clipboardJs;
        },

        showTooltip: function( e, msg ) {
            $( e ).addClass( 'sui-tooltip' );
            $( e ).attr( 'aria-label', msg );
            $( e ).attr( 'data-tooltip', msg );
        },

        generateUniqueId: function() {

            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString( 36 ).substr( 2, 9 );
        },

        destroy: function() {
            if ( null !== this._clipboardJs ) {
                this._clipboardJs.destroy();
                this.$element.attr( 'id', '' );
                this.$element.unwrap( '.sui-code-snippet-wrapper' );
                $( '#sui-code-snippet-button-' + this._clipboardId ).remove();
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {

            // instance of SUICodeSnippet can be called with $(element).data('SUICodeSnippet')
            if ( ! $.data( this, pluginName ) ) {
                $.data( this, pluginName, new SUICodeSnippet( this, options ) );
            }
        });
    };

}( jQuery, ClipboardJS, window, document ) );

( function( $ ) {

    // Enable strict mode.
    'use strict';

    // Define global SUI object if it doesn't exist.
    if ( 'object' !== typeof window.SUI ) {
        window.SUI = {};
    }

    SUI.suiCodeSnippet = function( ) {

        // Convert all code snippet.
        $( '.sui-2-3-31 .sui-code-snippet:not(.sui-no-copy)' ).each( function() {

            // backward compat of instantiate new accordion
            $( this ).SUICodeSnippet({});
        });
    };

    // wait document ready first
    $( document ).ready( function() {
        SUI.suiCodeSnippet();
    });

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.sliderBack = function( el ) {

		var slider = $( el ),
			dialog = slider.closest( '.sui-dialog' ),
			slides = slider.find( '.sui-slider-content > li' )
			;

		var navigation = slider.find( '.sui-slider-navigation' ),
			navButtons = navigation.find( 'button' ),
			btnBack    = navigation.find( '.sui-prev' ),
			btnNext    = navigation.find( '.sui-next' )
			;

		if ( ! dialog.hasClass( 'sui-dialog-onboard' ) ) {
			return;
		}

		function init() {

			var currSlide = slider.find( '.sui-slider-content > li.sui-current' ),
				prevSlide = currSlide.prev()
				;

			if ( ! prevSlide.length ) {

				if ( slider.hasClass( 'sui-infinite' ) ) {

					prevSlide = slider.find( '.sui-slider-content > li:last' );

					currSlide.removeClass( 'sui-current' );
					currSlide.removeClass( 'sui-loaded' );

					prevSlide.addClass( 'sui-current' );
					prevSlide.addClass( 'fadeInLeft' );

					navButtons.prop( 'disabled', true );

					setTimeout( function() {
						prevSlide.addClass( 'sui-loaded' );
						prevSlide.removeClass( 'fadeInLeft' );
					}, 600 );

					setTimeout( function() {
						navButtons.prop( 'disabled', false );
					}, 650 );
				}

			} else {

				currSlide.removeClass( 'sui-current' );
				currSlide.removeClass( 'sui-loaded' );

				prevSlide.addClass( 'sui-current' );
				prevSlide.addClass( 'fadeInLeft' );

				navButtons.prop( 'disabled', true );

				if ( ! slider.hasClass( 'sui-infinite' ) ) {

					btnNext.removeClass( 'sui-hidden' );

					if ( slides.first().data( 'slide' ) === prevSlide.data( 'slide' ) ) {
						btnBack.addClass( 'sui-hidden' );
					}
				}

				setTimeout( function() {
					prevSlide.addClass( 'sui-loaded' );
					prevSlide.removeClass( 'fadeInLeft' );
				}, 600 );

				setTimeout( function() {
					navButtons.prop( 'disabled', false );
				}, 650 );
			}
		}

		init();

		return this;
	};

	SUI.sliderNext = function( el ) {

		var slider = $( el ),
			dialog = slider.closest( '.sui-dialog' ),
			slides = slider.find( '.sui-slider-content > li' )
			;

		var navigation = slider.find( '.sui-slider-navigation' ),
			navButtons = navigation.find( 'button' ),
			btnBack    = navigation.find( '.sui-prev' ),
			btnNext    = navigation.find( '.sui-next' )
			;

		if ( ! dialog.hasClass( 'sui-dialog-onboard' ) ) {
			return;
		}

		function init() {

			var currSlide = slider.find( '.sui-slider-content > li.sui-current' ),
				nextSlide = currSlide.next()
				;

			if ( ! nextSlide.length ) {

				if ( slider.hasClass( 'sui-infinite' ) ) {

					nextSlide = slider.find( '.sui-slider-content > li:first' );

					currSlide.removeClass( 'sui-current' );
					currSlide.removeClass( 'sui-loaded' );

					nextSlide.addClass( 'sui-current' );
					nextSlide.addClass( 'fadeInRight' );

					navButtons.prop( 'disabled', true );

					setTimeout( function() {
						nextSlide.addClass( 'sui-loaded' );
						nextSlide.removeClass( 'fadeInRight' );
					}, 600 );

					setTimeout( function() {
						navButtons.prop( 'disabled', false );
					}, 650 );

				}

			} else {

				currSlide.removeClass( 'sui-current' );
				currSlide.removeClass( 'sui-loaded' );

				nextSlide.addClass( 'sui-current' );
				nextSlide.addClass( 'fadeInRight' );

				navButtons.prop( 'disabled', true );

				if ( ! slider.hasClass( 'sui-infinite' ) ) {

					btnBack.removeClass( 'sui-hidden' );

					if ( slides.length === nextSlide.data( 'slide' ) ) {
						btnNext.addClass( 'sui-hidden' );
					}
				}

				setTimeout( function() {
					nextSlide.addClass( 'sui-loaded' );
					nextSlide.removeClass( 'fadeInRight' );
				}, 600 );

				setTimeout( function() {
					navButtons.prop( 'disabled', false );
				}, 650 );

			}
		}

		init();

		return this;
	};

	SUI.sliderStep = function( el ) {

		var slider = $( el ),
			dialog = slider.closest( '.sui-dialog' )
			;

		var slides = slider.find( '.sui-slider-content' ),
			slide  = slides.find( '> li' )
			;

		var steps  = slider.find( '.sui-slider-steps' ),
			step   = steps.find( 'li' ),
			button = step.find( 'button' )
			;

		var navigation = slider.find( '.sui-slider-navigation' ),
			navButtons = navigation.find( 'button' ),
			navBack    = navigation.find( '.sui-prev' ),
			navNext    = navigation.find( '.sui-next' )
			;

		if ( ! dialog.hasClass( 'sui-dialog-onboard' ) && ! steps.hasClass( 'sui-clickable' ) ) {
			return;
		}

		function reset() {

			// Remove current class
			slide.removeClass( 'sui-current' );

			// Remove loaded state
			slide.removeClass( 'sui-loaded' );

		}

		function load( element ) {

			var button  = $( element ),
				index   = button.data( 'slide' )
				;

			var curSlide = button.closest( 'li[data-slide]' ),
				newSlide  = slides.find( '> li[data-slide="' + index + '"]' )
				;

			newSlide.addClass( 'sui-current' );

			if ( curSlide.data( 'slide' ) < newSlide.data( 'slide' ) ) {
				newSlide.addClass( 'fadeInRight' );
			} else {
				newSlide.addClass( 'fadeInLeft' );
			}

			navButtons.prop( 'disabled', true );

			if ( ! slider.hasClass( 'sui-infinite' ) ) {

				if ( 1 === newSlide.data( 'slide' ) ) {
					navBack.addClass( 'sui-hidden' );
					navNext.removeClass( 'sui-hidden' );
				}

				if ( slide.length === newSlide.data( 'slide' ) ) {
					navBack.removeClass( 'sui-hidden' );
					navNext.addClass( 'sui-hidden' );
				}
			}

			setTimeout( function() {

				newSlide.addClass( 'sui-loaded' );

				if ( curSlide.data( 'slide' ) < newSlide.data( 'slide' ) ) {
					newSlide.removeClass( 'fadeInRight' );
				} else {
					newSlide.removeClass( 'fadeInLeft' );
				}
			}, 600 );

			setTimeout( function() {
				navButtons.prop( 'disabled', false );
			}, 650 );
		}

		function init() {

			if ( button.length ) {

				button.on( 'click', function( e ) {

					reset();

					load( this );

					e.preventDefault();
					e.stopPropagation();

				});
			}
		}

		init();

		return this;
	};

	SUI.dialogSlider = function( el ) {

		var slider   = $( el ),
			dialog   = slider.closest( '.sui-dialog' ),
			btnBack  = slider.find( '.sui-slider-navigation .sui-prev' ),
			btnNext  = slider.find( '.sui-slider-navigation .sui-next' ),
			tourBack = slider.find( '*[data-a11y-dialog-tour-back]' ),
			tourNext = slider.find( '*[data-a11y-dialog-tour-next]' ),
			steps    = slider.find( '.sui-slider-steps' )
			;

		if ( ! dialog.hasClass( 'sui-dialog-onboard' ) || slider.hasClass( 'sui-slider-off' ) ) {
			return;
		}

		function init() {

			if ( btnBack.length ) {

				btnBack.on( 'click', function( e ) {

					SUI.sliderBack( slider );

					e.preventDefault();

				});
			}

			if ( tourBack.length ) {

				tourBack.on( 'click', function( e ) {

					SUI.sliderBack( slider );

					e.preventDefault();

				});
			}

			if ( btnNext.length ) {

				btnNext.on( 'click', function( e ) {

					SUI.sliderNext( slider );

					e.preventDefault();

				});
			}

			if ( tourNext.length ) {

				tourNext.on( 'click', function( e ) {

					SUI.sliderNext( slider );

					e.preventDefault();

				});
			}

			if ( steps.length ) {
				SUI.sliderStep( slider );
			}
		}

		init();

		return this;
	};

	$( '.sui-2-3-31 .sui-slider' ).each( function() {
		SUI.dialogSlider( this );
	});

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.linkDropdown = function() {

		function closeAllDropdowns( $except ) {

			var $dropdowns = $( '.sui-2-3-31 .sui-dropdown' );

			if ( $except ) {
				$dropdowns = $dropdowns.not( $except );
			}

			$dropdowns.removeClass( 'open' );

		}

		$( 'body' ).on( 'click', '.sui-dropdown-anchor', function( e ) {

			var $button = $( this ),
				$parent = $button.parent();

			closeAllDropdowns( $parent );

			if ( $parent.hasClass( 'sui-dropdown' ) ) {
				$parent.toggleClass( 'open' );
			}

			e.preventDefault();

		});

		$( 'body' ).mouseup( function( e ) {

			var $anchor = $( '.sui-2-3-31 .sui-dropdown-anchor' );

			if ( ( ! $anchor.is( e.target ) ) && ( 0 === $anchor.has( e.target ).length ) ) {
				closeAllDropdowns();
			}

		});

	};

	SUI.linkDropdown();

}( jQuery ) );

// This file is to be used for fixing up issues with IE11.

( function( $ ) {

    var colorpickers = $( '.sui-colorpicker-wrap' );

    // If IE11 remove SUI colorpicker styles.
    if ( !! navigator.userAgent.match( /Trident\/7\./ ) && colorpickers[0]) {
        colorpickers.find( '.sui-colorpicker' ).hide();
        colorpickers.removeClass( 'sui-colorpicker-wrap' );
    }

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	document.addEventListener( 'DOMContentLoaded', function() {
		var mainEl = $( '.sui-wrap' );
		if ( undefined === SUI.dialogs ) {
			SUI.dialogs = {};
		}

		// Init the dialog elements.
		$( '.sui-2-3-31 .sui-dialog' ).each( function() {
			if ( ! SUI.dialogs.hasOwnProperty( this.id ) ) {
				SUI.dialogs[this.id] = new A11yDialog( this, mainEl );
			}
		});

	});

}( jQuery ) );

( function( $ ) {

	// This will auto hide the top notice if the classes .sui-can-dismiss or .sui-cant-dismiss aren't present.
	$( '.sui-2-3-31 .sui-notice-top:not(.sui-can-dismiss, .sui-cant-dismiss)' ).delay( 3000 ).slideUp( 'slow' );

	$( '.sui-2-3-31 .sui-notice-dismiss' ).click( function( e ) {
		e.preventDefault();

        $( this ).parent().stop().slideUp( 'slow' );

		return false;
	});

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.showHidePassword = function() {

		$( '.sui-2-3-31 .sui-form-field' ).each( function() {

			var $this = $( this );

			if ( 0 !== $this.find( 'input[type="password"]' ).length ) {

				$this.find( '[class*="sui-button"], .sui-password-toggle' ).off( 'click.toggle-password' ).on( 'click.toggle-password', function() {

					var $button = $( this ),
						$input  = $button.parent().find( 'input' ),
						$icon   = $button.find( 'i' )
						;

					$button.parent().toggleClass( 'sui-password-visible' );
					$button.find( '.sui-password-text' ).toggleClass( 'sui-hidden' );

					if ( $button.parent().hasClass( 'sui-password-visible' ) ) {
						$input.prop( 'type', 'text' );
						$icon.removeClass( 'sui-icon-eye' ).addClass( 'sui-icon-eye-hide' );
					} else {
						$input.prop( 'type', 'password' );
						$icon.removeClass( 'sui-icon-eye-hide' ).addClass( 'sui-icon-eye' );
					}

				});

			}

		});

	};

	SUI.showHidePassword();

}( jQuery ) );

( function( $ ) {

    var endpoint = 'https://api.reviews.co.uk/merchant/reviews?store=wpmudev-org';

    // Update the reviews with the live stats.
    $( '.sui-2-3-31 .sui-reviews' ).each( function() {
        var review = $( this );
        $.get( endpoint, function( data ) {
            var stars = Math.round( data.stats.average_rating );
            var starsBlock = review.find( '.sui-reviews__stars' )[ 0 ];
            var i;
            for ( i = 0; i < stars; i++ ) {
                starsBlock.innerHTML += '<i class="sui-icon-star" aria-hidden="true"></i> ';
            }
            review.find( '.sui-reviews-rating' )[ 0 ].innerHTML = data.stats.average_rating;
            review.find( '.sui-reviews-customer-count' )[ 0 ].innerHTML = data.stats.total_reviews;
        });
    });

}( jQuery ) );

( function( $ ) {

    // Enable strict mode.
    'use strict';

    // Define global SUI object if it doesn't exist.
    if ( 'object' !== typeof window.SUI ) {
        window.SUI = {};
    }

    SUI.loadCircleScore = function( el ) {
		var dial          = $( el ).find( 'svg circle:last-child' ),
			score         = $( el ).data( 'score' ),
			radius        = 42,
			circumference = 2 * Math.PI * radius,
			dashLength    = ( circumference / 100 ) * score,
			gapLength     = dashLength * 100 - score,
			svg           =
				'<svg viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n' +
					'<circle stroke-width="16" cx="50" cy="50" r="42" />\n' +
					'<circle stroke-width="16" cx="50" cy="50" r="42" stroke-dasharray="0,' + gapLength + '" />\n' +
				'</svg>\n' +
				'<span class="sui-circle-score-label">' + score + '</span>\n';

		// Add svg to score element, add loaded class, & change stroke-dasharray to represent target score/percentage.
		$( el ).prepend( svg ).addClass( 'loaded' ).find( 'circle:last-child' ).css( 'animation', 'sui' + score + ' 3s forwards' );
	};

	$( '.sui-2-3-31 .sui-circle-score' ).each( function() {
		SUI.loadCircleScore( this );
	});

}( jQuery ) );

( function( $ ) {

    // Enable strict mode.
    'use strict';

    // Define global SUI object if it doesn't exist.
    if ( 'object' !== typeof window.SUI ) {
        window.SUI = {};
    }

    SUI.suiSelect = function( el ) {
		var jq = $( el ),
			wrap, handle, list, value, items;

		if ( ! jq.is( 'select' ) ) {
			return;
		}

		if ( jq.closest( '.select-container' ).length || jq.data( 'select2' ) || jq.is( '.sui-select' )  || jq.is( '.none-sui' ) ) {
			return;
		}

		// Add the DOM elements to style the select list.
		function setupElement() {

			// Wrap select
			jq.wrap( '<div class="select-container">' );

			// Hide select
			jq.attr( 'aria-hidden', true );
			jq.attr( 'hidden', true );
			jq.hide();

			wrap = jq.parent();

			handle = $( '<span class="dropdown-handle" aria-hidden="true"><i class="sui-icon-chevron-down"></i></span>' ).prependTo( wrap );
			list = $( '<div class="select-list-container"></div>' ).appendTo( wrap );
			value = $( '<button type="button" class="list-value" aria-haspopup="listbox">&nbsp;</button>' ).appendTo( list );
			items = $( '<ul tabindex="-1" role="listbox" class="list-results"></ul>' ).appendTo( list );

			wrap.addClass( jq.attr( 'class' ) );

			value.attr( 'id', jq.attr( 'id' ) + '-button' );
			value.attr( 'aria-labelledby', jq.attr( 'aria-labelledby' ) + ' ' + value.attr( 'id' ) );

			items.attr( 'id', jq.attr( 'id' ) + '-list' );
			items.attr( 'aria-labelledby', jq.attr( 'aria-labelledby' ) );

		}

		// When changing selection using JS, you need to trigger a 'sui:change' event
		// eg: $('select').val('4').trigger('sui:change')
		function handleSelectionChange() {

			jq.on( 'sui:change', function() {

				// We need to re-populateList to handle dynamic select options added via JS/ajax.
				populateList();

				items.find( 'li' ).not( '.optgroup-label' ).on( 'click', function onItemClick( ev ) {
					var opt = $( ev.target );
					selectItem( opt, false, opt.data( 'color' ) );
					handleValue();
				});
			});
		}

		// Add all the options to the new DOM elements.
		function populateList() {
            var children = jq.children();
			items.empty();
            children.each( function() {
                var opt = $( this ),
                    item,
					optgroup = $( this ),
                    optGroupItem,
                    $label;
                if ( 'OPTION' == $( this ).prop ( 'tagName' ) ) {

					item = $( '<li></li>' ).appendTo( items );
					item.attr( 'role', 'option' );

					if ( opt.data( 'content' ) ) {
						item.addClass( 'sui-element-flex' );
						item.html( '<span>' + opt.text() + '</span><span>' + opt.data( 'content' ) + '</span>' );
					} else if ( opt.data( 'icon' ) ) {
						item.html( '<i class="sui-icon-' + opt.data( 'icon' ) + '" aria-hidden="true"></i> ' + opt.text() );
					} else if ( opt.data( 'color' ) ) {
						item.html( '<span style="background-color: ' + opt.data( 'color' ) + '" data-color="' + opt.data( 'color' ) + '" aria-hidden="true"></span>' + opt.text() );
					} else {
						item.text( opt.text() );
					}

					if ( opt.is( ':disabled' ) ) {
						item.addClass( 'sui-disabled' );
					}

					items.attr( 'aria-activedescendant', jq.attr( 'id' ) + '-option-' + opt.val() );
					item.attr( 'id', jq.attr( 'id' ) + '-option-' + opt.val() );

					item.data( 'value', opt.val() );
					item.data( 'color', opt.data( 'color' ) );

                    if ( opt.val() == jq.val() ) {
                        selectItem( item, true, opt.data( 'color' ) );
                    }
                } else {
                    optGroupItem = $( '<ul></ul>' ).appendTo( items );
                    $label = $( '<li class="optgroup-label"></li>' ).text( optgroup.prop( 'label' ) );

                    optGroupItem.html( $label );
                    optGroupItem.addClass( 'optgroup' );

                    optgroup.find( 'option' ).each( function onPopulateLoop() {
                        var opt = $( this ),
                            item;
                        item = $( '<li></li>' ).appendTo( optGroupItem );
                        item.text( opt.text() );
                        item.data( 'value', opt.val() );

                        if ( opt.val() == jq.val() ) {
                            selectItem( item );
                        }
                    });
                }

            });
		}

		// Checks the option value for a link.
		function handleValue() {
			var val = jq[0].value;

			// If option is link, navigate to it.
			if ( val.match( '^https?:\/\/|#' ) ) {
				window.location.href = val;
			}
		}

		// Toggle the dropdown state between open/closed.
		function stateToggle() {
			if ( wrap.find( 'select' ).is( ':disabled' ) ) {
				return;
			}
			if ( ! wrap.hasClass( 'active' ) ) {
				stateOpen();
			} else {
				stateClose();
			}
		}

		// Close the dropdown list.
		function stateClose( item ) {
			if ( ! item ) {
				item = wrap;
			}

			item.removeClass( 'active' );
			item.closest( 'tr' ).removeClass( 'select-open' );
			item.find( '.list-value' ).removeAttr( 'aria-expanded' );
		}

		// Open the dropdown list.
		function stateOpen() {
			$( '.select-container.active' ).each( function() {
				stateClose( $( this ) );
			});

			wrap.addClass( 'active' );
			wrap.closest( 'tr' ).addClass( 'select-open' );
			wrap.find( '.list-value' ).attr( 'aria-expanded', true );
		}

		// Visually mark the specified option as "selected".
		function selectItem( opt, isInit, optColor ) {

			isInit = 'undefined' === typeof isInit ? false : isInit;

			if ( undefined !== optColor && '' !== optColor ) {
				value.html( '<span style="background-color: ' + optColor + '" data-color="' + optColor + '"></span>' + opt.text() );
			} else {
				value.text( opt.text() );
			}

			$( '.current', items ).removeAttr( 'aria-selected' );
			$( '.current', items ).removeClass( 'current' );
			opt.addClass( 'current' );
			opt.attr( 'aria-selected', true );
			items.attr( 'aria-activedescendant', opt.attr( 'id' ) );
			stateClose();

			// Also update the select list value.
			jq.val( opt.data( 'value' ) );

			if ( ! isInit ) {
				jq.trigger( 'change' );
			}

		}

		// Element constructor.
		function init() {
			var selectID;

			setupElement();
			populateList();
			handleSelectionChange();

			items.find( 'li' ).not( '.optgroup-label' ).on( 'click', function onItemClick( ev ) {
				var opt = $( ev.target );
				selectItem( opt, false, opt.data( 'color' ) );
				handleValue();
			});

			handle.on( 'click', stateToggle );
			value.on( 'click', stateToggle );
			jq.on( 'focus', stateOpen );

			$( document ).click( function onOutsideClick( ev ) {
				var jq = $( ev.target ),
					selectID;

				if ( jq.closest( '.select-container' ).length ) {
					return;
				}

				if ( jq.is( 'label' ) && jq.attr( 'for' ) ) {
					selectID = jq.attr( 'for' );

					if ( $( 'select#' + selectID ).length ) {
						return;
					}
				}

				stateClose();
			});

			selectID = jq.attr( 'id' );

			if ( selectID ) {
				$( 'label[for=' + selectID + ']' ).on( 'click', stateOpen );
			}

			jq.addClass( 'sui-styled' );
		}

		init();

		return this;
	};

	// Convert all select lists to fancy sui Select lists.
	$( '.sui-2-3-31 select:not([multiple])' ).each( function() {
		SUI.suiSelect( this );
	});

}( jQuery ) );

( function( $ ) {

	// Convert all select lists to fancy sui Select lists.
    if ( $( '.sui-color-accessible' )[0]) {
        $( '.sui-select' ).SUIselect2({
            dropdownCssClass: 'sui-select-dropdown sui-color-accessible'
        });
        $( '.sui-variables' ).SUIselect2({
            dropdownCssClass: 'sui-variables-dropdown sui-color-accessible'
        });
    } else {
        $( '.sui-select' ).SUIselect2({
            dropdownCssClass: 'sui-select-dropdown'
        });
        $( '.sui-variables' ).SUIselect2({
            dropdownCssClass: 'sui-variables-dropdown'
        });
    }

}( jQuery ) );

( function( $ ) {

	// Enable strict mode
	'use strict';

	// Define global SUI object if it doesn't exist
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.sideTabs = function( element ) {

		var $this 	   = $( element ),
			$label     = $this.parent( 'label' ),
			$data      = $this.data( 'tab-menu' ),
			$wrapper   = $this.closest( '.sui-side-tabs' ),
			$alllabels = $wrapper.find( '>.sui-tabs-menu .sui-tab-item' ),
			$allinputs = $alllabels.find( 'input' ),
			newContent
			;

		$this.on( 'click', function( e ) {

			$alllabels.removeClass( 'active' );
			$allinputs.removeAttr( 'checked' );
			$wrapper.find( '.sui-tabs-content>div[data-tab-content]' ).removeClass( 'active' );

			$label.addClass( 'active' );
			$this.attr( 'checked', 'checked' );

			newContent = $wrapper.find( '.sui-tabs-content div[data-tab-content="' + $data + '"]' );

			if ( newContent.length ) {
				newContent.addClass( 'active' );
			}
		});

	};

	$( '.sui-2-3-31 .sui-side-tabs label.sui-tab-item input' ).each( function() {
		SUI.sideTabs( this );
	});

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.floatInput = function() {

		$( 'body' ).ready( function() {

			var $moduleName = $( '.sui-sidenav .sui-with-floating-input' ),
				$pageHeader = $( '.sui-header-inline' ),
				$pageTitle  = $pageHeader.find( '.sui-header-title' )
				;

			var $titleWidth = $pageTitle.width(),
				$navWidth   = $pageHeader.next().find( '.sui-sidenav' ).width()
				;

			if ( $titleWidth > $navWidth ) {

				$moduleName.each( function() {

					$( this ).css({
						'left': ( $titleWidth + 20 ) + 'px'
					});
				});
			}

		});
	};

	SUI.floatInput();

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

    var _$stickies = [].slice.call(document.querySelectorAll('.sui-box-sticky'));

    _$stickies.forEach(function(_$sticky){
        if (CSS.supports && CSS.supports('position', 'sticky')) {
            apply_sticky_class(_$sticky);

            window.addEventListener('scroll', function(){
                apply_sticky_class(_$sticky);
            })
        }
    });

    function apply_sticky_class(_$sticky){
        var currentOffset = _$sticky.getBoundingClientRect().top;
        var stickyOffset = parseInt( getComputedStyle(_$sticky).top.replace('px','') );
        var isStuck = currentOffset <= stickyOffset;

        if (isStuck) {
            _$sticky.classList.add('sui-is-sticky');
        } else {
            _$sticky.classList.remove('sui-is-sticky');
        }
    }
}( jQuery ) );

( function( $ ) {

    // Enable strict mode.
    'use strict';

    // Define global SUI object if it doesn't exist.
    if ( 'object' !== typeof window.SUI ) {
        window.SUI = {};
    }

    SUI.suiTabs = function( config ) {

        var data;
        var types = [ 'tab', 'pane' ];
        var type;
        var groups = [];
        var activeGroups = [];
        var activeChildren = [];
        var activeItems = [];
        var indexGroup;
        var indexItem;
        var memory = [];

        function init( options ) {
            var groupIndex;
            var tabItems;
            var itemIndex;
            var hashId;
            data = options;
            setDefaults();

            groups.tab = document.querySelectorAll( data.tabGroup );
            groups.pane = document.querySelectorAll( data.paneGroup );

            for ( groupIndex = 0; groupIndex < groups.tab.length; groupIndex++ ) {
                tabItems = groups.tab[groupIndex].children;

                for ( itemIndex = 0; itemIndex < tabItems.length; itemIndex++ ) {
                    tabItems[itemIndex].addEventListener( 'click', onClick.bind( this, groupIndex, itemIndex ), false );

                    indexGroup = groupIndex;
                    indexItem = itemIndex;

                    if ( window.location.hash ) {
                        hashId = window.location.hash.replace( /[^\w-_]/g, '' );

                        if ( hashId === tabItems[itemIndex].id ) {
                            setNodes( groupIndex, itemIndex );
                        }
                    }
                }

            }
        }

        function onClick( groupIndex, itemIndex ) {
            setNodes( groupIndex, itemIndex );

            setCallback( indexGroup, indexItem );
        }

        function setNodes( groupIndex, itemIndex ) {
            var i;
            indexGroup = groupIndex;
            indexItem = itemIndex;

            for ( i = 0; i < types.length; i++ ) {
                type = types[i];

                setActiveGroup();
                setActiveChildren();
                setActiveItems();
                putActiveClass();
            }

            memory[groupIndex] = [];
            memory[groupIndex][itemIndex] = true;

        }

        function putActiveClass() {
            var i;
            for ( i = 0; i < activeChildren[type].length; i++ ) {
                activeChildren[type][i].classList.remove( data[type + 'Active']);
            }

            activeItems[type].classList.add( data[type + 'Active']);
        }

        function setDefaults() {
            var i;
            for ( i = 0; i < types.length; i++ ) {
                type = types[i];

                setOption( type + 'Group', '[data-' + type + 's]' );
                setOption( type + 'Active', 'active' );
            }
        }

        function setOption( key, value ) {
            data = data || [];
            data[key] = data[key] || value;
        }

        function setActiveGroup() {
            activeGroups[type] = groups[type][indexGroup];
        }

        function setActiveChildren() {
            activeChildren[type] = activeGroups[type].children;
        }

        function setActiveItems() {
            activeItems[type] = activeChildren[type][indexItem];
        }

        function setCallback() {
            if ( 'function' === typeof data.callback ) {
                data.callback( activeItems.tab, activeItems.pane );
            }
        }

        return init( config );
    };

	SUI.tabsOverflow = function( $el ) {

		var tabs = $el.closest( '.sui-tabs' ).find( '[data-tabs], [role="tablist"]' ),
            leftButton = $el.find( '.sui-tabs-navigation--left' ),
            rightButton = $el.find( '.sui-tabs-navigation--right' );

        function overflowing() {
            if ( tabs[0].scrollWidth > tabs.width() ) {
                if ( 0 === tabs.scrollLeft() ) {
                    leftButton.addClass( 'sui-tabs-navigation--hidden' );
                } else {
                    leftButton.removeClass( 'sui-tabs-navigation--hidden' );
                }
                reachedEnd( 0 );
                return true;
            } else {
                leftButton.addClass( 'sui-tabs-navigation--hidden' );
                rightButton.addClass( 'sui-tabs-navigation--hidden' );
                return false;
            }
        }
        overflowing();

        function reachedEnd( offset ) {
            var newScrollLeft,
                width,
                scrollWidth;
            newScrollLeft = tabs.scrollLeft() + offset;
            width = tabs.outerWidth();
            scrollWidth = tabs.get( 0 ).scrollWidth;

            if ( scrollWidth - newScrollLeft <= width ) {
                rightButton.addClass( 'sui-tabs-navigation--hidden' );
            } else {
                rightButton.removeClass( 'sui-tabs-navigation--hidden' );
            }
        }

		leftButton.click( function() {
            rightButton.removeClass( 'sui-tabs-navigation--hidden' );
            if ( 0 >= tabs.scrollLeft() - 150 ) {
                leftButton.addClass( 'sui-tabs-navigation--hidden' );
            }
            tabs.animate({
                scrollLeft: '-=150'
            }, 400, function() {
            });
            return false;
        });
		rightButton.click( function() {
            leftButton.removeClass( 'sui-tabs-navigation--hidden' );
            reachedEnd( 150 );
            tabs.animate({
                scrollLeft: '+=150'
            }, 400, function() {
            });

            return false;
        });


        $( window ).resize( function() {
            overflowing();
        });

        tabs.scroll( function() {
            overflowing();
        });
	};

	SUI.tabs = function() {

		var tablist = $( '.sui-tabs > div[role="tablist"]' );

		// For easy reference.
		var keys = {
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			delete: 46,
			enter: 13,
			space: 32
		};

		// Add or substract depending on key pressed.
		var direction = {
			37: -1,
			38: -1,
			39: 1,
			40: 1
		};

		// Prevent function from running if tablist does not exist.
		if ( ! tablist.length ) {
			return;
		}

		// Deactivate all tabs and tab panels.
		function deactivateTabs( tabs, panels ) {

			tabs.removeClass( 'active' );
			tabs.attr( 'tabindex', '-1' );
			tabs.attr( 'aria-selected', false );

			panels.removeClass( 'active' );
			panels.attr( 'hidden', true );

		}

		// Activate current tab panel.
		function activateTab( tab ) {

			var tabs     = $( tab ).closest( '[role="tablist"]' ).find( '[role="tab"]' ),
				panels   = $( tab ).closest( '.sui-tabs' ).find( '> .sui-tabs-content > [role="tabpanel"]' ),
				controls = $( tab ).attr( 'aria-controls' ),
				panel    = $( '#' + controls )
				;

			deactivateTabs( tabs, panels );

			$( tab ).addClass( 'active' );
			$( tab ).removeAttr( 'tabindex' );
			$( tab ).attr( 'aria-selected', true );

			panel.addClass( 'active' );
			panel.attr( 'hidden', false );
			panel.removeAttr( 'hidden' );

		}

		// When a "tablist" aria-orientation is set to vertical,
		// only up and down arrow should function.
		// In all other cases only left and right should function.
		function determineOrientation( event, index, tablist ) {

			var key      = event.keyCode || event.which,
				vertical = 'vertical' === $( tablist ).attr( 'aria-orientation' ),
				proceed  = false
				;

			// Check if aria orientation is set to vertical.
			if ( vertical ) {

				if ( keys.up === key || keys.down === key ) {
					event.preventDefault();
					proceed = true;
				}
			} else {

				if ( keys.left === key || keys.right === key ) {
					proceed = true;
				}
			}

			if ( true === proceed ) {
				switchTabOnArrowPress( event, index );
			}
		}

		// Either focus the next, previous, first, or last tab
		// depending on key pressed.
		function switchTabOnArrowPress( event, index ) {

			var pressed, target, tabs;

			pressed = event.keyCode || event.which;

			if ( direction[pressed]) {

				target = event.target;
				tabs   = $( target ).closest( '[role="tablist"]' ).find( '> [role="tab"]' );

				if ( undefined !== index ) {

					if ( tabs[index + direction[pressed] ]) {
						tabs[index + direction[pressed] ].focus();
					} else if ( keys.left === pressed || keys.up === pressed ) {
						tabs[tabs.length - 1].focus();
					} else if ( keys.right === pressed || keys.down === pressed ) {
						tabs[0].focus();
					}
				}
			}
		}

		// When a tab is clicked, activateTab is fired to activate it.
		function clickEventListener( event ) {
			var tab = event.target;
			activateTab( tab );
		}

		function keydownEventListener( event, index, tablist ) {

			var key = event.keyCode || event.which;

			switch ( key ) {

				case keys.end :

					event.preventDefault();

					// Actiavte last tab.
					// focusLastTab();

					break;

				case keys.home :

					event.preventDefault();

					// Activate first tab.
					// focusFirstTab();

					break;

				// Up and down are in keydown
				// because we need to prevent page scroll.
				case keys.up :
				case keys.down :
					determineOrientation( event, index, tablist );
					break;
			}
		}

		function keyupEventListener( event, index, tablist ) {

			var key = event.keyCode || event.which;

			switch ( key ) {

				case keys.left :
				case keys.right :
					determineOrientation( event, index, tablist );
					break;

				case keys.enter :
				case keys.space :
					activateTab( event );
					break;
			}
		}

		function init() {

			var tabgroup = tablist.closest( '.sui-tabs' );

			// Run the function for each group of tabs to prevent conflicts
			// when having child tabs.
			tabgroup.each( function() {

				var tabs, panels, index;

				tabgroup = $( this );
				tablist  = tabgroup.find( '> [role="tablist"]' );
				tabs     = tablist.find( '> [role="tab"]' );
				panels   = tabgroup.find( '> .sui-tabs-content > [role="tabpanel"]' );

				// Trigger events on click.
				tabs.on( 'click', function( e ) {
					clickEventListener( e );

				// Trigger events when pressing key.
				}).keydown( function( e ) {
					index = $( this ).index();
					keydownEventListener( e, index, tablist );

				// Trigger events when releasing key.
				}).keyup( function( e ) {
					index = $( this ).index();
					keyupEventListener( e, index, tablist );

				});
			});
		}

		init();

		return this;

	};

    if ( 0 !== $( '.sui-2-3-31 .sui-tabs' ).length ) {

		// Support tabs new markup.
		SUI.tabs();

		// Support legacy tabs.
		SUI.suiTabs();

		$( '.sui-2-3-31 .sui-tabs-navigation' ).each( function() {
			SUI.tabsOverflow( $( this ) );
		});
    }

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
        window.SUI = {};
	}

	SUI.treeOnLoad = function( element ) {

		var tree     = $( element ),
			leaf     = tree.find( 'li[role="treeitem"]' ),
			branch   = leaf.find( '> ul[role="group"]' )
			;

		// Hide sub-groups
		branch.slideUp();


		leaf.each( function() {

			var leaf       = $( this ),
				openLeaf   = leaf.attr( 'aria-expanded' ),
				checkLeaf  = leaf.attr( 'aria-selected' ),
				node       = leaf.find( '> .sui-tree-node' ),
				checkbox   = node.find( '> .sui-node-checkbox' ),
				button     = node.find( '> span[role="button"], > button' ),
				icon       = node.find( '> span[aria-hidden]' ),
				branch     = leaf.find( '> ul[role="group"]' ),
				innerLeaf  = branch.find( '> li[role="treeitem"]' ),
				innerCheck = innerLeaf.find( '> .sui-tree-node > .sui-node-checkbox' )
				;

			// FIX: Remove unnecessary elements for leafs
			if ( ( 'selector' === tree.data( 'tree' ) || 'selector' === tree.attr( 'data-tree' ) ) && 0 !== icon.length ) {
				button.remove();
			}

			if ( typeof undefined !== typeof openLeaf && false !== openLeaf ) {

				// Open sub-groups
				if ( 'true' === openLeaf ) {
					branch.slideDown();
				}
			} else {

				if ( 0 !== branch.length ) {
					leaf.attr( 'aria-expanded', 'false' );
				} else {

					// FIX: Remove unnecessary elements for leafs
					if ( 0 !== button.length ) {
						button.remove();
					}
				}
			}

			if ( typeof undefined !== typeof checkLeaf && false !== checkLeaf ) {

				// Checked leafs
				if ( 'true' === checkLeaf && 0 < branch.length ) {

					innerLeaf.attr( 'aria-selected', 'true' );

					if ( 0 !== checkbox.length && checkbox.is( 'label' ) ) {
						checkbox.find( 'input' ).prop( 'checked', true );
					}

					if ( 0 !== innerCheck.length && innerCheck.is( 'label' ) ) {
						innerCheck.find( 'input' ).prop( 'checked', true );
					}
				}
			} else {

				// Unchecked leafs
				leaf.attr( 'aria-selected', 'false' );

				if ( 0 !== checkbox.length && checkbox.is( 'label' ) ) {
					checkbox.find( 'input' ).prop( 'checked', false );
				}
			}
		});
	};

	SUI.treeButton = function( element ) {

		var button = $( element );

		button.on( 'click', function( e ) {

			var button = $( this ),
				leaf   = button.closest( 'li[role="treeitem"]' ),
				branch = leaf.find( '> ul[role="group"]' )
				;

			if ( 0 !== branch.length ) {

				branch.slideToggle( 250 );

				if ( 'true' === leaf.attr( 'aria-expanded' ) ) {
					leaf.attr( 'aria-expanded', 'false' );
				} else {
					leaf.attr( 'aria-expanded', 'true' );
				}
			}

			e.preventDefault();

		});
	};

	SUI.treeCheckbox = function( element ) {

		var checkbox = $( element );

		checkbox.on( 'click', function() {

			var checkbox  = $( this ),
				leaf      = checkbox.closest( 'li[role="treeitem"]' ),
				branches  = leaf.find( 'ul[role="group"]' ),
				leafs     = branches.find( '> li[role="treeitem"]' ),
				checks    = leafs.find( '> .sui-tree-node > .sui-node-checkbox input' ),
				topBranch = leaf.parent( 'ul' ),
				topLeaf   = topBranch.parent( 'li' )
				;

			var	countIndex = 0,
				countTopBranches = ( topLeaf.parents( 'ul' ).length - 1 )
				;

			if ( 'true' === leaf.attr( 'aria-selected' ) ) {

				// Unselect current leaf
				leaf.attr( 'aria-selected', 'false' );

				// Unselect current checkbox
				if ( checkbox.is( 'input' ) ) {
					checkbox.prop( 'checked', false );
				}

				// Unselect child leafs
				if ( 0 !== branches.length ) {
					leafs.attr( 'aria-selected', 'false' );
				}

				// Unselect child checkboxes
				if ( 0 !== checks.length ) {
					checks.prop( 'checked', false );
				}

				// Unselect branch(es) when not all leafs are selected
				if ( leaf.parent().is( 'ul' ) && 'group' === leaf.parent().attr( 'role' ) ) {

					leaf.parents( 'ul' ).each( function() {

						var branch = $( this ),
							leaf   = branch.parent( 'li' ),
							check  = leaf.find( '> .sui-tree-node > .sui-node-checkbox input' )
							;

						if ( 'treeitem' === leaf.attr( 'role' ) ) {

							leaf.attr( 'aria-selected', 'false' );

							if ( 0 !== check.length ) {
								check.prop( 'checked', false );
							}
						}
					});
				}
			} else {

				// Select current leaf
				leaf.attr( 'aria-selected', 'true' );

				// Select current checkbox
				if ( checkbox.is( 'input' ) ) {
					checkbox.prop( 'checked', true );
				}

				// Select child leafs
				if ( 0 !== branches.length ) {
					leafs.attr( 'aria-selected', 'true' );
				}

				// Select child checkboxes
				if ( 0 !== checks.length ) {
					checks.prop( 'checked', true );
				}

				// Select top branch(es) when all leafs are selected
				if ( 0 === topLeaf.find( 'li[aria-selected="false"]' ).length ) {

					topLeaf.attr( 'aria-selected', 'true' );

					for ( countIndex = 0; countTopBranches >= countIndex; countIndex++ ) {

						topLeaf.parent( 'ul' ).eq( countIndex ).each( function() {

							var branch     = $( this ),
								leafFalse  = branch.find( '> li[aria-selected="false"]' )
								;

							if ( 0 === leafFalse.length ) {
								branch.parent( 'li' ).attr( 'aria-selected', 'true' );
								branch.parent( 'li' ).find( '> .sui-tree-node > .sui-node-checkbox input' ).prop( 'checked', true );
							}
						});
					}
				}
			}
		});
	};

	SUI.treeForm = function( element ) {

		var button = $( element );

		if ( 'add' === button.attr( 'data-button' ) ) {

			button.on( 'click', function() {

				var button  = $( this ),
					leaf    = button.closest( 'li[role="treeitem"]' ),
					node    = leaf.find( '> .sui-tree-node' ),
					expand  = node.find( 'span[data-button="expander"]' ),
					branch  = leaf.find( '> ul[role="group"]' ),
					content = branch.find( '> span[role="contentinfo"]' )
					;

				if ( 0 !== content.length ) {

					// Hide button
					button.hide();
					button.removeAttr( 'tabindex' );
					button.attr( 'aria-hidden', 'true' );

					// Show content
					content.addClass( 'sui-show' );
					content.removeAttr( 'aria-hidden' );

					// FIX: Open tree if it's closed
					if ( 'true' !== leaf.attr( 'aria-expanded' ) ) {
						expand.click();
					}

					// Focus content
					content.focus();
					content.attr( 'tabindex', '-1' );

				}
			});
		}

		if ( 'remove' === button.attr( 'data-button' ) ) {

			button.on( 'click', function() {

				var button  = $( this ),
					content = button.closest( 'span[role="contentinfo"]' ),
					leaf    = content.closest( 'li[role="treeitem"]' ),
					node    = leaf.find( '> .sui-tree-node' ),
					btnAdd  = node.find( '> span[data-button="add"]' )
					;

				// Hide content
				content.removeClass( 'sui-show' );
				content.removeAttr( 'tabindex' );
				content.attr( 'aria-hidden', 'true' );

				// Show button
				btnAdd.show();
				btnAdd.removeAttr( 'aria-hidden' );
				btnAdd.focus();
				btnAdd.attr( 'tabindex', '-1' );

			});
		}
	};

	SUI.suiTree = function( element, dynamic ) {

		var tree = $( element );

		if ( ! tree.hasClass( 'sui-tree' ) || typeof undefined === tree.attr( 'data-tree' ) ) {
			return;
		}

		function button() {

			var leaf   = tree.find( 'li[role="treeitem"]' ),
				node   = leaf.find( '> .sui-tree-node' ),
				button = node.find( '> [data-button="expander"]' ),
				label  = node.find( '> span.sui-node-text' )
				;

			button.each( function() {
				var button = $( this );
				SUI.treeButton( button );
			});

			label.each( function() {
				var label = $( this );
				SUI.treeButton( label );
			});
		}

		function checkbox() {

			var leaf     = tree.find( 'li[role="treeitem"]' ),
				node     = leaf.find( '> .sui-tree-node' ),
				checkbox = node.find( '> .sui-node-checkbox' )
				;

			checkbox.each( function() {

				var checkbox = ( $( this ).is( 'label' ) ) ? $( this ).find( 'input' ) : $( this );

				SUI.treeCheckbox( checkbox );

			});
		}

		function add() {

			var leaf   = tree.find( 'li[role="treeitem"]' ),
				node   = leaf.find( '> .sui-tree-node' ),
				button = node.find( '> [data-button="add"]' )
				;

			button.each( function() {

				var button = $( this );

				SUI.treeForm( button );

			});
		}

		function remove() {

			var button = tree.find( '[data-button="remove"]' );

			button.each( function() {

				var button = $( this );

				SUI.treeForm( button );

			});
		}

		function init() {

			if (
				'selector' === tree.data( 'tree' ) ||
				'directory' === tree.data( 'tree' ) ||
				'selector' === tree.attr( 'data-tree' ) ||
				'directory' === tree.atrr( 'data-tree' )
			) {

				// Initial setup
				SUI.treeOnLoad( tree );

				// Expand action
				button();

				// Select action
				checkbox();

				// Add folder action
				if ( true === dynamic || 'true' === dynamic ) {
					add();
					remove();
				}
			}

			// TEST: Verify if input is checked on load
			// if ( 'selector' === tree.data( 'tree' ) ) {
			//
			// 	if ( 0 !== tree.find( 'input' ).length ) {
			//
			// 		tree.find( 'input' ).each( function() {
			//
			// 			console.log( '#' + $( this ).attr( 'id' ) + ': ' + $( this ).prop( 'checked' ) );
			//
			// 			// Output:
			// 			// #input-id: value
			//
			// 		});
			// 	}
			// }
		}

		init();

		return this;
	};

	if ( 0 !== $( '.sui-2-3-31 .sui-tree' ).length ) {

		$( '.sui-2-3-31 .sui-tree' ).each( function() {
			SUI.suiTree( $( this ), true );
		});
	}

}( jQuery ) );

( function( $ ) {

	// Enable strict mode.
	'use strict';

	// Define global SUI object if it doesn't exist.
	if ( 'object' !== typeof window.SUI ) {
		window.SUI = {};
	}

	SUI.upload = function() {

		$( '.sui-2-3-31 .sui-upload-group input[type="file"]' ).on( 'change', function( e ) {
			var file = $( this )[0].files[0],
				message = $( this ).find( '~ .sui-upload-message' );

			if ( file ) {
				message.text( file.name );
			}

		});

	};

	SUI.upload();

}( jQuery ) );
