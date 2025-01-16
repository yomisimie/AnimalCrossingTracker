import Time from "./Time";

export default class Fish {
  id: number;
  name: string;
  price: string;
  location: string;
  shadowSize: string;
  time: Time[];
  months: number[];
  image: string;

  constructor(
    id: number,
    name: string,
    price: string,
    location: string,
    shadowSize: string,
    time: Time[],
    months: number[],
    image: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.location = location;
    this.shadowSize = shadowSize;
    this.time = time;
    this.months = months;
    this.image = image;
  }
}
