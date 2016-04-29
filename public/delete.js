let cart = [];
let products = [];

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
        productsPlaceholder.innerHTML =
           productsTemplate(JSON.parse(this.responseText));
        console.log(products);
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
        cartPlaceholder.innerHTML =
           cartTemplate(JSON.parse(this.responseText));
      } else {
        console.log("No repsonse from server.");
      }
    }
}


loadCart();
loadProducts();
