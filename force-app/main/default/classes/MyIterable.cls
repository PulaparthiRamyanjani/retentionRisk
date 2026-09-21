public class MyIterable implements Iterable<String> {
   Private List<String> strings;

  // Constructor to initilize the list of strings

  public MyIterable(List<String> strings) 
  {
   this.strings = strings;
  
   }
    
   // Implementing the iterator method

    public Iterator<String> iterator(){

    return strings.iterator();
    }
}