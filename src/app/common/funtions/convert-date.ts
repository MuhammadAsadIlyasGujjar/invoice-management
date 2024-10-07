import * as momentTz from 'moment-timezone';
import moment from 'moment';

export function convertToUTC(localDateString: string): string {
  // Parse the local date string in the specified timezone (Pakistan Standard Time)
  const localDate = momentTz.tz(localDateString, "ddd MMM DD YYYY HH:mm:ss");
  // Convert to UTC
  const utcDate = localDate.utc();
  // Return the date in ISO format
  return utcDate.format();
}

export function convertToDate(localDateString: string) {
  // Parse the local date string in the specified timezone (Pakistan Standard Time)
  const localDate = moment(localDateString);

  return localDate.format();
}

export function isValidDate(localDateString: string) {
  const localDate = moment.utc(localDateString, moment.ISO_8601, true); // Strict ISO 8601 parsing

  return localDate.isValid();
}

export function convertToStartAndEndOfDayInUTC(dateString: string): { startOfDayUTC: string, endOfDayUTC: string } {
  // Parse the input date with timezone
  const localDate = moment.parseZone(dateString);

  // Get the start of the day in the local timezone
  const startOfDay = localDate.clone().startOf('day');
  // Get the end of the day in the local timezone
  const endOfDay = localDate.clone().endOf('day');

  // Convert to UTC
  const startOfDayUTC = startOfDay.utc().format();
  const endOfDayUTC = endOfDay.utc().format();

  return { startOfDayUTC, endOfDayUTC };
}
