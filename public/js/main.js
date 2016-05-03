let cart = [],
    products = [];

let productsSource = document.getElementById('products-template').innerHTML,
    productsTemplate = Handlebars.compile(productsSource),
    productsPlaceholder = document.getElementById('products');

let cartSource = document.getElementById('cart-template').innerHTML,
        cartTemplate = Handlebars.compile(cartSource),
        cartPlaceholder = document.getElementById('cart');

function loadProducts() {
   let xhr = new XMLHttpRequest();

   try {
      xhr.open("GET", "/api/products", true);
      xhr.send();
    } catch (e) {
      console.log("Error: " + e);
    };

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
        products = JSON.parse(this.responseText);
        loadCart();
      } else {
        console.log("No repsonse from server.");
      }
    }
}

function loadCart() {
  let xhr = new XMLHttpRequest();

   try {
      xhr.open("GET", "/api/cart", true);
      xhr.send();
    } catch (e) {
      console.log("Error: " + e);
    };

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
        cart = JSON.parse(this.responseText);
        cartPlaceholder.innerHTML = cartTemplate(cart);
        initializeCart();
        addHandlers();
      } else {
        console.log("No repsonse from server.");
      }
    }
}

function initializeCart(){
  let cartSkus = [];

  //get all the skus of items in the cart
  for (var i=0; i<cart.length; i++){
    cartSkus.push(cart[i].Sku)
  }

  //figure out what's in the cart
  _.map(products, function(x) {
    if (_.indexOf(cartSkus, x.Sku) !== -1) {x.InCart = true;}
  });

  //update the DOM
  productsPlaceholder.innerHTML = productsTemplate(products);
}

function addHandlers(){
  // add the "Add to Cart" event handlers
  let x = document.getElementsByClassName('btn-success');

  for(var i=0; i<x.length; i++){
    x[i].addEventListener("click", function(){
      let item = this.getAttribute('data-sku');

      let el = _.find(products, function(x){ return x.Sku == item});
      el.InCart = true;
      cart.push(el);

      productsPlaceholder.innerHTML = productsTemplate(products);
      cartPlaceholder.innerHTML = cartTemplate(cart);
      addHandlers();
    });
  };

  // add the "Remove from Cart" event handlers
  let y = document.getElementsByClassName('btn-danger');

  for(var i=0; i<y.length; i++){
    y[i].addEventListener("click", function(){
      let item = this.getAttribute('data-sku');

      let el = _.find(products, function(x){ return x.Sku == item});
      _.remove(cart, function(x) {return x.Sku == el.Sku});
      el.InCart = false;

      productsPlaceholder.innerHTML = productsTemplate(products);
      cartPlaceholder.innerHTML = cartTemplate(cart);
      addHandlers();
    });
  };
}

loadProducts();
