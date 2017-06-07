(function (jQuery) {

    // Horizontal scrolling

    jQuery(document).ready(function () {
        if ( jQuery( ".hslider-holder" ).length ) {
            var vsstatus=[], swipe_pos=[], maxwidth=[];
            var hs_holder=[], hs_container=[], hs_wrapper=[], hs_direction=[];

            jQuery(".hslider-holder").each(function (index) {
                vsstatus.push(0);
                swipe_pos.push(0);
                maxwidth.push(0);
                var elem_id = jQuery(this).attr("id");
                hs_direction.push(jQuery(this).data('direction'));
                hs_holder.push(jQuery("#" + elem_id));
                hs_wrapper.push(hs_holder[index].children(".hslider-wrapper"));
                hs_container.push(hs_wrapper[index].children(".hslider-container"));
            });

            var sumwidth,
                ratio,
                imgheight,
                delta;

            jQuery(window).resize(function () {
                jQuery(".hslider-holder").each(function (index) {
                    if (window.matchMedia('(max-width: 960px)').matches) {
                        var imagewidth, imageheight, slideheight;
                        hs_container[index].children('.hslider-slide').each(function () {
                            imagewidth = jQuery("img", this).get(0).naturalWidth;
                            imageheight = jQuery("img", this).get(0).naturalHeight;
                            slideheight = jQuery(this).height();
                            jQuery(this).css("width", imagewidth * slideheight / imageheight);
                        });
                        hs_container[index].css("transform", "translate3d(" + swipe_pos[index] + "px, 0px, 0px)");
                        hs_container[index].swipe("enable");
                    }
                    else {
                        hs_container[index].swipe("disable");
                        hs_container[index].children('.hslider-slide').each(function () {
                            jQuery(this).css("width", "");
                        });
                    }
                    imgheight = hs_container[index].find(" .hslider-slide").height();
                    sumwidth = 0;
                    hs_container[index].children(".hslider-slide").each(function (index) {
                        sumwidth += jQuery(this).width();
                    });
                    ratio = sumwidth / imgheight;
                    maxwidth[index] = sumwidth - jQuery(window).width();
                    if (hs_direction[index] === 'right') hs_container[index].css("transform", "translate3d(-" + maxwidth[index] + "px, 0px, 0px)");
                    hs_wrapper[index].height(100 * ratio + "vh");
                    vsstatus[index] = 0;

                    jQuery(window).scroll();
                });
            });

            jQuery(window).scroll(function () {
                jQuery(".hslider-holder").each(function (index) {
                    if (window.matchMedia('(max-width: 960px)').matches) {
                        hs_wrapper[index].attr('style', '');
                        hs_container[index].css('position', '');
                        hs_container[index].css({
                            "transform": "translate3d(" + swipe_pos[index] + "px, 0px, 0px)"
                        });
                    } else {

                        hs_container[index].css("transition-duration", "");
                        var docViewTop = jQuery(window).scrollTop();
                        var elemTop = hs_wrapper[index].offset().top;
                        var offsettop = docViewTop - elemTop;
                        var docViewBottom = docViewTop + jQuery(window).height();
                        var elemBottom = elemTop + hs_wrapper[index].height();
                        var offsetbottom = docViewBottom - elemBottom;

                        if (offsettop >= 0) {
                            if (!vsstatus[index]) {
                                hs_container[index].css("position", "fixed");
                                vsstatus[index] = 1;
                            }
                            if (vsstatus[index]) {
                                delta = offsettop * maxwidth[index] / (hs_wrapper[index].height() - jQuery(window).height());
                                if (delta > maxwidth[index]) delta = maxwidth[index];
                                if (hs_direction[index] === 'right') delta = maxwidth[index] - delta;
                                hs_container[index].css("transform", "translate3d(-" + delta + "px, 0px, 0px)");
                            }
                            if (offsetbottom >= 0) {
                                hs_container[index].css({"position": "absolute", "top": "auto", "bottom": "0"});
                                vsstatus[index] = 0;
                            }
                        } else {
                            if (vsstatus[index]) {
                                hs_container[index].css({
                                    "position": "absolute",
                                    "top": "0",
                                    "bottom": "auto"
                                });
                                vsstatus[index] = 0;
                            }
                        }
                    }
                });
            });

            jQuery( ".hslider-holder" ).each(function(index){
                hs_container[index].swipe({
                    swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
                        var disttemp;
                        if (phase == "move" && (direction == "left" || direction == "right")) {
                            hs_wrapper[index].find('.swipe').fadeOut(300);
                            if (direction == "left") {
                                disttemp = swipe_pos[index] - distance;
                                hs_container[index].css({
                                    "transform": "translate3d(" + disttemp + "px, 0px, 0px)",
                                    "transition-duration": "0.0s"
                                });
                            } else if (direction == "right") {
                                disttemp = swipe_pos[index] + distance;
                                hs_container[index].css({
                                    "transform": "translate3d(" + disttemp + "px, 0px, 0px)",
                                    "transition-duration": "0.0s"
                                });
                            }

                        } else if (phase == "end") {
                            if (direction == "right") {
                                swipe_pos[index] = swipe_pos[index] + distance + 150 * distance / duration;
                                if (swipe_pos[index] > 0) swipe_pos[index] = 0;
                                hs_container[index].css({
                                    "transform": "translate3d(" + swipe_pos[index] + "px, 0px, 0px)",
                                    "transition-duration": "0.5s"
                                });
                            } else if (direction == "left") {
                                var swdelta = hs_container[index].find(".hslider-slide:last-child").offset().left - hs_container[index].find(".hslider-slide:first-child").offset().left - jQuery(window).width() + hs_container[index].find(".hslider-slide:last-child").width();
                                swipe_pos[index] = swipe_pos[index] - distance - 150 * distance / duration;
                                if ((swipe_pos[index] + swdelta) < 0) swipe_pos[index] = -swdelta;
                                hs_container[index].css({
                                    "transform": "translate3d(" + swipe_pos[index] + "px, 0px, 0px)",
                                    "transition-duration": "0.5s"
                                });
                            }
                        }

                    },
                    threshold: 0
                });
            });
        }
    });
}(jQuery));
