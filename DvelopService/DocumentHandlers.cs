using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace persol_poc_hustler.DvelopService
{
    public class DocumentHandlers
    {
      

        private static string MEDIA_TYPE_HAL_JSON = "application/hal+json";

        //search document by given metadata
        public async Task<string> SearchDocument(string baseURI, string sessionId, string repoId, string searchFor)
        {
            var link_relation = "/dms/r/" + repoId + "/srm";
            var baseRequest = baseURI + link_relation;

            using (HttpClient client = new HttpClient())
            {
                //set Origin header to avoid conflicts with same origin policy
                client.BaseAddress = new Uri(baseURI);
                client.DefaultRequestHeaders.Add("Origin", baseURI);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessionId);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_HAL_JSON));

                //searchFor = (string)JsonConvert.DeserializeObject(searchFor);
                baseRequest += searchFor;

                var result = await client.GetAsync(baseRequest).ConfigureAwait(false);
                if (result.IsSuccessStatusCode)
                {
                    var jsonString = await result.Content.ReadAsStringAsync().ConfigureAwait(false);
                    Console.WriteLine("search ok: " + baseRequest);

                    dynamic jsonResult = JsonConvert.DeserializeObject<object>(jsonString);
                    foreach (var p in jsonResult.items)
                    {
                        Console.WriteLine(p.id + "==== > " + p._links.self.href);
                        foreach (var prop in p.sourceProperties)
                        {
                            Console.WriteLine("   Key = " + prop.key + " value = " + prop.value);
                        }
                    }
                    return jsonString;
                }
            }
            return String.Empty;
        }

        private async static Task<string> GetDocumentInfo(string baseURI, string sessionId, string repoId, string documentLink)
        {

            var link_relation = documentLink;
            var baseRequest = baseURI + link_relation;

            using (HttpClient client = new HttpClient())
            {
                //get download url
                //set Origin header to avoid conflicts with same origin policy
                client.BaseAddress = new Uri(baseURI);
                client.DefaultRequestHeaders.Add("Origin", baseURI);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessionId);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_HAL_JSON));

                var result = await client.GetAsync(baseRequest).ConfigureAwait(false);
                if (result.IsSuccessStatusCode)
                {
                    var jsonString = await result.Content.ReadAsStringAsync().ConfigureAwait(false);
                    Console.WriteLine("getdocinfo ok: " + baseRequest);

                    return jsonString;
                }
            }
            return null;
        }

        private async static Task<bool> DownloadDocument(string baseURI, string sessionId, string repoId, string jsonDocumentInfo, string downloadFilePath)
        {
            dynamic documentInfo = JsonConvert.DeserializeObject<object>(jsonDocumentInfo);
            var link_relation = documentInfo._links.mainblobcontent.href;
            var baseRequest = baseURI + link_relation;

            var fileName = "";
            foreach (var prop in documentInfo.sourceProperties)
            {
                if (prop.key == "dateiname")
                {
                    fileName = prop.value;
                    break;
                }
            }


            using (HttpClient client = new HttpClient())
            {
                //get download url
                //set Origin header to avoid conflicts with same origin policy
                client.BaseAddress = new Uri(baseURI);
                client.DefaultRequestHeaders.Add("Origin", baseURI);
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", sessionId);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MEDIA_TYPE_HAL_JSON));

                Console.WriteLine("start document download");
                var result = await client.GetAsync(baseRequest).ConfigureAwait(false); ;
                if (result.IsSuccessStatusCode)
                {
                    Stream stream = await result.Content.ReadAsStreamAsync().ConfigureAwait(false);
                    Directory.CreateDirectory(downloadFilePath);
                    string filePath = Path.Combine(downloadFilePath, fileName);
                    using (FileStream fs = new FileStream(filePath, FileMode.Create))
                    {
                        stream.CopyTo(fs);
                        fs.Flush();
                    }
                    Console.WriteLine("document downloaded to " + filePath);
                    return true;
                }
                else
                {
                    Console.WriteLine("document download failed");
                }
            }
            return false;
        }
    }
}
