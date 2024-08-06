import moment from "moment";
export function formatDate(date: any, newFormat?: any) {
  if (newFormat) {
    // return moment(date).format("h:mm a, LL");
    return moment(date).format("lll");
  }
  return moment(date).format("MMMM Do YYYY, h:mm a");
}
