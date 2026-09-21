public class account4 {
    public static void insertion(List<Account> acclist ){
        List<Contact> createcontacts = new List<Contact>();
        for(Account acc : acclist){
            if(acc.NumberofLocations__c!=null && acc.NumberofLocations__c>0){
                    for(Integer i=0; i< acc.NumberofLocations__c ;i++){
                     Contact con = new Contact();
                         con.LastName ='contact' + i;
                         con.Phone = acc.Phone;
                         con.AccountId = acc.Id;
                   createcontacts.add(con);
                        
                   
                    }
            }
        }
      insert createcontacts ;
    }
        
    public static void Updation(List<Account> acclist , map<id , Account> oldAccountMap){
        List<Contact> createcontacts = new List<Contact>();
        for(Account acc : acclist){
            Account oldacc = oldAccountMap.get(acc.id);
            if(oldacc!=null){
                if(oldacc.NumberofLocations__c!=acc.NumberofLocations__c){
            if(acc.NumberofLocations__c!=null && acc.NumberofLocations__c>0){
                    for(Integer i=0; i< acc.NumberofLocations__c ;i++){
                     Contact con = new Contact();
                         con.LastName ='contact' + i;
                         con.Phone = acc.Phone;
                         con.AccountId = acc.Id;
                   createcontacts.add(con);
                        
                     }
                  }
                }
            }
        }
      insert createcontacts ;
    }
   
 }