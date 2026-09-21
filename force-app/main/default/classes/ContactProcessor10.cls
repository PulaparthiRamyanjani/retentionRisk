public class ContactProcessor10 {
    public static void updateConEmails(string LName, String Email){
        List<Contact> conList = [SELECT LastName, Email FROM Contact WHERE LastName =: LName];
        for(Contact con: conList){
            con.Email = Email;
        }
        update conList;        
    }
}