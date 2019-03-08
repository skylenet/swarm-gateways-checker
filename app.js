var app = angular.module('app',[]);


app.controller('mainController', ['$scope','$http', function($scope,$http) {
  $scope.inputHash = "74f5b67c088a34a7b51612671300c9f040f4b8b322fa234d26069c17eb00428a";
  $scope.results = [];

  $scope.fetchFile = function(hash){

    $scope.results = [];

    $http.get('./gateways.json').then(function (response){
      var gateways = response.data;

      for (var i=0 ; i < gateways.length; i++){
        var gw = {
          checkURL : gateways[i].replace('{hash}', hash),
          isLoading: true,
          isOnline: false,
          size: 0,
          error: "",
        }
        $scope.results.push(gw);
      }

      $scope.results.forEach(function(res, index){
        $http.get(res.checkURL).then(function(response){
          res.isLoading = false;
          res.isOnline = true;
          res.size = response.data.length;
        }, function(errorResponse){
          res.isLoading = false;
          res.error = errorResponse;
        });
      });

    }, function(errorResponse){
      console.log("could not fetch gateways.json: " + response);
    });

  }

  $scope.onlineCount = function(){
    return $scope.results.filter(function(res){
      return res.isOnline == true;
    }).length;
  }

  $scope.formatBytes = function(a,b){
    if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
  }

}]);
