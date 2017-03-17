function controllerTemplateSettingApp($routeParams, $scope, $http, appService){
	//variable declaration
	$scope.progressLoadApp = false;
	$scope.appId = $routeParams.id;
	$scope.appName = '';
	$scope.appDescription = '';
	$scope.SForgId = '';
	$scope.SFconsumerKey = '';
	$scope.SFconsumerSecret = '';
	$scope.SFusername = '';
	$scope.SFpassword = '';
	$scope.FBappName = '';
	$scope.FBpageId = '';
	$scope.FBappId = '';
	$scope.FBappSecret = '';
	$scope.FBpageName = '';
	$scope.FBpageAccessToken = '';
	$scope.FBwebhookValidationToken = '';
	$scope.isActive = '';
	
	//function declaration
	$scope.init = function(){
		$scope.progressLoadApp = true;
		if(!appService.mapApps[$scope.appId]){
			appService.getApps(function(apps){
				setAppData(appService.mapApps[$scope.appId]);
				$scope.progressLoadApp = false;
			});
		}else{
			setAppData(appService.mapApps[$scope.appId]);
			$scope.progressLoadApp = false;
		}
	}
	
	$scope.appActivationToggle = function(){
		$scope.progressLoadApp = true;
		var to = ''
		if($scope.isActive){
			to = '/activate/app';
		}else{
			to = '/deactivate/app';
		}
		$http.post(to, {_id: $scope.appId}).then(
			function success(res){
				if(res.data){
					console.log('operation success');
				}else{
					$scope.isActive = !$scope.isActive;
				}
				$scope.progressLoadApp = false;
			},
			function failure(res){
				$scope.isActive = !$scope.isActive;
				$scope.progressLoadApp = false;
			}
		);
	}
	
	function setAppData(d){
		$scope.appName = d.appName;
		$scope.appDescription = d.appDescription;
		$scope.SForgId = d.SForgId;
		$scope.SFconsumerKey = d.SFconsumerKey;
		$scope.SFconsumerSecret = d.SFconsumerSecret;
		$scope.SFusername = d.SFusername;
		$scope.SFpassword = d.SFpassword;
		$scope.FBappName = d.FBappName;
		$scope.FBpageId = d.FBpageId;
		$scope.FBappId = d.FBappId;
		$scope.FBappSecret = d.FBappSecret;
		$scope.FBpageName = d.FBpageName;
		$scope.FBpageAccessToken = d.FBpageAccessToken;
		$scope.FBwebhookValidationToken = d.FBwebhookValidationToken;
		$scope.isActive = d.isActive;
	}
}