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
        public DbSet<MetadataTypeDescription> MetadataTypeDescriptions { get; set; }
        public DbSet<MetadataTypeDescriptionVote> MetadataTypeDescriptionVotes { get; set; }
        public DbSet<Metadata> Metadata { get; set; }
        public DbSet<DataSource> DataSource { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<MetadataCategory> MetadataCategory { get; set; }
        public DbSet<MetadataCommentMapping> MetadataCommentMappings { get; set; }
        public DbSet<ExperiencePostCommentMapping> ExperiencePostCommentMappings { get; set; }
        public DbSet<DataFormat> DataFormats { get; set; }

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
                new Backend { Name = "Django", Description = "Just django", Url = "https://www.django-rest-framework.org/"},
                new Backend { Name = "CKAN", Description = "CKAN is an open source data portal software", Url = "https://ckan.org/"}
            );

            builder.Entity<DataFormat>().ToTable("DataFormats");
            builder.Entity<DataFormat>().HasKey(p => p.MimeType);
            builder.Entity<DataFormat>().Property(p => p.Name).IsRequired();
            builder.Entity<DataFormat>().Property(p => p.Description).IsRequired();
            builder.Entity<DataFormat>().Property(p => p.DocumentationUrl);

            builder.Entity<DataFormat>().HasData(
                new DataFormat { Name = "json", MimeType = "application/json", Description = "Just json", DocumentationUrl = "https://www.json.org/json-en.html"},
                new DataFormat { Name = "csv", MimeType = "text/csv", Description = "Comma seperated values", DocumentationUrl = "https://tools.ietf.org/html/rfc4180"},
                new DataFormat { Name = "xml", MimeType = "application/xml", Description = "Extensible markup language", DocumentationUrl = "https://www.w3.org/XML/"},
                new DataFormat { Name = "yaml", MimeType = "application/x.yaml", Description = "Yet Another Markup Language: a human-readable approach to serializable data", DocumentationUrl = "https://yaml.org/"},
                new DataFormat { Name = "js", MimeType = "application/javascript", Description = "Javascript", DocumentationUrl = "https://developer.mozilla.org/en-US/docs/Web/JavaScript"},
                new DataFormat { Name = "rdf", MimeType = "application/rdf+xml", Description = "Resource Description Framework: A syntax for expressing metadata in xml", DocumentationUrl = "https://www.w3.org/TR/rdf-syntax-grammar/"},
                new DataFormat { Name = "xlsx", MimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Description = ".xlsx Excel spreadsheet", DocumentationUrl = "https://www.office.com/"},
                new DataFormat { Name = "xml", MimeType = "text/xml", Description = "Extensible markup language", DocumentationUrl = "https://www.w3.org/XML/"},
                new DataFormat { Name = "jsonld", MimeType = "application/ld+json", Description = "JSON for linking data", DocumentationUrl = "https://json-ld.org/"},
                new DataFormat { Name = "wms", MimeType = "application/x.wms", Description = "Web Map Service", DocumentationUrl = ""},
                new DataFormat { Name = "ualf", MimeType = "application/x.ualf", Description = "File format for describing lightening events", DocumentationUrl = "https://github.com/Gipphe/ualf"},
                new DataFormat { Name = "zip", MimeType = "application/zip", Description = "Zip file format", DocumentationUrl = "https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT"},
                new DataFormat { Name = "pdf", MimeType = "application/pdf", Description = "Portable document format", DocumentationUrl = "https://acrobat.adobe.com/us/en/acrobat/about-adobe-pdf.html"},
                new DataFormat { Name = "xls", MimeType = "application/vnd.sealed-xls", Description = "Compressed Microsoft Excel spreadsheet", DocumentationUrl = "https://www.office.com/"},
                new DataFormat { Name = "sosi", MimeType = "application/x-­ogc-sosi", Description = "Norwegian file format for map data: Samordnet Opplegg for Stedfestet Informasjon", DocumentationUrl = "https://www.kartverket.no/data/sosi-brukerveiledning/"},
                new DataFormat { Name = "sql", MimeType = "application/sql", Description = "SQL dump", DocumentationUrl = ""},
                new DataFormat { Name = "html", MimeType = "text/html", Description = "Hypertext Markup Language", DocumentationUrl = "https://www.w3.org/TR/html51/"},
                new DataFormat { Name = "geojson", MimeType = "application/vnd.geo+json", Description = "GeoJSON", DocumentationUrl = "https://geojson.org/"},
                new DataFormat { Name = "gml", MimeType = "application/gml+xml", Description = "Geography Markup Language", DocumentationUrl = "https://www.iana.org/assignments/media-types/application/gml+xml"},
                new DataFormat { Name = "tiff", MimeType = "image/tiff", Description = "Tagged Image File Format", DocumentationUrl = "http://www.libtiff.org/document.html"},
                new DataFormat { Name = "wfs", MimeType = "application/x.wfs", Description = "Web Feature Service", DocumentationUrl = "https://www.ogc.org/standards/wfs"},
                new DataFormat { Name = "N-Triples", MimeType = "application/n-triples", Description = "A line-based syntax for an RDF graph", DocumentationUrl = "https://www.w3.org/TR/n-triples/"},
                new DataFormat { Name = "kml", MimeType = "application/vnd.google-earth.kml+xml", Description = "Keyhole Markup Language: A file format used to display geographic data in an Earth browser such as Google Earth", DocumentationUrl = "https://developers.google.com/kml/documentation/kml_tut"},
                new DataFormat { Name = "Terse RDF Triple Language", MimeType = "text/turtle", Description = "A syntax and file format for expressing data in the Resource Description Framework (RDF) data model", DocumentationUrl = "https://www.w3.org/TR/turtle/"},
                new DataFormat { Name = "ods", MimeType = "application/vnd.oasis.opendocument.spreadsheet", Description = "OpenDocument spreadsheet, mainly used in OpenOffice, but also supported by the Microsoft Office suite.", DocumentationUrl = "https://www.iso.org/standard/43485.html"},
                new DataFormat { Name = "txt", MimeType = "text/plain", Description = "Plain text", DocumentationUrl = ""},
                new DataFormat { Name = "gtfs", MimeType = "application/x.gtfs", Description = "General Transit Feed Specification", DocumentationUrl = "http://gtfs.org"},
                new DataFormat { Name = "netex", MimeType = "application/x.netex", Description = "Network Timetable Exchange", DocumentationUrl = "http://netex-cen.eu/"},
                new DataFormat { Name = "gpx", MimeType = "application/gpx+xml", Description = "GPS exchange format", DocumentationUrl = "https://www.topografix.com/gpx.asp"}
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
            //builder.Entity<MetadataType>().Property(nameof(MetadataType.Description)).IsRequired();
            builder.Entity<MetadataType>().HasMany(p => p.MetadataList).WithOne(p => p.Type).HasForeignKey(p => p.MetadataTypeUuid).IsRequired();

            builder.Entity<MetadataTypeDescription>().ToTable("MetadataTypeDescription");
            builder.Entity<MetadataTypeDescription>().HasKey(d => d.Uuid);
            builder.Entity<MetadataTypeDescription>().Property(d => d.Content).IsRequired();
            builder.Entity<MetadataTypeDescription>().Property(d => d.AuthorMail).IsRequired();
            builder.Entity<MetadataTypeDescription>().Property(d => d.MetadataTypeUuid).IsRequired();

            builder.Entity<MetadataTypeDescriptionVote>().ToTable("MetadataTypeDescriptionVote");
            builder.Entity<MetadataTypeDescriptionVote>().HasKey(p => new { p.UserMail, p.MetadataTypeDescriptionUuid });
            builder.Entity<MetadataTypeDescriptionVote>().Property(v => v.MetadataTypeDescriptionUuid).IsRequired();
            builder.Entity<MetadataTypeDescriptionVote>().Property(v => v.UserMail).IsRequired();


            //Define metadata types
            var type_cycle = new MetadataType { Uuid = Guid.NewGuid(), Name = "Cycle history", CategoryUuid = bike.Uuid};
            var type_cycle_theft = new MetadataType { Uuid = Guid.NewGuid(), Name = "Cycle theft", CategoryUuid = bike.Uuid};
            var type_population = new MetadataType { Uuid = Guid.NewGuid(), Name = "Populasjon", CategoryUuid = population.Uuid};
            var type_kindergarden = new MetadataType { Uuid = Guid.NewGuid(), Name = "Kindergarden statistics", CategoryUuid = health.Uuid};
            var type_corona = new MetadataType { Uuid = Guid.NewGuid(), Name = "Corona virus cases", CategoryUuid = health.Uuid};
            var type_car = new MetadataType { Uuid = Guid.NewGuid(), Name = "Car history", CategoryUuid = cars.Uuid};
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
