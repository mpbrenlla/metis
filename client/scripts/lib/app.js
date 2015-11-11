angular
    .module('Metis', [
        'angular-meteor',
        'ui.router',
        'ngMaterial',
        'ngMdIcons',
        'gettext'
    ])
    .config(function ($mdThemingProvider) {

        var customBlueMap = $mdThemingProvider.extendPalette('teal', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    }).run(function (gettextCatalog) {
        gettextCatalog.setCurrentLanguage('es_ES');
    });


angular.element(document).ready(onReady);


function onReady() {
    angular.bootstrap(document, ['Metis']);
}