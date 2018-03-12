/* eslint-disable vars-on-top, no-var */
(function epicHello() {
  var userAgent = navigator.userAgent.toLowerCase();
  var supported = /(chrome|firefox)/;

  if (supported.test(userAgent.toLowerCase())) {
    var dark = [
      'padding: 20px 5px 16px',
      'background-color: #171718',
      'color: #bc994e',
    ].join(';');

    if (userAgent.indexOf('chrome') > -1) {
      dark += ';';
      dark += [
        'padding: 20px 5px 16px 40px',
        'background-image: url(http://epic.net/img/signature/epic-logo.png)',
        'background-position: 10px 9px',
        'background-repeat: no-repeat',
        'background-size: 26px 30px',
      ].join(';');
    }

    var gold = [
      'padding: 20px 5px 16px',
      'background-color: #bc994e',
      'color: #ffffff',
    ].join(';');

    var spacer = [
      'background-color: transparent',
    ].join(';');

    var msg = '\n\n %c Crafted with ♥︎ by EPIC %c https://www.epic.net %c \n\n\n';

    console.log(msg, dark, gold, spacer);
  } else if (window.console) {
    console.log('Crafted with love by EPIC - https://www.epic.net');
  }
}());
