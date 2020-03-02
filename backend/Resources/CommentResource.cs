using System;
using System.Collections.Generic;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class CommentResource
    {
        public Guid Uuid { get; set; }

        public string UserMail { get; set; }
        public User User { get; set; }

        public Guid ParentCommentUuid { get; set; }
        public IList<CommentResource> ChildComments { get; set; }

        public string Content { get; set; }

        public DateTime Published { get; set; }
        public DateTime Edited { get; set; }
    }
}
