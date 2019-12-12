<template>
  <div id="app">
    <event-calendar :events="ev" :color="'blue'" />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
  },
  data() {
    return {
      ev: [
        {
          date: new Date(),
          title: "Teste",
          desc: "Description of the event with many many lines, 123 test."
        },
        {
          date: new Date(2019,11,12,10,10,10),
          title: "Teste3",
          desc: "Description3 of the event with many many lines, 123 test."
        },
        {
          date: new Date(2019,11,10,10,10,0),
          title: "Teste 2",
          desc: "Descriptionsdsd of the event with many many lines, 123 test."
        }
      ]
    };
  }
};
</script>

<style>
</style>
