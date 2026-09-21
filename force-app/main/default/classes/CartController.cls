public with sharing class CartController { 
    @AuraEnabled(cacheable=true)
    public static CartWrapper getOpenCart(Id ownerId) {
        // Query to fetch the open cart
        Cart__c cart = [
            SELECT Id, Name,  
            (SELECT Product__r.Name, Quantity__c, Total_Amount__c, Amount__c 
             FROM Cart_Items__r) 
            FROM Cart__c 
            WHERE OwnerId = :ownerId AND Status__c = 'Open'
            LIMIT 1
        ];
        // Creating a wrapper to hold the cart and product information explicitly
        CartWrapper wrapper = new CartWrapper();
        wrapper.cartId = cart.Id;
        wrapper.cartName = cart.Name;
        wrapper.totalAmount = 0; // Initialize totalAmount
        wrapper.totalQuantity = 0; // Initialize totalQuantity
        // Loop through cart items and extract product name
        wrapper.cartItems = new List<CartItemWrapper>();
        if (cart.Cart_Items__r != null) {
            for (Cart_Item__c item : cart.Cart_Items__r) {
                CartItemWrapper itemWrapper = new CartItemWrapper();
                itemWrapper.id = item.Id; 
                itemWrapper.productName = item.Product__r.Name; // Explicitly assigning product name
                itemWrapper.quantity = item.Quantity__c;
                itemWrapper.totalAmount = item.Total_Amount__c;
                itemWrapper.amount = item.Amount__c;
                wrapper.cartItems.add(itemWrapper);
                // Accumulate total amounts and quantities
                wrapper.totalAmount += item.Total_Amount__c; // Sum total amount
                wrapper.totalQuantity += item.Quantity__c; // Sum total quantity
            }
        }
        return wrapper;
    }
    // Wrapper class to hold the cart and cart item data
    public class CartWrapper {
        @AuraEnabled public String cartId;
        @AuraEnabled public String cartName;
        @AuraEnabled public Decimal totalAmount; // Total amount added
        @AuraEnabled public Decimal totalQuantity; // Total quantity added
        @AuraEnabled public List<CartItemWrapper> cartItems;
    }
    public class CartItemWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public Decimal totalAmount;
        @AuraEnabled public Decimal amount;
    }
    @AuraEnabled
    public static void updateCartItemQuantity(Id cartItemId, Integer newQuantity) {
        try {
            // Fetch the Cart Item record
            Cart_Item__c cartItem = [SELECT Id, Quantity__c FROM Cart_Item__c WHERE Id = :cartItemId LIMIT 1];
            cartItem.Quantity__c = newQuantity; // Update quantity
            update cartItem; // Save changes
        } catch (Exception e) {
            // Log the error message
            System.debug('Error updating cart item quantity: ' + e.getMessage());
            throw new AuraHandledException('Could not update the quantity. Please try again.'); // Custom error message
        }
    }
    @AuraEnabled
    public static void deleteCartItem(Id cartItemId) {
        try{
            Cart_Item__c cartItem = [SELECT Id FROM Cart_Item__c WHERE Id = :cartItemId LIMIT 1];
            delete cartItem; // Delete the cart item
        }
        catch (QueryException e) {
            throw new AuraHandledException('Item not found: ' + e.getMessage());
        }
    }
}