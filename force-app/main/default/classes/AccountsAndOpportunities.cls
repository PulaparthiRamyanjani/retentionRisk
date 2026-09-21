public class AccountsAndOpportunities {
    public static void AccountsAndOpportunitiesLastMonth() {
        
        Date today = Date.today();
        Date firstDayOfThisMonth = today.toStartOfMonth();
        Date firstDayOfLastMonth = firstDayOfThisMonth.addMonths(-1);
        Date lastDayOfLastMonth = firstDayOfThisMonth.addDays(-1);

        List<Account> accList = [
            SELECT Id, Name, CreatedDate 
            FROM Account 
            WHERE CreatedDate >= :firstDayOfLastMonth AND CreatedDate <= :lastDayOfLastMonth 
            ORDER BY CreatedDate ASC
        ];

        List<Opportunity> oppList = [
            SELECT Id, Name, AccountId, CreatedDate 
            FROM Opportunity 
            WHERE AccountId IN :accList AND CreatedDate >= :firstDayOfLastMonth AND CreatedDate <= :lastDayOfLastMonth 
            ORDER BY CreatedDate ASC
        ];

      
        System.debug('Accounts created last month and their related oppurtunities:');
        for (Account acc : acclist) {
            System.debug('Account Name: ' + acc.Name + ', Created Date: ' + acc.CreatedDate);
            
            for (Opportunity opp : opplist) {
                if (opp.AccountId == acc.Id) {
                    System.debug('  Opportunity Name: ' + opp.Name + ', Created Date: ' + opp.CreatedDate);
                }
            }
        }
    }
}