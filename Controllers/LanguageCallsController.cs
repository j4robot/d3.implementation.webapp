using MenuManager.HTTPServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace MenuManager.Controllers
{

    public class LangaugeCallsController : ControllerBase
    {
        MethodAPIRequest methodAPIRequest = new MethodAPIRequest();
        public IConfiguration Configuration { get; set; }
        public LangaugeCallsController(IConfiguration configuration)
        {
            Configuration = configuration;
        }
       
        [HttpGet("api/LanTrans/spGetAllLanguageTrans/{pageSize}/{pageNumber}/{searchQuery}")]
        public async Task<object> GetAllLanguages(int pageSize, int pageNumber, string searchQuery)
        {
            string endpoint;
            if (searchQuery == "*")
            {
                endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}LanTrans/spGetAllLanguageTrans?PageNumber={pageNumber}&PageSize={pageSize}";
            }
            else
            {
                endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}LanTrans/spGetAllLanguageTrans?PageNumber={pageNumber}&PageSize={pageSize}&SearchQuery={searchQuery}";
            }

            //http://psl-app-vm3/HCMMenuBuilderMicroservice/api/LanTrans/spGetAllLanguageTrans?PageNumber=1&PageSize=20 //?PageNumber=1&PageSize=20&SearchQuery=s

            return await methodAPIRequest.MakeRequestAsync(endpoint, "GETH", null);
        }

        ///api/LanTrans/CreateLangTrans
        [HttpPost("api/LanTrans/CreateLangTrans")]
        public async Task<object> CreateLangTrans([FromBody]object data)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}LanTrans/CreateLangTrans";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "POST", data);
        }
        ///api/LanTrans/UpdateLangTrans/{LangTransId}
        [HttpPut("api/LanTrans/UpdateLangTrans/{LangTransId}")]
        public async Task<object> UpdateLangTrans([FromBody]object data, string LangTransId)
        {
            var endpoint = $"{Configuration["APISETTINGS:HCMMenuBuilderMicroservice"]}LanTrans/UpdateLangTrans/{LangTransId}";
            return await methodAPIRequest.MakeRequestAsync(endpoint, "PUT", data);
        }


    }
}