todoApp.controller("todoCtrl", function todoCtrl($scope){
    $scope.selectAllChecked = false;
    $scope.allSelected = false;
    $scope.todoList = [];
    $scope.formCurrentName = "";
    $scope.editItemTitle = {title:""};


    //Init data from storage if allowed and data present
    if(storageTest()){
        if(!(localStorage.getItem('todoList') === null)){
            $scope.todoList = JSON.parse(localStorage.getItem('todoList'));
            $scope.allSelected = JSON.parse(localStorage.getItem('allSelected'));
        }
    }

    $scope.$watch(function() {return $scope.todoList} , function(newlist, oldlist){

        //sets the local storage anytime changes are made to todolist
        if(newlist !== oldlist){
            localStorage.setItem('todoList', JSON.stringify($scope.todoList));
        }

        if($scope.todoList.length === 0 ){
            $scope.todoListEmpty = true;
        }else{
            $scope.todoListEmpty = false;
        }

        if(newlist.length > oldlist.length){
            $scope.selectAllChecked = false;
        }

        if(newlist.length !== oldlist.length){
            $scope.checkIfAllSelected();
        }
    },true);

    $scope.$watch(function(){return $scope.allSelected} , function(){
       if($scope.allSelected === true){
           $scope.selectAllChecked = true;
       }else{
           $scope.selectAllChecked = false;
       }
        localStorage.setItem('allSelected', JSON.stringify($scope.allSelected));
    });


    $scope.removeItem = function(item){
        $scope.todoList.splice($scope.todoList.indexOf(item),1);
    };

    $scope.toggleCompleted = function(){
        this.item.Completed = !this.item.Completed;
     };


    $scope.toggleAll = function(){
        $scope.allSelected = !$scope.allSelected;
        for(var index = 0; index < $scope.todoList.length; index++){
            if($scope.allSelected){
                $scope.todoList[index].Completed = true;
            }else{
                $scope.todoList[index].Completed = false;
            }
        }
    };

    $scope.setAsEditing = function(item){
        $scope.todoList[$scope.todoList.indexOf(item)].isEditing = true;
        $scope.editItemTitle.title = item.title
    };

    $scope.checkIfAllSelected = function(){
        $scope.allSelected = true;
        for(var index = 0; index < $scope.todoList.length; index++){
            if (!$scope.todoList[index].Completed){
                $scope.allSelected = false;
            }
        }
    };

    $scope.removeCompleted = function(){
        $scope.todoList = $scope.todoList.filter(function(todoItem){
            return todoItem.Completed !== true;
        });
        $scope.checkIfAllSelected;
    };

    $scope.submitItem = function(){
        var newItem = {};
        if(!($scope.formCurrentName === "")){
            newItem._Completed = false;
            Object.defineProperty(newItem, "Completed", {
                get: function(){
                    return this._Completed;
                },
                set: function(val){
                    if(!val){
                        $scope.allSelected = false;
                        $scope.selectAllChecked = false;
                    }
                    this._Completed = val;
                },
                configurable: true,
                enumerable: true
            });

            newItem.isEditing = false;
            newItem.title = $scope.formCurrentName.trim() ;
            newItem.id = $scope.todoList.length
            $scope.todoList.push(newItem);
            $scope.formCurrentName = "";
        }
    };

    $scope.editItem = function(item){
        //alert("in edit");
        //alert("Before $scope.editItemTitle = " +  $scope.editItemTitle.title);
        if(!($scope.editItemTitle.title === "")){
            //alert("in the if")
            $scope.todoList[$scope.todoList.indexOf(item)].title = $scope.editItemTitle.title.trim();
        }
        $scope.editItemTitle =  {title:""};
        //alert("After $scope.editItemTitle = " + $scope.editItemTitle.title);
        $scope.todoList[$scope.todoList.indexOf(item)].isEditing = false;
        //alert("is Editing " + $scope.isEditing.edit);
        if(!$scope.$$phase) {$scope.$apply()};
    };

    $scope.completedCount = function() {
        var count = 0;
        angular.forEach($scope.todoList, function(todoItem){
            count += todoItem.Completed ? 1 : 0;
        });
        return count;
    };

    $scope.itemsLeft = function(){
        var count = 0;
        angular.forEach($scope.todoList, function(todoItem){
            count += todoItem.Completed ? 0 : 1;
        });
        return count;
    };

    function storageTest(){
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

});

