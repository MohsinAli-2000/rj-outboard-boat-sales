/* =================================================================
   RJ's Outboard Sales & Service — script.js

   One $(document).ready with labeled regions. Every DOM-specific
   block is guarded with a .length check so this file stays safe to
   load on every page. New behaviour → add its own labeled region.
   ================================================================= */

$(document).ready(function () {

    /* ===== mobile menu code starts here ===== */
    if ($('.js-mobile-menu').length) {
        var $mobileMenu = $('.js-mobile-menu');
        var $mobileOverlay = $('.js-mobile-menu-overlay');
        var $mobileOpenButton = $('.js-mobile-menu-open');

        function openMobileMenu() {
            $mobileMenu.addClass('is-open').attr('aria-hidden', 'false');
            $mobileOverlay.addClass('is-open');
            $mobileOpenButton.attr('aria-expanded', 'true');
            $('body').addClass('is-menu-open');
        }

        function closeMobileMenu() {
            $mobileMenu.removeClass('is-open').attr('aria-hidden', 'true');
            $mobileOverlay.removeClass('is-open');
            $mobileOpenButton.attr('aria-expanded', 'false');
            $('body').removeClass('is-menu-open');
        }

        $mobileOpenButton.on('click', openMobileMenu);

        $('.js-mobile-menu-close, .js-mobile-menu-overlay').on('click', closeMobileMenu);

        // close the drawer after tapping a real destination link
        $mobileMenu.on('click', 'a[href]', function () {
            if ($(this).attr('href') !== 'javascript:void(0)') {
                closeMobileMenu();
            }
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') { closeMobileMenu(); }
        });

        // the burger is hidden above 991, so nothing should stay open
        $(window).on('resize', function () {
            if (window.innerWidth > 991) { closeMobileMenu(); }
        });
    }
    /* ===== mobile menu code ends here ===== */


    /* ===== hero video code starts here ===== */
    /* Home page only. Safari/iOS ignore the autoplay attribute until the
       element is also muted in JS; the catch keeps a blocked play() from
       raising an unhandled rejection, and the poster simply stays on
       screen. Visitors who ask for reduced motion get the still poster. */
    if ($('.js-hero-video').length) {
        var heroVideo = $('.js-hero-video').get(0);
        var prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        heroVideo.muted = true;

        if (prefersReducedMotion) {
            heroVideo.removeAttribute('autoplay');
            heroVideo.pause();
        } else {
            var heroPlayback = heroVideo.play();
            if (heroPlayback && typeof heroPlayback.catch === 'function') {
                heroPlayback.catch(function () { });
            }
        }
    }
    /* ===== hero video code ends here ===== */


    /* ===== form code starts here ===== */
    /* Newsletter, valuation and sea-trial forms. No backend yet: the
       browser's own constraint API validates the required fields, then
       the text in the form's data-success-message shows inline and the
       form resets. Mark a form with .js-form and give it a .js-form-message
       element; nothing else is needed to add another. */
    if ($('.js-form').length) {
        $('.js-form').on('submit', function (e) {
            e.preventDefault();
            var formElement = this;
            var $message = $(formElement).find('.js-form-message');

            if (!formElement.checkValidity()) {
                // native browser prompt points at the first invalid field
                formElement.reportValidity();
                return;
            }

            $message.text($(formElement).data('success-message')).prop('hidden', false);
            formElement.reset();
        });
    }
    /* ===== form code ends here ===== */


    /* ===== date input code starts here ===== */
    /* A bare type="date" input can't show a placeholder, only the browser's
       own mm/dd/yyyy mask. These start as text so "Select Date..." shows,
       swap to a real date field (and open its picker) on focus, and swap
       back if left empty. Past dates are blocked. */
    if ($('.js-date-input').length) {
        var today = new Date();
        var todayIso = today.getFullYear() + '-' +
            ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
            ('0' + today.getDate()).slice(-2);

        $('.js-date-input').on('focus', function () {
            var input = this;
            input.type = 'date';
            input.min = todayIso;
            if (typeof input.showPicker === 'function') {
                try { input.showPicker(); } catch (error) { /* needs a user gesture; the field is still usable */ }
            }
        });

        $('.js-date-input').on('blur', function () {
            if (!this.value) { this.type = 'text'; }
        });

        // a successful submit resets the form; show the placeholder again
        $('.js-date-input').closest('form').on('reset', function () {
            $(this).find('.js-date-input').attr('type', 'text');
        });
    }
    /* ===== date input code ends here ===== */

    /* ===== loan estimator code starts here ===== */
    /* Monthly payment = P * r / (1 - (1 + r)^-n) with r the APR / 12. The
       amount field accepts digits only, shows them as $12,345, and is
       clamped to the data-min / data-max range when it loses focus; the
       arrow keys nudge it by $1,000 ($10,000 with Shift). */
    if ($('.js-estimator').length) {
        var $estimator = $('.js-estimator');
        var $amountInput = $estimator.find('.js-estimator-amount');
        var $termButtons = $estimator.find('.js-estimator-term');
        var $payment = $estimator.find('.js-estimator-payment');
        var estimatorRate = parseFloat($estimator.data('rate')) / 100 / 12;
        var estimatorMin = parseInt($estimator.data('min'), 10);
        var estimatorMax = parseInt($estimator.data('max'), 10);

        function readAmount() {
            return parseInt($amountInput.val().replace(/\D/g, ''), 10) || 0;
        }

        function formatAmount(amount) {
            return '$' + amount.toLocaleString('en-US');
        }

        function updatePayment() {
            var amount = Math.min(Math.max(readAmount(), estimatorMin), estimatorMax);
            var months = parseInt($termButtons.filter('.is-active').data('months'), 10);
            var payment = amount * estimatorRate / (1 - Math.pow(1 + estimatorRate, -months));
            $payment.text(formatAmount(Math.round(payment)));
        }

        // select the whole amount on focus so typing replaces it
        $amountInput.on('focus', function () {
            var input = this;
            setTimeout(function () { input.select(); }, 0);
        });

        $amountInput.on('input', function () {
            var digits = $(this).val().replace(/\D/g, '').slice(0, 7);
            $(this).val(digits ? formatAmount(parseInt(digits, 10)) : '');
            updatePayment();
        });

        $amountInput.on('blur', function () {
            var clamped = Math.min(Math.max(readAmount(), estimatorMin), estimatorMax);
            $(this).val(formatAmount(clamped));
            updatePayment();
        });

        $amountInput.on('keydown', function (e) {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') { return; }
            e.preventDefault();
            var step = (e.shiftKey ? 10000 : 1000) * (e.key === 'ArrowUp' ? 1 : -1);
            var next = Math.min(Math.max(readAmount() + step, estimatorMin), estimatorMax);
            $(this).val(formatAmount(next));
            updatePayment();
        });

        $termButtons.on('click', function () {
            $termButtons.removeClass('is-active').attr('aria-pressed', 'false');
            $(this).addClass('is-active').attr('aria-pressed', 'true');
            updatePayment();
        });

        updatePayment();
    }
    /* ===== loan estimator code ends here ===== */

    /* ===== faq code starts here ===== */
    /* Accordion: each question button toggles its answer (all start open,
       as in the design). Filter pills show one category's group, or all of
       them, and a short note appears when a category has no questions. */
    if ($('.js-faq-toggle').length) {
        $('.js-faq-toggle').on('click', function () {
            var $button = $(this);
            var isOpen = $button.attr('aria-expanded') === 'true';
            $button.attr('aria-expanded', isOpen ? 'false' : 'true');
            $('#' + $button.attr('aria-controls')).prop('hidden', isOpen);
        });
    }

    if ($('.js-faq-filter').length) {
        $('.js-faq-filter').on('click', function () {
            var filter = $(this).data('filter');
            $('.js-faq-filter').removeClass('is-active').attr('aria-pressed', 'false');
            $(this).addClass('is-active').attr('aria-pressed', 'true');

            var visibleGroups = 0;
            $('.js-faq-group').each(function () {
                var show = filter === 'all' || $(this).data('category') === filter;
                $(this).prop('hidden', !show);
                if (show) { visibleGroups++; }
            });
            $('.js-faq-empty').prop('hidden', visibleGroups > 0);
        });
    }
    /* ===== faq code ends here ===== */

    /* ===== blog filter code starts here ===== */
    /* The category pills show only the posts of one category, or all of
       them. Posts carry data-category; the pills carry data-filter. */
    if ($('.js-post-filter').length) {
        $('.js-post-filter').on('click', function () {
            var filter = $(this).data('filter');
            $('.js-post-filter').removeClass('is-active').attr('aria-pressed', 'false');
            $(this).addClass('is-active').attr('aria-pressed', 'true');

            $('.js-post').each(function () {
                $(this).prop('hidden', filter !== 'all' && $(this).data('category') !== filter);
            });
        });
    }
    /* ===== blog filter code ends here ===== */

    /* ===== mega menu code starts here ===== */
    /* Desktop panels (Sales, Service, Resources) open on click only, one at a
       time. A click outside or Escape closes them. Below 992px the drawer
       sub-menus below do the same job. */
    if ($('.js-mega-trigger').length) {
        var $megaTriggers = $('.js-mega-trigger');

        function closeMega() {
            $megaTriggers.attr('aria-expanded', 'false').each(function () {
                $('#' + $(this).attr('aria-controls')).prop('hidden', true);
            });
        }

        $megaTriggers.on('click', function () {
            var wasOpen = $(this).attr('aria-expanded') === 'true';
            closeMega();
            if (!wasOpen) {
                $(this).attr('aria-expanded', 'true');
                $('#' + $(this).attr('aria-controls')).prop('hidden', false);
            }
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.rj-nav__item').length) { closeMega(); }
        });

        $(document).on('keydown', function (e) {
            if (e.key !== 'Escape') { return; }
            var $open = $megaTriggers.filter('[aria-expanded="true"]');
            closeMega();
            $open.first().trigger('focus');
        });
    }

    if ($('.js-mobile-sub-toggle').length) {
        $('.js-mobile-sub-toggle').on('click', function () {
            var isOpen = $(this).attr('aria-expanded') === 'true';
            $(this).attr('aria-expanded', isOpen ? 'false' : 'true');
            $(this).next('.rj-mobile-menu__sub').prop('hidden', isOpen);
        });
    }
    /* ===== mega menu code ends here ===== */

});
