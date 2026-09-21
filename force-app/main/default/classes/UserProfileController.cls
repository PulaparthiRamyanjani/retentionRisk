public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static User getUserProfile(String username) {
        return [SELECT Id, Name, Email, Phone FROM User WHERE Name = :username LIMIT 1];
    }
}