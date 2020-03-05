/*
 * Turns a date object into a string on the form that
 * input elements wants it. Also uses correct timezone
 */
export default function DateToString(date) {
  return date.toLocaleString(
    'no-NO',
    {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  )
    .split('/')
    .reverse()
    .join('-');
}
