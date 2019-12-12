<template>
  <div id="app">
    <event-calendar :events="eventList" :color="'black'" />
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

<style>
</style>
