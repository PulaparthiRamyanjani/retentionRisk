public class leadTriggerHandler05 {
    public static void convertLead(List<Lead> leads){
        List<Account> accList = new List<Account>();
        List<Contact> conList = new  List<Contact>();
        List<Opportunity> oppList = new List<Opportunity>();
        for(Lead ld: leads){
            Account acc = new Account();
            acc.Name = ld.LastName;
            accList.add(acc);
            Contact con = new Contact();
            con.LastName = ld.LastName;
            conList.add(con);
            Opportunity opp = new Opportunity();
            opp.Name = ld.LastName;
            opp.CloseDate = date.today();
            opp.StageName = 'Closed Won';
            oppList.add(opp);
        }   
        insert accList;
        insert conList; 
        insert oppList;
    }
}