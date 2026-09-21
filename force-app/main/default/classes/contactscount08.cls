public class contactscount08 {
    public static void contactsrelatedtoacc(String AccId) {
        // Query to get the count of contacts related to the account
        AggregateResult[] results = [SELECT COUNT(Id) totalcount FROM Contact WHERE AccountId = :AccId];
        // Extract the count from the result
        Integer s = (Integer)results[0].get('totalcount');
        System.debug('Contacts count of the related account is = ' + s);
    }
}