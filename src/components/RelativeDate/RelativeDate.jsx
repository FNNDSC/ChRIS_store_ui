import moment from 'moment';

class RelativeDate {
  constructor(date) {
    this.date = date;
  }

  static isValid(date) {
    return new Date(date).toDateString() !== 'Invalid Date';
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
