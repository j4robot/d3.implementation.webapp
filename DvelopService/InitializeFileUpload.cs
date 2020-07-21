using Microsoft.Extensions.Configuration;
using persol_poc_hustler.DvelopService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AppyController.DvelopService
{
    public class InitializeFileUpload
    {
        public IConfiguration Configuration { get; set; }
        public InitializeFileUpload(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public string runUpload(string uploadFile, string uploadMappingFile)
        {
            ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            var result = "";
            var baseURI = $"{Configuration["DvelopInfos:BaseURL"]}";
            var apiKey = $"{Configuration["DvelopInfos:API_Key"]}";
            var repoId = $"{Configuration["DvelopInfos:repoId"]}";

            var sessionId = new DvelopAccessHandler().Authenticate(baseURI, apiKey);

            if (null != sessionId)
            {

                try
                {
                    var documentLink = new FileHandlers(Configuration).UploadFile(baseURI, sessionId, repoId, uploadFile, uploadMappingFile).Result;

                    result = documentLink;

                }
                catch (Exception ex)
                {
                    result = "Couldn't upload the file to D3";
                    Console.WriteLine(ex);
                }

            }
            else
            {
                result = "D3 sessionId error";
            }

            return result;
        }


    }
}
