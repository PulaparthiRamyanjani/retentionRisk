public with sharing class NewCartController {
    @AuraEnabled
    public static void addToCart(Id productId, Integer quantity) {
        try {
            // Fetch the Contact ID linked to the current User (assuming it exists)
            Contact userContact = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
 
            // Fetch the current user's open cart (if any)
            List<Cart__c> userCartList = [SELECT Id, Status__c FROM Cart__c WHERE Customer__c = :userContact.Id AND Status__c = 'Open' LIMIT 1];
            Cart__c userCart;
 
            // If no open cart exists, create a new one
            if (userCartList.isEmpty()) {
                userCart = new Cart__c();
                userCart.Customer__c = userContact.Id; // Link to current user's contact
                userCart.OwnerId = UserInfo.getUserId(); // Set current user as owner
                userCart.Status__c = 'Open'; // Set status to 'Open'
                insert userCart;
            } else {
                userCart = userCartList[0];
            }
 
            // Fetch the price from the Product2 object
            Decimal listPrice = [SELECT Selling_Price__c FROM Product2 WHERE Id = :productId LIMIT 1].Selling_Price__c;
 
            // Calculate the amount for the cart item (ListPrice__c * quantity)
            Decimal amount = listPrice * quantity;
 
            // Add or update the item in the cart (to prevent duplicates)
            List<Cart_Item__c> existingCartItems = [SELECT Id, Quantity__c, List_Price__c
                                                     FROM Cart_Item__c
                                                     WHERE Cart__c = :userCart.Id AND Product__c = :productId];
 
            if (existingCartItems.isEmpty()) {
                // Add a new item to the cart
                Cart_Item__c cartItem = new Cart_Item__c();
                cartItem.Product__c = productId;
                cartItem.Quantity__c = quantity;
                cartItem.Cart__c = userCart.Id;
                cartItem.List_Price__c = listPrice; // Set the list price
                cartItem.Amount__c = amount; // Set the total amount
                insert cartItem;
            } else {
                // Update the existing cart item quantity and amount
                Cart_Item__c existingItem = existingCartItems[0];
                existingItem.Quantity__c += quantity;
                existingItem.Amount__c = existingItem.List_Price__c * existingItem.Quantity__c;
                update existingItem;
            }
 
        } catch (Exception e) {
            System.debug('Error in addToCart: ' + e.getMessage());
            throw new AuraHandledException('Error adding product to cart: ' + e.getMessage());
        }
    }
 
 
 
 
     
      @AuraEnabled(cacheable=true)
      public static CartData getCartItems() {
          // Fetch the Contact associated with the current user based on the email
          List<Contact> contactList = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
   
         
          if (contactList.isEmpty()) {
              throw new AuraHandledException('No contact found for the logged-in user.');
          }
         
          Contact currentContact = contactList[0];
     
          // Fetch ALL 'Open' Carts associated with that Contact
          List<Cart__c> cartList = [SELECT Id,DiscountedAmount__c FROM Cart__c WHERE Customer__c = :currentContact.Id AND Status__c = 'Open'];
     
          if (cartList.isEmpty()) {
              throw new AuraHandledException('No open carts found for the current contact.');
          }
         
          // Assuming you want to get the first open cart's Id
          Id cartId = cartList[0].Id;
          Decimal discountedAmount = cartList[0].DiscountedAmount__c;
     
          // Fetch Cart Items for the open cart
          List<Cart_Item__c> cartItems = [SELECT Id, Product__c, Quantity__c, List_Price__c, Product__r.Name
                                             FROM Cart_Item__c
                                             WHERE Cart__c = :cartId];
     
          return new CartData(cartItems, cartId,discountedAmount);
      }
     
 
 
   
      @AuraEnabled
      public static void removeFromCart(Id cartItemId) {
          try {
              // Query for the Cart_Items__c record to ensure it exists
              Cart_Item__c itemToRemove = [SELECT Id FROM Cart_Item__c WHERE Id = :cartItemId LIMIT 1];
 
              // Delete the item
              delete itemToRemove;
 
          } catch (Exception e) {
              System.debug('Error removing item from cart: ' + e.getMessage());
              throw new AuraHandledException('Error removing item from cart: ' + e.getMessage());
          }
      }
 
      @AuraEnabled
    public static void updateCartItemQuantity(Id cartItemId, Integer newQuantity) {
        try {
            System.debug('Updating quantity for cartItemId: ' + cartItemId);
            System.debug('New quantity: ' + newQuantity);
           
            // Validate that the newQuantity is greater than 0
            if (newQuantity == null || newQuantity <= 0) {
                throw new AuraHandledException('Invalid quantity: ' + newQuantity);
            }
 
            // Fetch the cart item from the database
            Cart_Item__c cartItem = [SELECT Id, List_Price__c, Quantity__c FROM Cart_Item__c WHERE Id = :cartItemId LIMIT 1];
            System.debug('Fetched cart item: ' + cartItem);
 
            // Update the quantity and recalculate the amount
            cartItem.Quantity__c = newQuantity;
            cartItem.Amount__c = cartItem.List_Price__c * newQuantity;
            update cartItem;
 
            System.debug('Cart item updated successfully');
        } catch (Exception e) {
            System.debug('Error updating cart item quantity: ' + e.getMessage());
            throw new AuraHandledException('Error updating cart item quantity: ' + e.getMessage());
        }
    }
 
 
    @AuraEnabled
    public static String applyCoupon(String couponCode, Id cartId) {
        try {
           
           
            // Fetch the cart
            Cart__c cart = [SELECT Id, DiscountedAmount__c FROM Cart__c WHERE Id = :cartId LIMIT 1];
           
   
            // Fetch the coupon based on the code
            Coupon__c coupon = [SELECT Id, Expiry_Date__c, Expired__c, Remaining_Quantity__c, Type__c, DiscountFlat__c, DiscountPercentage__c
                                 FROM Coupon__c
                                 WHERE Name = :couponCode
                                 AND Expired__c = false
                                 AND Expiry_Date__c >= TODAY
                                 LIMIT 1];
           
   
            // Check if coupon is null
            if (coupon == null) {
                throw new AuraHandledException('Invalid or expired coupon.');
            }
   
            // Fetch product-specific offers tied to this coupon
            List<Product_Offer__c> productOffers = [SELECT Product__c, Discount__c
                                                      FROM Product_Offer__c
                                                      WHERE Discount__c = :coupon.Id];
           
   
            if (productOffers.isEmpty()) {
                throw new AuraHandledException('This coupon does not apply to any products in your cart.');
            }
   
            // Fetch the cart items
            List<Cart_Item__c> cartItems = [SELECT Id, Product__c, Quantity__c, List_Price__c
                                              FROM Cart_Item__c
                                              WHERE Cart__c = :cart.Id];
           
   
            Decimal totalDiscount = 0;
            for (Cart_Item__c item : cartItems) {
                for (Product_Offer__c offer : productOffers) {
                    if (offer.Product__c == item.Product__c) {
                        if (coupon.Type__c == 'Percentage' && coupon.DiscountPercentage__c != null) {
                            totalDiscount += (item.List_Price__c * (coupon.DiscountPercentage__c / 100));
                        } else if (coupon.Type__c == 'Flat') {
                            totalDiscount += coupon.DiscountFlat__c;
                        }
                    }
                }
            }
   
            if (totalDiscount == 0) {
                throw new AuraHandledException('No applicable discount for products in your cart.');
            }
   
            cart.DiscountedAmount__c = totalDiscount;
            update cart;
   
            return 'Coupon applied successfully! Discount Amount: ' + totalDiscount;
   
        } catch (Exception e) {
            System.debug('Error applying coupon: ' + e.getMessage());
            throw new AuraHandledException('Error applying coupon: ' + e.getMessage());
        }
    }
   
    @AuraEnabled
public static String removeCoupon(Id cartId) {
    try {
        // Fetch the cart
        Cart__c cart = [SELECT Id, DiscountedAmount__c FROM Cart__c WHERE Id = :cartId LIMIT 1];
 
        if (cart == null) {
            throw new AuraHandledException('Cart not found.');
        }
 
        // Set the discount field back to 0 or null
        cart.DiscountedAmount__c = null; // Reset the discounted amount
        update cart;
 
        return 'Coupon removed successfully!';
    } catch (Exception e) {
        System.debug('Error removing coupon: ' + e.getMessage());
        throw new AuraHandledException('Error removing coupon: ' + e.getMessage());
    }
}
public class CartData {
    @AuraEnabled public List<Cart_Item__c> cartItems { get; set; }
    @AuraEnabled public Id cartId { get; set; }
    @auraEnabled public Decimal discountedAmount { get; set; }
    public CartData(List<Cart_Item__c> cartItems, Id cartId, Decimal discountedAmount) {
        this.cartItems = cartItems;
        this.cartId = cartId;
        this.discountedAmount= discountedAmount;
    }
}      
}