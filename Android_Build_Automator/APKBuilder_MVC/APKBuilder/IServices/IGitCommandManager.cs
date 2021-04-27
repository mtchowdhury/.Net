using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace APKBuilder.IServices
{
    public interface IGitCommandManager
    {
        bool Pull(string command, out string output, out string error, ILogger _logger);
    }
}
