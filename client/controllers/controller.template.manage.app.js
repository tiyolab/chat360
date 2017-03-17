function controllerTemplateManageApp($routeParams, $scope, $http, panelMenuService, messengerService){
	var initBlockName = '';
	var counter = 0;
	var currentBlock = 0;
	var textResponseType = function(){
		return {
			type: 'Text',
			message: ''
		}
	}
	var unSavedBlock = [];
	var unSavedBlockStructures = [];
	
	//variable declaration
	$scope.progressLoadBlockStructures = false;
	$scope.appId = $routeParams.id;
	$scope.blockStructureType = {
		'text' : 'Text'
	}
	$scope.blockButton = [];
	$scope.blockStructureLists = [];
	$scope.isBlockSelected = false;
	$scope.selectedBlockStructure = null;
	$scope.blockNameFocused = function(e){
		initBlockName = e.srcElement.value;
	}
	$scope.blockNameBlured = function(e){
		if(initBlockName != ''){
			if(initBlockName != e.srcElement.value){
				var tmpBlock = $scope.blockStructureLists[initBlockName];
				delete $scope.blockStructureLists[initBlockName];
				$scope.blockStructureLists[e.srcElement.value] = tmpBlock;
				
				$scope.blockButton.splice($scope.blockButton.indexOf(initBlockName), 1, e.srcElement.value);
				
				currentBlock = e.srcElement.value;
			}
		}
		initBlockName = '';
	}
	
	//function declaration
	$scope.openResponseTypeMenu = function(event){
		panelMenuService.create(
			event,
			'#block-menu',
			['Text', 'Generic'], 
			function(event, menu){
				if(menu == 'Text'){
					if($scope.selectedBlockStructure){
						$scope.blockStructureLists[currentBlock].blockStructures.push(messengerService.getTextResponseTemplate());
						$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
					}
				}
			});
	}
	
	$scope.getBlockStructure = function(){
		$scope.progressLoadBlockStructures = true;
		$http.get('/get/block/structure?appid='+$scope.appId).then(
			function success(res){
				if(!res.data.err){
					res.data.forEach(function(d){
						$scope.blockButton.push(d.blockName);
						$scope.blockStructureLists[d.blockName] = d;
					});
				}
				
				$scope.progressLoadBlockStructures = false;
			},
			function failure(res){
				$scope.progressLoadBlockStructures = false;
			}
		);
	}
	
	$scope.addBlock = function(){
		currentBlock = 'untitled_' + counter;
		$scope.blockButton.push(currentBlock);
		$scope.blockStructureLists[currentBlock] = {
			blockName: currentBlock,
			appId: $scope.appId,
			blockStructures: []
		};
		$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
		
		$scope.isBlockSelected = true;
		
		//remember that block hasn't been saved
		unSavedBlock[currentBlock] = ($scope.selectedBlockStructure.blockName);
		unSavedBlockStructures[currentBlock] = [];
		
		counter++;
	}
	
	$scope.selectBlock = function(cb){
		currentBlock = cb;
		$scope.isBlockSelected = true;
		$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
	}
	
	$scope.blockButtonAppereance = function(blockName){
		if($scope.selectedBlockStructure){
			if(blockName == $scope.selectedBlockStructure.blockName){
				return 'md-primary';
			}
		}
		
		return '';
	}
	
	$scope.saveStructure = function(structure, index){
		delete structure['$$hashKey'];
		var postTo = '';
		var dataTo = {};
		var type = 0;
		//if not new block
		if($scope.selectedBlockStructure._id){
			//if not new structure
			if(structure._id){
				postTo = '/update/structure';
				dataTo = structure;
				type = 1;
			}else{
				postTo = '/save/structure';
				structure.blockId = $scope.selectedBlockStructure._id;
				dataTo = structure;
				type = 2;
			}
		}else{
			postTo = '/save/block/structure';
			dataTo.block = {
				appId: $scope.selectedBlockStructure.appId,
				blockName: $scope.selectedBlockStructure.blockName
			};
			dataTo.structure = structure;
			type = 3;
		}
		
		$http.post(postTo, dataTo).then(
		function success(res){
			if(res){
				if(type == 3){
					mappingBlock($scope.blockStructureLists[currentBlock], res.data.res.block);
					$scope.blockStructureLists[currentBlock].blockStructures[index] = res.data.res.structure;
				}else if(type == 2){
					$scope.blockStructureLists[currentBlock].blockStructures[index] = res.data;
				}else if(type == 1){
					if(res){
						console.log('update success');
					}
				}
				
				$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
			}
		}, function failure(res){
			alert('failed save');
		});
	}
	
	$scope.deleteStructure = function(structure, index){
		//structur already saved in db
		if(structure._id){
			$http.post('/remove/structure', {_id: structure._id}).then(
				function success(res){
					$scope.blockStructureLists[currentBlock].blockStructures.splice(index, 1);
				},
				function failure(res){
					alert('failed delete structure');
				}
			);
		}else{
			$scope.blockStructureLists[currentBlock].blockStructures.splice(index, 1);
		}
	}
	
	$scope.saveBlock = function(){
		if($scope.selectedBlockStructure){
			//prefer to update
			if($scope.selectedBlockStructure._id){
				$http.post('/update/block', $scope.selectedBlockStructure).then(
					function success(res){
						$scope.blockStructureLists[currentBlock] = res.data;
						$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
					},
					function faulure(res){
						console.log('save failed');
					}
				);
			}
			//prefer to save
			else{
				$http.post('/save/block', $scope.selectedBlockStructure).then(
					function success(res){
						$scope.blockStructureLists[currentBlock] = res.data;
						$scope.selectedBlockStructure = $scope.blockStructureLists[currentBlock];
					},
					function faulure(res){
						console.log('save failed');
					}
				);
			}
		}
	}
	
	function mappingBlock(block, newBlock){
		block._id = newBlock._id ? newBlock._id : null;
		block.appId = newBlock.appId ? newBlock.appId : null;
		block.blockName = newBlock.blockName ? newBlock.blockName : null;
		
		return block;
	}
}