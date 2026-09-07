window.JekyllCommerceCheckout = {

  start: function (cart) {

    if (!Array.isArray(cart) || cart.length === 0) {
      return;
    }

    console.log(
      "Checkout adapter received:",
      cart
    );

    alert(
      "Checkout provider not connected yet."
    );

  }

};