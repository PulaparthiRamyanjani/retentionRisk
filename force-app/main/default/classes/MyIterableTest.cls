@IsTest
public class MyIterableTest {

      @IsTest

    static void testIterableForLoop(){
    
         // Create a list of strings
        List<String> strings = new List<String> {'Hello', 'World'};

       // Create an Instance of MyIterable
 
             MyIterable myIterable = new MyIterable(strings);

        // Use a for loop to iterate over the MyIterable instance

         for(String str: myIterable)
         {
           //Print each string to the debug log
          
            System.debug(str);      
         }      
    }
}