using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace OpenDataBackend
{
    class Program
    {
        public static void Main(string[] args)
        {
        	Console.WriteLine("Starting up the OpenData backend");
            BuildWebHost(args).Run();
        }
 
        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
