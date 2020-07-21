using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace persol_poc_hustler.DvelopService
{
    public class DvelopAccessHandler
    {

        private static string MEDIA_TYPE_HAL_JSON = "application/hal+json";
        private class AuthSessionInfoDto
        {
            public string AuthSessionId { get; set; }
            public DateTime Expire { get; set; }
        }

        //authenticate with user credentials and basic authentication
        public string Authenticate(string baseURI, string apiKey)
        {
            var link_relation = "/identityprovider/login";
            var baseRequest = baseURI + link_relation;

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseRequest);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                    client.DefaultRequestHeaders.Add("Accept", MEDIA_TYPE_HAL_JSON);

                    var result = client.GetAsync(link_relation).Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var authSessionInfo = JsonConvert.DeserializeObject<AuthSessionInfoDto>(result.Content.ReadAsStringAsync().Result);

                        if (null != authSessionInfo.AuthSessionId)
                        {
                            //Console.WriteLine("login ok: " + "expires: " + authSessionInfo.Expire + ", sessionId: " + authSessionInfo.AuthSessionId);
                            return authSessionInfo.AuthSessionId;
                        }
                    }
                    else
                    {
                        return "login failed with status code \"" + result.StatusCode + "\": " + baseRequest;
                    }
                }
            }
            catch (Exception ex)
            {
                return  "login failed with error \"" + ex.Message + "\": " + baseRequest;
            }
            return null;
        }
    }
}
