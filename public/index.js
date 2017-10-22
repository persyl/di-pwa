if ("serviceWorker" in navigator) {
  const sw = navigator.serviceWorker;

  sw
    .register("/sw.js", { scope: "/" })
    .then(function(registration) {
      // registration worked
      console.log("Registration succeeded. Scope is " + registration.scope);
      // updating service worker
      // console.log("Updating service worker");
      // registration.update();


      navigator.serviceWorker.addEventListener("message", function(event) {
        console.log(event);
      });
    })
    .catch(function(error) {
      // registration failed
      console.log("Registration failed with " + error);
    });
}else{
  console.log('Your browser does not support Service Workers!');
}
