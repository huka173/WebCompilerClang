'use strict';

window.addEventListener('resize', function() {
    if (window.screen.width <= 500) {
        document.querySelector('.logo').href = '/info';
    }
});