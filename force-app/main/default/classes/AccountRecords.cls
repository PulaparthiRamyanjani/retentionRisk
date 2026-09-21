public class AccountRecords {

    @AuraEnabled(cacheable=true)

    public static List<Account> getAccounts() {

        return [SELECT Id, Name, Industry FROM Account LIMIT 10];

    }

}