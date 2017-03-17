const PanelMenuModule = angular.module('PanelMenuModule', []);
PanelMenuModule.service('panelMenuService', function($mdPanel){
	var that = this;
	that.callback = null;
	that.event = null;
	
	this.create = function(event, relativeTo, menuItems, callback){
		that.event = event;
		that.callback = callback;
		var template = 
				'<div class="panel-menu-module" ' +
				'     aria-label="" ' +
				'     role="listbox">' +
				'  <div class="panel-menu-module-item" ' +
				'       tabindex="-1" ' +
				'       role="option" ' +
				'       ng-repeat="menu in ctrl.menuItems" ' +
				'       ng-click="ctrl.click(menu)"> ' +
				'    {{ menu }} ' +
				'  </div>' +
				'</div>';
				
		var position = $mdPanel.newPanelPosition()
		.relativeTo(relativeTo)
		.addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
		
		var config = {
			attachTo: angular.element(document.body),
			controller: panelMenuController,
			controllerAs: 'ctrl',
			template: template,
			panelClass: 'panel-menu-module',
			position: position,
			locals: {
				'menuItems' : menuItems
			},
			openFrom: event,
			clickOutsideToClose: true,
			escapeToClose: true,
			focusOnOpen: false,
			zIndex: 2
		};
		
		$mdPanel.open(config);
	}
	
});

function panelMenuController(mdPanelRef, $timeout, panelMenuService){
	this.mdPanelRef = mdPanelRef;
	this.service = panelMenuService;
}

panelMenuController.prototype.click = function(selectedMenu){
	this.mdPanelRef && this.mdPanelRef.close();
	this.service.callback(this.service.event, selectedMenu);
}
