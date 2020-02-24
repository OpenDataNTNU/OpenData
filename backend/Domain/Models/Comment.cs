using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace OpenData.Domain.Models
{
    public class Comment
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Uuid { get; set; }

        [ForeignKey("User")]
        public string UserMail { get; set; }
        public User User { get; set; }

        public string Content { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Published { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Edited { get; set; }
    }
}
