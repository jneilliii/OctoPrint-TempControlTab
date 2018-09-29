# coding=utf-8
from __future__ import absolute_import, division, print_function

import octoprint.plugin

class TempControlTabPlugin(octoprint.plugin.TemplatePlugin,
                           octoprint.plugin.AssetPlugin):
						   
	def get_template_configs(self):
		return [
			dict(type="tab", name="Temp & Control", custom_bindings=False)
		]

	def get_assets(self):
		return dict(js=["js/temp_control_tab.js"])

	def update_hook(self):
		return dict(
			temp_control_tab=dict(
				displayName="Temp Control Tab",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="jneilliii",
				repo="OctoPrint-TempControlTab",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/jneilliii/OctoPrint-TempControlTab/archive/{target_version}.zip"
			)
		)
		
__plugin_name__ = "Temp Control Tab"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = TempControlTabPlugin()
	
	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.update_hook
		}
	
	global __plugin_settings_overlay__
	__plugin_settings_overlay__ = dict(appearance=dict(components=dict(order=dict(tab=["temp","plugin_temp_control_tab"]))))
