<template>
  <div class="body">
    <div class="row" v-bind:class="mainColor">
      <div class="column-left">
        <div class="month">
          <ul>
            <li class="prev" v-on:click="prevMonth()">&#10094;</li>
            <li class="next" v-on:click="nextMonth()">&#10095;</li>
            <li>
              {{ info.months[currentMonth] }}
              <br />
              <span style="font-size:18px">{{ currentYear }}</span>
            </li>
          </ul>
        </div>

        <ul class="weekdays">
          <li v-for="(d,i) in info.weekDays" v-bind:key="i">{{ d }}</li>
        </ul>

        <ul class="days" ref="monthDays">
          <li
            v-for="(d,i) in dates"
            v-bind:key="i"
            class="day"
            v-bind:class="{ active: d.dateString==today.toDateString(), selected: selectedDay.number==d.number }"
            v-on:click="showDay(d)"
          >
            <b class="day-number" v-html="d.number"></b>

            <div class="event-number">
              <span v-if="d.events.length">
                {{ d.events.length }}
                <b
                  class="display-none d-md-inline"
                >{{ info.events.toLowerCase() }}.</b>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="column-right">
        <div class="month">
          <ul>
            <li>
              {{ info.day }}
              <br />
              {{ selectedDay.number || "-" }}
            </li>
          </ul>
        </div>

        <ul class="weekdays">
          <li class="w-100">{{ capitalize(info.events) }}</li>
        </ul>

        <div class="day-schedule" v-bind:style="dayScheduleStyle">
          <p class="text-center" v-if="!selectedDay.events.length">{{ info.noEvent }}</p>
          <div class="event-card mb-2" v-for="(e,i) in selectedDay.events" v-bind:key="i">
            <div class="event-title p-0" v-bind:id="'heading' + i">
              <button
                class="btn btn-link m-0 mt-1 w-100"
                v-on:click="showEvent(i)"
                v-html="e.title"
              ></button>
              <button class="btn btn-delete-event" v-on:click="deleteEvent(e)" v-if="deletable">&times;</button>
              <small class="event-time">{{ e.time }}</small>
            </div>
            <div class="event-description" v-html="e.desc" v-if="e.show"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["events", "onDeleteEvent", "language", "color", "translation", "showDelete"],
  name: "event-calendar",
  data() {
    return {
      dates: [],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      today: new Date(),
      selectedDay: { events: [] },
      dayScheduleStyle: {},
      info: {
        noEvent: "No events today.",
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        event: "Event", // singular
        events: "Events", // plural
        day: "Day"
      },
      mainColor: "normal",
      deletable: true,
    };
  },
  mounted() {
    if (this.translation) {
      for (var property in this.info) {
        if (this.translation[property]) {
          this.info[property] = this.translation[property];
        }
      }
    }
    if (this.language) {
      if (this.language == "pt") {
        this.info = {
          noEvent: "Nenhum evento nesse dia.",
          months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
          ],
          weekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
          event: "Evento",
          events: "Eventos",
          day: "Dia"
        };
      }
    }

    if(this.showDelete != undefined){
      this.deletable = this.showDelete;
    }

    if (this.color) {
      this.mainColor = this.color;
    }

    setTimeout(() => {
      this.getDates(this.currentYear, this.currentMonth);
    }, 500);
  },
  methods: {
    getDates(year, month) {
      this.selectedDay = { events: [] };
      this.dates = [];
      var d = new Date(year, month);
      var diaSemana = 0;
      var primeiroDia = false;
      while (d.getMonth() == month) {
        if (diaSemana == d.getDay()) {
          primeiroDia = true;
          var day = {
            number: d.getDate() + "",
            events: [],
            dateString: d.toDateString()
          };
          if (this.events) {
            this.events.map(event => {
              var eventDate = new Date(event.date);
              if (eventDate.toDateString() == d.toDateString()) {
                event.dayIndex = this.dates.length;
                event.show = false;
                event.time =
                  eventDate.toTimeString().split(":")[0] +
                  ":" +
                  eventDate.toTimeString().split(":")[1];
                day.events.push(event);
              } else {
                return event;
              }
            });
          }

          this.dates.push(day);

          if (day.dateString == this.today.toDateString()) {
            this.selectedDay = day;
          }

          d = new Date(d.getTime() + 1000 * 60 * 60 * 24);
        } else if (!primeiroDia) {
          this.dates.push({
            number: "&nbsp;",
            events: [],
            dateString: ""
          });
        }

        diaSemana++;
        if (diaSemana > 6) {
          diaSemana = 0;
        }
      }

      this.$forceUpdate();

      setTimeout(() => {
        var heightString = this.$refs.monthDays.clientHeight + "px";
        this.dayScheduleStyle = { height: heightString };
      }, 100);
    },
    nextMonth() {
      if (this.currentMonth < 11) {
        this.currentMonth++;
      } else {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.getDates(this.currentYear, this.currentMonth);
    },
    prevMonth() {
      if (this.currentMonth > 0) {
        this.currentMonth--;
      } else {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.getDates(this.currentYear, this.currentMonth);
    },
    showDay(day) {
      this.selectedDay = day;
    },
    deleteEvent(e) {
      if (this.onDeleteEvent != undefined) {
        var dayIndex = e.dayIndex;
        var eventIndex = this.dates[dayIndex].events.indexOf(e);
        delete e.dayIndex;
        this.onDeleteEvent(e, () => {
          this.dates[dayIndex].events.splice(eventIndex, 1);
          this.$forceUpdate();
        });
      }
    },
    showEvent(index) {
      this.selectedDay.events.forEach((e, i) => {
        if (i != index) this.selectedDay.events[i].show = false;
      });
      this.selectedDay.events[index].show = !this.selectedDay.events[index]
        .show;
      this.$forceUpdate();
    },
    capitalize(str) {
      if (str) {
        var capital = str.substring(0, 1);
        var rest = str.substring(1, str.length);
        return capital + "" + rest;
      } else {
        return str;
      }
    }
  }
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

ul {
  list-style-type: none;
}
.body {
  font-family: sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.6;
  color: #212529;
  text-align: left;
}

/* Month header */
.month {
  padding: 20px 25px;
  width: 100%;
  background: #1abc9c;
  text-align: center;
}
.normal .month {
  background: #1abc9c !important;
}
.blue .month {
  background: #3490dc !important;
}
.black .month {
  background: #343a40 !important;
}
.red .month {
  background: #e3342f !important;
}
.green .month {
  background: #38c172 !important;
}

/* Month list */
.month ul {
  margin: 0;
  padding: 0;
}

.month ul li {
  color: white;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
}

/* Previous button inside month header */
.month .prev {
  float: left;
  padding-top: 10px;
}

/* Next button */
.month .next {
  float: right;
  padding-top: 10px;
}

/* Weekdays (Mon-Sun) */
.weekdays {
  margin: 0;
  padding: 10px 0;
  background-color: #ddd;
}

.weekdays li {
  display: inline-block;
  width: 13.6%;
  color: #666;
  text-align: center;
}

.days {
  padding: 10px 0;
  background: #eee;
  margin: 0;
}

.days li.day {
  list-style-type: none;
  display: inline-block;
  width: 13.6%;
  text-align: center;
  margin-bottom: 5px;
  font-size: 14px;
  color: #777;
  height: 70px;
  padding: 5px;
  transition: 0.5s ease;
}

.days li.day.active {
  background: #1abc9c;
  color: white !important;
}
.normal .days li.day.active {
  background: #1abc9c !important;
}
.blue .days li.day.active {
  background: #3490dc !important;
}
.black .days li.day.active {
  background: #343a40 !important;
}
.red .days li.day.active {
  background: #e3342f !important;
}
.green .days li.day.active {
  background: #38c172 !important;
}

.prev,
.next {
  cursor: pointer;
}

.day .event-number {
  padding: 0;
  overflow-y: auto;
  height: 40px;
  margin: 0 2px;
  white-space: nowrap;
  overflow: hidden;
}
.day .event-number b {
  font-weight: normal;
}
.day .event-number span {
  list-style-type: none;
  text-align: center;
  border: 1px solid #1abc9b;
  background: #eeeeee;
  color: #000;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 3px;
  display: block;
}
.normal .day .event-number span {
  border: 1px solid #1abc9b;
}
.blue .day .event-number span {
  border: 1px solid #3490dc !important;
}
.black .day .event-number span {
  border: 1px solid #343a40 !important;
}
.red .day .event-number span {
  border: 1px solid #e3342f !important;
}
.green .day .event-number span {
  border: 1px solid #38c172 !important;
}

.day:not(.selected) {
  border: 1px solid transparent;
}
.day.selected {
  border: 1px solid #1abc9b;
  color: #1abc9b;
  background: white;
}
.normal .day.selected {
  color: #1abc9b;
  border: 1px solid #1abc9b;
}
.blue .day.selected {
  color: #3490dc !important;
  border: 1px solid #3490dc !important;
}
.black .day.selected {
  color: #343a40 !important;
  border: 1px solid #343a40 !important;
}
.red .day.selected {
  color: #e3342f !important;
  border: 1px solid #e3342f !important;
}
.green .day.selected {
  color: #38c172 !important;
  border: 1px solid #38c172 !important;
}

.day.selected.active span {
  background: white !important;
  color: #1abc9b;
}
.normal .day.selected.active span {
  background: white !important;
  color: #1abc9b;
}
.blue .day.selected.active span {
  background: white !important;
  color: #3490dc !important;
}
.black .day.selected.active span {
  background: white !important;
  color: #343a40 !important;
}
.red .day.selected.active span {
  background: white !important;
  color: #e3342f !important;
}
.green .day.selected.active span {
  background: white !important;
  color: #38c172 !important;
}

.day.selected span {
  --webkit-box-shadow: 0px 5px 5px -5px black;
  box-shadow: 0px 5px 5px -5px black;
  background: #1abc9b;
  color: white;
}
.normal .day.selected span {
  background: #1abc9b;
}
.blue .day.selected span {
  background: #3490dc !important;
}
.black .day.selected span {
  background: #343a40 !important;
}
.red .day.selected span {
  background: #e3342f !important;
}
.green .day.selected span {
  background: #38c172 !important;
}

.day-schedule {
  padding-top: 0.5rem;
  padding-left: 5px;
  padding-right: 5px;
  background: #eeeeee;
  overflow-y: auto;
}

.day > span.day-number {
  height: 20px;
}

.text-center {
  text-align: center !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}
.p-0 {
  padding: 0 !important;
}
.m-0 {
  margin: 0 !important;
}
.mt-1 {
  margin-top: 0.25rem !important;
}
.w-100 {
  width: 100% !important;
}
.event-card {
  position: relative;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.event-title {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  position: relative;
}
.event-title:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}
.event-description {
  -webkit-box-flex: 1;
  flex: 1 1 auto;
  padding: 1.25rem;
}
.event-time {
  color: #777;
  font-size: 0.6rem;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
}
.btn-group {
  position: relative;
  display: -webkit-inline-box;
  display: inline-flex;
  vertical-align: middle;
}
.btn-group > .btn:not(:last-child):not(.dropdown-toggle) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.btn-group > .btn:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.btn-group > .btn:not(:first-child) {
  margin-left: -1px;
}
.btn-group > .btn {
  position: relative;
  -webkit-box-flex: 1;
  flex: 1 1 auto;
}
button:not(:disabled),
[type="button"]:not(:disabled) {
  cursor: pointer;
}
.btn-link {
  font-weight: 400;
  color: #3490dc;
  text-decoration: none;
}
.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 0.9rem;
  line-height: 1.6;
  border-radius: 0.25rem;
  -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.btn-delete-event {
  position: absolute;
  right: 0;
  z-index: 10;
  font-size: 20px;
  padding: 0;
  height: 100%;
  width: 20px;
  background: none;
  outline: none !important;
  border: none;
  padding-bottom: 4px;
}
.row {
  display: -webkit-box;
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.column-right {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}
.display-none {
  display: none !important;
}
.body {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .body {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .column-left {
    -webkit-box-flex: 0;
    flex: 0 0 75%;
    max-width: 75%;
  }
  .column-right {
    -webkit-box-flex: 0;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .d-md-inline {
    display: inline !important;
  }
  .body {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .body {
    max-width: 960px;
  }
}
</style>
