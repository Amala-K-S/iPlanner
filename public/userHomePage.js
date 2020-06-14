var app = angular.module('taskList', []);
app.controller('taskCtrl', function ($scope)
{
    $scope.taskList = [];

    $scope.taskAdd = function () {
        $scope.taskList.push({taskText: $scope.taskInput, taskDate: $scope.taskDate, taskLabel:$scope.taskLabel,taskStatus:$scope.taskStatus,done: false});
    //    $scope.taskNo="";
      //  $scope.taskInput = "";
      //  $scope.taskDate = "";
      //  $scope.taskLabel="";
      //  $scope.taskStatus="";
    };

    $scope.remove = function () {
        var oldList = $scope.taskList;
        $scope.taskList = [];
        angular.forEach(oldList, function (x) {
            if (!x.done) {$scope.taskList.push(x); }
        });
    };

    $scope.remove = function (index) {
        $scope.taskList.splice(index,1);
    };
});
