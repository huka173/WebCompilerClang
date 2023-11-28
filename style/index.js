'use strict';

window.addEventListener('resize', function() {
    let height = 0;

    if(window.screen.width >= 1200) {
        document.body.style.zoom = 0.9;
        height = window.screen.height - 50;
    }
    else {
        height = window.screen.height - 200;
    }
    const objStyleCompileForm = document.querySelector('.compile-frame').style;
    objStyleCompileForm.height = `${height}px`;
});