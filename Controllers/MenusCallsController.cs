using System.Threading.Tasks;
using MenuManager.HTTPServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MenuManager.Controllers
{

    public class MenusCallsController : ControllerBase
    {
        MethodAPIRequest methodAPIRequest = new MethodAPIRequest();
        public IConfiguration Configuration { get; set; }
        public MenusCallsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        

        [HttpGet("api/menus/getmenusbyappid/{applicationId}")]
        public async Task<object> GetMenusByApplicationId(string applicationId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Menus/GetMenusByApplicationId/{applicationId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpGet("api/menus/getmenusandsubbyapplicationId/{applicationId}")]
        public async Task<object> GetMenusAndSubByApplicationId(string applicationId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Menus/GetMenusAndSubByApplicationId/{applicationId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpGet("api/menus/getallmenus")]
        public async Task<object> GetAllMenus()
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Menus/GetAllMenus";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpPost("api/menu/postmenu")]
        public async Task<object> CreateMenu([FromBody] object data)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Menus/CreateMenu";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "POST", data);
        }

        [HttpPut("api/menu/putmenu/{menuId}")]
        public async Task<object> UpdateMenu([FromBody] object data, string menuId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Menus/{menuId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "PUT", data);
        }

    }
}