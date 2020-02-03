using System;
using System.Text.RegularExpressions;
using System.Net.Mail;

using OpenData.Resources;

namespace OpenData.Extensions
{
    public static class NewUserExtensions
    {
        public static bool IsValidMail(this NewUserResource newUser) {
            try
            {
                MailAddress mailAddress = new MailAddress(newUser.Mail);
            } catch (FormatException)
            {
                return false;
            }
            return true;
        }

        public static bool IsValidPassword(this NewUserResource newUser)
        {
            const string passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})";
            return Regex.IsMatch(newUser.Password, passwordRegex);
        }
    }
}
