using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APKBuilder.Hubs;
using APKBuilder.IServices;
using Microsoft.AspNetCore.SignalR;

namespace APKBuilder.Services
{
    public class NotificationManager: INotificationManager
    {
        private readonly IHubContext<ClientHub> _hubContext;

        public NotificationManager(IHubContext<ClientHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task SendMessage(string hash, string response, string path)

        {
            await _hubContext.Clients.All.SendAsync(AppConstants.AppConstants.RECEIVE_MESSAGE, hash, response, path);
        }
    }
}
