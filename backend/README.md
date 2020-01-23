# Backend

Based on this pretty decent tutorial: https://www.freecodecamp.org/news/an-awesome-guide-on-how-to-build-restful-apis-with-asp-net-core-87b818123e28/

## Creating new concepts

 * Create a Model(`Domain/Models`)
 * Create a Controller(this is what responds to rest requests)
 * Create a Service(and interface for it)
 * Create a Repository(and its interface)
 * Create databaase definition in `AppDbContext`
 * Register dependency injection of the repository and service in `Startup.cs`

The tutorial linked above demonstrates how it works. 