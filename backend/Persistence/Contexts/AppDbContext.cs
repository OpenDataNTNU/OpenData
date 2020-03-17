using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Linq;
using System;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore;

using OpenData.Domain.Models;

namespace OpenData.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Municipality> Municipalities { get; set; }
        public DbSet<ExperiencePost> ExperiencePosts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MetadataType> MetadataTypes { get; set; }
        public DbSet<Metadata> Metadata { get; set; }
        public DbSet<DataSource> DataSource { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<MetadataCategory> MetadataCategory { get; set; }
        public DbSet<MetadataCommentMapping> MetadataCommentMappings { get; set; }
        public DbSet<ExperiencePostCommentMapping> ExperiencePostCommentMappings { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //This is where we create new tables
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Municipality>().ToTable("Municipalities");
            builder.Entity<Municipality>().HasKey(p => p.Name);
            builder.Entity<Municipality>().Property(p => p.ShieldFileName).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Municipality>().HasMany(p => p.MetadataList).WithOne(p => p.Owner).HasForeignKey(p => p.MunicipalityName).IsRequired();

            builder.Entity<Municipality>().HasData
            (
                new Municipality { Name = "Bodø", MailDomain = "bodo.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Test", MailDomain = "test.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Bærum", MailDomain = "baerum.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Oslo", MailDomain = "oslo.kommune.no", ShieldFileName = "404.png"},
                new Municipality { Name = "Trondheim", MailDomain = "trondheim.kommune.no", ShieldFileName = "404.png"},
                new Municipality { Name = "Asker", MailDomain = "asker.kommune.no", ShieldFileName = "404.png"}
            );


            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(p => p.Mail);
            builder.Entity<User>().Property(p => p.Password).IsRequired();
            builder.Entity<User>().Property(p => p.PasswordSalt).IsRequired();
            builder.Entity<User>().HasOne(p => p.Municipality);

            builder.Entity<Backend>().ToTable("Backends");
            builder.Entity<Backend>().HasKey(p => p.Name);
            builder.Entity<Backend>().Property(p => p.Description).IsRequired();
            builder.Entity<Backend>().Property(p => p.Url).IsRequired();

            builder.Entity<Backend>().HasData(
                new Backend { Name = "Django", Description = "Just django", Url = "https://www.django-rest-framework.org/"}
            );

            builder.Entity<DataFormat>().ToTable("DataFormats");
            builder.Entity<DataFormat>().HasKey(p => p.Name);
            builder.Entity<DataFormat>().Property(p => p.Description).IsRequired();
            builder.Entity<DataFormat>().Property(p => p.DocumentationUrl).IsRequired();

            builder.Entity<DataFormat>().HasData(
                new DataFormat { Name = "JSON", Description = "Just json", DocumentationUrl = "https://www.json.org/json-en.html"},
                new DataFormat { Name = "CSV", Description = "Comma seperated values", DocumentationUrl = "https://tools.ietf.org/html/rfc4180"}
            );

            builder.Entity<MetadataCategory>().ToTable("MetadataCategory");
            builder.Entity<MetadataCategory>().HasKey(c => c.Uuid);
            builder.Entity<MetadataCategory>().Property(c => c.Name).IsRequired();
            builder.Entity<MetadataCategory>().Property(c => c.HasChildren).IsRequired();
            builder.Entity<MetadataCategory>()
                .HasMany(c => c.Children)
                .WithOne(c => c.Parent)
                .HasForeignKey(c => c.ParentUuid);
            builder.Entity<MetadataCategory>()
                .HasMany(c => c.Types)
                .WithOne(c => c.Category)
                .HasForeignKey(c => c.CategoryUuid);

            //Build some tree structure we can play around with
            var travel = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Travel", HasChildren = true};
            var cars = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Cars", ParentUuid = travel.Uuid};
            var bike = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Bikes", ParentUuid = travel.Uuid};
            var population = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Population"};
            var govtProp = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Government property", HasChildren = true};
            var powerConsumption = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Power consumption", ParentUuid = govtProp.Uuid};

            var health = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Health & wellbeing"};

            var organization = new MetadataCategory { Uuid = Guid.NewGuid(), Name = "Organization and cooperation"};

            builder.Entity<MetadataCategory>().HasData(
                travel, cars, bike, govtProp, population, powerConsumption,
                health, organization
            );

            builder.Entity<MetadataType>().ToTable("MetadataTypes");
            builder.Entity<MetadataType>().HasKey(p => p.Uuid);
            builder.Entity<MetadataType>().Property(nameof(MetadataType.Name)).IsRequired();
            builder.Entity<MetadataType>().Property(nameof(MetadataType.Description)).IsRequired();
            builder.Entity<MetadataType>().HasMany(p => p.MetadataList).WithOne(p => p.Type).HasForeignKey(p => p.MetadataTypeUuid).IsRequired();

            //Define metadata types
            var type_cycle = new MetadataType { Uuid = Guid.NewGuid(), Name = "Cycle history", CategoryUuid = bike.Uuid, Description = "Pling pling"};
            var type_cycle_theft = new MetadataType { Uuid = Guid.NewGuid(), Name = "Cycle theft", CategoryUuid = bike.Uuid,  Description = "Some times, they get stolen."};
            var type_population = new MetadataType { Uuid = Guid.NewGuid(), Name = "Populasjon", CategoryUuid = population.Uuid,  Description = "Informasjon om populasjonsdensitet"};
            var type_kindergarden = new MetadataType { Uuid = Guid.NewGuid(), Name = "Kindergarden statistics", CategoryUuid = health.Uuid,  Description = "Kids grow faster in gardens"};
            var type_corona = new MetadataType { Uuid = Guid.NewGuid(), Name = "Corona virus cases", CategoryUuid = health.Uuid,  Description = "Statistics about corona virus cases"};
            var type_car = new MetadataType { Uuid = Guid.NewGuid(), Name = "Car history", CategoryUuid = cars.Uuid,  Description = "Wroom wroom"};
            builder.Entity<MetadataType>().HasData(
                type_cycle, type_cycle_theft, type_population, type_kindergarden, type_corona, type_car
            );

            builder.Entity<DataSource>().ToTable("DataSource");
            builder.Entity<DataSource>().HasKey(d => d.Uuid);
            builder.Entity<DataSource>().HasOne(d => d.DataFormat);
            builder.Entity<DataSource>().HasOne(d => d.Metadata);

            builder.Entity<Metadata>().ToTable("Metadata");
            builder.Entity<Metadata>().HasKey(p => p.Uuid);
            builder.Entity<Metadata>().Property( p => p.Description).IsRequired();
            builder.Entity<Metadata>().Property( p => p.ReleaseState).IsRequired();
            builder.Entity<Metadata>().HasMany(p => p.DataSource).WithOne(d => d.Metadata).HasForeignKey(d => d.MetadataUuid);

            builder.Entity<MetadataExperiencePostMapping>().ToTable("MetadataExperiencePostMapping");
            builder.Entity<MetadataExperiencePostMapping>().HasKey(p => new {p.ExperiencePostUuid, p.MetadataUuid});
            builder.Entity<MetadataExperiencePostMapping>().HasOne(m => m.Metadata).WithMany(e => e.ExperiencePosts).HasForeignKey(m => m.MetadataUuid);
            builder.Entity<MetadataExperiencePostMapping>().HasOne(p => p.ExperiencePost).WithMany().HasForeignKey(p => p.ExperiencePostUuid);
            
            builder.Entity<Metadata>().HasData(
                new Metadata { Uuid = Guid.NewGuid(),
                               Description="Pling Plong", ReleaseState = EReleaseState.Released, MunicipalityName = "Trondheim",
                               MetadataTypeUuid = type_cycle.Uuid},
                new Metadata { Uuid = Guid.NewGuid(), 
                               Description="We have a lot of bikes", ReleaseState = EReleaseState.Yellow, MunicipalityName = "Oslo",
                               MetadataTypeUuid = type_cycle.Uuid},

                new Metadata { Uuid = Guid.NewGuid(),
                               Description="Cycle theft for Trondheim. Contains city bike theft", ReleaseState = EReleaseState.Green, MunicipalityName = "Trondheim",
                               MetadataTypeUuid = type_cycle_theft.Uuid},
                new Metadata { Uuid = Guid.NewGuid(), 
                               Description="We have a lot of bikes. Some get stolen. Not the city bikes though.", ReleaseState = EReleaseState.Released, MunicipalityName = "Oslo",
                               MetadataTypeUuid = type_cycle_theft.Uuid},

                new Metadata { Uuid = Guid.NewGuid(),
                               Description="", ReleaseState = EReleaseState.Released, MunicipalityName = "Trondheim",
                               MetadataTypeUuid = type_population.Uuid},
                new Metadata { Uuid = Guid.NewGuid(), 
                               Description="", ReleaseState = EReleaseState.Green, MunicipalityName = "Oslo",
                               MetadataTypeUuid = type_population.Uuid},
                new Metadata { Uuid = Guid.NewGuid(), 
                               Description="", ReleaseState = EReleaseState.Red, MunicipalityName = "Bodø",
                               MetadataTypeUuid = type_population.Uuid},
                new Metadata { Uuid = Guid.NewGuid(), 
                               Description="", ReleaseState = EReleaseState.Released, MunicipalityName = "Test",
                               MetadataTypeUuid = type_population.Uuid}
            );
            
            builder.Entity<Comment>().ToTable("Comment");
            builder.Entity<Comment>().HasKey(c => c.Uuid);
            builder.Entity<Comment>().Property(c => c.Content).IsRequired();
            builder.Entity<Comment>().Property(c => c.UserMail).IsRequired();
            builder.Entity<Comment>().Property(c => c.Published).IsRequired();
            builder.Entity<Comment>().Property(c => c.Edited).IsRequired();
            builder.Entity<Comment>().Property(c => c.HasChildren).IsRequired();
            builder.Entity<Comment>()
                .HasMany(c => c.ChildComments)
                .WithOne(c => c.ParentComment)
                .HasForeignKey(c => c.ParentCommentUuid);


            builder.Entity<MetadataCommentMapping>().HasKey(p => new { p.MetadataUuid, p.CommentUuid });
            builder.Entity<MetadataCommentMapping>()
                .HasOne(m => m.Metadata)
                .WithMany(m => m.Comments)
                .HasForeignKey(m => m.MetadataUuid);
            builder.Entity<ExperiencePostCommentMapping>().HasKey(p => new { p.ExperiencePostUuid, p.CommentUuid });
            builder.Entity<ExperiencePostCommentMapping>()
                .HasOne(m => m.ExperiencePost)
                .WithMany(e => e.Comments)
                .HasForeignKey(m => m.ExperiencePostUuid);


            builder.Entity<Tag>().ToTable("Tags");
            builder.Entity<Tag>().HasKey(p => p.Name);

            builder.Entity<Tag>().HasData(
                new Tag { Name = "Public activity" },
                new Tag { Name = "Public property" },
                new Tag { Name = "Traffic" }
            );

            builder.Entity<MetadataTypeTagMapping>().ToTable("MetadataTypeTagMapping");
            builder.Entity<MetadataTypeTagMapping>().HasKey(p => new { p.TagName, p.MetadataTypeUuid });
            builder.Entity<MetadataTypeTagMapping>().HasOne(p => p.Type).WithMany(p => p.Tags).HasForeignKey(p => p.MetadataTypeUuid);
            builder.Entity<MetadataTypeTagMapping>().HasOne(p => p.Tag).WithMany().HasForeignKey(p => p.TagName);

            builder.Entity<Like>().ToTable("Likes");
            builder.Entity<Like>().HasKey(p => new { p.LikeUserEmail, p.MetadataUuid });
            builder.Entity<Like>().HasOne(p => p.LikeUser).WithMany().HasForeignKey(p => p.LikeUserEmail);
            builder.Entity<Like>().HasOne(p => p.Metadata).WithMany(p => p.Likes).HasForeignKey(p => p.MetadataUuid);

            builder.Entity<MetadataTypeTagMapping>().HasData(
                new MetadataTypeTagMapping { TagName = "Public activity", MetadataTypeUuid = type_cycle.Uuid},
                new MetadataTypeTagMapping { TagName = "Public activity", MetadataTypeUuid = type_car.Uuid},
                new MetadataTypeTagMapping { TagName = "Traffic", MetadataTypeUuid = type_car.Uuid}
            );

            builder.Entity<ExperiencePost>().ToTable("ExperiencePost");
            builder.Entity<ExperiencePost>().HasKey(p => p.Uuid);
            builder.Entity<ExperiencePost>().Property(p => p.Contents).IsRequired();
            builder.Entity<ExperiencePost>().HasOne(p => p.LastEditedBy);
            builder.Entity<ExperiencePost>().Property(p => p.Created).IsRequired();
            builder.Entity<ExperiencePost>().Property(p => p.Modified).IsRequired();

            builder.Entity<ExperiencePostTagMapping>().ToTable("ExperiencePostTagMapping");
            builder.Entity<ExperiencePostTagMapping>().HasKey(p => new {p.TagName, p.ExperiencePostUuid});
            builder.Entity<ExperiencePostTagMapping>().HasOne(p => p.Post).WithMany(p => p.Tags).HasForeignKey(p => p.ExperiencePostUuid);
            builder.Entity<ExperiencePostTagMapping>().HasOne(p => p.Tag).WithMany().HasForeignKey(p => p.TagName);
        }
    }
}
