Date.prototype.getWeek = function(dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() -
    (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

Tasks = new Mongo.Collection('tasks');

Tasks.before.insert(function(userId, doc) {
  doc.createdAt = moment().toDate();
  doc.statusChangedAt = new Date();
  doc.status = "open";
  doc.owner = userId;
});

Tasks.computeDeadline = function(startDate, repetition) {
  var deadline = new Date(startDate.getTime());
  var now = new Date();

  if (repetition === "daily") {
    deadline = new Date();
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(0);
    deadline.setMinutes(0);
    deadline.setSeconds(0);
    deadline.setMilliseconds(0);
  } else if (repetition === "weekly") {
    if (startDate < now) {

    }
  } else if (repetition === "monthly") {
    if (startDate < now) {
      var monthsToAdd = 0;
      if ((startDate.getDate() < now.getDate()) && ((startDate.getHours() * 60 + startDate.getMinutes()) < now.getHours() * 60 + now.getMinutes())) {
        monthsToAdd = 1;
      }
      if (now.getMonth() != 12) {
        deadline.setMonth(now.getMonth() + monthsToAdd);
        deadline.setFullYear(now.getFullYear());
      } else {
        deadline.setMonth(0);
        deadline.setFullYear(now.getFullYear() + 1);
      }
    }
  } else if (repetition === "yearly") {
    if (startDate < now) {
      var yearsToAdd = 0;
      if (deadline.getYear() === now.getYear()) {
        yearsToAdd = 1;
      }
      deadline.setFullYear(now.getFullYear() + yearsToAdd);
    }
  }

  return deadline;
}

Tasks.remainingTime = function(status, statusChangedAt, repetition, startDate) {

  var deadline = Tasks.computeDeadline(startDate, repetition);
  var statusChangedAt = new Date(statusChangedAt);
  var now = new Date();

  if (status === "done") {
    if (repetition === "daily") {
      if ((statusChangedAt.getYear() === now.getYear()) && (statusChangedAt.getMonth() === now.getMonth()) && (statusChangedAt.getDay() === now.getDay())) {
        return "Heute schon erledigt";
      }
    } else if (repetition === "weekly") {
      if ((statusChangedAt.getYear() === now.getYear()) && (statusChangedAt.getWeek() === now.getWeek())) {
        return "Diese Woche schon erledigt";
      }
    } else if (repetition === "monthly") {
      var lastDeadline = new Date(deadline.getTime());
      if (lastDeadline.getMonth() === 0) {
        lastDeadline.setMonth(11);
        lastDeadline.setFullYear(lastDeadline.getFullYear() - 1);
      } else {
        lastDeadline.setMonth(lastDeadline.getMonth() - 1);
      }
      if ((statusChangedAt <= deadline) && (statusChangedAt > lastDeadline)) {
        return "Diesen Monat schon erledigt";
      }
    } else if (repetition === "yearly") {
      var lastDeadline = new Date(deadline.getTime());
      lastDeadline.setFullYear(deadline.getFullYear() - 1);
      if ((statusChangedAt <= deadline) && (statusChangedAt > lastDeadline)) {
        return "In diesem Jahr schon erledigt";
      }
    }
  }

  var diff = (deadline - now) / 1000;

  var days = Math.floor(diff / (24 * 60 * 60));
  var leftSec = diff - days * 24 * 60 * 60;
  var hrs = Math.floor(leftSec / (60 * 60));
  leftSec = leftSec - hrs * 60 * 60;
  var min = Math.floor(leftSec / (60));
  leftSec = leftSec - min * 60;

  return days + " Tage, " + hrs + " Stunden und " + min + " Minuten übrig";
}
Schema = {};

Schema.tasks = new SimpleSchema({
  name: {
    type: String,
    label: "Bezeichnung",
    max: 200
  },
  repetition: {
    type: String,
    label: "Wiederholen...",
    allowedValues: ["onetime", "daily", "weekly", "monthly", "yearly"],
    defaultValue: "daily",
    autoform: {
      firstOption: 'daily',
      options: 'allowed',
      options: [{
        label: "Täglich",
        value: "daily"
      }, {
        label: "Wöchentlich",
        value: "weekly"
      }, {
        label: "Monatlich",
        value: "monthly"
      }, {
        label: "Jährlich",
        value: "yearly"
      }]
    }
  },
  startDate: {
    type: Date,
    label: "Start Datum",
    defaultValue: new Date(),
    autoform: {
      type: "pickadate",
    }
  },
  status: {
    type: String,
    autoform: {
      afFieldInput: {
        type: "hidden"
      },
      afFormGroup: {
        label: false
      }
    }
  },
  statusChangedAt: {
    type: Date,
    autoform: {
      afFieldInput: {
        type: "hidden"
      },
      afFormGroup: {
        label: false
      }
    }
  }
});

Tasks.attachSchema(Schema.tasks)
