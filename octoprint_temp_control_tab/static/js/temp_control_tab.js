$(function() {
    function TempControlTabViewModel(parameters) {
        var self = this;

        self.controlViewModel = parameters[0];
        self.temperatureViewModel = parameters[1];

		// Check for TouchUIPlugin, if not loaded apply changes.
		var htmlId = $("html").attr("id");
		if (htmlId != "touch") {
		
			// page container adjustments
			$('div.page-container').css({'min-width':'1900px'});
			
			// navbar adjustments
			$('#navbar > div.navbar-inner > div.container').css({'width':'100%'});
			$('#navbar > div.navbar-inner > div.row-fluid > div.nav-collapse').css({'padding-right':'20px'});
			
			// main content adjustments
			$('div.container.octoprint-container').addClass('row-fluid');
			$('div.container.octoprint-container.row-fluid > div.row').css({'margin-left':'20px','padding-right':'20px'});
			
			// sidebar adjustments
			$('div.container.octoprint-container > div.row > div.accordion.span4').removeClass('span4').addClass('span2');
			$('#files div.row-fluid.upload-buttons > span.btn.btn-primary.fileinput-button.span6:nth-child(2) > span').text('Upload SD');
			
			// tabs adjustments
			$('div.container.octoprint-container > div.row > div.tabbable.span8').removeClass('span8').addClass('span10');
			$('div#tabs_content div.tab-pane:not("#tab_plugin_temp_control_tab,#temp,#control")').wrapInner('<div class="span6"></div>');
			$('div#tabs_content div.tab-pane:not("#tab_plugin_temp_control_tab,#temp,#control") div.span6').wrap('<div class="row-fluid"></div>');
			
			// footer adjustments
			$('div.container.octoprint-container > div.footer').css({'padding-left':'20px','padding-right':'20px'});

			 // fix control tab
			self.onTabChange = function(current, previous) {
				if ((current === "#tab_plugin_temp_control_tab") || (current === "#temp") || (current === "#control")) {
					var selected = OctoPrint.coreui.selectedTab;
					OctoPrint.coreui.selectedTab = "#control";
					self.controlViewModel.onTabChange("#control", previous);
					OctoPrint.coreui.selectedTab = selected;
				} else if (previous === "#tab_plugin_temp_control_tab") {
					self.controlViewModel.onTabChange(current, "#control");
				}
			};
	/* 
			self.onAllBound = function(allViewModels) {
				var selected = OctoPrint.coreui.selectedTab;
				OctoPrint.coreui.selectedTab = "#control";
				self.controlViewModel.onAllBound(allViewModels);
				OctoPrint.coreui.selectedTab = selected;
				self.temperatureViewModel._initializePlot();
			};
	 */		
			self.controlViewModel.onBrowserTabVisibilityChange = function(status) {
				if (status) {
					var selected = OctoPrint.coreui.selectedTab;
					OctoPrint.coreui.selectedTab = "#control";
					self.controlViewModel._enableWebcam();
					OctoPrint.coreui.selectedTab = selected;
				} else {
					self.controlViewModel._disableWebcam();
				}
			};
			
			// fix temp tab
			self.onAfterTabChange = function(current, previous) {
				if ((current === "#tab_plugin_temp_control_tab") || (current === "#temp") || (current === "#control")) {
					console.log(self.temperatureViewModel._getPlotInfo());
					self.temperatureViewModel._initializePlot(true,self.temperatureViewModel._getPlotInfo());
					self.temperatureViewModel.updatePlot();
				}
			}
			
	/* 
			// fix temperature tab
			self.onAfterTabChange = function(current, previous) {
				if ((current === "#tab_plugin_temp_control_tab") || (current === "#temp") || (current === "#control")) {
					if (!self.temperatureViewModel.plot) {
						self.temperatureViewModel._initializePlot();
					} else {
						self.temperatureViewModel.updatePlot();
					}				
					self.temperatureViewModel.onAfterTabChange("#temp", previous);
				} 
			}
	 */
			self.onAllBound = function(allViewModels) {
				var selected = OctoPrint.coreui.selectedTab;
				OctoPrint.coreui.selectedTab = "#control";
				self.controlViewModel.onAllBound(allViewModels);
				OctoPrint.coreui.selectedTab = selected;
				$('#tab_plugin_temp_control_tab > div.row-fluid > #temp_container').append($('div#temp').removeClass('tab-pane'));
				$('#tab_plugin_temp_control_tab > div.row-fluid > #control_container').append($('div#control').removeClass('tab-pane'));
				// hide orginal temp and control tab
				$('#control_link,#temp_link').hide();
			}
		}			
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TempControlTabViewModel,
        dependencies: ["controlViewModel", "temperatureViewModel"]
    });
});