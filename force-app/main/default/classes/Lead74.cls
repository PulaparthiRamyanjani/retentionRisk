public class Lead74 {
    public static void leadsource(){
        list<Lead> leadslist = [SELECT Id, LeadSource FROM lead WHERE LeadSource !=null];
        for(Lead le : leadslist){
            if(le.LeadSource == 'Purchased List'){
                system.debug('leadid:' +le.Id + ' has particular leadsource');
            }
            else{
                system.debug('leadid:' +le.Id + ' doesnt have particular leadsource');
            }
        }
    }
}