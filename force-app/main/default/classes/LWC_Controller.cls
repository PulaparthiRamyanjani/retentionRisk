public class LWC_Controller{
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(string inputName) {
        string accName = '%' + inputName + '%';
        return [SELECT Id, Name, Industry FROM Account WHERE NAME LIKE :accName LIMIT 10];
    }
}