public class StringManipulator06 {
    public static String reverseString(String input) {
        String reversed = '';
        for(Integer i = input.length() - 1; i >= 0; i--) {
            reversed += input.substring(i, i + 1);
        }
        system.debug(reversed);
        return reversed;
    }
}