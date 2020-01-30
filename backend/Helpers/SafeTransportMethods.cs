using System;
using System.Collections.Generic;
using System.Linq;
using OpenData.Domain.Models;

namespace OpenData.Helpers
{
    public static class SafeTransportMethods
    {
        /// <summary>
        /// Clears any sensitive fields from the user, such as password.
        /// </summary>
        /// <returns>User</returns>
        public static User PrepForTransport(this User user)
        {
            user.Password = null;
            user.PasswordSalt = null;
            return user;
        }

        /// <summary>
        /// Clears any sensitive fields from the users, such as password.
        /// </summary>
        /// <returns>Users</returns>
        public static IEnumerable<User> PrepForTransport(this IEnumerable<User> users)
        {
            return users.Select(x => x.PrepForTransport());
        }
    }
}
