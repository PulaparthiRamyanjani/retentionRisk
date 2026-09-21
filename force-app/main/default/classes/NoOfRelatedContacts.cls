public class NoOfRelatedContacts {
    public static void CountPerAccount(){
        List<Aggregateresult> ContactCounts = [ Select AccountId , Count(Id) ContactCount
                                                From Contact
                                                Group by AccountId ];
         for (AggregateResult result : contactCounts) {
            Id accountId = (Id) result.get('AccountId');
            Integer contactCount = (Integer) result.get('contactCount');
            System.debug('Account ID: ' + accountId + ' has ' + contactCount + ' contacts.');
        }
    }
 }