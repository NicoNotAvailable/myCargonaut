export class DateUtils {
  static parseDate(dateStr: string): string {
    const [datePart] = dateStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    const formattedDay = this.addLeadingZero(date.getDate());
    const formattedMonth = this.addLeadingZero(date.getMonth() + 1);
    const formattedYear = date.getFullYear();

    return `${formattedDay}.${formattedMonth}.${formattedYear}`;
  }

  private static addLeadingZero(value: number): string {
    return value < 10 ? '0' + value : String(value);
  }
}