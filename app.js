var app = angular.module('app',[]);

app.controller('mainController', ['$scope','$http', function($scope,$http) {
  $scope.hash = "74f5b67c088a34a7b51612671300c9f040f4b8b322fa234d26069c17eb00428a";
  $scope.results = [];
  $http.get('./gateways.json').then(function (response){
    var gateways = response.data;

    for (var i=0 ; i < gateways.length; i++){
      var gw = {
        checkURL : gateways[i].replace('{hash}', $scope.hash),
        isLoading: true,
        isOnline: false,
        error: "",
      }
      $scope.results.push(gw);
    }

    $scope.results.forEach(function(res, index){
      $http.get(res.checkURL).then(function(response){
        res.isLoading = false;
        res.isOnline = true;
      }, function(errorResponse){
        res.isLoading = false;
        res.error = errorResponse;
      });
    });

  }, function(errorResponse){
    console.log("could not fetch gateways.json: " + response);
  });

  $scope.onlineCount = function(){
    return $scope.results.filter(function(res){
      return res.isOnline == true;
    }).length;
  }

}]);
