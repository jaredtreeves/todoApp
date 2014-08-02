todoApp.directive('autoFocus', function() {
   return{
       scope: {trigger: '=autoFocus'},
       link: function(scope,element){
           scope.$watch('trigger', function(value){
               if(value === true){
                   element[0].focus();
               }
           });
       }
   }
});