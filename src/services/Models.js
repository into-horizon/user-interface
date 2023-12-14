import productDefaultImage from "../assets/no-image.png";

export class WishlistItemModel {
  constructor({ id, entitle, artitle, pictures }) {
    this.id = crypto.randomUUID();
    this.product_id = id;
    this.entitle = entitle;
    this.artitle = artitle;
    this.picture =
      pictures?.product_picture ?? pictures?.[0] ?? productDefaultImage;
  }
}
