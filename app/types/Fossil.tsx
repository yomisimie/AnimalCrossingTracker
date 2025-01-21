export default class Fossil {
  id: number;
  name: string;
  price: number;
  group: string;
  score: number;
  size: string;
  image: string;

  constructor(
    id: number,
    name: string,
    price: number,
    group: string,
    score: number,
    size: string,
    image: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.group = group;
    this.score = score;
    this.size = size;
  }
}
