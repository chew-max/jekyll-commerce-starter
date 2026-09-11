window.JekyllCommerceCheckout = {
  endpoint:
    window.JekyllCommerceConfig
      ?.checkoutEndpoint || "",


  getFieldValue:
    function (id) {
      const element =
        document.getElementById(
          id
        );

      if (!element) {
        return "";
      }

      return element.value
        .trim();
    },


  showError:
    function (message) {
      const errorElement =
        document.getElementById(
          "checkout-error"
        );

      if (!errorElement) {
        alert(message);
        return;
      }

      errorElement.textContent =
        message;

      errorElement.hidden =
        false;

      /*
       * Bring the error into view,
       * especially on mobile.
       */
      try {
        errorElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } catch (error) {
        /*
         * Older browsers may not
         * support scrollIntoView options.
         */
      }
    },


  clearError:
    function () {
      const errorElement =
        document.getElementById(
          "checkout-error"
        );

      if (!errorElement) {
        return;
      }

      errorElement.textContent =
        "";

      errorElement.hidden =
        true;
    },


  validateCustomer:
    function () {
      this.clearError();


      const name =
        this.getFieldValue(
          "checkout-name"
        );

      const email =
        this.getFieldValue(
          "checkout-email"
        );

      const phone =
        this.getFieldValue(
          "checkout-phone"
        );

      const address1 =
        this.getFieldValue(
          "checkout-address1"
        );

      const address2 =
        this.getFieldValue(
          "checkout-address2"
        );

      const city =
        this.getFieldValue(
          "checkout-city"
        );

      const state =
        this.getFieldValue(
          "checkout-state"
        );

      const postalCode =
        this.getFieldValue(
          "checkout-postal-code"
        );

      const country =
        this.getFieldValue(
          "checkout-country"
        );


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const zipPattern =
        /^\d{5}(-\d{4})?$/;


      if (!name) {
        this.showError(
          "Please enter your full name."
        );

        return null;
      }


      if (
        !emailPattern.test(
          email
        )
      ) {
        this.showError(
          "Please enter a valid email address."
        );

        return null;
      }


      if (!address1) {
        this.showError(
          "Please enter your shipping address."
        );

        return null;
      }


      if (!city) {
        this.showError(
          "Please enter your city."
        );

        return null;
      }


      if (!state) {
        this.showError(
          "Please select your state."
        );

        return null;
      }


      if (
        !zipPattern.test(
          postalCode
        )
      ) {
        this.showError(
          "Please enter a valid ZIP code."
        );

        return null;
      }


      if (
        country !== "US"
      ) {
        this.showError(
          "Only United States shipping is currently supported."
        );

        return null;
      }


      return {
        email:
          email,

        customer: {
          name:
            name,

          phone:
            phone,

          shipping: {
            address1:
              address1,

            address2:
              address2,

            city:
              city,

            state:
              state,

            postalCode:
              postalCode,

            country:
              country
          }
        }
      };
    },


  getCheckoutErrorMessage:
    function (
      response,
      data
    ) {
      const status =
        Number(
          response?.status || 0
        );

      const code =
        String(
          data?.code ||
          data?.errorCode ||
          data?.error ||
          ""
        )
          .trim()
          .toLowerCase();

      const rawMessage =
        String(
          data?.message || ""
        )
          .trim();

      const combined =
        (
          code +
          " " +
          rawMessage
        )
          .toLowerCase();


      /*
       * Unavailable product / variant.
       *
       * Supports both future structured
       * error codes and the existing
       * human-readable backend messages.
       */
      if (
        combined.includes(
          "unavailable"
        ) ||
        combined.includes(
          "not available"
        ) ||
        combined.includes(
          "unfulfillable"
        ) ||
        combined.includes(
          "not fulfillable"
        ) ||
        combined.includes(
          "variant_not_available"
        ) ||
        combined.includes(
          "product_not_available"
        ) ||
        combined.includes(
          "sku_not_available"
        )
      ) {
        return (
          "One or more items in your cart are no longer available. " +
          "Please review your cart, remove or change the unavailable item, and try checkout again."
        );
      }


      /*
       * Unknown or invalid SKU/product.
       *
       * This can happen if the storefront
       * is stale relative to the backend
       * catalog.
       */
      if (
        combined.includes(
          "unknown sku"
        ) ||
        combined.includes(
          "invalid sku"
        ) ||
        combined.includes(
          "sku not found"
        ) ||
        combined.includes(
          "unknown product"
        ) ||
        combined.includes(
          "product not found"
        )
      ) {
        return (
          "One or more items in your cart could not be verified. " +
          "Please remove the affected item and add it again from the shop."
        );
      }


      /*
       * Quantity validation.
       */
      if (
        combined.includes(
          "quantity"
        ) &&
        (
          combined.includes(
            "maximum"
          ) ||
          combined.includes(
            "max"
          ) ||
          combined.includes(
            "limit"
          ) ||
          combined.includes(
            "invalid"
          )
        )
      ) {
        return (
          "One or more cart quantities need to be adjusted before checkout. " +
          "Please review your cart and try again."
        );
      }


      /*
       * Customer-address validation.
       */
      if (
        status === 400 &&
        (
          combined.includes(
            "address"
          ) ||
          combined.includes(
            "postal"
          ) ||
          combined.includes(
            "zip"
          ) ||
          combined.includes(
            "shipping"
          )
        )
      ) {
        return (
          "We couldn't verify the shipping information for this order. " +
          "Please review your address and try again."
        );
      }


      /*
       * Rate limiting.
       */
      if (status === 429) {
        return (
          "Checkout is receiving a lot of requests right now. " +
          "Please wait a moment and try again."
        );
      }


      /*
       * Server/provider outage.
       */
      if (status >= 500) {
        return (
          "Checkout is temporarily unavailable. " +
          "Your cart has been preserved. Please wait a moment and try again."
        );
      }


      /*
       * Safe generic client-side response.
       *
       * We intentionally do not display
       * arbitrary backend error text here.
       */
      if (
        status >= 400 &&
        status < 500
      ) {
        return (
          "We couldn't start checkout with the current cart. " +
          "Please review your items and shipping information, then try again."
        );
      }


      return (
        "Checkout could not be created. " +
        "Your cart has been preserved so you can try again."
      );
    },


  start:
    async function (cart) {
      if (
        !Array.isArray(
          cart
        ) ||
        cart.length === 0
      ) {
        this.showError(
          "Your cart is empty."
        );

        return;
      }


      if (!this.endpoint) {
        console.log(
          "Checkout cart:",
          cart
        );

        this.showError(
          "Checkout provider has not been configured yet."
        );

        return;
      }


      const customer =
        this.validateCustomer();


      if (!customer) {
        return;
      }


      const button =
        document.getElementById(
          "checkout-button"
        );


      if (button) {
        button.disabled =
          true;

        button.textContent =
          "Opening Checkout...";
      }


      try {
        const response =
          await fetch(
            this.endpoint,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"
              },

              body:
                JSON.stringify({
                  email:
                    customer.email,

                  customer:
                    customer.customer,

                  items:
                    cart.map(
                      function (
                        item
                      ) {
                        return {
                          productId:
                            item.productId,

                          sku:
                            item.sku,

                          quantity:
                            item.quantity
                        };
                      }
                    )
                })
            }
          );


        let data = {};

        try {
          data =
            await response.json();
        } catch (error) {
          /*
           * A Worker or upstream provider
           * may occasionally return HTML,
           * plain text, or an empty body.
           */
          data = {};
        }


        if (!response.ok) {
          const checkoutError =
            new Error(
              this.getCheckoutErrorMessage(
                response,
                data
              )
            );

          checkoutError.status =
            response.status;

          throw checkoutError;
        }


        if (
          data &&
          typeof data.checkoutUrl ===
            "string" &&
          data.checkoutUrl.trim()
        ) {
          window.location.href =
            data.checkoutUrl;

          return;
        }


        throw new Error(
          "Checkout could not be started. Your cart has been preserved so you can try again."
        );


      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );


        /*
         * fetch() rejects for network-level
         * problems such as offline state,
         * DNS failure, or connection failure.
         */
        if (
          !navigator.onLine
        ) {
          this.showError(
            "You're offline. Reconnect to the internet and try checkout again."
          );
        } else {
          this.showError(
            error?.message ||
            "Checkout is temporarily unavailable. Your cart has been preserved."
          );
        }


        if (button) {
          button.disabled =
            false;

          button.textContent =
            "Checkout";
        }
      }
    }
};