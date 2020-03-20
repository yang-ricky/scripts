define([
	'jquery',
	'when',
	'../base/main',
	'./sequencing-word-vertical',
	'template!./main.html'
], function activityTemplateModule($, when, Widget, swv, tTemplate) {
	"use strict";

	var TOPIC_ACT_SWV_LOAD = "activity/template/swv/load";

	function Ctor() {
	}

	function render() {
		var me = this;

		// No matter when render() is called, it always check if the $element is exist,
		// to make sure there is no code error when render() is called after finalization.
		if (!me.$element) {
			return;
		}

		// If it is the first time be called, it renders the basic outer html of
		// current activity.
		if (!this._htmlPromise) {
			this._htmlPromise = this.html(tTemplate());
		}

		var data = this._json;

		return this._htmlPromise
			.then(function () {
				return me.publish(TOPIC_ACT_SWV_LOAD, {
					item: me.items(),
					json: data,
					_super: me
				});
			});
	}

	var methods = {
		"sig/initialize": function onInitialize() {
			this.hasScoring || this.type(Widget.ACT_TYPE.PRACTICE);

			if (this.type() == Widget.ACT_TYPE.PRACTICE) {
				this.items().answered(true);
			}

			this.length(1);
		},

		"sig/render": function onRender() {
			return render.call(this);
		},

		"sig/finalize": function onFinalize() {
			this._htmlPromise = null;
		},

		nextStep: function onNextStep() {
			if (this.index() >= this.length() - 1) {
				return when.resolve();
			}

			this.index(this.index() + 1);

			return this.signal('render');
		},

		_onAnswerChecked: function () {
		}
	};

	return Widget.extend(Ctor, methods);
});
