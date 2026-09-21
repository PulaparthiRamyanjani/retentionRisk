public class ProductDetailsAddtoCart {
    @AuraEnabled
    public static String addProductToCart(Id productId, Integer quantity) {
        // Hardcode your specific OwnerId for testing purposes
        Id ownerId = '005GC00000lBgEIYA0'; // Replace with your actual Salesforce UserId
 
        // Fetch your active Cart__c record based on your OwnerId
        List<Cart__c> carts = [
            SELECT Id 
            FROM Cart__c 
            WHERE CreatedById = :ownerId
            AND Status__c = 'Open' // Change this to match your actual status
            LIMIT 1
        ];
 
        // Check if any Cart__c is found
        if (carts.isEmpty()) {
            throw new AuraHandledException('No active cart found for the user.');
        }
 
        // Use the first cart if one exists
        Cart__c cart = carts[0];
 
        // Fetch the product price to calculate the amount
        Product2 product = [
            SELECT Id, Selling_Price__c 
            FROM Product2 
            WHERE Id = :productId 
            LIMIT 1
        ];
 
       
 
        // Check if the product is already in the cart
        List<Cart_Item__c> existingItems = [
            SELECT Id, Quantity__c 
            FROM Cart_Item__c 
            WHERE Product__c = :productId 
            AND Cart__c = :cart.Id 
            LIMIT 1
        ];
 
        if (!existingItems.isEmpty()) {
            // If the item already exists, increase its quantity
            Cart_Item__c existingItem = existingItems[0];
            existingItem.Quantity__c += quantity; // Increase quantity
 
            
            try {
                // Update the existing Cart_Item__c
                update existingItem;
                return 'Product quantity updated in cart successfully';
            } catch (DmlException e) {
                // Log error details for debugging
                System.debug('Error during update: ' + e.getMessage());
                throw new AuraHandledException('Error updating product quantity in cart: ' + e.getMessage());
            }
        } else {
            // Create a new Cart_Item__c record if it does not exist
            Cart_Item__c newItem = new Cart_Item__c();
            newItem.Product__c = productId; // Relate to Product__c
            newItem.Quantity__c = quantity;
            newItem.Cart__c = cart.Id; // Relate to the Cart__c record (Master-Detail)
 
 
            try {
                // Insert the Cart_Item__c
                insert newItem;
                return 'Product added to cart successfully';
            } catch (DmlException e) {
                // Log error details for debugging
                System.debug('Error during insert: ' + e.getMessage());
                throw new AuraHandledException('Error adding product to cart: ' + e.getMessage());
            }
        }
    }
 
}