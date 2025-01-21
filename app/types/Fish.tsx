import Time from "./Time";

export default class Fish {
  id: number;
  name: string;
  price: number;
  location: string;
  shadow: string;
  time: Time[];
  months: number[];
  image: string;

  constructor(
    id: number,
    name: string,
    price: number,
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
    this.shadow = shadowSize;
    this.time = time;
    this.months = months;
    this.image = image;
  }
}
