public with sharing class NewProductController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getBestSellers() {
        // Query Product2 records along with related Product Images
        List<Product2> products = [SELECT Id, Name, Cost_Price__c, 
                                   (SELECT 	Resource_URL__c,Name, URL__c FROM Product_Images__r LIMIT 1)
                                   FROM Product2 
                                   WHERE Cost_Price__c != NULL 
                                   ORDER BY Cost_Price__c DESC 
                                   LIMIT 3];
        
        // Prepare the result with product info and image URL
        List<Map<String, Object>> bestSellers = new List<Map<String, Object>>();
        
        for (Product2 product : products) {
            Map<String, Object> productInfo = new Map<String, Object>();
            productInfo.put('Id', product.Id);
            productInfo.put('Name', product.Name);
            productInfo.put('Cost_Price__c', product.Cost_Price__c);
            
            // Check if product has a related image and add it to the map
            if (!product.Product_Images__r.isEmpty()) {
                productInfo.put('imageUrl', product.Product_Images__r[0].URL__c);
            } else {
                productInfo.put('imageUrl', '/defaultImage.png'); // Fallback image if no image is found
            }
            
            bestSellers.add(productInfo);
        }
        
        return bestSellers;
    }
}