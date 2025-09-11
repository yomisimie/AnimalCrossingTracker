export default class Fossil {
  id: number;
  name: string;
  price: number;
  group: string;
  score: number;
  genre: string;
  size: string;
  image: string;

  constructor(
    id: number,
    name: string,
    price: number,
    group: string,
    score: number,
    genre: string,
    size: string,
    image: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.group = group;
    this.score = score;
    this.genre = genre;
    this.size = size;
    this.image = image;
  }
}
