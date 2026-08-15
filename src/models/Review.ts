// models/Review.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// Prevent user from reviewing the same product twice
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Auto-update product rating + reviewsCount after saving
reviewSchema.post("save", async function () {
  const Review = this.model("Review");
  const Product = this.model("Product");

  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      rating: stats[0].avgRating,
      reviewsCount: stats[0].numReviews,
    });
  }
});

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
