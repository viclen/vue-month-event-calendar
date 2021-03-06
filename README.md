# vue-month-event-calendar

Npm: https://www.npmjs.com/package/@viclen/vue-month-event-calendar

GitHub: https://github.com/viclen/vue-month-event-calendar

## Library installation
```
// npm
npm i @viclen/vue-month-event-calendar --save

// yarn
yarn add @viclen/vue-month-event-calendar
```

## Basic Usage
```
<template>
  <div id="app">
    <event-calendar :events="eventList" />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
  },
  data() {
    return {
      eventList: [
        {
          date: new Date(2019,11,12,10,10,10),
          title: "First event",
          desc: "We can set date as a date object or as a string, like the next one."
        },
        {
          date: "2019-12-25 10:00",
          title: "Christmas",
          desc: "An annual festival commemorating the birth of Jesus Christ... (<a href='https://en.wikipedia.org/wiki/Christmas'>Wikipedia</a>)"
        },
        {
          date: new Date(2019,11,10,10,10,0),
          title: "HTML Description",
          desc: "I can create <a href=''>links</a> within the <b>description</b>."
        }
      ]
    };
  }
};
</script>
```

## Language
You may choose the language of the calendar by changing the :language property.
The current available languages are ***en*** and ***pt***.

If your language is none of the above, or you just want to change which words are displayed, there is also the :translation property.
You may create your own translation to what appears to the calendar.

See code below. All available options are there.
```
<event-calendar :events="eventList" :language="'pt'" :translation="translation" />

<script>
export default {
  data() {
    return {
        translation: {
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
            day: "Day",
        }
    }
  }
}
```

## Color
You may also change the main color of the calendar.

### Available colors
To customize the color, you may just write them into the :color property as a string.
See the code for more.

#### Normal
```
<event-calendar :events="eventList" :color="'normal'" />
```
![normal](http://autosavestudio.com/vue-month-event-calendar/normal.png)

#### Blue
```
<event-calendar :events="eventList" :color="'blue'" />
```
![blue](http://autosavestudio.com/vue-month-event-calendar/blue.png)

#### Black
```
<event-calendar :events="eventList" :color="'black'" />
```
![black](http://autosavestudio.com/vue-month-event-calendar/black.png)

#### Red
```
<event-calendar :events="eventList" :color="'red'" />
```
![red](http://autosavestudio.com/vue-month-event-calendar/red.png)

#### Green
```
<event-calendar :events="eventList" :color="'green'" />
```
![green](http://autosavestudio.com/vue-month-event-calendar/green.png)

## Event Deletion
For each event shown in the calendar, there is an '&times;' button for deleting that event.

If you don't want events to be deletable, use the :showDelete property:
```
<event-calendar :showDelete="false" />
```

### onDeleteEvent function
If you want to make it possible to delete an event, you shoud inform the onDeleteEvent property.

The parameters of that function are: 
- e -> the event to be deleted, which comes from the :events array;
- callback -> this is the function that will remove the event from the calendar. You must call this if you want to update the events in the calendar after you delete it.
```
<event-calendar :onDeleteEvent="(e, callback) => myDeleteFunction(e, callback)" />

<script>
export default {
  methods: {
    // the event (e) here is exactly the same from the events array.
    myDeleteFunction(e, callback){
      // do some async requests
      axios.get('/delete').then(() => {
        // if the event was successfully deleted and the callback exists
        if(eventDeleted && callback){
          // executes the callback
          callback();
        }
      });
    }
  }
}
</script>
```

## Vue JS configuration reference
See [Configuration Reference](https://cli.vuejs.org/config/).
