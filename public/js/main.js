let cart = [],
    products = [];

let productsSource = document.getElementById('products-template').innerHTML,
    productsTemplate = Handlebars.compile(productsSource),
    productsPlaceholder = document.getElementById('products');

let cartSource = document.getElementById('cart-template').innerHTML,
        cartTemplate = Handlebars.compile(cartSource),
        cartPlaceholder = document.getElementById('cart');

function callAPI (endpoint, callback) {
   let xhr = new XMLHttpRequest();

   try {
      xhr.open("GET", "/api/" + endpoint, true);
      xhr.send();
    } catch (e) {
      console.log("Error: " + e);
    };

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
        callback(this);
      } else {
        console.log("No repsonse from server.");
      }
    }
}

function loadProducts() {
  var callback = function(xhr) {
          products = JSON.parse(xhr.responseText);
          loadCart();
  };
  callAPI("products", callback);
}

function loadCart() {
  var callback = function(xhr) {
        cart = JSON.parse(xhr.responseText);
        cartPlaceholder.innerHTML = cartTemplate(cart);
        initializeCart();
        addHandlers();
  };
  callAPI("cart", callback);
}

function initializeCart(){
  let cartSkus = [];

  //get all the skus of items in the cart
  for (var i=0; i<cart.length; i++){
    cartSkus.push(cart[i].Sku)
  }

  //figure out what's in the cart
  products.map(function(x) {
    if (cartSkus.indexOf(x.Sku) !== -1) {x.InCart = true;}
  });

  //update the DOM
  productsPlaceholder.innerHTML = productsTemplate(products);
}

function addHandlers(){

  function getSkus(e) {
      let item = e.target.getAttribute('data-sku');
      let el = products.filter(function(x){ return x.Sku == item});
      return el;
  }

  function updateDOM() {
      productsPlaceholder.innerHTML = productsTemplate(products);
      cartPlaceholder.innerHTML = cartTemplate(cart);
      addHandlers();
  }

  // add the "Add to Cart" event handlers
  let x = document.getElementsByClassName('btn-success');

  for(var i=0; i<x.length; i++){
    x[i].addEventListener("click", function(e){
      var el = getSkus(e);
      el[0].InCart = true;
      cart.push(el[0]);
      updateDOM();
    });
  };

  // add the "Remove from Cart" event handlers
  let y = document.getElementsByClassName('btn-danger');

  for(var i=0; i<y.length; i++){
    y[i].addEventListener("click", function(e){
       var el = getSkus(e);

       for(var i = 0; i < cart.length; i++) {
           var cartItem = cart[i];
           if (cartItem.Sku == el[0].Sku) {
                  cart.splice(i, 1);
           }
        }
      el[0].InCart = false;
      updateDOM();
    });
  };
}

loadProducts();
