define([
	"when",
	"troopjs-ef/component/widget",
	"school-ui-shared/utils/typeid-parser",
	"school-ui-studyplan/utils/animation-helper",
	"school-ui-studyplan/utils/state-parser",
	"school-ui-studyplan/enum/studyplan-velocity",
	"school-ui-studyplan/enum/studyplan-state",
	"school-ui-studyplan/enum/studyplan-item-state",
	"template!./progress.html"
], function(when, Widget, typeidParser, animationHelper, stateParser, velocityState, studyplanState, itemState, tProgress){

	var UNDEF;
	var $ELEMENT = "$element";

	var DATA_STUDYPLAN = "_data_studyplan";

	var SEL_OPTIONAL_POPOVER = ".ets-sp-optional-popover";
	var SEL_POPOVER_HOLDER = ".ets-sp-optional-holder";
	var SEL_RATE_NUM = ".ets-sp-rate-num";
	var SEL_MANDATORY_FINISHED = ".ets-sp-mandatory .ets-sp-finished";
	var SEL_OPTIONAL_FINISHED = ".ets-sp-optional .ets-sp-finished";
	var SEL_MOVEON_TIPS = ".ets-sp-moveon-tips";

	var CLS_NONE = "ets-none";

	var DURATION_RATE = 800;

	return Widget.extend(function(){
		var me = this;
		me[DATA_STUDYPLAN] = me[$ELEMENT].data("studyplan");
	},{
		"velocityState" : velocityState,
		"sig/start" : function(){
			var me = this;
			var studyplan = me[DATA_STUDYPLAN];

			var mandatoryCount = optionalCount = mandatoryFinished = optionalFinished = 0;
			var goalItem;
			var optionalItems = [];
			var mandatoryRate;
			var optionalRate;
			var isNopace;


			//check items status
			studyplan.items.forEach(function(item){
				var state;
				if(item.typeCode !== "goal"){
					state = stateParser.parseFlag(itemState, item.progress.state);
					if(item.isOptional){
						optionalCount++;
						state.Completed && optionalFinished++;
						optionalItems.push({itemData:item, locked:state.Locked});
					}
					else{
						mandatoryCount++;
						state.Completed && mandatoryFinished++;
					}
				}
				else{
					goalItem = item;
				}
			});

			mandatoryRate = mandatoryCount ?
				(parseInt(mandatoryFinished / mandatoryCount * 100, 10) + "%") : UNDEF;
			optionalRate = optionalCount ?
				(parseInt(optionalFinished / optionalCount * 100, 10) + "%") : UNDEF;

			if(goalItem){
				goalItem.properties.paces.forEach(function(e){
					if(e.pacePoints === 0){
						isNopace = e.selected;
					}
				});
			}

			return me.html(tProgress, {
				completed : studyplan.progress.state === studyplanState.Completed,
				goal : goalItem,
				isNopace: isNopace,
				mandatoryRate : mandatoryRate,
				optionalRate : optionalRate,
				optionalItems : optionalItems,
				velocity : studyplan.progress.properties.velocity
			}).then(function(){
				var $optionalBar = me[$ELEMENT].find(SEL_OPTIONAL_POPOVER);
				var $mandatoryProgress = me[$ELEMENT].find(SEL_MANDATORY_FINISHED);
				var $optionalProgress = me[$ELEMENT].find(SEL_OPTIONAL_FINISHED);


				//init popover for optional items
				$optionalBar.data({
					"content": me[$ELEMENT].find(SEL_POPOVER_HOLDER).html(),
					"trigger" : "hover",
					"placement":"bottom",
					"html" : true
				});
				$optionalBar.popover();


				//start animation
				$mandatoryProgress.css("width", 0);
				$optionalProgress.css("width", 0);
				setTimeout(function(){
					animationHelper.request("goalEnter", function(){
						return when.promise(function(resolve){
							$mandatoryProgress.css("width", mandatoryRate);
							$optionalProgress.css("width", optionalRate);
							setTimeout(function(){
								resolve();
							}, DURATION_RATE);
						});
					});
				}, 0);
			});

		},
		"hub/studyplan/goal/moveon-tips/show" : function(text){
			text && this[$ELEMENT].find(SEL_MOVEON_TIPS).removeClass(CLS_NONE).text(text);
		}
	});
});
