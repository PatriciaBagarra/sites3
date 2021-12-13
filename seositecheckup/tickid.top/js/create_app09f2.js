function validateEmail(email) {
     const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(String(email).toLowerCase());
 }

 function ValidateFullname() {
     var fullname = $('#fullname').val();
     var namestore = $('#namestore').val();
     var phonenumber = $('#phone-number').val();
     if (fullname != '') {
         if (fullname.length < 6) {
             $("#error-name").html(" Vui lòng nhập họ và tên phải lớn hơn 6 ký tự ");
             document.getElementById('sign-in-button').disabled = true;

         } else {
             $("#error-name").html('&nbsp;');
             if (namestore.length > 1 && phonenumber.length > 9) {
                 document.getElementById('sign-in-button').disabled = false;
                 document.getElementById('namestore').disabled = false;
             } else {
                 document.getElementById('sign-in-button').disabled = true;
                 document.getElementById('namestore').disabled = false;
             }

         }
     } else {
         $("#error-name").html("Vui lòng nhập họ và tên của bạn");
         $("#error-name").show();
         document.getElementById('sign-in-button').disabled = true;
     }
 }


 function xoa_dau(str) {
     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
     str = str.replace(/đ/g, "d");
     str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
     str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
     str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
     str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
     str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
     str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
     str = str.replace(/Đ/g, "D");
     str = str.replace(/Đ/g, "D");
     str = str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '')
     return str.toLowerCase();
 }

 var nameStore = document.getElementById('namestore');
 if(nameStore){
    nameStore.addEventListener('keyup', chang_url);
 }
 var typingTimer; //timer identifier
 var doneTypingInterval = 500; //time in ms, 5 second for example
 var $input = $('#namestore');

 function chang_url() {
     var name = xoa_dau($('#namestore').val());
     if (name != '') {
         if (name.length < 3) {
             $("#name-store").html("Vui lòng nhập tên cửa hàng lớn hơn 2 ký tự ");
             $("#name-store").show();
             document.getElementById('sign-in-button').disabled = true;
             document.getElementById('fullname').disabled = false;
             document.getElementById('phone-number').disabled = false;
         } else {
             $("#name-store").html('&nbsp')
             document.getElementById('sign-in-button').disabled = false;
             document.getElementById('fullname').disabled = false;
         }
     } else {
         $("#name-store").html(" Vui lòng nhập tên cửa hàng ");
         $("#name-store").show();
         document.getElementById('sign-in-button').disabled = true;
         document.getElementById('fullname').disabled = false;
         document.getElementById('phone-number').disabled = false;
     }
 }

 function check_phone_number() {
     var name = xoa_dau($('#namestore').val());
     var fullname = $('#fullname').val();
     var check_phoneNumber = $('#phone-number').val();
     $.ajax({
         type: "POST",
         url: "/index/check_phone",
         data: {
             "phone": check_phoneNumber
         },
         dataType: 'json',
         timeout: 600000,
         success: function(data) {
             if (data.status == 200) {
                 $("#alert-error").html('&nbsp')
                 if (name.length > 2 && fullname.length > 5) {
                     document.getElementById('sign-in-button').disabled = false;
                     document.getElementById('fullname').disabled = false;
                     document.getElementById('namestore').disabled = false;
                 } else {
                     document.getElementById('sign-in-button').disabled = true;
                     document.getElementById('namestore').disabled = false;
                     document.getElementById('fullname').disabled = false;
                 }

             } else if (data.status == 201) {
                 $("#alert-error").html(data.data.msg);
                 $("#alert-error").show();
                 document.getElementById('sign-in-button').disabled = true;
                 document.getElementById('fullname').disabled = true;
                 document.getElementById('namestore').disabled = true;
             }
         },

     });
 }

 var first = 0;
 window.onload = function() {
     // Listening for auth state changes.
     // Event bindings.
     let fullname = document.getElementById('fullname');
     let phoneNumber = document.getElementById('phone-number');
     let codeBtn = document.getElementById('cancel-verify-code-buttons');
     let codeForm = document.getElementById('verification-code-form');
     let signBtn = document.getElementById('sign-in-button');
     if(signBtn){
        updateSignInButtonUI();
     }
     if(fullname){
        document.getElementById('fullname').addEventListener('keyup', ValidateFullname);
     }
     if(phoneNumber){
        document.getElementById('phone-number').addEventListener('keyup', updateSignInButtonUI);
     }
     if(codeBtn){
     document.getElementById('cancel-verify-code-button').addEventListener('click', cancelVerification);
    }
    if(codeForm){
     document.getElementById('verification-code-form').addEventListener('submit', onVerifyCodeSubmit);
    }
    if(signBtn){
     document.getElementById('sign-in-button').addEventListener('click', onSignInSubmit);
    }
 };

 /**
  * Function called when clicking the Login button call voice otp.
  */
 function onSignInSubmit() {
     var email = $('#mailstore').val();
     if (email) {
         _email = validateEmail(email);
         if (_email == false) {
             $("#mail-store").html('Vui lòng nhập đúng email của bạn!');
             return;
         } 
     }
     $("#mail-store").html('&nbsp');
     showLoading();
     updateSignInButtonUI();
     if (isPhoneNumberValid()) {
         var phoneNumber = getPhoneNumberFromUserInput();
         var phoneNumberInternational = "+84" + phoneNumber.slice(1, phoneNumber.length);
         $("input[name='register-input-phone']").val(phoneNumber);
         $("input[name='login-input-phone']").val(phoneNumber);
         $("#phone-dsp").html(phoneNumber);
         $.ajax({
                 type: "POST",
                 url: "/index/login_sms",
                 data: {"phone":phoneNumber},
                 dataType: 'json',
                 timeout: 600000,
                 success: function (data) {
                     hideLoading();
                    $('html,body').animate({scrollTop:0},1500);
                     if (data.status == 200) {
                         document.getElementById('contact-form').style.display = 'none';
                         var sec = 30
                         var timer = setInterval(function() { 
                             $('#timeDown').text(sec--);
                             if (sec == -1) {
                                 $("#cancel-verify-code-button").prop('disabled', false);
                             $('#timeDown').fadeOut('fast');
                             clearInterval(timer);
                         } 
                         }, 1000);
                         
                         document.getElementById('verification-code-form').style.display = 'block';
                     } else {
                         $("#alert-error").html(data.message);
                         $("#alert-error").show();
                     }
                 },
                 error: function (e) {
                     $("#alert-error").html("Có lỗi xảy ra, vui lòng thử lại");
                     $("#alert-error").show();
                     hideLoading();
                 }
             });
     } else {
         hideLoading();
     }
 }

 /**
  * Function called when clicking the "Verify Code" button.
  */
 function onVerifyCodeSubmit(e) {
     $("#alert-errors").html('&nbsp')
     e.preventDefault();
     showLoading();
     if (!!getCodeFromUserInput()) {
     var _token = getCodeFromUserInput();
         $.ajax({
             type: "POST",
             url: "/index/login_sms_verify",
             data: {"phone": $("input[name='login-input-phone']").val(), "_token" : _token},
             dataType: 'json',
             timeout: 600000,
             success: function (data) {
                 if(data.status == 200) {
                     if(data.data.isRegister) {
                         hideLoading();
                         onRegisterSubmit();
                     } else {
                         if (data.data.login == true && data.data.num_sites > 0) {
                             onRegisterSubmit();
                         } else {
                             alert("Bạn đã hết số quyền tạo web. Vui lòng liên hệ tới quản trị viên để được cấp quyền!")
                             location.href = '/home';
                         } 
                     }
                 }
                 if (data.status == 201){
                     $("#alert-errors").html(data.message);
                     $("#alert-errors").show();
                     hideLoading();
                 }
             },
             error: function (e) {
                 $("#alert-errors").html("Có lỗi xảy ra, vui lòng thử lại");
                 $("#alert-errors").show();
                 hideLoading();
             }
         });
     } else {
         hideLoading();
     }
 }

 function onRegisterSubmit() {
     showLoading();
     var _name = $('#fullname').val();
     var _namestore = $('#namestore').val();
     var _phone = $('#phone-number').val();
     var _source_id = $('#source_id').val();
     var _email = $('#mailstore').val();
     var _address = $('#addressstore').val();
     var _token = getCodeFromUserInput();
     
     $.ajax({
         type: "POST",
         url: "/index/process_register_store_by_code_otp",
         data: {
             "tel": _phone,
             "namestore": _namestore,
             "name": _name,
             "email":_email,
             "address":_address,
             "_token": _token,
             "source_id": _source_id
         },
         dataType: 'json',
         timeout: 600000,
         success: function(data) {
             if (data.status == 200) {
                 if (data.data.login) {
                     location.href = '/khoi-tao-app-thanh-cong';
                 } else {
                     location.href = '/khoi-tao-app-ban-hang';
                 }
                 hideLoading();
             } else if (data.status == 201) {
                 $("#alert-errors").html(data.data.msg);
                 $("#alert-errors").show();
                 $("#action-register").show();
                 $('#register-button').prop('disabled', false);
                 $('#cancel-register-button').prop('disabled', false);
                 hideLoading();

             } else {
                 location.href = '/khoi-tao-app-ban-hang';
             }
         },
         error: function(e) {
             $("#alert-errors").html("Có lỗi xảy ra, vui lòng thử lại");
             $("#alert-errors").show();

             $("#action-register").show();
             $('#register-button').prop('disabled', false);
             $('#cancel-register-button').prop('disabled', false);
             hideLoading();
         }
     });

 }


 /**
  * Cancels the verification code input.
  */
 function cancelVerification(e) {
     document.getElementById('verification-code-form').style.display = 'none';
     document.getElementById('contact-form').style.display = 'block';
 }

 /**
  * Signs out the user when the sign-out button is clicked.
  */
 function onSignOutClick() {
     firebase.auth().signOut();
 }

 /**
  * Reads the verification code from the user input.
  */
 function getCodeFromUserInput() {
     return document.getElementById('verification-code').value;
 }

 /**
  * Reads the phone number from the user input.
  */
 function getPhoneNumberFromUserInput() {
     let phoneInput = document.getElementById('phone-number');
     if(phoneInput){
        return document.getElementById('phone-number').value;
     }
     return "";
 }

 /**
  * Returns true if the phone number is valid.
  */
 function isPhoneNumberValid() {
     var pattern = /(09|03|07|08|05)+([0-9]{8})\b/g;
     var phoneNumber = getPhoneNumberFromUserInput();
     return phoneNumber.search(pattern) !== -1;
 }


 /**
  * Updates the Sign-in button state depending on ReCAptcha and form values state.
  */
 function updateSignInButtonUI() {

     document.getElementById('sign-in-button').disabled = !isPhoneNumberValid() ||
         !!window.signingIn;

     if (!isPhoneNumberValid()) {
         if (first > 1) {
             $("#alert-error").html("Vui lòng nhập đúng số điện thoại");
             $("#alert-error").show();
         }
         document.getElementById('sign-in-button').disabled = true;
         // document.getElementById('namestore').disabled = true;
         // document.getElementById('note-format-international').style.display = 'block';
     } else {
         check_phone_number();
     }

     first = first + 1;

 }

 $(document).ready(function () {
    //  $('.js-contact-box').css('height', $('.js-contact-box').outerHeight());
 })
 

 function showLoading() {
     $("#login_title").html("Đang khởi tạo ...");
     $("#loging").show();
     $(".box-register-create-app").addClass("op_03");
 }

 function hideLoading() {
     $("#login_title").html("Xác thực tài khoản");
     $("#loging").html('&nbsp')
     $(".box-register-create-app").removeClass("op_03");
 }