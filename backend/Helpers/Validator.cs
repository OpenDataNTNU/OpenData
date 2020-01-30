using System;
using System.Text.RegularExpressions;
using System.Net.Mail;

namespace OpenData.Helpers
{
    public static class Validator
    {
        public static bool IsValidMail(string value) {
            try
            {
                MailAddress mailAddress = new MailAddress(value);
            } catch(FormatException e)
            {
                return false;
            }
            return true;
        }

        public static bool IsValidPassword(string value)
        {
            const string passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})";
            return Regex.IsMatch(value, passwordRegex);
        }
    }
}
