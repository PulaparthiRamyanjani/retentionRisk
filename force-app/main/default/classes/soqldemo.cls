public class soqldemo {
    public static void demo() {
       Set<Id> accIds = new set<Id>();
       List<Account> acclist = [SELECT Id 
                                FROM Account
                                LIMIT 10];
        for(Account acc : acclist) {
            accIds.add(acc.Id);
           System.debug(accIds);
        }
         List<Account> acclist1 = [SELECT Id, Name, Industry,Rating
                                FROM Account
                                WHERE Id IN: accIds];
    }
        
}