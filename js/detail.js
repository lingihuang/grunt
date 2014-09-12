$(function() {
	var DOMAIN_URL				  = _hfConfig.ApiPath,
		STATIC_URL 				  = '//s1.hfcdn.com',
		MESSAGES                  = window.HF.messages,
		SIDE_FIXED_CLASS          = 'side-fixed',
		SIDE_FIXED_BOTTOM_CLASS   = 'side-fixed-bottom',
		IS_ON_CLASS               = 'is-on',
		IS_CURR_CLASS 			  = 'is-curr',
		IS_ACTIVE_CLASS           = 'is-active',
		IS_SHOW_CLASS             = 'is-show',
		IS_HIDE_CLASS             = 'is-hide',
		IS_ERROR_CLASS            = 'is-error',
		IS_DISABLED_CLASS         = 'is-disable',
		LAZY_LOADING_CLASS        = 'lazy-loading',
		PAGING_LAZY_CLASS 		  = 'm-paging-lazy',
		PAGING_EMPTY_CLASS 		  = 'm-paging-empty',
		WEB_STORAGE_ITEMS         = {
			addHouse              : 'isBuyDetailAddHouse',
			notifyLowerPrice      : 'isBuyDetailLowerPrice',
			addBuilding           : 'isBuyDetailAddBuilding',
			notifyBuildingNewCase : 'isBuyDetailBuildingNewCase'
		},
		WEB_STORAGE_KEY_PREFIX    = 'hfid-',
		ICON_MARKER 			  = {
			current   : STATIC_URL + '/fp/hf/img/buy/markers/ico_current.png',
			traffic   : STATIC_URL + '/fp/hf/img/buy/markers/ico_traffic.png',
			life      : STATIC_URL + '/fp/hf/img/buy/markers/ico_life.png',
			hospital  : STATIC_URL + '/fp/hf/img/buy/markers/ico_hospital.png',
			education : STATIC_URL + '/fp/hf/img/buy/markers/ico_education.png',
			leisure   : STATIC_URL + '/fp/hf/img/buy/markers/ico_leisure.png',
			hate      : STATIC_URL + '/fp/hf/img/buy/markers/ico_hate.png'
		},
		sideSel                   = $('#side'),
		sideParentSel             = sideSel.parent(),
		sideSectionSel            = sideSel.find('.side-section'),
		agentSectionSel           = $('#agent-section'),
		mapSectionSel             = $('#map-section'),
		houseListSectionSel       = $('#house-list-section'),
		reservationFormSel        = $('#reservation-form'),
		reservationFormLoadingSel = $('#reservation-form-loading'),
		isIE8 			          = navigator.userAgent.match(/msie 8.0/i) ? true : false,
		tools					  = window.HF.tools,
		sideOffsetTop             = 0,
		sidePosTop                = 0,
		profileName          	  = '',
		totalAmount               = 0,
		messageMaxLen             = 0,
		queryParams				  = {},
		isLogin 				  = false,
		mapCanvas,
		infoWindow,
		markers 				  = {},
		nearbyMarker,
		timer,
		handleShareClick,
		handleForwardClick,
		handleReportClick,
		handleAddHouseClick,
		handleAddHouseActionClick,
		handleLowerPriceClick,
		handleLowerPriceActionClick,
		handleAddBuildingClick,
		handleAddBuildingActionClick,
		handleBuildingNewCaseActionClick,
		handleLightboxClose,
		handleCheckboxClick,
		handleRadioGenderClick,
		handleRadioTimeClick,
		handleCheckboxTimeClick,
		handleExtraInfoShow,
		handleMessageKeyup,
		handleViewPhoneClick,
		handleBadgeClick,
		handleLoanKeyup,
		handleTabPoiClick,
		handleNearbyPoiMouseEnter,
		handleNearbyPoiMouseLeave,
		handleMouseEnterPaging,
		init,
		initReservationForm,
		initLoanCaculation,
		initMap,
		loadImage,
		getWebStorageItem,
		setWebStorageItem,
		setSidePosition,
		getWebMaxMsgCode,
		getParams,
		addWebMaxPageTracking,
		addGAECTracking,
		addWebMaxMsgTracking,
		resetReservationForm,
		updateReservationForm,
		resetTimeCheckboxes,
		showSignUpCheckbox,
		submitToNotifyBuildingNewCase,
		getAmountFormat,
		caculateLoan,
		queryNearbyLiving,
		renderNearbyPoiInfo,
		addMarkers,
		removeMarkers,
		renderMarkers,
		renderHouseList,
		loadHouseImages;

	/**
	* Open window of facebook share.
	*
	* @event handleShareClick
	* @param {Object} e Event object
	*/
	handleShareClick = function (e) {
		var timestamp 	= new Date().getTime(),
			href  		= window.location.href,
			url 		= href.indexOf('?') !== -1 ? href + '&v=' + timestamp : href + '?v=' + timestamp;
		window.open('http://www.facebook.com/share.php?u=' + encodeURIComponent(url), '_blank', 'width=600,height=400');
		e.preventDefault();
	};

	/**
	* Show the lightbox of forward.
	*
	* @event handleForwardClick
	* @param {Object} e Event object
	*/
	handleForwardClick = function (e) {
		var selector = $(this);
		selector.CiRoBox({
			backdropclose : true,
			click         : false,
			height        : 700,
			width         : 620,
			url           : selector.attr('href')
		});
		e.preventDefault();
	};

	/**
	* Show the lightbox of report.
	*
	* @event handleReportClick
	* @param {Object} e Event object
	*/
	handleReportClick = function (e) {
		var selector = $(this);
		selector.CiRoBox({
			backdropclose : true,
			click         : false,
			height        : 600,
			width         : 620,
			url           : selector.attr('href')
		});
		e.preventDefault();
	};

	/**
	* Show the lightbox to add a house.
	*
	* @event handleAddHouseClick
	* @param {Object} e Event object
	*/
	handleAddHouseClick = function (e) {
		var selector = $(this),
			data;

		// Reset value of session storage of adding house.
		setWebStorageItem(WEB_STORAGE_ITEMS.addHouse, '0');

		data = {
			Method: 'AddHouse',
			Data: {
				SRC  : ' /buy/house/' + queryParams.hfId + '/',
				HFID : queryParams.hfId
			}
		};

		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/MyNotes.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10),
					content 	= '',
					responseData;

				if (status === -1 || (status === 1 && statusCode === 5)) {
					tools.showError();
					return;
				}
				
				responseData = data.Data;
				switch (statusCode) {
					case 1:
						content 	= '#lightbox-add-house-success';
						var successSel 	= $(content),
							amount 		= parseInt(responseData.amount, 10),
							total 		= parseInt(responseData.total, 10),
							remaining   = (total - amount > 0) ? total - amount : 0;
						successSel.find('.amount').text(amount);
						successSel.find('.remaining').text(remaining);
						successSel.find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 2:
						content = '#lightbox-add-house-duplicate';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 3:
						content = '#lightbox-add-house-limit';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 4:
						content = '#lightbox-add-house-nonlogin';
						break;
				}
				
				selector.CiRoBox({
					backdropclose : true,
					click         : false,
					content       : content,
					width         : 620
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});

		e.preventDefault();
	};

	/**
	* Bind event to actions of sign-in or sign-up in the lightbox of adding a house.
	*
	* @event handleAddHouseActionClick
	* @param {Object} e Event object
	*/
	handleAddHouseActionClick = function (e) {
		setWebStorageItem(WEB_STORAGE_ITEMS.addHouse, '1');
		window.location.href = $(this).attr('href');
		e.preventDefault();
	};

	/**
	* Show the lightbox to get notification of lowering price.
	*
	* @event handleLowerPriceClick
	* @param {Object} e Event object
	*/
	handleLowerPriceClick = function (e) {
		var selector = $(this),
			data;

		// Reset value of session storage of lowering price.
		setWebStorageItem(WEB_STORAGE_ITEMS.notifyLowerPrice, '0');

		data = {
			Method: 'GetLowPrice',
			Data: {
				SRC  : ' /buy/house/' + queryParams.hfId + '/',
				HFID : queryParams.hfId
			}
		};

		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/MyNotes.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10),
					content 	= '',
					responseData;

				if (status === -1 || (status === 1 && statusCode === 5)) {
					tools.showError();
					return;
				}
				
				responseData = data.Data;
				switch (statusCode) {
					case 1:
						content = '#lightbox-lower-price-success';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 2:
						content = '#lightbox-lower-price-duplicate';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 3:
						content = '#lightbox-lower-price-limit';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 4:
						content = '#lightbox-lower-price-nonlogin';
						break;
				}
				selector.CiRoBox({
					backdropclose : true,
					click         : false,
					content       : content,
					width         : 620
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});

		e.preventDefault();
	};

	/**
	* Bind event to actions of sign-in or sign-up in the lightbox of lowering price.
	*
	* @event handleLowerPriceActionClick
	* @param {Object} e Event object
	*/
	handleLowerPriceActionClick = function (e) {
		setWebStorageItem(WEB_STORAGE_ITEMS.notifyLowerPrice, '1');
		window.location.href = $(this).attr('href');
		e.preventDefault();
	};

	/**
	* Show the lightbox to add a building.
	*
	* @event handleAddBuildingClick
	* @param {Object} e Event object
	*/
	handleAddBuildingClick = function (e) {
		var selector = $(this),
			data;

		// Reset value of session storage of adding a building.
		setWebStorageItem(WEB_STORAGE_ITEMS.addBuilding, '0');

		data = {
			Method: 'AddBuilding',
			Data: {
				SRC        : ' /buy/house/' + queryParams.buildingId + '/',
				BuildingID : queryParams.buildingId
			}
		};

		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/MyNotes.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10),
					content 	= '',
					responseData;

				if (status === -1 || (status === 1 && statusCode === 5)) {
					tools.showError();
					return;
				}
				
				responseData = data.Data;
				switch (statusCode) {
					case 1:
						content = '#lightbox-add-building-success';
						var successSel 	= $(content),
							amount 		= parseInt(responseData.amount, 10),
							total 		= parseInt(responseData.total, 10),
							remaining   = (total - amount > 0) ? total - amount : 0;
						successSel.find('.amount').text(amount);
						successSel.find('.remaining').text(remaining);
						successSel.find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 2:
						content = '#lightbox-add-building-duplicate';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 3:
						content = '#lightbox-add-building-limit';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 4:
						content = '#lightbox-add-building-nonlogin';
						break;
				}
				selector.CiRoBox({
					backdropclose : true,
					click         : false,
					content       : content,
					width         : 620
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});

		e.preventDefault();
	};

	/**
	* Bind event to actions of sign-in or sign-up in the lightbox of adding a building.
	*
	* @event handleAddBuildingActionClick
	* @param {Object} e Event object
	*/
	handleAddBuildingActionClick = function (e) {
		setWebStorageItem(WEB_STORAGE_ITEMS.addBuilding, '1');
		window.location.href = $(this).attr('href');
		e.preventDefault();
	};

	/**
	* Bind event to actions of sign-in or sign-up in the lightbox of adding a building new case.
	*
	* @event handleAddBuildingActionClick
	* @param {Object} e Event object
	*/
	handleBuildingNewCaseActionClick = function (e) {
		setWebStorageItem(WEB_STORAGE_ITEMS.notifyBuildingNewCase, '1');
		window.location.href = $(this).attr('href');
		e.preventDefault();
	};

	/**
	* Close the lightbox.
	*
	* @event handleLightboxClose
	* @param {Object} e Event object
	*/
	handleLightboxClose = function (e) {
		if (jQuery.fn.CiRoBoxClose) {
			jQuery.fn.CiRoBoxClose();
		}
		e.preventDefault();
	};

	/**
	* Set ative or inactive to the customized checkboxes.
	*
	* @event handleCheckboxClick
	* @param {Object} e Event object
	*/
	handleCheckboxClick = function (e) {
		var choiceSel = $(e.currentTarget).closest('.m-choice');
		if (choiceSel.find('input[type="checkbox"]').prop('checked')) {
			choiceSel.removeClass(IS_CURR_CLASS);
		} else {
			choiceSel.addClass(IS_CURR_CLASS);
		}
	};

	/**
	* Set ative or inactive to the gender radio buttons.
	*
	* @event handleRadioGenderClick
	* @param {Object} e Event object
	*/
	handleRadioGenderClick = function (e) {
		reservationFormSel.find('.form-group-gender .m-choice.is-single').removeClass(IS_CURR_CLASS);
		$(this).closest('.m-choice').addClass(IS_CURR_CLASS);

		if (isIE8) {
			var iconSels = reservationFormSel.find('.form-group-gender .m-choice.is-single .m-icon'),
				iconSel  = $(this).find('.m-icon');
			iconSels.removeClass('m-icon-choice-single');
			setTimeout(function () {
				iconSels.addClass('m-icon-choice-single');
				iconSel.addClass('m-icon-choice-single');
			}, 0);
		}
	};

	/**
	* Set ative or inactive to the radio button of contact time.
	*
	* @event handleRadioTimeClick
	* @param {Object} e Event object
	*/
	handleRadioTimeClick = function (e) {
		$(this).closest('.m-choice').addClass(IS_CURR_CLASS);

		// Set inactive state to all checkboxes of time.
		var checkboxSels = reservationFormSel.find('.form-group-time .m-choice').not('.is-single');
		checkboxSels.each(function (idx, element) {
			$(element).removeClass(IS_CURR_CLASS);
			$(element).find('input[type="checkbox"]').prop('checked', false);
			if (isIE8) {
				var iconSel = $(element).find('.m-icon');
				iconSel.removeClass('m-icon-choice');
				setTimeout(function () {
					iconSel.addClass('m-icon-choice');
				}, 0);
			}
		});
	};

	/**
	* Set ative or inactive to checkboxes of contact time.
	*
	* @event handleCheckboxTimeClick
	* @param {Object} e Event object
	*/
	handleCheckboxTimeClick = function (e) {
		handleCheckboxClick(e);

		var radioSel = $('#reservation-radio-time').closest('.m-choice');
		radioSel.removeClass(IS_CURR_CLASS);
		radioSel.find('input[type="radio"]').prop('checked', false);

		if (isIE8) {
			var iconSel = radioSel.find('.m-icon');
			iconSel.removeClass('m-icon-choice-single');
			setTimeout(function () {
				iconSel.addClass('m-icon-choice-single');
			}, 0);
		}
	};

	/**
	* Handle to show extra info fieldset when focusing on input email or clicking on the submit button.
	*
	* @event handleExtraInfoShow
	* @param {Object} e Event object
	*/
	handleExtraInfoShow = function (e) {
		var selector = reservationFormSel.find('.form-fieldset-extra-info');
		selector.removeClass(IS_HIDE_CLASS);
	};

	/**
	* Show the total count of words when typing in the message.
	*
	* @event handleMessageKeyup
	* @param {Object} e Event object
	*/
	handleMessageKeyup = function (e) {
		var messageSel 	= reservationFormSel.find('textarea[name="message"]'),
			parentSel 	= messageSel.closest('.m-form-group'),
			helpSel	  	= parentSel.find('.m-form-help-block');
		parentSel.removeClass(IS_ERROR_CLASS);
		if (!helpSel.length) {
			helpSel = $('<p class="m-form-help-block"></p>');
		}
		helpSel.html('字數限制：' + messageSel.val().length + '/' + messageMaxLen).appendTo(parentSel);
	};

	/**
	* Show the complete phone number of the agent.
	* Send a request to store the count number of clicking.
	*
	* @event handleViewPhoneClick
	* @param {Object} e Event object
	*/
	handleViewPhoneClick = function (e) {
		if (!$(this).find('.contact').hasClass('contact-incomplete')) {
			return;
		}
		// Show both complete phone numbers.
		$('.action-view-phone').find('.contact').removeClass('contact-incomplete');

		var data = {
			Method: 'Inquire',
			Data: {
				HFID: queryParams.hfId
			}
		};
			
		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/HousePhoneHit.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		 = parseInt(data.Status, 10),
					statusCode 	 = parseInt(data.StatusCode, 10),
					responseData = data.Data;

				if (status === -1 || (status === 1 && (statusCode === 0 || statusCode === -1))) {
					tools.showError();
					return;
				}

				// 直效追蹤系統
				if (responseData.HitID) {
					_dmq.push(['_setTransaction', '0', responseData.HitID]);
				}

				// GA EC Tracking
				var params 			= getParams(),
					transactionId 	= '',
					affiliation 	= '';
				if (params.utm_source) {
					transactionId = queryParams.hfId;
					if (params.utm_content) {
						transactionId = transactionId + '_' + params.utm_content;
					}
					transactionId = transactionId + '_TEL';
					affiliation   = params.utm_source;
				} else {
					transactionId = queryParams.hfId + '_TEL';
					affiliation   = window.location.host;
				}
				addGAECTracking({
					transactionId : transactionId,
					affiliation   : affiliation,
					skuCode       : queryParams.caseNo,
					productName   : queryParams.caseName,
					category      : ''
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});

		e.preventDefault();
	};

	/**
	* Open the lightbox when the user clicks on the badge.
	*
	* @event handleBadgeClick
	* @param {Object} e Event object
	*/
	handleBadgeClick = function (e) {
		var content = $(this).attr('data-target');
		$(this).CiRoBox({
			backdropclose : true,
			click         : false,
			content       : content,
			width         : 620
		});
		e.preventDefault();
	};

	/**
	* Caculate loan when typeing in the fields of down payment, principal, interest rate, or year.
	*
	* @event handleLoanKeyup
	* @param {Object} e Event object
	*/
	handleLoanKeyup = function (e) {
		var downPaymentSel 		 = $('#down-payment'),
			principalSel         = $('#loan-principal'),
			rateSel              = $('#loan-rate'),
			yearSel              = $('#loan-year'),
			downPayment          = downPaymentSel.val().replace(/[^0-9]+/gi, ''),
			principal            = principalSel.val().replace(/[^0-9]+/gi, ''),
			rate                 = rateSel.val().replace(/[^0-9\.]+/gi, ''),
			year                 = yearSel.val().replace(/[^0-9]+/gi, ''),
			amount               = 0,
			id                   = $(this).attr('id'),
			downPaymentParentSel = downPaymentSel.closest('.m-form-group'),
			principalParentSel   = principalSel.closest('.m-form-group'),
			rateParentSel        = rateSel.closest('.m-form-group'),
			amountErrHtml;

		downPayment = (parseInt(downPayment, 10) || 0) * 10000;
		principal 	= (parseInt(principal, 10) || 0) * 10000;
		year        = parseInt(year, 10) || 0;

		amountErrHtml = '<p class="m-form-help-block">您輸入的金額已超過此房屋價格囉！請重新輸入正確金額。</p>';
		// Clear error state and error message.
		switch (id) {
			case 'down-payment':
				downPaymentParentSel.removeClass(IS_ERROR_CLASS);
				downPaymentParentSel.find('.m-form-control-col p').remove();
				principal = totalAmount - downPayment;
				if (downPayment > totalAmount) {
					downPaymentParentSel.addClass(IS_ERROR_CLASS);
					downPaymentParentSel.find('.m-form-control-col').append($(amountErrHtml));
				}
				break;
			case 'loan-principal':
				principalParentSel.removeClass(IS_ERROR_CLASS);
				principalParentSel.find('.m-form-control-col p').remove();
				downPayment = totalAmount - principal;
				if (principal > totalAmount) {
					principalParentSel.addClass(IS_ERROR_CLASS);
					principalParentSel.find('.m-form-control-col').append($(amountErrHtml));
				}
				break;
			case 'loan-rate':
				rateParentSel.removeClass(IS_ERROR_CLASS);
				rateParentSel.find('.m-form-control-col p').remove();
				if (parseFloat(rate) > 100) {
					rateParentSel.addClass(IS_ERROR_CLASS);
					rateParentSel.find('.m-form-control-col').append($('<p class="m-form-help-block">請勿輸入超過100%的利率唷！請重新輸入正確利率。</p>'));
				}
				break;
		}

		downPaymentSel.val(parseInt(downPayment / 10000, 10));
		principalSel.val(parseInt(principal / 10000, 10));
		rateSel.val(rate);
		yearSel.val(year);

		amount = parseInt(caculateLoan(principal, parseFloat(rate), year), 10);
		amount = getAmountFormat(amount.toString());
		$('#monthly-payment').text(amount);
		$('#monthly-payment-amount').text('$' + amount);
	};

	/**
	* Click on any tab of poi category.
	*
	* @event handleTabPoiClick
	* @param {Object} e Event object
	*/
	handleTabPoiClick = function (e) {
		var parentSel = $(this).closest('li'),
			type 	  = $(this).attr('data-type');

		if (!$.isEmptyObject(markers['default'])) {
			$.each(markers['default'], function (key, markers) {
				removeMarkers(markers, true);
			});
		}

		if (parentSel.hasClass(IS_ACTIVE_CLASS)) {
			parentSel.removeClass(IS_ACTIVE_CLASS);
			if (markers[type]) {
				removeMarkers(markers[type]);
			}
		} else {
			parentSel.addClass(IS_ACTIVE_CLASS);
			if (markers[type]) {
				renderMarkers(markers[type]);
				return;
			}

			$.ajax({
				url      : DOMAIN_URL + 'ashx/Buy/GetPOI.ashx',
				type     : 'GET',
				dataType : 'json',
				data     : {
					POIType  : type,
					Lng      : queryParams.lng,
					Lat      : queryParams.lat,
					Distance : 500
				},
				success  : function (data, textStatus, jqXHR) {
					if (!data.POI.length) {
						return;
					}
        			markers[type] = [];
					addMarkers({
						type    : type,
						data    : data.POI,
						markers : markers[type]
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					tools.showError();
				}
			});
		}
		
		e.preventDefault();
	};

	/**
	* Mouseenter any poi list.
	*
	* @event handleNearbyPoiMouseEnter
	* @param {Object} e Event object
	*/
	handleNearbyPoiMouseEnter = function (e) {
		var data 	= $(this).closest('li').data('poi'),
			latlng  = new google.maps.LatLng(data.lat, data.lng),
			htmlArr = [];

		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(function () {
			if (!nearbyMarker) {
	            nearbyMarker = new google.maps.Marker({
	                position : latlng,
	                map      : mapCanvas,
	                icon     : ICON_MARKER[data.type],
	                title    : data.name
	            });
	        } else {
	            nearbyMarker.setPosition(latlng);
	            nearbyMarker.setIcon(ICON_MARKER[data.type]);
	            nearbyMarker.setMap(mapCanvas);
	        }

	        htmlArr = [
	            '<div class="map-infowindow">',
	                '<h4 class="heading">' + data.name + '</h4>',
	            '</div>'
	        ];
	        if (!infoWindow) {
	            infoWindow = new google.maps.InfoWindow({
	                content  : htmlArr.join(''),
	                maxWidth : 250
	            });
	        } else {
	        	infoWindow.close();
	        	infoWindow.setContent(htmlArr.join(''));
	        }
            infoWindow.open(mapCanvas, nearbyMarker);
		}, 200);
	};

	/**
	* Mouseleave any poi list.
	*
	* @event handleNearbyPoiMouseLeave
	* @param {Object} e Event object
	*/
	handleNearbyPoiMouseLeave = function (e) {
		if (timer) {
			clearTimeout(timer);
		}

		if (nearbyMarker) {
            nearbyMarker.setMap(null);
        }
        if (infoWindow) {
            infoWindow.close();
        }
	};

	/**
	* Mouseenter the previous or next item.
	*
	* @event handleMouseEnterPaging
	* @param {Object} e Event object
	*/
	handleMouseEnterPaging = function (e) {
		if (!$(this).hasClass(PAGING_LAZY_CLASS)) {
			return;
		}

		var data   = {
			Method: 'Inquire',
			Data: {
				HFID  : queryParams.hfId
			}
		};

		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/DetailObjView.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		 = parseInt(data.Status, 10),
					statusCode 	 = parseInt(data.StatusCode, 10),
					responseData = data.Data;

				if (status === -1 || (status === 1 && statusCode === -1)) {
					tools.showError();
					return;
				}

				var prevSel = $('.m-paging-btn-prev'),
					nextSel = $('.m-paging-btn-next');

				$.each(data.Data, function (idx, item) {
					item = $.parseJSON(item);
					var selector = (idx === 'Prev') ? prevSel : nextSel,
						mainSel  = selector.find('.m-paging-main'),
						thumbSel,
						infoHtml = [];

					if ($.isEmptyObject(item)) {
						mainSel.html('無推薦物件');
						selector.css('cursor', 'default');
						selector.removeClass(PAGING_LAZY_CLASS).addClass(PAGING_EMPTY_CLASS);
					} else {
						thumbSel = $('<div class="m-paging-thumb"></div>');
						selector.attr('href', '/buy/house/' + item.HFID);

						infoHtml = [
							'<div class="m-paging-info">',
								'<h4 class="m-paging-heading"><em>' + decodeURIComponent(item.Address) + '</em>' + item.RegArea + '坪</h4>',
								'<div class="m-paging-minor">' + decodeURIComponent(item.Room) + '</div>',
								'<div class="m-paging-major"><em>' + item.Price + '</em>萬</div>',
							'</div>'
						];

						loadImage(item.Pic01, function (image) {
							$(image).appendTo(thumbSel);
							mainSel.html('');
							mainSel.append(thumbSel).append($(infoHtml.join('')));
							selector.removeClass(PAGING_LAZY_CLASS);
						});
					}
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Create a new image and load it.
	*
	* @method loadImage
	* @param {String} src Image src
	* @param {Function} callback A callback function triggered when image is onloaded
	*/
	loadImage = function (src, callback) {
		var image = new Image();
		image.onload = function () {
			if (callback) {
				callback(image);
			}
		};

		image.onerror = function () {
			PicFilter(this, 0);
			if (callback) {
				callback(image);
			}
		};

		image.src = src;
	};

	/**
	* Get the value of session storage item.
	*
	* @event getWebStorageItem
	* @param {String} itemKey Item key
	*/
	getWebStorageItem = function (itemKey) {
		if (!window.sessionStorage) {
			return;
		}
		
		var itemStr = window.sessionStorage.getItem(itemKey) ? window.sessionStorage.getItem(itemKey) : '{}',
			items   = !$.isNumeric($.parseJSON(itemStr)) ? $.parseJSON(itemStr) : {},
			key     = WEB_STORAGE_KEY_PREFIX + queryParams.hfId;
		return parseInt(items[key], 10);
	};

	/**
	* Set the value of session storage item.
	*
	* @event setWebStorageItem
	* @param {String} itemKey Item key
	* @param {String} value Item value
	*/
	setWebStorageItem = function (itemKey, value) {
		if (!window.sessionStorage) {
			return;	
		}

		var itemStr = window.sessionStorage.getItem(itemKey) ? window.sessionStorage.getItem(itemKey) : '{}',
			items   = !$.isNumeric($.parseJSON(itemStr)) ? $.parseJSON(itemStr) : {},
			key     = WEB_STORAGE_KEY_PREFIX + queryParams.hfId;
		items[key] = value;
		window.sessionStorage.setItem(itemKey, JSON.stringify(items));
	};

	/**
	* Set the position of the side section.
	*
	* @method setSidePosition
	*/
	setSidePosition = function () {
		var scrollTop = $(this).scrollTop(),
			bottomSel = mapSectionSel.length ? mapSectionSel : houseListSectionSel;
		if (scrollTop >= sideOffsetTop && bottomSel.length) {
			var top = scrollTop - sideParentSel.offset().top + sidePosTop;
			if (top + sideSectionSel.height() >= bottomSel.position().top) {
				top = bottomSel.position().top - sideSectionSel.height();
			}
			sideSel.css('top', top);
		} else {
			sideSel.css('top', sidePosTop);
		}
	};

	/**
	* Show or hide the checkbox of sign-up.
	*
	* @method showSignUpCheckbox
	*/
	showSignUpCheckbox = function (str) {
		var emailInputSel 		= reservationFormSel.find('input[name="email"]'),
			fieldsetSignUpSel 	= reservationFormSel.find('.form-fieldset-sign-up'),
			data;
		data = {
			Method: 'Inquire',
			Data: {
				Email: encodeURIComponent(emailInputSel.val())
			}
		};
			
		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/QueryMember.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10);

				if (status === -1 || (status === 1 && statusCode === 0)) {
					tools.showError();
					return;
				}
				
				if (statusCode === 1) {
					// The email is not used. Show the checkbox of sign-up.
					fieldsetSignUpSel.removeClass(IS_HIDE_CLASS);
				} else if (statusCode === 2) {
					// The email has been used. Hide the checkbox of sign-up.
					fieldsetSignUpSel.addClass(IS_HIDE_CLASS);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Submit to get notification when there is a new case in the building.
	*
	* @event submitToNotifyBuildingNewCase
	* @param {Selector} selector jQuery Selector
	*/
	submitToNotifyBuildingNewCase = function (selector) {
		// Reset value of session storage of adding a building new case.
		setWebStorageItem(WEB_STORAGE_ITEMS.notifyBuildingNewCase, '0');

		var data = {
			Method: 'AddBuildingNewCase',
			Data: {
				BuildingID: queryParams.buildingId
			}
		};

		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/MyNotes.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10),
					content 	= '',
					responseData;

				if (status === -1 || (status === 1 && statusCode === 5)) {
					tools.showError();
					return;
				}
				
				responseData = data.Data;
				switch (statusCode) {
					case 1:
						content = '#lightbox-notify-building-newcase-success';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 2:
						content = '#lightbox-notify-building-newcase-duplicate';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 3:
						content = '#lightbox-notify-building-newcase-limit';
						$(content).find('.b-lightbox-hd .name').html(decodeURIComponent(responseData.MemberName) + '您好！');
						break;
					case 4:
						content = '#lightbox-notify-building-newcase-nonlogin';
						break;
				}
				selector.CiRoBox({
					backdropclose : true,
					click         : false,
					content       : content,
					width         : 620
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Get the format of the price.
	*
	* @method getAmountFormat
	* @param {String} str The price amount
	* @return {String} Return the price amount
	*/
	getAmountFormat = function (str) {
		return str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,");
	};

	/**
	* Caculate the amount of loan.
	* Formula of Loan Caculation: http://www.landbank.com.tw/Manage/b_3.aspx?EpfJdId9UuCGfWtnHzKyW3iyYFqOs3zQ
	*
	* @method caculateLoan
	* @param {Number} principal The loan amount
	* @param {Number} rate The interest rate
	* @param {Number} year The loan year
	* @return {Number} amount Return the refund amount
	*/
	caculateLoan = function (principal, rate, year) {
		var monthlyRate = 0,
	        months      = 0,
	        average		= 0,
	        amount 		= 0;
	    if (principal > 0 && rate > 0 && year > 0) {
	    	monthlyRate = (rate / 100) / 12;
	        months      = year * 12;
	    	average 	= (Math.pow((1 + monthlyRate), months) * monthlyRate) / (Math.pow((1 + monthlyRate), months) - 1);
	    	amount 		= principal * average;
		}
	    return amount;
	};

	/**
	* Query nearby living data.
	*
	* @method queryNearbyLiving
	*/
	queryNearbyLiving = function () {
		var data = {
			Method: 'Inquire',
			Data: {
				HFID: queryParams.hfId
			}	
		};

		$.ajax({
			url        : DOMAIN_URL + 'ashx/Buy/new/GetLivingNear.ashx',
			type       : 'GET',
			dataType   : 'jsonp',
			data: 'RequestPackage=' + JSON.stringify(data),
			success: function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10);
				if (status === -1 || (status === 1 && statusCode === 0)) {
					tools.showError();
					return;
				}
				renderNearbyPoiInfo(data.Data.near);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Render nearby poi info and bind events.
	*
	* @method renderNearbyPoiInfo
	* @param {Array} data An arry of poi data
	*/
	renderNearbyPoiInfo = function (data) {
		var infoSel = mapSectionSel.find('.info');
        infoSel.html('');

        $.each(data, function (idx, item) {
            var data,
                selector;
            data = {
                name     : decodeURIComponent(item.Name),
                distance : item.Distance,
                lat      : parseFloat(item.Lat, 10),
                lng      : parseFloat(item.Lng, 10),
                type     : item.TypeName
            };
            $('<li></li>').data('poi', data)
                        .html('<a href="javascript:;">到 <em title="' + data.name + '">' + data.name + '</em> ' + data.distance + '公尺</a>')
                        .appendTo(infoSel);
        });
        
        infoSel.find('li a').hover(handleNearbyPoiMouseEnter, handleNearbyPoiMouseLeave);
	};

	/**
	* Create markers and add markers into an array. Also, render markers on the map.
	*
	* @method addMarkers
	* @param {String} obj.type Icon type
	* @param {Array} obj.data Poi data
	* @param {Array} obj.markers An arry of markers
	*/
	addMarkers = function (obj) {
		$.each(obj.data, function (idx, poi) {
			var lat = parseFloat(poi.Lat, 10),
				lng = parseFloat(poi.Lng, 10),
				marker;

			if (!infoWindow) {
                infoWindow = new google.maps.InfoWindow({
					content  : '',
					maxWidth : 250
                });
            }

			marker = new google.maps.Marker({
				position : new google.maps.LatLng(lat, lng),
				map      : mapCanvas,
				icon     : ICON_MARKER[obj.type],
				title    : decodeURIComponent(poi.Name) + '(' + decodeURIComponent(poi.Title) + ')'
			});

			google.maps.event.addListener(marker, 'click', function(e) {
				var htmlArr = [
					'<div class="map-infowindow">',
						'<h4 class="heading">' + decodeURIComponent(poi.Name) + '(' + decodeURIComponent(poi.Title) + ')' + '</h4>',
						'<p>' + decodeURIComponent(poi.Address) + '</p>',
					'</div>'
				];
				infoWindow.setContent(htmlArr.join(''));
				infoWindow.open(mapCanvas, marker);
			});

			obj.markers.push(marker);
		});
	};

	/**
	* Remove markers from the map.
	*
	* @method removeMarkers
	* @param {Array} markers An arry of markers
	* @param {Boolean} isDefault Check if markers are default pois
	*/
	removeMarkers = function (markers, isDefault) {
		if (!markers.length) {
			return;
		}
		
		for (var i = markers.length - 1; i >= 0; i--) {
            var marker = markers[i];
            marker.setMap(null);
            if (isDefault) {
                markers.pop();
            }
        }
	};

	/**
	* Render markers on the map.
	*
	* @method renderMarkers
	* @param {Array} markers An arry of markers
	*/
	renderMarkers = function (markers) {
		$.each(markers, function (idx, marker) {
			marker.setMap(mapCanvas);
		});
	};

	/**
	* Send a request to get data and render html markup of the recommended house list.
	*
	* @method renderHouseList
	* @param {Function} callback A callback function
	*/
	renderHouseList = function (callback) {
		var data = {
			Method: 'Inquire',
			Data: {
				Page       : 1,
				SearchMode : 5,
				HFID       : queryParams.hfId
			}
		};
			
		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/GetBuyList.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				var status 		= parseInt(data.Status, 10),
					statusCode 	= parseInt(data.StatusCode, 10);

				if (status === -1 || (status === 1 && statusCode === 0)) {
					tools.showError();
					return;
				}
				
				var list 				= $.parseJSON(data.Data.ListObjects),
					htmls 				= [],
					houseListBodySel 	= houseListSectionSel.find('.m-thumbnail-bd');

				if (!list.length) {
					return;
				}
				houseListBodySel.html('');
				$.each(list, function (idx, item) {
					htmls.push('<section class="m-thumbnail-item">');
					htmls.push('<a class="ga_click_trace" href="' + DOMAIN_URL + 'buy/house/' + item.HFID + '" target="_blank" ga_cat="detail_more_house" ga_event="click" ga_label="detail_more_house_' + (idx + 1) + '">');
					htmls.push('<div class="m-thumbnail-item-hd m-thumbnail-figure">');
					htmls.push('<figure class="m-thumbnail-figure-bd b-middleSet">');
					htmls.push('<div class="' + LAZY_LOADING_CLASS + '" data-alt="' + item.CaseName + '" data-src="' + item.CoverPic + '"></div>');
					htmls.push('</figure>');
					htmls.push('</div>');
					htmls.push('<div class="m-thumbnail-item-bd">');
					htmls.push('<h2 class="casename">' + item.CaseName + '</h2>');
					htmls.push('<div class="price">');
					if (item.LastPrice) {
						htmls.push('<span class="original-price"><em class="number">' + item.LastPrice + '</em><em class="postfix">萬</em></span>');
					}
					htmls.push('<span class="discount-price"><em class="number">' + item.Price + '</em><em class="postfix">萬</em></span>');
					htmls.push('</div>');
					htmls.push('</div>');
					htmls.push('</a>');
					htmls.push('</section>');
				});
				houseListBodySel.html(htmls.join(''));
				houseListSectionSel.removeClass(IS_HIDE_CLASS);
				if ($.isFunction(callback)) {
					callback();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Load images of the recommended house list.
	*
	* @method loadHouseImages
	*/
	loadHouseImages = function () {
		// There is no any recommended house.
		if (houseListSectionSel.hasClass(IS_HIDE_CLASS)) {
			return;
		}

		var houseListBodySel = houseListSectionSel.find('.m-thumbnail-bd');
		houseListBodySel.find('.' + LAZY_LOADING_CLASS).each(function (idx, element) {
			var selector = $(element);
			loadImage(selector.attr('data-src'), function (image) {
				image.alt = selector.attr('data-alt');
				selector.fadeIn(1000, function () {
					selector.replaceWith($(image));
				});
			});
		});
	};

	/**
	* Get string of WebMaxMsgCode of reservation form, for example: YYYYMMDDHHMMSS + 3 digitals of random().
	*
	* @method getWebMaxMsgCode
	* @return {String} Return WebMaxMsgCode string
	*/
	getWebMaxMsgCode = function () {
		var date    = new Date(),
			year 	= date.getFullYear(),
			month   = date.getMonth() + 1,
			day     = date.getDate(),
			hour    = date.getHours(),
			minute  = date.getMinutes(),
			second  = date.getSeconds(),
			dateArr = [],
			random  = '000' + Math.floor(Math.random() * 1000).toString();

		dateArr = [
			year,
			month >= 10 ? month : '0' + month,
			day >= 10 ? day : '0' + day,
			hour >= 10 ? hour : '0' + hour,
			minute >= 10 ? minute : '0' + minute,
			second >= 10 ? second : '0' + second
		];

		return dateArr.join('') + random.substring(random.length, random.length - 3);
	};

	/**
	* Get parameters from window.location.href
	*
	* @method getParams
	* @return {Object} Return params
	*/
	getParams = function () {
		var params = {};
		if (window.location.href.indexOf('?') !== -1) {
			var pairs = window.location.href.split('?')[1].split('&');
			$.each(pairs, function (idx, value) {
				var arr = value.split('=');
				params[arr[0]] = arr[1];
			});
		}
		return params;
	};

	/**
	* Buy Web Max Page Tracking
	*
	* @method addWebMaxPageTracking
	*/
	addWebMaxPageTracking = function () {
		// Use setTimeout() to prevent DoObjectTrack undefined.
		if (typeof DoObjectTrack === 'undefined') {
            setTimeout(arguments.callee, 100);
            return;
        }

		var str   = '/' + encodeURIComponent('買屋'),
			level = 0,
			url   = '',
			ap 	  = [];

		if (queryParams.wmRefUrl) {
			// Source from others.
			url   = queryParams.wmRefUrl;
			level = 0;			
		} else {
			// Source from housefun.
			// level 0: 一覽頁 (買屋找中古屋)
			// level 1: others
			url   = document.referrer ? document.referrer : window.location.href;
			level = (url === 'http://buy.housefun.com.tw/' || url.indexOf(str) !== -1) ? 0 : 1;
		}

        ap.push([1, '3']);
        ap.push([2, level]);
        ap.push([3, '1']);
        ap.push([4, queryParams.caseId]);
        ap.push([5, url]);
        
    	DoObjectTrack(ap);
	};

	/**
	* GA EC Tracking
	* https://support.google.com/tagmanager/answer/3002596?hl=en
	*
	* @method addGAECTracking
	* @param {String} obj.transactionId Unique transaction identifier
	* @param {String} obj.affiliation Partner or store
	* @param {String} obj.skuCode Product SKU
	* @param {String} obj.productName Product name
	* @param {String} obj.category Product category
	*/
	addGAECTracking = function (obj) {
	    if(typeof(dataLayer) !== 'undefined') {
		    dataLayer.push({
				'transactionId'          : obj.transactionId,
				'transactionAffiliation' : obj.affiliation,
				'transactionTotal'       : 1,
				//'transactionTax'       : '',
				//'transactionShipping'  : '',
				'transactionProducts'    : [{
					'sku'      : obj.skuCode,
					'name'     : obj.productName,
					'category' : obj.category,
					'price'    : 1,
					'quantity' : 1
		        }],
		        'event':'trackTrans'
		    });
		}
	};
	
	/**
	* Web Max Message Tracking
	*
	* @method addWebMaxMsgTracking
	*/
	addWebMaxMsgTracking = function (email, phone) {
		var ap = [];
        ap.push([1, getWebMaxMsgCode()]);
        ap.push([2, email]);
        ap.push([3, 'HF_買屋物件明細頁']);
        ap.push([4, phone]);
        ap.push([5, queryParams.caseId]);
        DoMessage(ap);
	};
	
	/**
	* Reset the reservation form.
	*
	* @method resetReservationForm
	*/
	resetReservationForm = function () {
		var message = '我在好房HouseFun看見物件請與我聯絡，謝謝。';
		reservationFormSel.find('input[type="text"], input[type="password"]').val('');
		reservationFormSel.find('textarea[name="message"]').val(message);
		reservationFormSel.find('.m-choice').removeClass(IS_ACTIVE_CLASS);
		reservationFormSel.find('.form-group-gender .m-choice.is-single').eq(0).addClass(IS_ACTIVE_CLASS);
		reservationFormSel.find('.form-group-time .m-choice').eq(0).addClass(IS_ACTIVE_CLASS);

		reservationFormSel.find('.m-form-group').removeClass(IS_ERROR_CLASS);
		reservationFormSel.find('.m-form-help-block').html('');
		reservationFormSel.find('.form-group-message').append($('<p class="m-form-help-block">字數限制：' + message.length + '/' + messageMaxLen + '</p>'));

		reservationFormSel.find('.form-fieldset-sign-up').addClass(IS_HIDE_CLASS);
		reservationFormSel.find('.form-container-password').addClass(IS_HIDE_CLASS);

		reservationFormSel.find('fieldset').prop('disbled', false);
		reservationFormSel.find('.m-button').prop('disabled', false);

		reservationFormSel.find('.action-submit').prop('disabled', false).removeClass(IS_DISABLED_CLASS);
	};

	/**
	* Update user data of reservation form if the user has signed in.
	*
	* @method updateReservationForm
	*/
	updateReservationForm = function () {
		var data = {
			Method: 'Inquire'
		};
		$.ajax({
			url      : DOMAIN_URL + 'ashx/Buy/New/QueryLoginStatus.ashx',
			type     : 'GET',
			dataType : 'jsonp',
			data     : 'RequestPackage=' + JSON.stringify(data),
			success  : function (data, textStatus, jqXHR) {
				if (parseInt(data.Status, 10) === -1) {
					// Not login.
					return;
				}

				var statusCode = parseInt(data.StatusCode, 10);
				if (statusCode === 0 || statusCode === -1) {
					tools.showError();
				} else if (statusCode === 1) {
					// Logged in.
					// If the user has signed in, automatically fill in each input of reservation form with user data.
					// Also, we don't need to show the checkbox of sign-up.
					isLogin = true;

					// Set user data of reservation form.
					var userData = data.Data,
						sexual   = userData.Sexual ? userData.Sexual : '1';

					// Switch values of first name and last name.
					reservationFormSel.find('input[name="last_name"]').val(decodeURIComponent(userData.UserFName));
					reservationFormSel.find('input[name="first_name"]').val(decodeURIComponent(userData.UserLName));
					reservationFormSel.find('input[name="email"]').val(userData.ContactEmail);
					reservationFormSel.find('input[name="phone"]').val(userData.MobilPhoneNumber);

					// Reset state of gender radio buttons.
					reservationFormSel.find('.form-group-gender .m-choice.is-single').removeClass(IS_ACTIVE_CLASS);
					reservationFormSel.find('.form-group-gender .m-choice.is-single input[name="gender"]').prop('checked', false);
					reservationFormSel.find('.form-group-gender .m-choice.is-single').each(function (idx, element) {
						var radioSel = $(element).find('input[name="gender"]');
						if (radioSel.val() === sexual) {
							$(element).addClass(IS_ACTIVE_CLASS);
							radioSel.prop('checked', true);
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				tools.showError();
			}
		});
	};

	/**
	* Bind events to the reservation form and do form validation.
	* jQuery Validation http://jqueryvalidation.org/
	* jQuery Placeholder https://github.com/mathiasbynens/jquery-placeholder
	*
	* @method initReservationForm
	*/
	initReservationForm = function () {
		profileName   = $('#profile-name').html();
		messageMaxLen = reservationFormSel.find('textarea[name="message"]').attr('maxLength');

		// Plugin placeholder for IE8 and IE9.
		reservationFormSel.find('input[placeholder], textarea').placeholder();

		// Update user data of reservation form if the user has signed in.
		updateReservationForm();

		// Show the extra info fieldset when focusing on input email.
		reservationFormSel.find('input[name="email"]').on('focus', handleExtraInfoShow);
		// Show the extra info fieldset when clicking on the submit button.
		reservationFormSel.find('.action-submit').on('click', handleExtraInfoShow);

		// Click on the radio buttons of gender.
		reservationFormSel.find('.form-group-gender .m-choice-btn').on('click', handleRadioGenderClick);

		// Click on the radio button of contact time.
		reservationFormSel.find('.form-group-time .m-choice.is-single .m-choice-btn').on('click', handleRadioTimeClick);

		// Click on the checkbox of contact time.
		reservationFormSel.find('.form-group-time .m-choice:not(".is-single") .m-choice-btn').on('click', handleCheckboxTimeClick);

		// Click on the checkbox of sign up.
		reservationFormSel.find('.form-group-sign-up .m-choice-btn').on('click', function (e) {
			handleCheckboxClick(e);
			var pwdContainerSel = reservationFormSel.find('.form-container-password');
			if ($(this).closest('.m-choice').find('input[type="checkbox"]').prop('checked')) {
				pwdContainerSel.addClass(IS_HIDE_CLASS);
			} else {
				pwdContainerSel.removeClass(IS_HIDE_CLASS);
			}
		});

		// Click on the checkbox of agreement.
		reservationFormSel.find('.form-group-agreement .m-choice-btn').on('click', handleCheckboxClick);
		
		// Keyup the message field to count how many words the user input.
		reservationFormSel.find('.form-group-message textarea[name="message"]').on('keyup', handleMessageKeyup);

		// Validate reservation form.
		$('#form1').validate({
			onkeyup: false,
			rules: {
				last_name: {
					nameRequired     : '.form-control-first-name',
					nameEachRequired : true
				},
				first_name: {
					nameRequired     : '.form-control-last-name',
					nameEachRequired : true
				},
				email: {
					required   : true,
					emailValid : true
				},
				phone: {
					required    : true,
					digits      : true,
					rangelength : [9, 10]
				},
				time: {
					timeRequired: [$('#reservation-radio-time'), reservationFormSel.find('input[name="time"]')]
				},
				message: {
					required: true
				},
				agreement: {
					required: true
				},
				password: {
					required: function (element) {
						return $('#reservation-checkbox-sign-up:checked').length > 0;
					},
					rangelength: [6, 20]
				},
				confirm_pwd: {
					required: function (element) {
						return $('#reservation-checkbox-sign-up:checked').length > 0;
					},
					rangelength : [6, 20],
					equalTo     : reservationFormSel.find('input[name="password"]')
				}
			},
			messages: {
				last_name: {
					nameRequired     : MESSAGES.name_required,
					nameEachRequired : MESSAGES.last_name_required
				},
				first_name: {
					nameRequired     : MESSAGES.name_required,
					nameEachRequired : MESSAGES.first_name_required
				},
				email: {
					required   : MESSAGES.email_required,
					emailValid : MESSAGES.email_valid
				},
				phone: {
					required   : MESSAGES.phone_required,
					digits     : MESSAGES.phone_valid,
					rangelength: MESSAGES.phone_length
				},
				time: {
					timeRequired: MESSAGES.contact_time_required
				},
				message: {
					required: MESSAGES.message_required
				},
				agreement: {
					required: MESSAGES.agreement_required
				},
				password: {
					required    : MESSAGES.password_required,
					rangelength : MESSAGES.password_length
				},
				confirm_pwd: {
					required    : MESSAGES.password_required,
					rangelength : MESSAGES.password_length,
					equalTo     : MESSAGES.password_equal
				}
			},
			onclick: function (element, event) {
				$(element).valid();
			},
			onfocusout: function (element, event) {
				$(element).valid();
			},
			invalidHandler: function (event, validator) {
				
			},
			submitHandler: function (form) {
				// Show the process loading.
				reservationFormLoadingSel.find('.b-loading-bd').css('height', reservationFormSel.outerHeight());
				reservationFormLoadingSel.removeClass(IS_HIDE_CLASS);

				// Disabled the form.
				reservationFormSel.find('fieldset').prop('disbled', true);
				reservationFormSel.find('.m-button').prop('disabled', true);
				
				var timeRadioSel      	= reservationFormSel.find('input[name="choice_time"]:checked'),
					timeCheckboxSels  	= reservationFormSel.find('input[name="time"]:checked'),
					signUpCheckboxSel 	= reservationFormSel.find('input[name="sign_up"]:checked'),
					timeVals 			= [],
					email   			= $.trim(reservationFormSel.find('input[name="email"]').val()),
					phone 				= $.trim(reservationFormSel.find('input[name="phone"]').val()),
					data 				= {};

				if (timeRadioSel.length) {
					timeVals.push(timeRadioSel.val());
				} else {
					timeCheckboxSels.each(function (idx, element) {
						timeVals.push($(element).val());
					});
				}

				// DB inputs: FirstName => 姓, LastName => 名
				data = {
					Method: 'Inquire',
					Data: {
						FirstName          : encodeURIComponent($.trim(reservationFormSel.find('input[name="last_name"]').val())),
						LastName           : encodeURIComponent($.trim(reservationFormSel.find('input[name="first_name"]').val())),
						Sexual             : reservationFormSel.find('input[name="gender"]:checked').val(),
						Email              : encodeURIComponent(email),
						PhoneNumber        : phone,
						BecomeMember       : signUpCheckboxSel.length ? 'Y' : 'N',
						FreeTime           : timeVals.join(','),
						Memo               : encodeURIComponent($.trim(reservationFormSel.find('textarea[name="message"]').val())),
						Password           : signUpCheckboxSel.length ? reservationFormSel.find('input[name="password"]').val() : '',
						HFID               : queryParams.hfId,
						CaseID             : queryParams.caseId,
						MessageType        : queryParams.messageType,
						ShopID             : queryParams.shopId,
						WebMaxMsgCode      : getWebMaxMsgCode(),
						AssignBuilding     : encodeURIComponent(queryParams.assignBuilding),
						County             : encodeURIComponent(queryParams.county),
						District           : encodeURIComponent(queryParams.district),
						Road               : encodeURIComponent(queryParams.road)
					}
				};

				$.ajax({
					url        : DOMAIN_URL + 'ashx/Buy/New/LeaveMessage.ashx',
					type       : 'GET',
					dataType   : 'jsonp',
					data       : 'RequestPackage=' + JSON.stringify(data),
					beforeSend : function (jqXHR, settings) {
						reservationFormSel.find('.action-submit').prop('disabled', true).addClass(IS_DISABLED_CLASS);
					},
					success  : function (data, textStatus, jqXHR) {
						reservationFormLoadingSel.addClass(IS_HIDE_CLASS);
						resetReservationForm();

						if (parseInt(data.Status, 10) === -1) {
							tools.showError();
							return;
						}
						
						var statusCode 	 = parseInt(data.StatusCode, 10),
							responseData = data.Data;

						if (statusCode === 0) {
							tools.showError();
						} else if (statusCode === 1) {
							// 直效追蹤系統
							if (data.Data.MessageID) {
								_dmq.push(['_setTransaction', '1', '01-' + responseData.MessageID]);
							}

							// Web Max Message Tracking
							addWebMaxMsgTracking(email, phone);

							// GA EC Tracking
							var params 		  = getParams(),
								transactionId = queryParams.hfId,
								affiliation   = '',
								skuCode       = '';
							if (params.utm_source) {
								if (params.utm_content) {
									transactionId = transactionId + '_' + params.utm_content;
								}
								affiliation = skuCode = params.utm_source;
							} else {
								affiliation = window.location.host;
							}
							addGAECTracking({
								transactionId : transactionId,
								affiliation   : affiliation,
								skuCode       : skuCode,
								productName   : queryParams.caseName,
								category      : queryParams.messageType
							});

							alert('留言成功! 謝謝您! 我們已將您的留言傳送給【' + profileName + '】，如聯繫上有任何問體，請致電客服中心，謝謝。好房網客服專線:412-8668 (手機直撥請加02)');
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						reservationFormLoadingSel.addClass(IS_HIDE_CLASS);
						resetReservationForm();
						tools.showError();
					}
				});

				return false;
			},
			highlight: function (element, errorClass, validClass) {
				// Prevent being triggered from not reservation form element.
				if ($(element).closest('.m-form').attr('id') !== 'reservation-form') {
					return;
				}

				$(element).closest('.m-form-group').addClass(IS_ERROR_CLASS);
			},
			unhighlight: function (element, errorClass, validClass) {
				// Prevent being triggered from not reservation form element.
				if ($(element).closest('.m-form').attr('id') !== 'reservation-form') {
					return;
				}

				$(element).closest('.m-form-group').removeClass(IS_ERROR_CLASS);
				$(element).closest('.m-form-group').find('.m-form-help-block').remove();

				// If the user has signed in, automatically fill in each input of reservation form with user data.
				// Also, we don't need to show the checkbox of sign-up.
				// Show or hide the checkbox of sign-up.
				if (!isLogin && $(element).attr('name') === 'email') {
					showSignUpCheckbox();
				}

				// Show the total count of message words.
				handleMessageKeyup();
			},
			errorPlacement: function (error, element) {
				// Prevent being triggered from not reservation form element.
				if ($(element).closest('.m-form').attr('id') !== 'reservation-form') {
					return;
				}
				
				// Validation of last name, first name and message is required to remove .m-form-help-block.
				element.closest('.m-form-group').find('.m-form-help-block').remove();
				var errorSel = $('<p class="m-form-help-block"></p>').append(error);
				element.closest('.m-form-group').append(errorSel);
			}
		});
	};

	/**
	* Caculate down payment and loan principal on the initial.
	* Bind events to each input of the popover of loan caculation.
	*
	* @method initLoanCaculation
	*/
	initLoanCaculation = function () {
		// Caculate loan.
		totalAmount = (parseInt($('#total-amount').text().replace(',', ''), 10) || 0) * 10000;

		var downPayment 	= totalAmount * 0.3,
			loanPrincipal 	= totalAmount - downPayment;
		$('#down-payment').val(parseInt(downPayment / 10000, 10));
		$('#loan-principal').val(parseInt(loanPrincipal / 10000, 10));
		$('#loan-rate').val(2);
		$('#loan-year').val(20);

		$('#down-payment, #loan-principal, #loan-rate, #loan-year').on('keyup', handleLoanKeyup);
	};

	/**
	* Initialize the google map.
	*
	* @method initMap
	*/
	initMap = function () {
		var mapCanvasEle = document.getElementById('map-canvas'),
  			latlng = new google.maps.LatLng(queryParams.lat, queryParams.lng),
  			styles,
  			mapOptions,
  			marker,
  			panorama;

		styles = [{
		    featureType: 'administrative',
		    elementType: 'all',
		    stylers: [{
		        saturation: 0
		    }]
		}, {
		    featureType: 'administrative.country',
		    elementType: 'all',
		    stylers: [{
		        visibility: 'simplified'
		    }]
		}, {
		    featureType: 'administrative.province',
		    elementType: 'all',
		    stylers: [{
		        visibility: 'simplified'
		    }]
		}, {
		    featureType: 'landscape',
		    elementType: 'all',
		    stylers: [{
		        saturation: -10
		    }]
		}, {
		    featureType: 'poi',
		    elementType: 'all',
		    stylers: [{
		        visibility: 'off'
		    }]
		}, {
		    featureType: 'poi.park',
		    elementType: 'all',
		    stylers: [{
		        saturation: -10
		    }, {
		        lightness: 30
		    }, {
		        visibility: 'simplified'
		    }]
		}, {
		    featureType: 'road',
		    elementType: 'all',
		    stylers: [{
		        saturation: -100
		    }]
		}, {
		    featureType: 'road.highway',
		    elementType: 'geometry',
		    stylers: [{
		        saturation: 0
		    }, {
		        hue: '#5EAB1F'
		    }, {
		        lightness: 0
		    }]
		}, {
		    featureType: 'road.highway',
		    elementType: 'label',
		    stylers: [{
		        visibility: 'simplified'
		    }]
		}, {
		    featureType: 'road.arterial',
		    elementType: 'all',
		    stylers: [{
		        saturation: -100
		    }, {
		        lightness: 20
		    }]
		}, {
		    featureType: 'road.arterial',
		    elementType: 'label',
		    stylers: [{
		        visibility: 'on'
		    }]
		}, {
		    featureType: 'road.local',
		    elementType: 'label',
		    stylers: [{
		        visibility: 'on'
		    }]
		}, {
		    featureType: 'transit',
		    elementType: 'all',
		    stylers: [{
		        saturation: -100
		    }]
		}, {
		    featureType: 'water',
		    elementType: 'all',
		    stylers: [{
		        hue: '#0089CF'
		    }, {
		        saturation: -50
		    }, {
		        lightness: 30
		    }]
		}, {
		    featureType: 'administrative.land_parcel',
		    elementType: 'all',
		    stylers: [{
		        visibility: 'on'
		    }]
		}];

		mapOptions = {
			zoom               : 17,
			maxZoom            : 19, 
			minZoom            : 13, 
			center             : latlng,
			mapTypeId          : google.maps.MapTypeId.ROADMAP,
			zoomControl        : true,
			zoomControlOptions : {
				style: google.maps.ZoomControlStyle.SMALL
			},
			scrollwheel : false,
			styles      : styles
		};

		mapCanvas = new google.maps.Map(mapCanvasEle, mapOptions);
		panorama  = mapCanvas.getStreetView();
		panorama.setPosition(mapCanvas.getCenter());

		if (queryParams.isShift) {
			//Add an overlay to the map.
			var circleOverlay = new google.maps.Circle({
				strokeWeight : 0,
				fillColor    : '#ff9933',
				fillOpacity  : 0.35,
				map          : mapCanvas,
				center       : latlng,
				radius       : 100
			});

			google.maps.event.addListener(circleOverlay, 'mouseover', function(e) {
				$(mapCanvas.getDiv()).attr('title', '物件位於此範圍內');
			});
			google.maps.event.addListener(circleOverlay, 'mouseout', function(e) {
				$(mapCanvas.getDiv()).attr('title', '');
			});
		} else {
			marker = new google.maps.Marker({
				position : latlng,
				map      : mapCanvas,
				icon     : ICON_MARKER.current,
				title    : '目前物件位置'
			});
		}

		// Add control of streetview.
		var controlSel = $('<div class="map-control"></div>').html('<a class="btn" draggable="false" href="javascript:;" title="街景">街景</a>');
		controlSel.on('click', function (e) {
			panorama.setVisible(true);
			e.preventDefault();
		});
        mapCanvas.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlSel.get(0));

        // To prevent firing visible_changed event twice, set panorama center in the end of dragging the map.
        // Instead, set panorama center when firing click event of map-control.
        google.maps.event.addListener(mapCanvas, 'dragend', function () {
        	panorama.setPosition(mapCanvas.getCenter());
        });

        // Add GA event tracking for map type control.
        google.maps.event.addListener(mapCanvas, 'maptypeid_changed', function() {
        	var type = mapCanvas.getMapTypeId();
        	switch (type) {
        		case google.maps.MapTypeId.HYBRID:
        			gtm_event_track('detail_map', 'detail_map_function_click', 'detail_map_function_Satellite imagery');
        			break;
        		case google.maps.MapTypeId.ROADMAP:
        			gtm_event_track('detail_map', 'detail_map_function_click', 'detail_map_function_map');
        			break;
        		case google.maps.MapTypeId.TERRAIN:
        			gtm_event_track('detail_map', 'detail_map_function_click', 'detail_map_function_landscape');
        			break;
        	}
		});

        // Add GA event tracking when dragging Pegman onto the map or clicking on the map-control.
        google.maps.event.addListener(panorama, 'visible_changed', function() {
        	if (panorama.getVisible()) {
        		gtm_event_track('detail_map', 'detail_map_function_click', 'detail_map_function_Street View');
        	}
        });

		// Query nearby poi info.
		queryNearbyLiving();
	};

	/**
	* Set the position of the side section and bind events whe the page is ready.
	*
	* @method init
	*/
	init = function () {
		// Check the sign-in state of the user to show/hide anchors of sign-in, sign-up, or sing-out.
		window.HF.tools.logResults();

		queryParams = {
			hfId           : $('#query-hf-id').val(),
			buildingId     : $('#query-building-id').val(),
			caseId         : $('#query-case-id').val(),
			messageType    : $('#query-message-type').val(),
			shopId         : $('#query-shop-id').val(),
			assignBuilding : $('#query-assign-building').val(),
			county         : $('#query-county').val(),
			district       : $('#query-district').val(),
			road           : $('#query-road').val(),
			caseNo         : $('#query-case-no').val(),
			caseName       : $('#query-case-name').val(),
			isShift	       : parseInt($('#query-XYShift').val(), 10),
			lng            : parseFloat($('#query-lng').val(), 10),
			lat            : parseFloat($('#query-lat').val(), 10),
			wmRefUrl       : $('#query-wm-ref-url').val()
		};

		if (!queryParams.hfId) {
			return;
		}

        addWebMaxPageTracking();

		sideOffsetTop = sideSel.offset().top;
		sidePosTop    = sideSel.position().top;

		// Reposition the side section.
		setSidePosition();

		// Validate the reservation form.
		initReservationForm();

		// Caculate loan.
		initLoanCaculation();

		// The map section won't be rendered if lat or lng is equal to zero.
		if (mapSectionSel.length) {
			var settings = {
				'callback': initMap
			};
			if (typeof gmap_client_id !== 'undefined' && gmap_client_id) {
				$.extend({}, settings, {'other_params':'client=' + gmap_client_id + '&sensor=false'});
			}
			// Initialize the google map.
			google.load('maps', '3.9', settings);
			// Bind event to each tab of poi category.
			mapSectionSel.on('click', '.tabs > li > a', handleTabPoiClick);
		}

		// TODO: load google map when the user scrolled on the position of the map.
		// Reposition the side section and load house images.
		$(window).on('resize scroll', function (e) {
			setSidePosition();

			if ($(this).scrollTop() >= (agentSectionSel.offset().top - 400)) {
				loadHouseImages();
			}
		});

		// Render the recommended house list.
		if ($(window).scrollTop() >= (agentSectionSel.offset().top - 400)) {
			renderHouseList(loadHouseImages);
		} else {
			renderHouseList();
		}

		// Share facebook.
		$('#action-share').on('click', handleShareClick);
		// Forward email.
		$('#action-forward').on('click', handleForwardClick);
		// Report.
		$('#action-report').on('click', handleReportClick);

		// Add a house.
		$('#action-add-house').on('click', handleAddHouseClick);
		// Notification of lower price.
		$('#action-lower-price').on('click', handleLowerPriceClick);
		// Add a building.
		$('#action-add-building').on('click', handleAddBuildingClick);

		// Update value of session storage in order to show the lightbox on the initial.
		$('#lightbox-add-house-nonlogin').find('.action-sign-in, .action-sign-up').on('click', handleAddHouseActionClick);

		// Update value of session storage in order to show the lightbox on the initial.
		$('#lightbox-lower-price-nonlogin').find('.action-sign-in, .action-sign-up').on('click', handleLowerPriceActionClick);

		// Update value of session storage in order to show the lightbox on the initial.
		$('#lightbox-add-building-nonlogin').find('.action-sign-in, .action-sign-up').on('click', handleAddBuildingActionClick);

		$('#lightbox-notify-building-newcase-nonlogin').find('.action-sign-in, .action-sign-up', handleBuildingNewCaseActionClick);

		// Show the lightbox of notification of lowering price.
		$('#lightbox-add-house-success').find('.action-notify-lower-price').on('click', function (e) {
			$('#action-lower-price').trigger('click');
			e.preventDefault();
		});

		// Show the lightbox of notification of adding a building newcase.
		$('#lightbox-add-building-success').find('.action-notify-building-newcase').on('click', function (e) {
			submitToNotifyBuildingNewCase($('#action-add-building'));
			e.preventDefault();
		});

		// Close the lightbox.
		$('#lightbox-add-house-success').find('.action-view').on('click', handleLightboxClose);
		$('#lightbox-lower-price-success').find('.action-view').on('click', handleLightboxClose);
		$('#lightbox-add-building-success').find('.action-view').on('click', handleLightboxClose);
		$('#lightbox-notify-building-newcase-success').find('.action-view').on('click', handleLightboxClose);
		$('#lightbox-notify-building-newcase-duplicate').find('.action-view').on('click', handleLightboxClose);

		// Show the lightbox result of adding a house on the initial.
		if (getWebStorageItem(WEB_STORAGE_ITEMS.addHouse)) {
			$('#action-add-house').trigger('click');
		}

		// Show the lightbox result of lowering the price on the initial.
		if (getWebStorageItem(WEB_STORAGE_ITEMS.notifyLowerPrice)) {
			$('#action-lower-price').trigger('click');
		}

		// Show the lightbox result of adding a building on the initial.
		if (getWebStorageItem(WEB_STORAGE_ITEMS.addBuilding)) {
			$('#action-add-building').trigger('click');
		}

		// Show the lightbox result of notification of adding a building newcase on the initial.
		if (getWebStorageItem(WEB_STORAGE_ITEMS.notifyBuildingNewCase)) {
			$('#lightbox-add-building-success').find('.action-notify-building-newcase').trigger('click');
		}

		// Click to view the complete phone number.
		$('.action-view-phone').on('click', handleViewPhoneClick);

		// Badge list.
		$('#badge-list').on('click', 'li > a', handleBadgeClick);

		// Mouseenter or mouseleave the tooltip.
		$('.m-icon-question-circle').each(function (idx, element) {
			$(element).mtooltip({
				title    : '電話不通 ？',
				content  : '部分節費系統無法撥打本服務專線，請改用其他市話或其他電信業者（如：中華電信、遠傳、台灣大哥大、亞太、威寶）撥打。',
				container: '.detail-content'
			});
		});

		// Show or hide the popover.
		$('#action-land-building').mpopover({
			title    : '謄本資料',
			content  : $('#popover-land-building').find('.popover-content'),
			container: '.detail-content',
			placement: 'upper-left'
		});

		// Show or hide the popover.
		$('#action-caculation').mpopover({
			title    : '簡易房貸試算公式',
			content  : $('#popover-caculation').find('.popover-content'),
			container: '.detail-content',
			placement: 'upper-left'
		});

		$('.m-paging-btn-prev, .m-paging-btn-next').on('mouseenter', handleMouseEnterPaging);
	};

	init();
});
