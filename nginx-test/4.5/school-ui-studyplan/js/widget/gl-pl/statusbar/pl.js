define(["./main",
	"jquery",
	"school-ui-studyplan/utils/client-storage",
	"template!./index.html"
], function (StatusBarBase, $, clientStorage, template) {
	'use strict';

	var SEL_CONTAINER = ".evc-studyplan-status-optional-pl-container";

	return StatusBarBase.extend({
		"hub/studyplan/evc/pl/notification": function (data) {
			var me = this;
			me.render(data);
		},
		"hub/studyplan/evc/pl/announcement/disable": function () {
			var me = this;
			me.hideSeparateLine();
		},
		"dom:[data-action = closePLOptionalMsg]/click": function (e) {
			var me = this;
			var $el = me.$element;

			clientStorage.setLocalStorage("pl_tips", "closed");
			$el.find(SEL_CONTAINER).remove();
			me.hideSeparateLine();
		}
	});
});
