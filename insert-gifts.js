const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const gifts = [
  {
    name: "Cozy Living Room Set",
    category: "Living Room",
    description: "A beautiful set of cushions and decorations for a cozy living room.",
    price: 80,
    image: "/images/living-room.jpg"
  },
  {
    name: "Modern Floor Lamp",
    category: "Living Room",
    description: "Elegant floor lamp for a modern home.",
    price: 45,
    image: "/images/floor-lamp.jpg"
  },
  {
    name: "Decorative Vase",
    category: "Living Room",
    description: "Stylish decorative vase for your home.",
    price: 25,
    image: "/images/vase.jpg"
  },
  {
    name: "Soft Throw Blanket",
    category: "Living Room",
    description: "Warm and comfortable blanket for relaxing evenings.",
    price: 35,
    image: "/images/blanket.jpg"
  },
  {
    name: "Coffee Table",
    category: "Living Room",
    description: "Modern wooden coffee table.",
    price: 120,
    image: "/images/coffee-table.jpg"
  },
  {
    name: "Scented Candle Set",
    category: "Living Room",
    description: "A set of relaxing scented candles.",
    price: 20,
    image: "/images/candles.jpg"
  },
  {
    name: "Decorative Wall Art",
    category: "Living Room",
    description: "Beautiful wall decoration for your living space.",
    price: 50,
    image: "/images/wall-art.jpg"
  },
  {
    name: "Comfort Armchair",
    category: "Living Room",
    description: "Comfortable armchair for reading and relaxing.",
    price: 150,
    image: "/images/armchair.jpg"
  },
  {
    name: "Kitchen Starter Set",
    category: "Kitchen",
    description: "Useful kitchen accessories for a new home.",
    price: 70,
    image: "/images/kitchen-set.jpg"
  },
  {
    name: "Ceramic Dinner Set",
    category: "Kitchen",
    description: "Elegant ceramic plates and bowls.",
    price: 60,
    image: "/images/dinner-set.jpg"
  },
  {
    name: "Electric Kettle",
    category: "Kitchen",
    description: "Fast and convenient electric kettle.",
    price: 40,
    image: "/images/kettle.jpg"
  },
  {
    name: "Coffee Maker",
    category: "Kitchen",
    description: "Compact coffee maker for coffee lovers.",
    price: 90,
    image: "/images/coffee-maker.jpg"
  },
  {
    name: "Garden Tool Set",
    category: "Garden",
    description: "Practical tools for gardening.",
    price: 55,
    image: "/images/garden-tools.jpg"
  },
  {
    name: "Indoor Plant",
    category: "Garden",
    description: "Beautiful indoor plant for home decoration.",
    price: 30,
    image: "/images/plant.jpg"
  },
  {
    name: "Bluetooth Speaker",
    category: "Electronics",
    description: "Portable wireless speaker with great sound.",
    price: 65,
    image: "/images/speaker.jpg"
  },
  {
    name: "Smart Desk Lamp",
    category: "Electronics",
    description: "Adjustable smart lamp for your desk.",
    price: 50,
    image: "/images/desk-lamp.jpg"
  }
];

async function insertGifts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("giftlink");
    const collection = db.collection("gifts");

    const result = await collection.insertMany(gifts);

    console.log(`Inserted ${result.insertedCount} gifts`);
    console.log(result.insertedIds);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

insertGifts();