public with sharing class ProductListController {
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getProducts() {
        // Querying from Product_Image__c, using the lookup to get Product details
        List<Product_Images__c> productImages = [
            SELECT Id, URL__c, Hero_Image__c, 
                   Product__r.Id, Product__r.Name, 
                   Product__r.Selling_Price__c, 
                   Product__r.Description, 
                   Product__r.In_Stock__c
            FROM Product_Images__c
            WHERE Hero_Image__c = true
            LIMIT 100
        ];
        System.debug('Product images retrieved: ' + productImages.size());
 
        List<ProductWrapper> productList = new List<ProductWrapper>();
        for (Product_Images__c image : productImages) {
            ProductWrapper pw = new ProductWrapper();
            pw.productImageId = image.Id; // Add this line to capture the Product_Image__c ID
            pw.productId = image.Product__r.Id;
            pw.productName = image.Product__r.Name;
            pw.productPrice = image.Product__r.Selling_Price__c;
            pw.productDescription = image.Product__r.Description;
            pw.inStock = image.Product__r.In_Stock__c;
            pw.heroImageUrl = image.URL__c;  // Hero Image URL from Product_Image__c
            productList.add(pw);
        }
        return productList;
    }
 
    public class ProductWrapper {
        @AuraEnabled public String productImageId; // Add this property
        @AuraEnabled public String productId;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal productPrice;
        @AuraEnabled public String productDescription;
        @AuraEnabled public Boolean inStock;
        @AuraEnabled public String heroImageUrl;
    }
}