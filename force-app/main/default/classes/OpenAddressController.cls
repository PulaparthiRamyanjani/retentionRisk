public class OpenAddressController {
@AuraEnabled(cacheable=true)
    public static Product_Order__c  getOrderAddress() {
        // Hardcoded OwnerId value
        Id ownerId = '005GC00000lBgEIYA0'; // Replace with the actual OwnerId
 
        // Fetch the Order record based on the hardcoded OwnerId
        return [
            SELECT Id, Shipping_Address__c, Billing_Address__c 
            FROM Product_Order__c  
            WHERE OwnerId = :ownerId 
            LIMIT 1
        ];
    }
 
    @AuraEnabled
    public static void updateOrderAddress(Id orderId, String shippingAddress, String billingAddress) {
        // Fetch the specific order record by Id
        Product_Order__c  order = [
            SELECT Id, Shipping_Address__c, Billing_Address__c 
            FROM Product_Order__c 
            WHERE Id = :orderId 
            LIMIT 1
        ];
        // Update the address fields
        order.Shipping_Address__c = shippingAddress;
        order.Billing_Address__c = billingAddress;
        update order;
    }

}