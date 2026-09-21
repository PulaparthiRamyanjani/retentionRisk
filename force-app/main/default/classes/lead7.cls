public class lead7 {
    public static void duplicates(List<Lead> leadlist){ 
       set<String> emails = new  set<String>();
        set<String> duplicateemails = new set<String>();
        for(Lead le : leadlist){
            if(le.Email!=null){
                if(emails.contains(le.Email)){
                    duplicateemails.add(le.Email);
                }
                else{
                    emails.add(le.Email);
             }
        }
   }  
        for(Lead le :leadlist){
         if(le.Email!=null &&  duplicateemails.contains(le.Email)){
                    le.addError('duplicate lead');
           }
        }
    }  
}