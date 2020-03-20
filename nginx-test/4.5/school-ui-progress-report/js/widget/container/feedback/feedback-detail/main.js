define([
	"jquery",
	"when",
	'underscore',
	"troopjs-ef/component/widget",
	"troopjs-browser/loom/config",
	"troopjs-browser/loom/weave",
	"school-ui-progress-report/enum/feedback-typecode",
	"template!./writing.html",
	"template!./gl.html",
	"template!./pl.html",
	"template!./cp20.html",
	"template!./eft.html",
	"template!./osa.html"
], function ($, when, _, Widget, loom, weave, fbType, tWriting, tGL, tPL, tCP20, tEFT, tOSA) {
	"use strict";

	var $ELEMENT = "$element";

	var UNDEF;

	var PROP_FEEDBACK_ID = "_feedbackId";
	var PROP_TEACHER_PROFILE = "_teacherProfile";
	var PROP_WRITING_ID = "_writingId";

	var SEL_VIDEO_NOTES = '.ets-pr-fb-video-and-notes';
	var SEL_CORRECTION = ".ets-pr-fb-correction";

	var CLS_SURVEY = 'ets-pr-fb-survey';
	var SEL_SURVEY = '.' + CLS_SURVEY;

	//if teacher's image ready, remove this line
	var defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkEzNzkzNzJDRDQ1MTFFNEJCQTBDRTQ3OUEzNjM5OEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkEzNzkzNzNDRDQ1MTFFNEJCQTBDRTQ3OUEzNjM5OEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QTM3OTM3MENENDUxMUU0QkJBMENFNDc5QTM2Mzk4QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QTM3OTM3MUNENDUxMUU0QkJBMENFNDc5QTM2Mzk4QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjsNI60AAA0mSURBVHja7F13UBXd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"

	function _firstResult(result) {
		return result;
	}

	function _getArchiveWritingFeedback(summary) {
		var me = this;
		var clobPromise = summary.clob ? me.query(summary.clob.id).spread(_firstResult) : when.resolve(UNDEF);
		var teacherPromise = summary.teacher ? me.query(summary.teacher.id).spread(_firstResult) : when.resolve(UNDEF);

		return when.all([clobPromise, teacherPromise]).spread(function (clob, teacher) {
			var feedbackDetail = summary.detail;
			if (feedbackDetail.comment || feedbackDetail.correction) {
				return [feedbackDetail, teacher];
			}
			else if (clob) {
				if (clob.comment || clob.correction) {
					feedbackDetail.comment = clob.comment || "";
					feedbackDetail.correction = clob.correction || "";
					feedbackDetail.correctedTime = clob.correctDateTime || "";
					return [feedbackDetail, teacher];
				}
				else if (clob.writingId) {
					return me.query('integration_writing_feedback_detail!' + clob.writingId + '.teacher').spread(function (inteFeedbackDetail) {
						return [inteFeedbackDetail || feedbackDetail, inteFeedbackDetail && inteFeedbackDetail.teacher || teacher];
					});
				}
			}

			return [feedbackDetail, teacher];
		});
	}

	function _getRegularWritingFeedback(summary) {
		var me = this;
		return me.query(summary.detail.id + ".teacher").spread(function (feedbackDetail) {
			var teacher = feedbackDetail.teacher;
			me[PROP_WRITING_ID] = feedbackDetail.writing_id;
			return [feedbackDetail, teacher];
		});
	}

	function renderWritingFeedback(summary) {
		var me = this;
		var promiseQuery = summary.isArchive ?
			_getArchiveWritingFeedback.call(me, summary) :
			_getRegularWritingFeedback.call(me, summary);

		return promiseQuery.spread(function (feedbackDetail, teacher) {
			me[PROP_TEACHER_PROFILE] = teacher;
			if (teacher) {
				teacher.imageUrl = defaultImage;
			}

			me[$ELEMENT].html(tWriting({
				summary: summary,
				feedback: feedbackDetail,
				teacher: teacher
			}));

			//use $element.data() to prevent browser's auto html unescape
			me[$ELEMENT].find(SEL_CORRECTION).data("correction", feedbackDetail.correction);
			return me.weave();
		});
	}

	function renderEvcFeedback(summary, evcmember) {
    var me = this;
    
    if (summary.isArchive) {
      return when.rejected(false);
    }

    return when.all([
      checkEvcMemberSettings.call(this),
      this.query(summary.detail.id + ".teacher,.topic")
    ]).spread(function (memberList, feedbackDetailList) {
      var evcmember = memberList[0];
      var feedbackDetail = feedbackDetailList[0];
			me[PROP_TEACHER_PROFILE] = feedbackDetail.teacher;
			if (feedbackDetail.teacher) {
				feedbackDetail.teacher.imageUrl = defaultImage;
			}

			var renderTemplate;
			switch (summary.typeCode) {
				case fbType.gl:
					renderTemplate = tGL;
					break;
				case fbType.pl:
					renderTemplate = tPL;
					break;
				case fbType.cp20:
					renderTemplate = tCP20;
					break;
				case fbType.eftv:
					renderTemplate = tEFT;
					break;
				case fbType.osa:
					renderTemplate = tOSA;
					break;
			}

			// check if evc enables video/notes or not
			var isGL = summary.typeCode === fbType.gl;
			var videoRecoredEnabled = isGL ? evcmember.enableGLRecord : evcmember.enablePLRecord;

			me[$ELEMENT].html(renderTemplate({
				_: _,
				feedback: feedbackDetail,
				teacher: feedbackDetail.teacher,
				videoRecoredEnabled: videoRecoredEnabled
			}));

			me[$ELEMENT].find(SEL_VIDEO_NOTES).data('options', {
				hasVideoRecord: feedbackDetail.hasVideoRecord,
				videoAvailable: feedbackDetail.videoAvailable,
				video: {
					topicBlurbId: feedbackDetail.topicBlurb_id, // for some GL
					topic: isGL ? feedbackDetail.topic && feedbackDetail.topic.topic : feedbackDetail.topic,
					video: feedbackDetail.videoRecord
				},
				noteAvailable: feedbackDetail.noteAvailable,
				notes: feedbackDetail.notes
			});

			return me.weave();
		});
	}

	var checkEvcMemberSettings = _.once(function () {
		return this.query('evcmember!current');
	});

	return Widget.extend({
		"sig/start": function () {
			var me = this;
			var summary = me[$ELEMENT].data("summary");
			me[PROP_FEEDBACK_ID] = summary.feedback_id;

			if (summary.typeCode === fbType.writing) {
				return renderWritingFeedback.call(me, summary);
			}
			else {
        return renderEvcFeedback.call(me, summary);
			}
		},
		'dom:.ets-pr-fb-open-survey-button/click': function () {
			var me = this;
			if (me[$ELEMENT].find(SEL_SURVEY).length > 0 || !me[PROP_WRITING_ID]) {
				return;
			}

			var $survey = $('<div>')
				.addClass(CLS_SURVEY)
				.data('writingId', me[PROP_WRITING_ID])
				.data('teacherProfile', me[PROP_TEACHER_PROFILE])
				.attr(loom.weave, "school-ui-progress-report/widget/container/feedback/feedback-survey/main(writingId, teacherProfile)")
				.appendTo(me[$ELEMENT]);
			$survey.weave();
		},
		'dom:.ets-pr-fb-survey/hidden.ets-fb-survey': function () {
			var me = this;
			var $oldSurvey = me[$ELEMENT].find(SEL_SURVEY);
			$oldSurvey.unweave().then(function () {
				$oldSurvey.remove();
			});
		}
	});
});
