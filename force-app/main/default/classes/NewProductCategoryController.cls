public with sharing class  NewProductCategoryController {
    @AuraEnabled(cacheable=true)
    public static List<Category_Custom__c> getCategoriesAndSubcategories() {
        
        if (!Schema.sObjectType.Category_Custom__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view categories.');
        }
    
       
        List<Category_Custom__c> parentCategories = [
            SELECT Id, Name, Sequence__c 
            FROM Category_Custom__c

            WHERE ParentCategory__c = null 
            ORDER BY Sequence__c
        ];
    
        
        List<Category_Custom__c> subcategories = [
            SELECT Id, Name, Sequence__c, ParentCategory__c 
            FROM Category_Custom__c
            WHERE ParentCategory__c != null 
            ORDER BY Sequence__c
        ];
    
       
        return parentCategories;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<CategoryWrapper> getCategoriesWithSubcategories() {
        // Query all parent categories
        List<Category_Custom__c> parentCategories = [
            SELECT Id, Name 
            FROM Category_Custom__c
            WHERE ParentCategory__c = NULL
            ORDER BY Sequence__c
        ];

        // Create a wrapper to return both parent categories and subcategories
        List<CategoryWrapper> categoriesWithSubs = new List<CategoryWrapper>();

        for (Category_Custom__c parentCategory : parentCategories) {
            // Query subcategories for each parent
            List<Category_Custom__c> subcategories = [
                SELECT Id, Name 
                FROM Category_Custom__c 
                WHERE ParentCategory__c = :parentCategory.Id
                ORDER BY Sequence__c
            ];

            // Query products associated with the parent category
            List<Product_Category__c> productsInParent = [
                SELECT Product__r.Name 
                FROM Product_Category__c 
                WHERE 	Category__c = :parentCategory.Id
            ];

            // Query products for each subcategory
            Map<Id, List<Product_Category__c>> subcategoryProducts = new Map<Id, List<Product_Category__c>>();
            for (Category_Custom__c subcategory : subcategories) {
                List<Product_Category__c> productsInSub = [
                    SELECT Product__r.Name 
                    FROM Product_Category__c 
                    WHERE 	Category__c = :subcategory.Id
                ];
                subcategoryProducts.put(subcategory.Id, productsInSub);
            }

            // Add the parent category, its subcategories, and their products to the wrapper
            categoriesWithSubs.add(new CategoryWrapper(parentCategory, subcategories, productsInParent, subcategoryProducts));
        }

        return categoriesWithSubs;
    }

    public class CategoryWrapper {
        @AuraEnabled public Category_Custom__c parentCategory { get; set; }
        @AuraEnabled public List<Category_Custom__c> subcategories { get; set; }
        @AuraEnabled public List<Product_Category__c> productsInParent { get; set; }
        @AuraEnabled public Map<Id, List<Product_Category__c>> subcategoryProducts { get; set; }

        public CategoryWrapper(Category_Custom__c parentCategory, List<Category_Custom__c> subcategories, 
                               List<Product_Category__c> productsInParent, 
                               Map<Id, List<Product_Category__c>> subcategoryProducts) {
            this.parentCategory = parentCategory;
            this.subcategories = subcategories;
            this.productsInParent = productsInParent;
            this.subcategoryProducts = subcategoryProducts;
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Category_Custom__c> getCategories() {
        // Check if the user has read access to Categories__c object
        if (!Schema.sObjectType.Category_Custom__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view categories.');
        }
        
        // Proceed with the query if accessible
        return [SELECT Id, Name, Sequence__c FROM Category_Custom__c ORDER BY Sequence__c];
    }



@AuraEnabled(cacheable=true)
public static List<Category_Custom__c> getSubcategories(Id parentCategoryId) {
    if (!Schema.sObjectType.Category_Custom__c.isAccessible()) {
        throw new AuraHandledException('You do not have permission to view categories.');
    }
    return [SELECT Id, Name, Sequence__c 
            FROM Category_Custom__c
            WHERE ParentCategory__c = :parentCategoryId
            ORDER BY Sequence__c];
}

    @AuraEnabled
    public static List<ProductWrapper> getProductsByCategory(Id categoryId) {
        List<ProductWrapper> productList = new List<ProductWrapper>();
    
       
        if (!Schema.sObjectType.Product_Category__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view product categories.');
        }
        if (!Schema.sObjectType.Product_Images__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view product images.');
        }
    
     
        List<Product_Category__c> productCategories = [
            SELECT Product__c, Product__r.Name, Product__r.ListPrice__c, Product__r.Description, Product__r.Remaining_Quantity__c 
            FROM Product_Category__c 
            WHERE 	Category__c = :categoryId
        ];
    
       
        List<Category_Custom__c> subcategories = [
            SELECT Id 
            FROM Category_Custom__c 
            WHERE ParentCategory__c = :categoryId
        ];
    
        List<Product_Category__c> subcategoryProducts = new List<Product_Category__c>();
        if (!subcategories.isEmpty()) {
            subcategoryProducts = [
                SELECT Product__c, Product__r.Name, Product__r.ListPrice__c, Product__r.Description, Product__r.Remaining_Quantity__c 
                FROM Product_Category__c 
                WHERE 	Category__c IN :subcategories
            ];
        }
    
       
        productCategories.addAll(subcategoryProducts);
    
        
        Set<Id> productIds = new Set<Id>();
        for (Product_Category__c pc : productCategories) {
            productIds.add(pc.Product__c);
        }
    
       
        List<Product_Images__c> productImages = [
            SELECT Product__c, URL__c, Resource_URL__c, Image_Type__c
            FROM Product_Images__c 
            WHERE Product__c IN :productIds AND Hero_Image__c = true
        ];
    
        Map<Id, String> imageMap = new Map<Id, String>();
        for (Product_Images__c image : productImages) {
            String imageUrl = (image.Image_Type__c == 'URL') ? image.URL__c : image.Resource_URL__c;
            imageMap.put(image.Product__c, imageUrl);
        }
    
        for (Product_Category__c pc : productCategories) {
            ProductWrapper pw = new ProductWrapper();
            pw.productId = pc.Product__c;
            pw.productName = pc.Product__r.Name; 
            pw.productPrice = pc.Product__r.ListPrice__c; 
            pw.description = pc.Product__r.Description; 
            pw.isInStock = pc.Product__r.Remaining_Quantity__c > 0; 
            pw.heroImageUrl = imageMap.containsKey(pc.Product__c) ? imageMap.get(pc.Product__c) : null; // Hero image URL
            productList.add(pw);
        }
    
        return productList;
    }
    
  
    public class ProductWrapper {
        @AuraEnabled public Id productId;
        @AuraEnabled public String productName;
        @AuraEnabled public Decimal productPrice;
        @AuraEnabled public String description;
        @AuraEnabled public Boolean isInStock;
        @AuraEnabled public String heroImageUrl; 
    }
}