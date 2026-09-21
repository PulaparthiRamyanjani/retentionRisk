public class AddToCartController {
   @AuraEnabled
    public static void addToCart(String productId, Integer quantity) {
        // Assuming your user ID for testing is '005xxxxxxxxxxxx'
        Id ownerId = '005GC00000lBgEIYA0';  // Replace with your actual User ID
 
        // Fetch the active cart for the current user (based on CreatedById for testing)
        Cart__c activeCart = [SELECT Id FROM Cart__c WHERE Status__c = 'Open' AND CreatedById = :ownerId LIMIT 1];
 
        if (activeCart == null) {
            throw new AuraHandledException('No active cart found for the current user.');
        }
 
        // Check if the product is already in the cart
        Cart_Item__c cartItem = [SELECT Id, Quantity__c FROM Cart_Item__c 
                                 WHERE Cart__c = :activeCart.Id 
                                 AND Product__c = :productId 
                                 LIMIT 1];
 
        if (cartItem != null) {
            // Update the existing cart item with the new quantity (cannot update CreatedById once set)
            cartItem.Quantity__c += quantity;
            update cartItem;
        } else {
            // Create a new cart item (CreatedById is automatically set during record creation)
            Cart_Item__c newCartItem = new Cart_Item__c();
            newCartItem.Cart__c = activeCart.Id;
            newCartItem.Product__c = productId;
            newCartItem.Quantity__c = quantity;
            insert newCartItem;
        }
    }
}