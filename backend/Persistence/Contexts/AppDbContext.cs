using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.Json;
using System;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore;

using OpenData.Domain.Models;

namespace OpenData.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Municipality> Municipalities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MetadataType> MetadataTypes { get; set; }
        public DbSet<Metadata> Metadata { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //This is where we create new tables
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
<<<<<<< HEAD

            builder.Entity<Municipality>().ToTable("Municipalities");
            builder.Entity<Municipality>().HasKey(p => p.Name);
            builder.Entity<Municipality>().Property(p => p.ShieldFileName).IsRequired().ValueGeneratedOnAdd();
=======
            
            builder.Entity<Municipality>().ToTable("Municipalities");
            builder.Entity<Municipality>().HasKey(p => p.Name);
            builder.Entity<Municipality>().Property(p => p.ShieldFileName).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Municipality>().Property(p => p.Latitude).IsRequired();
            builder.Entity<Municipality>().Property(p => p.Longitude).IsRequired();
>>>>>>> 2c10d6b57bb4a21e1ca844948e7794a42beed753
            builder.Entity<Municipality>().HasMany(p => p.MetadataList).WithOne(p => p.Owner).HasForeignKey(p => p.MunicipalityName).IsRequired();

            builder.Entity<Municipality>().HasData
            (
<<<<<<< HEAD
                new Municipality { Name = "Bodø", MailDomain = "bodo.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Test", MailDomain = "test.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Bærum", MailDomain = "baerum.kommune.no", ShieldFileName = "404.png" },
                new Municipality { Name = "Oslo", MailDomain = "oslo.kommune.no", ShieldFileName = "404.png"},
                new Municipality { Name = "Trondheim", MailDomain = "trondheim.kommune.no", ShieldFileName = "404.png"},
                new Municipality { Name = "Asker", MailDomain = "asker.kommune.no", ShieldFileName = "404.png"}
=======
                new Municipality { Name = "Bodø", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Bærum", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Oslo", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Trondheim", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Asker", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F }
>>>>>>> 2c10d6b57bb4a21e1ca844948e7794a42beed753
            );


            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(p => p.Mail);
            builder.Entity<User>().Property(p => p.Password).IsRequired();
            builder.Entity<User>().Property(p => p.PasswordSalt).IsRequired();
            
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

            builder.Entity<MetadataType>().ToTable("MetadataTypes");
            builder.Entity<MetadataType>().HasKey(p => p.Name);

            builder.Entity<MetadataType>().Property(nameof(MetadataType.Description)).IsRequired();
            builder.Entity<MetadataType>().HasMany(p => p.MetadataList).WithOne(p => p.Type).HasForeignKey(p => p.MetadataTypeName).IsRequired();

            builder.Entity<MetadataType>().HasData(
                new MetadataType { Name = "Cycle history", Description = "Pling pling"},
                new MetadataType { Name = "Car history", Description = "Wroom wroom"}
            );
            
            builder.Entity<Metadata>().ToTable("Metadata");
            builder.Entity<Metadata>().HasKey(p => p.Uuid);
            builder.Entity<Metadata>().Property( p => p.Description).IsRequired();
            builder.Entity<Metadata>().Property( p => p.Url).IsRequired();
            builder.Entity<Metadata>().HasOne(p => p.Format);
            builder.Entity<Metadata>().Property( p => p.ReleaseState).IsRequired();

            builder.Entity<Tag>().ToTable("Tags");
            builder.Entity<Tag>().HasKey(p => p.Name);

            builder.Entity<Tag>().HasData(
                new Tag { Name = "Public activity" },
                new Tag { Name = "Public property" },
                new Tag { Name = "Traffic" }
            );

            builder.Entity<MetadataTypeTagMapping>().ToTable("MetadataTypeTagMapping");
            builder.Entity<MetadataTypeTagMapping>().HasKey(p => new { p.TagName, p.MetadataTypeName });
            builder.Entity<MetadataTypeTagMapping>().HasOne(p => p.Type).WithMany(p => p.Tags).HasForeignKey(p => p.MetadataTypeName);
            builder.Entity<MetadataTypeTagMapping>().HasOne(p => p.Tag).WithMany().HasForeignKey(p => p.TagName);

            builder.Entity<MetadataTypeTagMapping>().HasData(
                new MetadataTypeTagMapping { TagName = "Public activity", MetadataTypeName = "Cycle History"},
                new MetadataTypeTagMapping { TagName = "Public activity", MetadataTypeName = "Car History"},
                new MetadataTypeTagMapping { TagName = "Traffic", MetadataTypeName = "Car History"}
            );
        }
    }
}