import { getMongoClientInstance } from "@/db/config/connection";
import { Db, ObjectId } from "mongodb";

export type WishlistModel = {
  _id: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const DATABASE_NAME = process.env.MONGODB_NAME || "test";
const COLLECTION_WISHLIST = "Wishlists";
const COLLECTION_PRODUCT = "Products";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

// Get Wishlist by User ID dengan aggregate lookup ke Product
export const getWishlistByUser = async (userId: string) => {
  try {
    const db = await getDb();
    const userObjectId = new ObjectId(userId);

    const wishlistUser = await db
      .collection(COLLECTION_WISHLIST)
      .aggregate([
        { $match: { userId: userObjectId } },
        {
          $lookup: {
            from: COLLECTION_PRODUCT,
            localField: "productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    // console.log('GET WL MODEL: ', wishlistUser);

    return wishlistUser;
  } catch (err) {
    console.error("Error in getWishlistByUser model:", err);
    throw err;
  }
};

// Tambah atau Hapus Wishlist Item
export const toggleWishlistItem = async (userId: string, productId: string) => {
  // console.log('di MODEL WL')
  const db = await getDb();
  const wishlistCollection = db.collection(COLLECTION_WISHLIST);
  // console.log('WL COLLECTION SINI >', wishlistCollection);

  const existingItem = await wishlistCollection.findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
  });

  if (existingItem) {
    await wishlistCollection.deleteOne({ _id: existingItem._id });
    return false; // Item dihapus dari wishlist
  } else {
    const newItem: WishlistModel = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // console.log('newitem MODEL WL: ', newItem);

    await wishlistCollection.insertOne(newItem);
    return newItem;
  }
};
