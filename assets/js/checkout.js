window.JekyllCommerceCheckout = {

endpoint:
  window.JekyllCommerceConfig
    ?.checkoutEndpoint || "",

  start: async function (cart, email) {

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
		
		if (!this.endpoint) {

		  console.log(
			"Checkout cart:",
			cart
		  );

		  alert(
			"Checkout provider has not been configured yet."
		  );

		  return;
		}

      const response = await fetch(
        this.endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

		body: JSON.stringify({
		  email: email,

		  items: cart.map(function (item) {
			return {
			  productId: item.productId,
			  sku: item.sku,
			  quantity: item.quantity
			};
		  })
		})
        }
      );

      if (!response.ok) {
        throw new Error(
          "Checkout request failed."
        );
      }

      const data =
        await response.json();

      if (data.checkoutUrl) {

        window.location.href =
          data.checkoutUrl;

        return;
      }

      console.log(
        "Checkout response:",
        data
      );

      alert(
        "Checkout backend is connected, but no payment provider is configured yet."
      );

    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Checkout is temporarily unavailable."
      );

    }

  }

};