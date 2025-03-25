import { getMongoClientInstance } from "@/db/config/connection";
import { type Db, ObjectId } from "mongodb";

export type ProductModel = {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  excerpt?: string;
  price: number;
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductModelCreateInput = Omit<
  ProductModel,
  "_id" | "createdAt" | "updatedAt"
>;

const DATABASE_NAME = process.env.MONGODB_NAME || "test";
const COLLECTION_PRODUCT = "Products";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);

  return db;
};

// GET Product
export const getProducts = async () => {
  const db = await getDb();

  const products = (await db
    .collection(COLLECTION_PRODUCT)
    .find({})
    .toArray()) as ProductModel[];
  // console.log("product dimodel: ", products);

  return products;
};

// GET Featured Product
export const getFeatured = async () => {
  try {
    const db = await getDb();

    const featured = (await db
      .collection(COLLECTION_PRODUCT)
      .find({
        _id: {
          $in: [
            new ObjectId("65de68b9b340afd57db23e2b"),
            new ObjectId("65de68b9b340afd57db23e2a"),
            new ObjectId("65de68b9b340afd57db23e2c"),
            new ObjectId("65de68b9b340afd57db23e2d"),
            new ObjectId("65de68b9b340afd57db23e2e"),
          ],
        },
      })
      .toArray()) as ProductModel[];
    // console.log("[DEBUG] Featured: ", featured);

    return featured;
  } catch (err) {
    console.error(err);
  }
};

export const createProduct = async (product: ProductModelCreateInput) => {
  const db = await getDb();

  const newProduct: ProductModel = {
    ...product,
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection(COLLECTION_PRODUCT).insertOne(newProduct);

  return result;
};

export const getProductById = async (id: string) => {
  const db = await getDb();
  const objectId = new ObjectId(id);

  const product = (await db
    .collection(COLLECTION_PRODUCT)
    .findOne({ _id: objectId })) as ProductModel;

  return product;
};

export const updateProduct = async (
  id: string,
  updateData: Partial<ProductModelCreateInput>
) => {
  const db = await getDb();
  const objectId = new ObjectId(id);

  const result = await db
    .collection(COLLECTION_PRODUCT)
    .updateOne(
      { _id: objectId },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

  return result;
};

export const deleteProduct = async (id: string) => {
  const db = await getDb();
  const objectId = new ObjectId(id);

  const result = await db
    .collection(COLLECTION_PRODUCT)
    .deleteOne({ _id: objectId });

  return result;
};
