# MenAccessoriesProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Products server

Run `json-server --watch db.json` in "D:\Programming\Angular\Men-Accessories_project\src\assets\Server>" for start json server.

## UI

All pages in this app are adapted for devices of any width.

# Header

Header is also adaptive.

# Home Page

The ***Home Page*** was written in pure Html and Scss.
without using any library.
The design of this page was taken from here: 'https://www.figma.com/file/WJBuEvfM1ndPzd2dBNqSI5/%D0%B0%D0%BA%D1%81%D0%B5%D1%81%D1%81%D1%83%D0%B0%D1%80%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD?type=design&node-id=0-1';

# Products Page

The ***Products Page*** was written in Html and Scss, with using Bootstrap & Angular Material Components.
.
At the top there are search and filter fields that work both separately and together.
There is also an "Add Product" button that opens a pop-up window to add or edit a product.
.
After the search container comes the products container.
Product container includes product cards.
.
The product card contains its picture, clicking on which the user goes to the page of this product, where there is a detailed description of it and an image slider.
After the picture in the card is the name of the product, brand, price and a brief description.
And at the very bottom of the card there is an action field with an *edit/delete* button (which is available only to the user who added this product), *add to cart* button and *buy button*.

# Product Details Page

The ***Product Details Page*** was written in Html and Scss, with using Bootstrap & Angular Material Components.
.
*Poduct Detail* has a same functionality as the *Products* page.
There is all about product. There is also an action field, with the above buttons.

# Cart Page

The ***Cart Page*** was written in Html and Scss, with using Bootstrap & Angular Material Components(Mat-Table).

All added products are visible here.
The user can reduce or add the quantity of goods. and find out the total price of this product, as well as the total cost of the cart.
The user can buy, remove items from the cart. just one or all together

