export class Time {
  from: number;
  to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }
}

export class Availability {
  month: number[];
  time: Time[];

  constructor(month: number[], time: Time[]) {
    this.month = month;
    this.time = time;
  }
}
