using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;

namespace OpenData.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Municipality> Municipalities { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //This is where we create new tables
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            builder.Entity<Municipality>().ToTable("Categories");
            builder.Entity<Municipality>().HasKey(p => p.Name);
            builder.Entity<Municipality>().Property(p => p.ShieldFileName).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Municipality>().Property(p => p.Latitude).IsRequired();
            builder.Entity<Municipality>().Property(p => p.Longitude).IsRequired();

            builder.Entity<Municipality>().HasData
            (
                new Municipality { Name = "Bærum", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Oslo", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Trondheim", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F },
                new Municipality { Name = "Asker", ShieldFileName="404.png", Latitude=1.0F, Longitude=1.0F }
            );
        }
    }
}