public with sharing class AddressController {
    @AuraEnabled(cacheable=true)
    public static List<Address_Book__c> getAddresses() {
        return [SELECT Id, Name, Street__c, City__c, State_c__c, Postal_Code__c, Country__c,Land_Mark__c FROM Address_Book__c];
    }
 
    @AuraEnabled
    public static void deleteAddress(Id addressId) {
    try {
        Address_Book__c addressToDelete = [SELECT Id FROM Address_Book__c WHERE Id = :addressId LIMIT 1];
        if (addressToDelete != null) {
            delete addressToDelete;
        } else {
            throw new AuraHandledException('Address not found');
        }
    } catch (Exception e) {
        throw new AuraHandledException('Error deleting address: ' + e.getMessage());
    }
}
 
 
    @AuraEnabled
    public static void updateAddress(Address_Book__c address) {
        Address_Book__c existingAddress = [SELECT Id, Name, Street__c, City__c, State_c__c, Postal_Code__c, Country__c, Land_Mark__c
                                            FROM Address_Book__c
                                            WHERE Id = :address.Id
                                            LIMIT 1];
 
        if (address.Street__c != null) {
            // Update the fields with the new values
            existingAddress.Name = address.Name;
            existingAddress.Street__c = address.Street__c;
            existingAddress.City__c = address.City__c;
            existingAddress.State_c__c = address.State_c__c;
            existingAddress.Postal_Code__c = address.Postal_Code__c;
            existingAddress.Country__c = address.Country__c;
            existingAddress.Land_Mark__c = address.Land_Mark__c;
 
            // Perform the update
            update existingAddress;
        }else {
            throw new AuraHandledException('Address not found');
        }
    }
 
    @AuraEnabled
    public static void addAddress(Address_Book__c address) {
        try {
            insert address;
        } catch (Exception e) {
            throw new AuraHandledException('Failed to add address: ' + e.getMessage());
        }
    }
 
 
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getCountryPicklistValues() {
        // Get the picklist values for the Country__c field
        Schema.DescribeFieldResult fieldResult = Address_Book__c.Country__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
       
        // Create a list of maps to return picklist values
        List<Map<String, String>> countryOptions = new List<Map<String, String>>();
       
        for (Schema.PicklistEntry entry : picklistEntries) {
            // Only add active picklist values
            if (entry.isActive()) {
                Map<String, String> option = new Map<String, String>();
                option.put('value', entry.getValue());
                option.put('label', entry.getLabel());
                countryOptions.add(option);
            }
        }
       
        return countryOptions;
    }
}