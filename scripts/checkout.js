import { cart, removeFromCart, updateDeliveryOption } from "../data/cart.js";

import { products } from "../data/products.js";

import { formatCuency } from "../utils/money.js";

import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

import { deliveryOptions } from "../data/deliveryOptions.js";

const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM,D"));

let cartSummaryHtml = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let machingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      machingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }

  });

  const today = dayjs() 
  const deliveryDate = today.add(deliveryOptions.deliveryDays, "days");
  const dataString = deliveryDate.format("dddd, MMMM D ");



 
  cartSummaryHtml += ` 
    <div class="cart-item-container js-cart-item-container-${
      machingProduct.id
    }">
      <div class="delivery-date">
         Delivery date:  ${dataString} 
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${machingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${machingProduct.name} 
          </div>
          <div class="product-price">
            $${formatCuency(machingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link  link-primary js-delete-link" data-product-id = "${
              machingProduct.id
            }">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
            ${deliveryOptionsHTML(machingProduct, cartItem)}  
        </div>
      </div>
    </div>  
  `;
});

function deliveryOptionsHTML(machingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dataString = deliveryDate.format("dddd, MMMM D ");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCuency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
    <div class="delivery-option js-delivery-option" data-product-id=${
      machingProduct.id
    } data-delivery-option-id=${deliveryOption.id}>
      <input type="radio"
      ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${machingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dataString}
        </div>
        <div class="delivery-option-price">
          ${priceString} - Shipping
        </div>
      </div>
    </div>
    `;
  });

  return html;
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();
  });
});


document.querySelectorAll("js-delivery-option").forEach((element) => {
  element.addEventListener('click', () => {
    const {productId,deliveryOptionId } = element.dataset; 
    updateDeliveryOption(productId,deliveryOptionId);
  })
}) 