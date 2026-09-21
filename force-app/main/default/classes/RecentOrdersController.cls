public with sharing class RecentOrdersController {
    @AuraEnabled(cacheable=true)
    public static List<Product_Order__c> getRecentOrders(Id ownerId) {
        return [
            SELECT Id, Name, Total__c, Status__c, Shipping_Address__c, PaymentStatus__c
            FROM Product_Order__c 
            WHERE OwnerId = :ownerId 
            ORDER BY CreatedDate DESC 
            LIMIT 5
        ];
    }
}