public with sharing class HomePageController {
    @AuraEnabled(cacheable=true)
    public static Cart__c getOpenCart() {
       
        Contact currentContact = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
        return [SELECT Id,Name, Status__c FROM Cart__c WHERE Customer__c = :currentContact.Id AND Status__c = 'Open' LIMIT 1];
    }
 
    @AuraEnabled(cacheable=true)
    public static List<Product_Order__c> getOpenOrders() {
        Contact currentContact = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
        return [SELECT Id, Name, Total__c, Shipping_Address__c, PaymentStatus__c
                FROM Product_Order__c
                WHERE Customer__c = :currentContact.Id AND Status__c = 'Open'];
    }
 
 
    @AuraEnabled(cacheable=true)
    public static List<Product_Order__c> getRecentOrders() {
     
        Contact currentContact = [SELECT Id FROM Contact WHERE Email = :UserInfo.getUserEmail() LIMIT 1];
        return [SELECT Name, Total__c, Shipping_Address__c, PaymentStatus__c,Status__c  FROM Product_Order__c
                WHERE Customer__c = :currentContact.Id 
                ORDER BY CreatedDate DESC LIMIT 5];
    }
}