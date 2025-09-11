import { Time, Availability } from "./Time";

export default class Bug {
  id: number;
  name: string;
  location: string;
  price: number;
  time?: Time[];
  months?: number[];
  image: string;
  weather?: string;
  availability?: Availability[];
  rarity?: string;

  constructor(
    id: number,
    name: string,
    location: string,
    price: number,
    time: Time[],
    months: number[],
    image: string,
    weather: string,
    availability: Availability[],
    rarity: string
  ) {
    this.image = image;
    this.id = id;
    this.name = name;
    this.location = location;
    this.price = price;
    this.time = time;
    this.weather = weather;
    this.months = months;
    this.availability = availability;
    this.rarity = rarity || "";
  }
}
