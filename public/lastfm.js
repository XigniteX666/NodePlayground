var app = new Vue({
  el: '#app',
  data: {
    searchTerm: 'Nirvana',
    user: '',
    artistList: '',
    chart:'',
    artistDetails:''
  },
  created: function() {
    this.searchArtist();
  },
  methods: {
    searchArtist: function() {
      var vm = this;
      this.$http.get('/api/lastfm/search/artist/'+this.searchTerm).then(response => {
        this.artistList = response.data.results.artistmatches.artist;
      });
    },
    artistChart: function(){
      var vm = this;
      this.$http.get('api/lastfm/chart').then(response => {
        this.artistList = response.data;
      });
    },

    say: function (message) {
      alert(message)
    },

    getArtistDetails: function(artistid){
      var vm = this;
      this.$http.get('/api/lastfm/artist/' + artistid).then(response => {
        console.log(response.data)
        this.artistDetails = response.data;
      });
    }

  }
})
