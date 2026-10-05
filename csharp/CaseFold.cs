using System;
using System.Globalization;

class CaseFold {
    static void Main() {
        string text = Console.In.ReadToEnd().Trim();
        Console.WriteLine(CultureInfo.InvariantCulture.TextInfo.ToTitleCase(text.ToLowerInvariant()));
    }
}
