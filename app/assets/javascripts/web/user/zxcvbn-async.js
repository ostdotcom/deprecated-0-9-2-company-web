/**
 * Created by AkshayRaje on 13/10/17.
 */

;(function (window, $) {

    var zxcvbnDefaultHtml = '<div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div>';

    var zxcvbnCheck = function(password){

        var zxcvbnobj = zxcvbn(password, [
            $('#email').val(),
            'simple',
            'token',
            'simpletoken'
        ]);

        var zxcvbnHtml = [
            '<div class="zxcvbn zxcvbn-0"></div><div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div>',
            '<div class="zxcvbn zxcvbn-0"></div><div class="zxcvbn zxcvbn-1"></div><div class="zxcvbn"></div><div class="zxcvbn"></div><div class="zxcvbn"></div>',
            '<div class="zxcvbn zxcvbn-0"></div><div class="zxcvbn zxcvbn-1"></div><div class="zxcvbn zxcvbn-2"></div><div class="zxcvbn"></div><div class="zxcvbn"></div>',
            '<div class="zxcvbn zxcvbn-0"></div><div class="zxcvbn zxcvbn-1"></div><div class="zxcvbn zxcvbn-2"></div><div class="zxcvbn zxcvbn-3"></div><div class="zxcvbn"></div>',
            '<div class="zxcvbn zxcvbn-0"></div><div class="zxcvbn zxcvbn-1"></div><div class="zxcvbn zxcvbn-2"></div><div class="zxcvbn zxcvbn-3"></div><div class="zxcvbn zxcvbn-4"></div>'
        ];

        if(password.length > 0){
            $('.zxcvbn-group').html(zxcvbnHtml[zxcvbnobj.score]);
        } else {
            $('.zxcvbn-group').html(zxcvbnDefaultHtml);
        }

    };

    var $password = $("#password");

    $(function () {

        $('.zxcvbn-group').html(zxcvbnDefaultHtml);

        // Asynchronously load zxcvbn.js from //cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js
        $.ajax({
            url: '//cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js',
            dataType: "script",
            cache: true,
            success: function(){

                $password.on('keyup', function () {
                    zxcvbnCheck($(this).val());
                });

            }
        });

        $( "#showhide-password" ).on('click', function() {
            if($password.attr('type') == 'password'){
                $password.attr('type', 'text');
                $(this).addClass('clicked');
            } else if($password.attr('type') == 'text'){
                $password.attr('type', 'password');
                $(this).removeClass('clicked');
            }
        });

    });

})(window, jQuery);
