// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    $(".header").headroom();
    
    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });


    function fix_page_height(){
        var sections = $('.page-content');

        if ( sections.length == 1 ) {
            sections.css('min-height', $(window).height() - $('.footer').outerHeight() - $('.header').outerHeight() );
        }
    }
    fix_page_height();

    $(window).on('resize', function(event) {
        event.preventDefault();
        fix_page_height();
    });


    /*---------------------------
                                  File input logic
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).on('change', function(event) {
            event.preventDefault();
            var placeholder = $(this).siblings('label');
        
            if ( this.files.length > 0 ) {
                if ( this.files[0].size < 5000000 ) {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    
                    placeholder.text(filename);
                } else {
                    alert('Maximum file size is 5Mb');
                }    
            } else {
                placeholder.text('');
            }
            
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $('.mobile-menu').toggleClass('active');
    });


    $('.js-close-menu').on('click', function(event) {
        event.preventDefault();
        $('.js-toggle-menu').toggleClass('is-active');
        $('.mobile-menu').removeClass('active');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({
        
    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.fancybox.open([
            {
                src  : popup,
                type: 'inline',
                opts : {}
            }
        ], {
            loop : false
        });
    }



    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });




    /*---------------------------
                                  Vertical carousel
    ---------------------------*/

    /*$('.vertical-carousel').slick({
       vertical: true,
       slidesToShow: 3,
       slidesToScroll: 1,
       arrows: false,
       infinite: true,
       autoplay: true,
        autoplaySpeed: 2000,
    })*/



    function add_transaction ( html ) {
        slide = $.parseHTML( html );

        if ( $('.vertical-carousel').find('.slide').length > 0 ) {

            $('.vertical-carousel').find('.slide').fadeOut('1000', function() {
                $(this).remove();

                $('.vertical-carousel').prepend(slide);
                $(slide).fadeIn('1000');
            });    

        } else {

            $('.vertical-carousel').prepend(slide);
            $(slide).fadeIn('1000');

        }
    }

    setInterval(function(){
        var str = '<div class="slide">'+
                        '<div class="card">'+
                            '<div class="card-body">'+
                                '<div class="tx-card">'+
                                    '<div class="tx-card__recepient">Someone from Argentina just bought</div>'+
                                    '<div class="tx-card__amount">1.5 ETH of Intimate Tokens</div>'+
                                    '<div class="tx-card__time">12 Minutes ago</div>'+
                                '</div>'+
                            '</div>'+
                            '<button class="dismiss-notification">×</button>' +
                        '</div>'+
                    '</div>';


        add_transaction( str );
    }, Math.random() * (10000 - 4000) + 4000 );

    $(document).on('click', '.dismiss-notification', function(event) {
        event.preventDefault();
        $(this).parents('.card').fadeOut('1000', function() {
            $(this).remove();
        });
    });




    /* Select plan */
    $('.js-select-plan').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */

        $(this).parents('.js-plan-select-form').find('.card').each(function(index, el) {
            $(this).removeClass('selected');
            var plan_id = $(this).attr('data-id');
            $(this).find('input[name="plans['+plan_id+'][selected]"]').val('0');
            $(this).find('.btn').removeClass('btn-success').text('Select');
        });

        $(this).parents('.card').addClass('selected');
        var plan_id = $(this).parents('.card').attr('data-id');
        $(this).parents('.card').find('input[name="plans['+plan_id+'][selected]"]').val('1');
        $(this).parents('.card').find('.btn').addClass('btn-success').text('Selected');

        $(this).parents('.js-plan-select-form').find('input[name="selected_plan"]').val(plan_id);
    });





    /* Copy to clipboad */
    $('.js-copy-value').on('click', function(event) {
        event.preventDefault();
        var input = $(this).siblings('input');

        /* Select the text field */
        input.select();

        /* Copy the text inside the text field */
        document.execCommand("Copy");

        /* Alert the copied text */
        alert("Copied the text: " + input.val());
    }); 



    /* toggle password show */
    $('.js-toggle-password').on('click', function(event) {
        event.preventDefault();

        var labels = $(this).attr('data-label');

        var states = labels.split(" | ");
        var input = $(this).siblings('input');

        $(this).toggleClass('is-active btn-primary');

        if ( $(this).hasClass('is-active') ) {
            $(this).text( states[0] );
            input.attr('type', 'text');
        } else {
            $(this).text( states[1] );
            input.attr('type', 'password');
        }
    });


    /*---------------------------
                                  Google map init
    ---------------------------*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var styles = [];

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 16,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var styledMapType=new google.maps.StyledMapType(styles,{name:'Styled'});
        map.mapTypes.set('Styled',styledMapType);
        map.setMapTypeId('Styled');

        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Site Title"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file