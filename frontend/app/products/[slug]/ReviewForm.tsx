"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { submitReview, getAvailableOrderItemsForProduct } from "@/lib/api";

export default function ReviewForm({ productSlug, onSubmitting, onDone }: { productSlug: string; onSubmitting: () => void; onDone: (msg: string | null) => void }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [orderItemId, setOrderItemId] = useState<number | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);

  async function loadItems() {
    setLoadingItems(true);
    const items = await getAvailableOrderItemsForProduct(productSlug);
    setLoadingItems(false);
    if (items.length > 0) setOrderItemId(items[0].id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderItemId) {
      await loadItems();
      toast.error("Select an order item delivered to you before submitting a review.");
      return;
    }
    onSubmitting();
    const fd = new FormData();
    fd.append('order_item_id', String(orderItemId));
    fd.append('rating', String(rating));
    fd.append('title', title);
    fd.append('comment', comment);

    const res = await submitReview(fd);
    if (!res) {
      toast.error("Failed to submit review");
      onDone(null);
      return;
    }

    if (res.success) {
      // Review will be pending approval
      onDone('Thanks — your review has been submitted and will appear after approval.');
      toast.success('Review submitted');
      return;
    }

    toast.error(res.message || 'Failed to submit review');
    onDone(null);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2 items-center mb-2">
        <label className="text-sm font-semibold">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2">
          {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} star{r>1? 's':''}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2">
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review" className="w-full p-2 border rounded" rows={4} />
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="btn-brand px-4 py-2 rounded">Submit Review</button>
        <button type="button" onClick={loadItems} className="px-3 py-2 border rounded">Load my delivered items</button>
      </div>
    </form>
  );
}
