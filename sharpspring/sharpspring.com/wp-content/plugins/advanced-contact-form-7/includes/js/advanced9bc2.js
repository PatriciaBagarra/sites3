;jQuery(document).ready(function($){

  var work = $('.ik_ssnoform_redirect');

  if ( work.length === 0 ) {
    return false;
  }

  $(document).on('wpcf7mailsent', function(e) {
    if (typeof __ss_noform !== 'undefined') {
      var frm = $('#'+e.detail.form_id),
          action = frm.attr('action'),
          container = $('.ik_ssnoform_redirect[data-id='+e.detail.form_id+']'),
          token = container.data('token');
      __ss_noform.push(['form', e.detail.form_id, token]);
      __ss_noform.push(['submit', function() {
        if (action !== 'confirmation') {
          window.location = action;
        } else {
          var confirm_el = $('#' + container.data('confirm'));
          if (confirm_el.length) {
            frm.find('.myform').html('').append(confirm_el.show());
          }
        }
      }, token]);
    }
  });

  work.each(function(index, el) {
    var current_work = $(el),
        current_form = $('#' + current_work.data('id'));

    current_work.attr('data-cookieimgsrc', '/');
    current_work.append('<img class="set-cookie-img" src="#" style="display:none;">');

    current_form
    .on('click change', 'input[type="radio"]', function(e) {
      if ( current_work.hasClass('way1') ) {
        checkDemoRadio(current_work, current_form);
      } else if ( current_work.hasClass('way2') ) {
        checkRedirects(current_work, current_form);
      }
    }).
    on('submit', function(e) {
      if (current_work.data('cookieimgsrc') !== '/') {
        populateCookie( current_work, current_form );
      }
    });

    if ( current_work.hasClass('way1') ) {
      checkDemoRadio(current_work, current_form);
    } else if ( current_work.hasClass('way2') ) {
      checkRedirects(current_work, current_form);
    }
  });

  function checkRedirects(context, form) {
    var radioDemo = $('input[name="demo"]:checked', form),
        radioMarketing = $('input[name="marketing_firm_539daa9e7acc5"]:checked', form),
        redirectYesYes = context.data('redirectyesyes'),
        redirectYesNo = context.data('redirectyesno'),
        redirectNoYes = context.data('redirectnoyes'),
        redirectNoNo = context.data('redirectnono');
    if ( radioDemo.length != 0 && radioMarketing.length != 0 ) {
      var radioDemoVal = radioDemo.val().toUpperCase(),
          radioMarketingVal = radioMarketing.val().toUpperCase();
      if ( radioDemoVal === 'YES' && radioMarketingVal === 'YES' ) {
        form.attr('action', redirectYesYes);
        context.attr('data-cookieimgsrc', getCookieImgUrl(redirectYesYes));
      } else if ( radioDemoVal === 'YES' && radioMarketingVal === 'NO' ) {
        form.attr('action', redirectYesNo);
        context.attr('data-cookieimgsrc', getCookieImgUrl(redirectYesNo));
      } else if ( radioDemoVal === 'NO' && radioMarketingVal === 'YES' ) {
        form.attr('action', redirectNoYes);
        context.attr('data-cookieimgsrc', getCookieImgUrl(redirectNoYes));
      } else if ( radioDemoVal === 'NO' && radioMarketingVal === 'NO' ) {
        form.attr('action', redirectNoNo);
        context.attr('data-cookieimgsrc', getCookieImgUrl(redirectNoNo));
      }
    }
  }

  function checkDemoRadio(context, form) {
    var T = $('input[name="demo"]:checked', form);
    if ( T.length !== 0 ) {
        var Tval = T.val().toUpperCase(),
            redirectYes = context.data('redirectyes'),
            redirectNo = context.data('redirectno');
      if ( Tval != "" ) {
        if ( redirectYes !== undefined && redirectNo !== undefined ) {
          if ( Tval === 'YES' ) {
            form.attr('action', redirectYes);
            context.attr('data-cookieimgsrc', getCookieImgUrl(redirectYes));
          } else {
            form.attr('action', redirectNo);
            context.attr('data-cookieimgsrc', getCookieImgUrl(redirectNo));
          }
        } else {
          console.warn('Fill "Redirect" value in the shortcode');
        }
      } else {
        console.warn('Fill "Demo" value');
      }
    }
  }

  if (typeof Cookies.get === 'function') {
    $('[data-cookie]').each(function() {
      var T = $(this);
      if ( T[0].nodeName == 'INPUT' ) {

        var Tname = T.attr('name'),
            TnewVal = Cookies.get(Tname);

        // remove "previous-version" cookie
        if ( TnewVal !== undefined && TnewVal.indexOf('{') === 0 && TnewVal.indexOf('}') > 0 ) {
          Cookies.remove(Tname, { path: '/' });
          TnewVal = Cookies.get(Tname);
        }

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

          // remove "previous-version" cookie
          if ( TnewVal0 !== undefined && TnewVal0.indexOf('{') === 0 && TnewVal0.indexOf('}') > 0 ) {
            Cookies.remove(Tname, { path: '/' });
            TnewVal0 = Cookies.get(Tname);
          }

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

  function populateCookie( context, form ) {
    var formPopulate = {};
    form.find('[data-populate]').each(function() {
      var T = $(this);
      if ( T[0].nodeName == 'INPUT' ) {
        var Tname = T.attr('name'),
          Tval = T.val();
        formPopulate[Tname] = Tval;
      } else if ( T[0].nodeName == 'SPAN' ) {
        var Tinp = T.find('input:checked'),
          Tname = Tinp.attr('name'),
          Tval = Tinp.val();
        formPopulate[Tname] = Tval;
      }
    });
    formPopulate['ref'] = '1';

    // sort by length
    var sortFormPopulate = [];
    for (var elem in formPopulate) {
      sortFormPopulate.push([elem, formPopulate[elem]]);
    }
    sortFormPopulate.sort(function(a, b) {
      if ( a[1] !== undefined && b[1] !== undefined ) {
        return a[1].length - b[1].length;
      }
    });

    var formPopulate = {};
    for ( var i in sortFormPopulate ) {
      var arr1 = sortFormPopulate[i];
      for ( var j = 0; j < arr1.length; j+=2 ) {
        formPopulate[arr1[j]] = arr1[j+1];
      }
    }

    // img src
    var getParams = $.param( formPopulate ),
        cookieImg = $('.set-cookie-img', context),
        cookieimgsrc = context.data('cookieimgsrc');
    if ( cookieimgsrc.indexOf("?") > -1 ) {
      getParams = '&' + getParams;
    } else {
      getParams = '?' + getParams;
    }
    cookieImg.attr('src', cookieimgsrc + getParams );
  }

  function getCookieImgUrl(url) {
    var host = url;
    if ( host.indexOf( window.location.hostname ) > -1) {
      return "/";
    }
    if (host.indexOf('://') > -1) {
      var http = host.split('://');
      host = host.split('/')[2];
      host = host.split(':')[0];
      host = host.split('?')[0];
      host = http[0] + '://' + host + '/wp-content/plugins/advanced-contact-form-7/setcookie.php';
    } else {
      host = "/";
    }
    return host;
  }

});