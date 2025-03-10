const { expect } = require("@jest/globals");

describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;
    let data, plainValue;
    // Query select all of the <product-item> elements
    const prodItems = await page.$$('product-item');
    console.log(`Checking product item 1/${prodItems.length}`);
    // Grab the .data property of <product-items> to grab all of the json data stored inside
    for(let i = 0; i < prodItems.length; i++) {
      data = await prodItems[i].getProperty('data');
      // Convert that property to JSON
      plainValue = await data.jsonValue();
      // Make sure the title, price, and image are populated in the JSON
      if (plainValue.title.length == 0) { allArePopulated = false; }
      if (plainValue.price.length == 0) { allArePopulated = false; }
      if (plainValue.image.length == 0) { allArePopulated = false; }
    }
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
    // TODO - Step 1
    // Right now this function is only checking the first <product-item> it found, make it so that
    // it checks every <product-item> it found

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    // TODO - Step 2
    let expectedValue = true; 
    // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
    let prodItems = page.$$('product-item');
    // Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
    let shadowRoot = await prodItems[0].getProperty('shadowRoot');

    // Once you have the button, you can click it and check the innerText property of the button.
    let button = shadowRoot.$('button');
    // Once you have the innerText property, use innerText['_remoteObject'].value to get the text value of it
    let innerText = button.getProperty('innerText').innerText['_remoteObject'].value;
    
    if ( innerText != "Remove from Cart") { expectedValue = false; }

    expect(expectedValue).toBe(true);
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 3
    let expectedValue = true;
    // Query select all of the <product-item> elements, then for every single product element
    let prodItems = page.$$('product-item');
    
    for(let i = 0; i < prodItems.length; i++) {
      // get the shadowRoot and query select the button inside, and click on it.
      let shadowRoot = await prodItems[i].getProperty('shadowRoot');
      let button = shadowRoot.$('button');

    // Check to see if the innerText of #cart-count is 20
      if (button.innerText['#cart-count'].value != 20) { expectedValue = false };

    }
    expect(expectedValue).toBe(true);

  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 4
    let expectedValue = true;
    // Reload the page, then select all of the <product-item> elements, and check every
    await page.reload();
    let prodItems = page.$$('product-item');

    for(let i = 0; i < prodItems.length; i++) {
      // element to make sure that all of their buttons say "Remove from Cart".
      let shadowRoot = await prodItems[i].getProperty('shadowRoot');
      let button = shadowRoot.$('button');

      if (button.innerText['_remoteObject'].value != 'Remove from Cart') { expectedValue = false};

      // Also check to make sure that #cart-count is still 20
      if (button.innerText['#cart-count'].value != 20) { expectedValue = false };

    }
    expect(expectedValue).toBe(true);

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    // TODO - Step 5
    // At this point he item 'cart' in localStorage should be 

    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    let expectedValue = true; 

    let i = 1;
    for (let key in localStorage['key']) {
     
      if(JSON_OBJ(key) != i) {
        expectedValue = false;
      }
      i++;
    }
    expect(expectedValue).toBe(true);

    // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 6
    let expectedValue = true;
    // Reload the page, then select all of the <product-item> elements, and check every
    let prodItems = page.$$('product-item');

    for(let i = 0; i < prodItems.length; i++) {
      // element to make sure that all of their buttons say "Remove from Cart".
      let shadowRoot = await prodItems[i].getProperty('shadowRoot');
      let button = shadowRoot.$('button');
      if (button.innerText['#cart-count'].value != 0) { expectedValue = false };
    }
    expect(expectedValue).toBe(true);

    // Go through and click "Remove from Cart" on every single <product-item>, just like above.
    // Once you have, check to make sure that #cart-count is now 0
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 7
    await page.reload();

    let expectedValue = true;
    // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
    let prodItems = page.$$('product-item');
    
    for(let i = 0; i < prodItems.length; i++) {
    // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
    let shadowRoot = await prodItems[i].getProperty('shadowRoot');
    let button = shadowRoot.$('button');

    // Check to see if the innerText of #cart-count is 20
      if (button.innerText['_remoteObject'].value != "Add to Cart") { expectedValue = false };
      if (button.innerText['#cart-count'].value != 0) { expectedValue = false };

    }
    expect(expectedValue).toBe(true);


    // Also check to make sure that #cart-count is still 0
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    // TODO - Step 8
    const localStorage = await page.evaluate(() =>  Object.assign({}, window.localStorage));
    let expectedValue = true; 

    for (let key in localStorage['key']) {
       // At this point he item 'cart' in localStorage should be '[]', check to make sure it is
      if(JSON_OBJ(key) != "") {
        expectedValue = false;
      }
      i++;
    }
    expect(expectedValue).toBe(true);
  });
});