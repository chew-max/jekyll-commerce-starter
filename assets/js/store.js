document.addEventListener("DOMContentLoaded", function () {

  const CART_STORAGE_KEY = "jekyllCommerceCart";

  /* =======================================================
     Helpers
     ======================================================= */

  function getCart() {
    const storedCart =
      localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    try {
      return JSON.parse(storedCart);
    } catch (error) {
      console.error(
        "Unable to parse cart data:",
        error
      );

      return [];
    }
  }


  function saveCart(cart) {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );

    renderCart();
  }


	function getCartItemKey(product) {
	  return product.sku || [
		product.productId || product.url,
		product.color || "",
		product.size || ""
	  ].join("|");
	}


  function formatMoney(value) {
    return "$" + Number(value).toFixed(2);
  }


  /* =======================================================
     Mobile Navigation
     ======================================================= */

  const toggle =
    document.querySelector(".mobile-nav-toggle");

  const navigation =
    document.querySelector(".main-navigation");

  if (toggle && navigation) {
    toggle.addEventListener("click", function () {

      const isOpen =
        toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle("is-open");

      document.body.classList.toggle("nav-open");

    });
  }


  /* =======================================================
     Cart Drawer
     ======================================================= */

  const cartButton =
    document.querySelector("#cart-button");

  const cartDrawer =
    document.querySelector("#cart-drawer");

  const cartClose =
    document.querySelector("#cart-drawer-close");

  const cartOverlay =
    document.querySelector("#cart-overlay");


  function openCart() {
    if (!cartDrawer || !cartOverlay) {
      return;
    }

    cartDrawer.classList.add("is-open");

    cartDrawer.setAttribute(
      "aria-hidden",
      "false"
    );

    cartButton?.setAttribute(
      "aria-expanded",
      "true"
    );

    cartOverlay.hidden = false;

    requestAnimationFrame(function () {
      cartOverlay.classList.add("is-visible");
    });

    document.body.classList.add("cart-open");
  }


  function closeCart() {
    if (!cartDrawer || !cartOverlay) {
      return;
    }

    cartDrawer.classList.remove("is-open");

    cartDrawer.setAttribute(
      "aria-hidden",
      "true"
    );

    cartButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    cartOverlay.classList.remove("is-visible");

    document.body.classList.remove("cart-open");

    window.setTimeout(function () {
      cartOverlay.hidden = true;
    }, 250);
  }


  cartButton?.addEventListener(
    "click",
    openCart
  );

  cartClose?.addEventListener(
    "click",
    closeCart
  );

  cartOverlay?.addEventListener(
    "click",
    closeCart
  );

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeCart();
      }

    }
  );


  /* =======================================================
     Product Gallery
     ======================================================= */

  const mainImage =
    document.querySelector("#product-main-image");

  const thumbnails =
    document.querySelectorAll(".product-gallery__thumb");

  thumbnails.forEach(function (thumbnail) {

    thumbnail.addEventListener("click", function () {

      const newImage =
        thumbnail.getAttribute("data-image");

      if (mainImage && newImage) {
        mainImage.src = newImage;
      }

      thumbnails.forEach(function (item) {
        item.classList.remove("is-active");
      });

      thumbnail.classList.add("is-active");

    });

  });


  /* =======================================================
     Product Variants
     ======================================================= */

  let selectedColor = null;
  let selectedSize = null;

  const colorButtons =
    document.querySelectorAll(".color-option");

  const sizeButtons =
    document.querySelectorAll(".size-option");


  if (colorButtons.length > 0) {
    selectedColor =
      colorButtons[0].getAttribute("data-value");
  }


  colorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      colorButtons.forEach(function (item) {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      selectedColor =
        button.getAttribute("data-value");

      const label =
        document.querySelector("#selected-color");

      if (label) {
        label.textContent = selectedColor;
      }

    });

  });


  sizeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      sizeButtons.forEach(function (item) {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      selectedSize =
        button.getAttribute("data-value");

      const label =
        document.querySelector("#selected-size");

      if (label) {
        label.textContent = selectedSize;
      }

    });

  });
	let variantSkus = {};

	const skuData =
	  document.querySelector("#product-variant-skus");

	if (skuData) {
	  try {
		variantSkus =
		  JSON.parse(skuData.textContent);
	  } catch (error) {
		console.error(
		  "Unable to parse variant SKUs:",
		  error
		);
	  }
	}

  /* =======================================================
     Product Quantity
     ======================================================= */

  const quantityInput =
    document.querySelector("#product-quantity");

  const quantityMinus =
    document.querySelector("#quantity-minus");

  const quantityPlus =
    document.querySelector("#quantity-plus");


  if (
    quantityInput &&
    quantityMinus &&
    quantityPlus
  ) {

    quantityMinus.addEventListener(
      "click",
      function () {

        let quantity =
          parseInt(quantityInput.value, 10) || 1;

        quantity = Math.max(
          1,
          quantity - 1
        );

        quantityInput.value = quantity;

      }
    );


    quantityPlus.addEventListener(
      "click",
      function () {

        let quantity =
          parseInt(quantityInput.value, 10) || 1;

        quantity = Math.min(
          10,
          quantity + 1
        );

        quantityInput.value = quantity;

      }
    );

  }


  /* =======================================================
     Add To Cart
     ======================================================= */

  const addToCartButton =
    document.querySelector("#add-to-cart");

  const productMessage =
    document.querySelector("#product-message");


  if (addToCartButton) {

    addToCartButton.addEventListener(
      "click",
      function () {

        if (
          sizeButtons.length > 0 &&
          !selectedSize
        ) {

          if (productMessage) {
            productMessage.textContent =
              "Please select a size.";

            productMessage.className =
              "product-message is-error";
          }

          return;
        }

		const selectedSku =
		variantSkus?.[selectedColor]?.[selectedSize] || null;
  
		const product = {

		  productId:
			addToCartButton.dataset.productId,

		  sku:
			selectedSku,

		  title:
			addToCartButton.dataset.productTitle,

		  price:
			parseFloat(
			  addToCartButton.dataset.productPrice
			),

		  url:
			addToCartButton.dataset.productUrl,

		  image:
			addToCartButton.dataset.productImage,

		  color:
			selectedColor,

		  size:
			selectedSize,

		  quantity:
			parseInt(
			  quantityInput?.value || "1",
			  10
			)

		};


        const cart = getCart();

        const productKey =
          getCartItemKey(product);

        const existingItem =
          cart.find(function (item) {
            return (
              getCartItemKey(item) ===
              productKey
            );
          });


		if (existingItem) {

		  existingItem.quantity += product.quantity;

		  // Keep existing cart data synced with current product data
		  existingItem.title = product.title;
		  existingItem.price = product.price;
		  existingItem.image = product.image;
		  existingItem.url = product.url;

		} else {

		  cart.push(product);

}


        saveCart(cart);


        if (productMessage) {
          productMessage.textContent =
            "Added to cart.";

          productMessage.className =
            "product-message is-success";
        }


        openCart();

      }
    );

  }


  /* =======================================================
     Cart Rendering
     ======================================================= */

  function renderCart() {

    const cart = getCart();

    const cartItems =
      document.querySelector("#cart-items");

    const cartEmpty =
      document.querySelector("#cart-empty");

    const cartFooter =
      document.querySelector("#cart-footer");

    const cartSubtotal =
      document.querySelector("#cart-subtotal");

    const cartCount =
      document.querySelector("#cart-count");


    const totalQuantity =
      cart.reduce(function (total, item) {
        return total + item.quantity;
      }, 0);


    if (cartCount) {
      cartCount.textContent =
        totalQuantity;
    }


    if (!cartItems) {
      return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

      if (cartEmpty) {
        cartEmpty.style.display = "flex";
      }

      if (cartFooter) {
        cartFooter.style.display = "none";
      }

      return;
    }


    if (cartEmpty) {
      cartEmpty.style.display = "none";
    }

    if (cartFooter) {
      cartFooter.style.display = "block";
    }


    let subtotal = 0;


    cart.forEach(function (item, index) {

      subtotal +=
        item.price * item.quantity;


      const itemElement =
        document.createElement("div");

      itemElement.className =
        "cart-item";


      const details =
        document.createElement("div");


      const title =
        document.createElement("div");

      title.className =
        "cart-item__title";

      title.textContent =
        item.title;


      const meta =
        document.createElement("div");

      meta.className =
        "cart-item__meta";

      meta.textContent =
        [
          item.color,
          item.size
        ]
          .filter(Boolean)
          .join(" / ");


      const price =
        document.createElement("div");

      price.className =
        "cart-item__price";

      price.textContent =
        formatMoney(
          item.price * item.quantity
        );


      const controls =
        document.createElement("div");

      controls.className =
        "cart-item__controls";


      const quantity =
        document.createElement("div");

      quantity.className =
        "cart-item__quantity";


      const decreaseButton =
        document.createElement("button");

      decreaseButton.type =
        "button";

      decreaseButton.textContent =
        "−";

      decreaseButton.setAttribute(
        "aria-label",
        "Decrease quantity"
      );


      const quantityValue =
        document.createElement("span");

      quantityValue.textContent =
        item.quantity;


      const increaseButton =
        document.createElement("button");

      increaseButton.type =
        "button";

      increaseButton.textContent =
        "+";

      increaseButton.setAttribute(
        "aria-label",
        "Increase quantity"
      );


      decreaseButton.addEventListener(
        "click",
        function () {

          const updatedCart =
            getCart();

          updatedCart[index].quantity -= 1;

          if (
            updatedCart[index].quantity <= 0
          ) {
            updatedCart.splice(index, 1);
          }

          saveCart(updatedCart);

        }
      );


      increaseButton.addEventListener(
        "click",
        function () {

          const updatedCart =
            getCart();

          updatedCart[index].quantity += 1;

          saveCart(updatedCart);

        }
      );


      quantity.append(
        decreaseButton,
        quantityValue,
        increaseButton
      );


      const removeButton =
        document.createElement("button");

      removeButton.type =
        "button";

      removeButton.className =
        "cart-item__remove";

      removeButton.textContent =
        "Remove";


      removeButton.addEventListener(
        "click",
        function () {

          const updatedCart =
            getCart();

          updatedCart.splice(
            index,
            1
          );

          saveCart(updatedCart);

        }
      );


      controls.append(
        quantity,
        removeButton
      );


      details.append(
        title,
        meta,
        price,
        controls
      );
		const imageWrap =
		  document.createElement("a");

		imageWrap.className =
		  "cart-item__image";

		imageWrap.href =
		  item.url;

		const image =
		  document.createElement("img");

		image.src =
		  item.image || "";

		image.alt =
		  item.title;

		imageWrap.append(image);

		itemElement.append(
		  imageWrap,
		  details
		);

      cartItems.append(itemElement);

    });


    if (cartSubtotal) {
      cartSubtotal.textContent =
        formatMoney(subtotal);
    }

  }


  /* =======================================================
     Checkout Placeholder
     ======================================================= */

  const checkoutButton =
    document.querySelector("#checkout-button");

	checkoutButton?.addEventListener(
	  "click",
	  function () {

		const cart = getCart();

		if (
		  window.JekyllCommerceCheckout &&
		  typeof window.JekyllCommerceCheckout.start === "function"
		) {
		  const checkoutEmail =
		document.querySelector("#checkout-email");

		const email =
		  checkoutEmail?.value.trim() || "";

		if (!email) {
		  alert("Please enter your email.");
		  checkoutEmail?.focus();
		  return;
		}

		if (!checkoutEmail.checkValidity()) {
		  alert("Please enter a valid email address.");
		  checkoutEmail.focus();
		  return;
		}

		window.JekyllCommerceCheckout.start(
		  cart,
		  email
		);
		}

	  }
	);


  /* =======================================================
     Initial Render
     ======================================================= */

  renderCart();

});