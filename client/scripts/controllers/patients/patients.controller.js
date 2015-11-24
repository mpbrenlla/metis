angular
    .module('Metis')
    .controller('PatientsCtrl', PatientsCtrl);

function PatientsCtrl($scope, $meteor, $state) {

  $scope.page = 1;
  $scope.perPage = 5;
  $scope.sort = {"name": 1};
  $scope.orderProperty = '1';

    $scope.search = "";

    /*$scope.patients = $meteor.collection(function() {
        return Patients.find({})
    });*/

    $scope.patients = $meteor.collection(function() {
        return Patients.find({}, {
            sort : $scope.getReactively('sort')
        });
    });

    $scope.pageChanged = function(newPage) {
        $scope.page = newPage;
    };

    $scope.$watch('orderProperty', function(){
        if ($scope.orderProperty)
            $scope.sort = {name: parseInt($scope.orderProperty)};
    });

    $meteor.autorun($scope, function() {

        $scope.$meteorSubscribe('patients', {
                limit: parseInt($scope.getReactively('perPage')),
                skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
                sort: $scope.getReactively('sort')
            },
            $scope.getReactively('search')).then(function(){
                $scope.patientsCount = $meteor.object(Counts ,'numberOfPatients', false);
                console.log($scope.patientsCount);
            });

    });



    /*$meteor.autorun($scope, function() {
        $meteor.subscribe('patients', {},
            $scope.getReactively('search'));
    });*/

   /* $scope.patients = $meteor.collection(Patients).
      subscribe('patients',{},$scope.getReactively('search'));*/

    $scope.remove = remove;

    $scope.enter = enter;

    $scope.createPatient = createPatient;

    ////////////

    function remove(patient) {
        $scope.patients.remove(patient);
    }

    function enter(patient) {
        $state.go('app.patientDetails', {patientId: patient._id});
    }

    function createPatient() {
        $state.go('app.addPatient');
    }

}
