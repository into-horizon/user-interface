import productDefaultImage from "../assets/no-image.png";

export class WishlistItemModel {
  constructor({ id, entitle, artitle, pictures, product_id }) {
    this.id = product_id ? id : crypto.randomUUID();
    this.product_id = product_id ?? id;
    this.entitle = entitle;
    this.artitle = artitle;
    this.picture =
      pictures?.product_picture ?? pictures?.[0] ?? productDefaultImage;
  }
}

export class CartItemModel {
  constructor({
    id,
    entitle,
    artitle,
    pictures,
    product_id,
    size,
    color,
    quantity,
    price,
    currency,
  }) {
    this.id = product_id ? id : crypto.randomUUID();
    this.product_id = product_id ?? id;
    this.entitle = entitle;
    this.artitle = artitle;
    this.picture =
      pictures?.product_picture ?? pictures?.[0] ?? productDefaultImage;
    this.size = size;
    this.color = color;
    this.quantity = quantity;
    this.price = price;
    this.currency = currency;
  }
}
