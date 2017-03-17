function controllerTemplateResponseRouter($routeParams, $scope, $http){
	//variable declaration
	$scope.appId = $routeParams.id;
	$scope.progressLoadRouters = false;
	$scope.routers = [];
	
	blocks = [];
	
	//functio definition
	$scope.init = function(){
		$scope.getRouters();
		$scope.getBlocks();
	}
	
	$scope.getRouters = function(){
		$http.get('/get/bot/router?appid='+$scope.appId).then(
			function success(res){
				if(res.data){
					$scope.routers = trim(res.data);
				}
			},
			function failure(res){
				console.log(res);
			}
		);
	}
	
	$scope.getBlocks = function(){
		$http.get('/get/block?appid='+$scope.appId).then(
			function success(res){
				blocks = trim(res.data);
			},
			function failure(res){
				alert('failed load blokc information');
			}
		);
	}
	
	$scope.queryBlock = function(query) {
		return query 
			? blocks.filter(function(block){
				return angular.lowercase(block.blockName).indexOf(angular.lowercase(query)) != -1
			}) 
			: [];
    }
	
	$scope.addRule = function(){
		$scope.routers.push({
			appId: $scope.appId,
			request: [],
			response: []
		})
	}
	
	$scope.SaveOneRule = function(rule, index){
		$http.post('/save/rule', rule).then(
			function success(res){
				if(res.data){
					$scope.routers[index] = trim(res.data);
				}
			},
			function failure(res){
				alert('failed load blokc information');
			}
		);
	}
	
	$scope.DeleteOneRule = function(rule, index){
		if(rule._id){
			$http.post('/delete/rule', {_id: rule._id}).then(
				function success(res){
					if(res.data){
						$scope.routers.splice(index, 1);
					}
				},
				function failure(res){
					alert('failed to delete route');
				}
			);
		}else{
			$scope.routers.splice(index, 1);
		}
	}
	
	$scope.saveAllRule = function(){
		$http.post('/save/all/rule', $scope.routers).then(
			function success(res){
				console.log(res);
				if(res.data){
					$scope.routers = trim(res.data);
				}
				console.log($scope.routers);
			},
			function failure(res){
				alert('failed load blokc information');
			}
		);
	}
	
	function trim(data){
		if(data instanceof Array){
			var tmp = [];
			data.forEach(function(d){
				delete d['__v'];
				delete d['$$hashKey'];
				
				tmp.push(d);
			});
			
			return tmp;
		}else{
			delete data['__v'];
			delete data['$$hashKey'];
			
			return data;
		}
	}
}