const moment = require('moment-timezone');

function getTime(timezone) {
  let date = moment().tz(timezone).format('YYYY-MM-DD');
  let time = moment().tz(timezone).format('HH:MM:SS');

  let d_day = date.split('-')[2];
  let d_month = date.split('-')[1];
  let d_year = date.split('-')[0];
  
  if (d_day.startsWith('0')) d_day = d_day.substring(1,d_day.length);
  if (d_month.startsWith('0')) d_month = d_month.substring(1,d_month.length);
  if (d_year.startsWith('0')) d_year = d_year.substring(1,d_year.length);
  date = d_year + '-' + d_month + '-' + d_day;
  
  let t_hour = time.split(':')[0];
  let t_min = time.split(':')[1];
  let t_sec = time.split(':')[2];
  
  if (t_hour.startsWith('0')) t_hour = t_hour.substring(1,t_hour.length);
  if (t_min.startsWith('0')) t_min = t_min.substring(1,t_min.length);
  if (t_sec.startsWith('0')) t_sec = t_sec.substring(1,t_sec.length);
  time = t_hour + ':' + t_min + ':' + t_sec;

  return date + ' ' + time;
}

module.exports = {getTime}