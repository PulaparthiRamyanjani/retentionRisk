public with sharing class ProductDetailsController {
    @AuraEnabled(cacheable=true)
    public static ProductWrapper getProductDetails(Id productImageId) { // Rename the parameter to clarify it's the Product_Image__c ID
        // Debug log to check if Apex is being called
        System.debug('Fetching details for productImageId: ' + productImageId);
        // Query the Product_Image__c directly using its Id
        Product_Images__c productImage = [
            SELECT Id, URL__c, Hero_Image__c, 
                   Product__r.Id, Product__r.Name, 
                   Product__r.Selling_Price__c, 
                   Product__r.Description, 
                   Product__r.In_Stock__c
            FROM Product_Images__c
            WHERE Id = :productImageId // Use the Product_Image__c ID
            LIMIT 1
        ];
 
        // Log fetched product image details
        System.debug('Fetched product image: ' + productImage);
 
        // Prepare the ProductWrapper to return
        ProductWrapper pw = new ProductWrapper();
        pw.productId = productImage.Product__r.Id; // This fetches the related Product__c ID
        pw.productName = productImage.Product__r.Name;
        pw.productPrice = productImage.Product__r.Selling_Price__c;
        pw.productDescription = productImage.Product__r.Description;
        pw.inStock = productImage.Product__r.In_Stock__c;
        pw.images = new List<ImageWrapper>();
 
        // Fetch related images based on the Product__c ID
        List<Product_Images__c> relatedImages = [
            SELECT URL__c FROM Product_Images__c 
            WHERE Product__c = :productImage.Product__r.Id
        ];
        for (Product_Images__c img : relatedImages) {
            ImageWrapper image = new ImageWrapper();
            image.url = img.URL__c;
            pw.images.add(image);
        }
 
        return pw;
    }
 
    public class ProductWrapper {
        @AuraEnabled public String productId;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal productPrice;
        @AuraEnabled public String productDescription;
        @AuraEnabled public Boolean inStock;
        @AuraEnabled public List<ImageWrapper> images;
    }
 
    public class ImageWrapper {
        @AuraEnabled public String url;
    }
}