jQuery(document).ready(function($) {
  if ( $('.sffvc-ssnoform-scripts').length === 0 ) {
    return false;
  }

  /*
   * Redirects
   */
  var work = $('.sffvc-ssnoform-redirect');

  $(document).on('change', '.sffvc input[type="radio"]', function(e) {
  	$(this).closest('.sffvc-radio-container').removeClass('error-radio');
    if ( work.hasClass('way1') ) {
      var wRadio = work.data('radio');
      checkDemoRadio(wRadio);
    } else if ( work.hasClass('way2') ) {
      checkRedirects();
    }
  });

  work.each(function() {
    var T = $(this);
    if ( T.hasClass('way1') ) {
      var wRadio = work.data('radio');
      checkDemoRadio(wRadio);
    } else if ( T.hasClass('way2') ) {
      checkRedirects();
    }
  });

  function checkRedirects() {
    var radioDemo = $('.sffvc input[name="demo"]:checked'),
        radioMarketing = $('.sffvc input[name="marketing_firm_539daa9e7acc5"]:checked'),
        Tform = radioDemo.closest('form'),
        redirectYesYes = work.data('redirectyesyes'),
        redirectYesNo = work.data('redirectyesno'),
        redirectNoYes = work.data('redirectnoyes'),
        redirectNoNo = work.data('redirectnono');
    if ( radioDemo.length != 0 && radioMarketing.length != 0 ) {
      var radioDemoVal = radioDemo.val().toUpperCase(),
          radioMarketingVal = radioMarketing.val().toUpperCase();
      if ( radioDemoVal === 'YES' && radioMarketingVal === 'YES' ) {
        Tform.attr('action', redirectYesYes);
      } else if ( radioDemoVal === 'YES' && radioMarketingVal === 'NO' ) {
        Tform.attr('action', redirectYesNo);
      } else if ( radioDemoVal === 'NO' && radioMarketingVal === 'YES' ) {
        Tform.attr('action', redirectNoYes);
      } else if ( radioDemoVal === 'NO' && radioMarketingVal === 'NO' ) {
        Tform.attr('action', redirectNoNo);
      }
    }
  }

  function checkDemoRadio(wRadio) {
    if ( wRadio === 'demo' ) {
      var T = $('.sffvc input[name="demo"]:checked');
    } else if ( wRadio === 'agency' ) {
      var T = $('.sffvc input[name="marketing_firm_539daa9e7acc5"]:checked');
    } else {
      var T = '';
    }
    if ( T.length !== 0 ) {
        var Tval = T.val().toUpperCase(),
            Tform = T.closest('form'),
            redirectYes = work.data('redirectyes'),
            redirectNo = work.data('redirectno');
      if ( Tval != "" ) {
        if ( redirectYes !== undefined && redirectNo !== undefined ) {
          if ( Tval === 'YES' ) {
            Tform.attr('action', redirectYes);
          } else {
            Tform.attr('action', redirectNo);
          }
        } else {
          console.warn('Fill "Redirect" value in the shortcode');
        }
      } else {
        console.warn('Fill a value of the radio-button');
      }
    }
  }

  /*
   * Cookies
   */
  if (typeof Cookies.get === 'function') {
    $('[data-cookie]').each(function() {
      var T = $(this);
      if ( T[0].nodeName == 'INPUT' || T[0].nodeName == 'TEXTAREA' || T[0].nodeName == 'SELECT' ) {

        var Tname = T.attr('name'),
            TnewVal = Cookies.get(Tname);

        if ( typeof TnewVal !== undefined && TnewVal !== undefined ) {
          T.val( TnewVal );
        }

        T.on('change', function() {
          var TcookieVal = T.val();
          Cookies.set(Tname, TcookieVal, { expires: 365, path: '/' });
        });

      } else if ( T[0].nodeName == 'SPAN' ) {

        var Tinp = T.find('input');

        Tinp.each(function() {

          var T2 = $(this),
              Tname = T2.attr('name'),
              TnewVal0 = Cookies.get(Tname);

          if ( typeof TnewVal0 !== undefined && TnewVal0 !== undefined && T2.val() === TnewVal0 ) {
            T2.prop('checked', true).change();
          }

          T2.on('change', function() {
            if ( T2.is(':checked') ) {
              var TcookieVal = T2.val();
              Cookies.set(Tname, TcookieVal, { expires: 365, path: '/' });
            }
          });
        });
      }
    });
  }

  /*
   * Submit
   */
  $(document).on('submit', '.sffvc-form', function(e) {
    e.preventDefault();
    var $form = $( this ),
        isValidForm = frm_validate($form),
        noRedirect = $form.find('.sffvc-msg');
    if (isValidForm == true) {
      var frmTag = $form.attr('id'),
          frmData = frm_getdata($form);
      if ( noRedirect.length > 0 ) {
        $form.find('.sffvc-body').hide();
        noRedirect.show();
      }
      triggerEvent( '#'+frmTag, 'sffvc_formsent', frmData );
    } else {
      return false;
    }
  });

  function frm_validate(frm) {
    var valid = true,
      frm_inp = frm.find('input.sffvc-input, textarea.sffvc-input, select.sffvc-input'),
      radios_wrap = frm.find('.sffvc-radio-container'),
      invalidList = [];
    frm_inp.each(function(index, el) {
      var inp = $(el),
        val = inp.val();
      if (val.length < 1) {
        valid = false;
        invalidList.push(inp);
        inp.addClass('error');
      } else {
        inp.removeClass('error');
      }
      if ( inp.hasClass('sffvc-input-email') ) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // valid aaa@aaa.aa
        if (!regex.test(val)) {
          valid = false;
          invalidList.push(inp);
          inp.addClass('error');
        } else {
          inp.removeClass('error');
        }
      }
      if ( inp.hasClass('sffvc-input-phone') ) {
        var regex = /^(\d+-?|\d+\s?)+\d+$/; // valid 111-11 111
        if (!regex.test(val)) {
          valid = false;
          invalidList.push(inp);
          inp.addClass('error');
        } else {
          inp.removeClass('error');
        }
      }
    });
    radios_wrap.each(function(index, el) {
      var T = $(el),
        radio_checked = T.find('input[type="radio"]:checked');
      T.removeClass('error-radio');
      if ( radio_checked.length < 1 ) {
        var focused = T.find('input[type="radio"]').get(0);
        T.addClass('error-radio');
        invalidList.push(focused);
        valid = false;
      }
    });
    if ( invalidList[0] ) {
      invalidList[0].focus();
    }
    return valid;
  }

  function frm_getdata(frm) {
    var frmData = {};
    frmData.inputs = [];
    frmData.status = "sent";
    $.each(frm.serializeArray(), function(i, field) {
      frmData.inputs.push( field );
    });
    return frmData;
  }

  function triggerEvent( target, name, detail ) {
    var $target = $( target );
    var event = new CustomEvent( name, {
      bubbles: true,
      detail: detail
    } );
    $target.get( 0 ).dispatchEvent( event );
  }

});

/*
 * Polyfill for Internet Explorer
 * See https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
( function () {
  if ( typeof window.CustomEvent === "function" ) return false;
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
} )();
