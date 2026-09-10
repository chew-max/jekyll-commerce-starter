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


        const data =
          await response.json();


		if (!response.ok) {
		  throw new Error(
			data.message ||
			"Checkout could not be created."
		  );
		}

        if (
          data.checkoutUrl
        ) {
          window.location.href =
            data.checkoutUrl;

          return;
        }


        throw new Error(
          "Checkout URL was not returned."
        );


      } catch (error) {
        console.error(
          "Checkout error:",
          error
        );


        this.showError(
          error.message ||
          "Checkout is temporarily unavailable."
        );


        if (button) {
          button.disabled =
            false;

          button.textContent =
            "Checkout";
        }
      }
    }
};