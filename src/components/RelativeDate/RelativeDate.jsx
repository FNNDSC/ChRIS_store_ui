import moment from 'moment';

class RelativeDate {
  constructor(date) {
    this.date = date;
  }

  isValid() {
    return new Date(this.date).toDateString() !== 'Invalid Date';
  }

  format() {
    const date = new Date(this.date);
    return moment(date).fromNow();
  }
}

export default RelativeDate;
