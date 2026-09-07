document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     Mobile Navigation
     ======================================================= */

  const toggle = document.querySelector(".mobile-nav-toggle");
  const navigation = document.querySelector(".main-navigation");

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

    const defaultColor =
      colorButtons[0].getAttribute("data-value");

    selectedColor = defaultColor;

  }


  colorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      colorButtons.forEach(function (item) {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      selectedColor =
        button.getAttribute("data-value");

      const selectedColorLabel =
        document.querySelector("#selected-color");

      if (selectedColorLabel) {
        selectedColorLabel.textContent =
          selectedColor;
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

      const selectedSizeLabel =
        document.querySelector("#selected-size");

      if (selectedSizeLabel) {
        selectedSizeLabel.textContent =
          selectedSize;
      }

    });

  });


  /* =======================================================
     Quantity
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

        quantity = Math.max(1, quantity - 1);

        quantityInput.value = quantity;

      }
    );


    quantityPlus.addEventListener(
      "click",
      function () {

        let quantity =
          parseInt(quantityInput.value, 10) || 1;

        quantity = Math.min(10, quantity + 1);

        quantityInput.value = quantity;

      }
    );

  }


  /* =======================================================
     Add To Cart - V1
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


        const product = {

          title:
            addToCartButton.dataset.productTitle,

          price:
            parseFloat(
              addToCartButton.dataset.productPrice
            ),

          url:
            addToCartButton.dataset.productUrl,

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


        console.log(
          "Product ready for cart:",
          product
        );


        if (productMessage) {

          productMessage.textContent =
            "Added to cart.";

          productMessage.className =
            "product-message is-success";

        }

      }
    );

  }

});