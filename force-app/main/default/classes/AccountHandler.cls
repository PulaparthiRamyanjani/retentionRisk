public class AccountHandler {
    public static Account InsertNewAccount(String AccountName){
        Account acct = new Account(Name=AccountName);
        try{
            insert acct;
        }
        catch(DMLException e){
            return Null;
        }
        return acct;
    }

}