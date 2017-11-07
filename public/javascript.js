var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    user: '',
    activities: ''
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      var vm = this;
      this.$http.get('/api/strava/user').then(response => {
        this.user = response.data
      });

      this.$http.get('/api/strava/activities').then(response => {
        this.activities = response.data
      });
    }

  }
})
