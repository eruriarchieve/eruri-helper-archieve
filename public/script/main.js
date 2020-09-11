new Vue({
  name: 'CoursePage',
  el: '#course-page',
  data() {
    return {
      courses: [],
      loading: false,
      selectedCourse: null,
      options: {
        onlyNotDone: false,
        weekFilter: 1,
      }
    }
  },
  async created() {
    this.loading = true;
    try {
      this.courses = (await axios.get('/api/courses')).data;
    } catch(e) {
      console.log(e);
      alert(e.response.data.message);
      window.location.href = e.response.data.redirect;
    }
    this.loading = false;
  },
  watch: {
    options: {
      deep: true,
      handler() {
        if(this.options.weekFilter < 1) this.options.weekFilter = 1;
      }
    }
  },
  methods: {
    async selectCourse(course) {
      if(this.loading) return;
      this.loading = true;
      try {
        this.selectedCourse = (await axios.get(`/api/courses/${course.id}`)).data;
      }catch(e) {
        if(e.response) {
          alert(e.response.data.message);
          window.location.href = e.response.data.redirect;
        }
      }
      this.loading = false;
    }
  },
  computed: {
    filteredSelectedCourse() {
      if(!this.selectedCourse) return null;
      return {
        ...this.selectedCourse,
        homeworks: this.selectedCourse.homeworks.filter(homework => (homework.week >= this.options.weekFilter) && (!this.options.onlyNotDone || !homework.done)),
        videos: this.selectedCourse.videos.filter(video => (video.week >= this.options.weekFilter) && (!this.options.onlyNotDone || !video.done))
      }
    }
  }
});
