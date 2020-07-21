using System.Threading.Tasks;
using MenuManager.HTTPServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MenuManager.Controllers
{

    public class ApplicationCallsController : ControllerBase
    {
        MethodAPIRequest methodAPIRequest = new MethodAPIRequest();
        public IConfiguration Configuration { get; set; }
        public ApplicationCallsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [HttpGet("api/application/getapplicationbyprojectid/{projectId}")]
        public async Task<object> GetApplicationsByProjectId(string projectId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Applications/spGetAllApplicationByProjectId/{projectId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "GET", null);
        }

        [HttpPost("api/application/postapplication")]
        public async Task<object> CreateApplication([FromBody]object data)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Applications/CreateApplication";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "POST", data);
        }

        [HttpPut("api/application/putapplication/{applicationId}")]
        public async Task<object> UpdateApplication([FromBody]object data, string applicationId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}Applications/UpdateApplication/{applicationId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "PUT", data);
        }
    }
}