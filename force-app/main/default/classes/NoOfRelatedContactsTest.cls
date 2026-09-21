@isTest
public class NoOfRelatedContactsTest {
    @isTest
    static void testCountPerAccount() {
       
        Account acc1 = new Account(Name = 'Test Account 1');
        Account acc2 = new Account(Name = 'Test Account 2');
        insert new List<Account>{ acc1, acc2 };
        
        Contact con1 = new Contact(FirstName = 'John', LastName = 'Doe', AccountId = acc1.Id);
        Contact con2 = new Contact(FirstName = 'Jane', LastName = 'Doe', AccountId = acc1.Id);
        Contact con3 = new Contact(FirstName = 'Jake', LastName = 'Doe', AccountId = acc2.Id);
        insert new List<Contact>{ con1, con2, con3 };
        
        
        Test.startTest();
        NoOfRelatedContacts.countPerAccount();
        Test.stopTest();
        
        List<AggregateResult> contactCounts = [
            SELECT AccountId, COUNT(Id) contactCount
            FROM Contact
            GROUP BY AccountId
        ];
        
        System.assertEquals(2, contactCounts.size(), 'Expected 2 accounts with contacts');
        
        for (AggregateResult result : contactCounts) {
            Id accountId = (Id) result.get('AccountId');
            Integer contactCount = (Integer) result.get('contactCount');
            
            if (accountId == acc1.Id) {
                System.assertEquals(2, contactCount, 'Account 1 should have 2 contacts');
            } else if (accountId == acc2.Id) {
                System.assertEquals(1, contactCount, 'Account 2 should have 1 contact');
            }
        }
    }
}