using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace MenuManager.HTTPServices
{
    public class MethodAPIRequest : HelperInterface
    {
        static readonly HttpClient client = new HttpClient();
        public IConfiguration Configuration { get; set; }
        public MethodAPIRequest() { }
        public MethodAPIRequest(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public async Task<string> GetToken()
        {
            return "";
        }

        public async Task<string> MakeRequestAsync(string url, string method, object dataToSend = null)
        {
            string data = null;
            HttpResponseMessage response = null;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", await GetToken());

            switch (method)
            {
                case "GET":
                    response = await client.GetAsync(url);
                    break;
                case "GETH":
                    response = await client.GetAsync(url);
                    break;
                case "POST":
                    response = await client.PostAsync(url, new StringContent(dataToSend.ToString(), Encoding.UTF8, "application/json"));
                    break;
                case "PUT":
                    response = await client.PutAsync(url, new StringContent(dataToSend.ToString(), Encoding.UTF8, "application/json"));
                    break;
                case "DELETE":
                    response = await client.DeleteAsync(url);
                    break;
            }

            if (response.IsSuccessStatusCode && method != "GETH")
            {
                
                var responseContent = await response.Content.ReadAsStringAsync();
                data = responseContent;
            }

            if (response.IsSuccessStatusCode && method == "GETH")
            {
                data = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                return JsonConvert.SerializeObject(new { data, headers = response.Headers });
            }

            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized || response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                return "Unauthorized";
            }
            return data;
        }
    }
}
