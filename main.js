if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {scope: '/'})
    .then(function (reg) {
        
    }).catch(function (error) {
        console.log('Failed ' + error);
    });
}

window.addEventListener("beforeinstallprompt", ev => {
    // Stop Chrome from asking _now_
    ev.preventDefault();

    // Create your custom "add to home screen" button here if needed.
    // Keep in mind that this event may be called multiple times, 
    // so avoid creating multiple buttons!
    myCustomButton.onclick = () => ev.prompt();
});