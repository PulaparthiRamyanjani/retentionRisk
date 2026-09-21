public class CaseHandler07 {
    public static void printname(){
        List<Case> cases = [SELECT CaseNumber, Subject FROM Case];
        for(Case case1: cases){
            system.debug('Case with the caseNumber ' +case1.CaseNumber + ' has the subject as ' +   case1.Subject);
        }
    }
 
}