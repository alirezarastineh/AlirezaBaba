import bcrypt from "bcryptjs";
import { User } from "./models/userModel";
import { Product } from "./models/productModel";

export const sampleProducts: Product[] = [
  {
    name: "Lamborghini Huracán",
    slug: "lamborghini-huracán",
    image:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980649/uploads/p4.jpg",
    category: "Sport Car",
    brand: "Lamborghini",
    price: 200000.0,
    countInStock: 10,
    description: "High Quality Car",
    rating: 4.5,
    numReviews: 10,
    reviews: [
      { name: "John", comment: "good", rating: 4, createdAt: new Date() },
    ],
    images: [
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980638/uploads/p11.jpg",
    ],
    isFeatured: true,
    banner:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980296/uploads/b1.jpg",
  },
  {
    name: "Lamborghini Terzo Millennio",
    slug: "lamborghini-terzo-millennio",
    image:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980643/uploads/p3.jpg",
    category: "Sport Car",
    brand: "Lamborghini",
    price: 2288000.0,
    countInStock: 20,
    description: "High Quality Car",
    rating: 4.0,
    numReviews: 10,
    reviews: [],
    images: [],
    isFeatured: true,
    banner:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980283/uploads/b2.jpg",
  },
  {
    name: "Mercedes-Benz G-Class",
    slug: "mercedes-benz-g-class",
    image:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980295/uploads/p2.jpg",
    category: "Car",
    brand: "Mercedes-Benz",
    price: 155000.0,
    countInStock: 0,
    description: "High Quality Car",
    rating: 4.8,
    numReviews: 17,
    reviews: [],
    images: [],
    isFeatured: false,
  },
  {
    name: "Dodge Challenger SRT Hellcat",
    slug: "dodge-challenger-srt-hellcat",
    image:
      "https://res.cloudinary.com/kouroshrstn/image/upload/v1688980296/uploads/p1.jpg",
    category: "Car",
    brand: "Dodge",
    price: 92000.0,
    countInStock: 15,
    description: "High Quality Car",
    rating: 4.5,
    numReviews: 14,
    reviews: [],
    images: [],
    isFeatured: false,
  },
];

export const sampleUsers: User[] = [
  {
    name: "Alireza",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: true,
  },
  {
    name: "John",
    email: "user@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: false,
  },
];
