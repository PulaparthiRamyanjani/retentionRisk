public class CreateContactForAccount13 {
    public static void createCon(List<Account> accList){
        for(Account acc: accList){
            Contact con = new Contact();
            con.LastName = acc.Name;
            con.AccountId = acc.Id;
            insert con;
        }
    }
}