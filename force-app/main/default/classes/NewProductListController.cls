public with sharing class NewProductListController {

    @AuraEnabled(cacheable=true)
    public static ProductWrapper getProductDetailsWithImage(Id productId) {
        System.debug('Product ID: ' + productId);
        ProductWrapper productWrapper = new ProductWrapper();

        // Query for the product details
        Product2 product = [
            SELECT Id, Name, ListPrice__c, Description, TotalQuantity__c, Remaining_Quantity__c
            FROM Product2
            WHERE Id = :productId
            LIMIT 1
        ];

        System.debug('Product Details: ' + product);

        // Query for hero image related to the product
        String heroImageUrl = null; // Initialize outside the block
        List<Product_Images__c> heroImages = [
            SELECT URL__c, Resource_URL__c, Image_Type__c
            FROM Product_Images__c
            WHERE Product__c = :productId AND Hero_Image__c = true
            LIMIT 1
        ];

        System.debug('Hero Images: ' + heroImages);

        if (!heroImages.isEmpty()) {
            Product_Images__c image = heroImages[0];
            heroImageUrl = (image.Image_Type__c == 'URL') ? image.URL__c : image.Resource_URL__c;
        }

        // Populate the product wrapper with product details
        productWrapper.productId = product.Id;
        productWrapper.productName = product.Name;
        productWrapper.productPrice = product.ListPrice__c;
        productWrapper.description = product.Description;
        productWrapper.isInStock = product.Remaining_Quantity__c > 0;
        productWrapper.heroImageUrl = heroImageUrl;
        productWrapper.remainingQuantity = product.Remaining_Quantity__c;

        System.debug('Product Wrapper: ' + productWrapper); // Log the populated wrapper
        return productWrapper; // Return the populated productWrapper
    }

    
    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getAllProducts() {
        List<ProductWrapper> productList = new List<ProductWrapper>();

        // Query to get all products with relevant fields
        List<Product2> products = [
            SELECT Id, Name, ListPrice__c, Description, TotalQuantity__c, Remaining_Quantity__c
            FROM Product2
            WHERE IsActive = true
            ORDER BY Name
        ];

        // Query product hero images
        Map<Id, String> productImages = new Map<Id, String>();
        List<Product_Images__c> heroImages = [
            SELECT Product__c, URL__c, Resource_URL__c, Image_Type__c
            FROM Product_Images__c
            WHERE Hero_Image__c = true
        ];

        for (Product_Images__c image : heroImages) {
            String imageUrl = (image.Image_Type__c == 'URL') ? image.URL__c : image.Resource_URL__c;
            productImages.put(image.Product__c, imageUrl);
        }

        // Wrap products with hero images and details
        for (Product2 product : products) {
            ProductWrapper pw = new ProductWrapper();
            pw.productId = product.Id;
            pw.productName = product.Name;
            pw.productPrice = product.ListPrice__c;
            pw.description = product.Description;
            pw.isInStock = product.Remaining_Quantity__c > 0 ? true : false;
            pw.heroImageUrl = productImages.containsKey(product.Id) ? productImages.get(product.Id) : null;
            pw.remainingQuantity = product.Remaining_Quantity__c;
            productList.add(pw);
        }

        return productList;
    }


    @AuraEnabled(cacheable=true)
    public static Product2 getProductDetails(Id productId) {
        return [
            SELECT Name, Description, ListPrice__c,  Remaining_Quantity__c 
            FROM Product2
            WHERE Id = :productId
            LIMIT 1
        ];
    }

  

    // Wrapper class for returning product details
    public class ProductWrapper {
        @AuraEnabled public Id productId;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal productPrice;
        @AuraEnabled public String description;
        @AuraEnabled public Boolean isInStock;
        @AuraEnabled public String heroImageUrl;
        @AuraEnabled public Decimal remainingQuantity;
    }


}