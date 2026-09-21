public with sharing class OrderController {
    
    // Fetch the Product Order record
    @AuraEnabled(cacheable=true)
    public static List<Product_Order__c> getOpenOrders(Id ownerId) {
        return [
            SELECT Id, Name, Total__c, Status__c, Shipping_Address__c, PaymentStatus__c 
            FROM Product_Order__c 
            WHERE OwnerId = :ownerId AND Status__c = 'Open' 
            ORDER BY CreatedDate DESC 
            LIMIT 5];
    }
}