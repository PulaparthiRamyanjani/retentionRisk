public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getFilteredAccounts() {
        return [SELECT Id, Name FROM Account WHERE Name LIKE '%ch s m raju%'];
    }
}