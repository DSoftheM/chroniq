using Chroniq.Models;
using Chroniq.Storage;
using Microsoft.EntityFrameworkCore;

namespace Chroniq.Services;

public class UsersService(AppDbContext context)
{
    public async Task<User?> Get(Guid id)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.Id == id);
    }
}