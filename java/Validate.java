import java.util.regex.Pattern;

public class Validate {
    static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    public static void main(String[] args) throws Exception {
        String line = new String(System.in.readAllBytes()).trim();
        int good = 0;
        int bad = 0;
        for (String token : line.split("\\s+")) {
            if (token.isEmpty()) continue;
            if (EMAIL.matcher(token).matches()) good++;
            else bad++;
        }
        System.out.println(good + " " + bad);
    }
}
