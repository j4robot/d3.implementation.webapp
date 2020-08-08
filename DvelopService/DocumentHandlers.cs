using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace persol_poc_hustler.DvelopService
{
    public class DocumentHandlers
    {
      

        private static string MEDIA_TYPE_HAL_JSON = "application/hal+json";
        System.Timers.Timer timer;

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

        public async Task<string> GetDocumentInfo(string baseURI, string sessionId, string repoId, string documentLink)
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

        private void DeleteDocumentIn50Secs(string filePathRoot)
        {
            timer = new System.Timers.Timer();
            timer.Interval = (30000);
            //timer.Elapsed += OnTimedEvent;
            string[] Files = Directory.GetFiles(filePathRoot);
            for (int i = 0; i < Files.Length; i++)
            {
                //Here we will find wheter the file is 7 days old
                if (DateTime.Now.Subtract(File.GetCreationTime(Files[i])).TotalMilliseconds > 20000)
                {
                    File.Delete(Files[i]);
                }
            }
            timer.Enabled = true;
            timer.Start();
        }

        public async Task<string> DownloadDocument(string baseURI, string sessionId, string repoId, string jsonDocumentInfo, string downloadFilePath)
        {
            dynamic documentInfo = JsonConvert.DeserializeObject<object>(jsonDocumentInfo);
            var link_relation = documentInfo._links.mainblobcontent.href;
            var baseRequest = baseURI + link_relation;

            var fileName = "";
            //{key: "f6d948fb-f757-4c88-83bd-6e1e7da9e2f0", value: "laptop-request-form.pdf", isMultiValue: false}
            foreach (var prop in documentInfo.sourceProperties)
            {
                if (prop.key == "property_filename")
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

                    try
                    {
                        DeleteDocumentIn50Secs(downloadFilePath);

                        // Check if file exists with its full path    
                        if (File.Exists(Path.Combine(filePath, fileName)))
                        {
                            // If file found, delete it    
                            File.Delete(Path.Combine(filePath, fileName));
                            using (FileStream fs = new FileStream(filePath, FileMode.Create))
                            {
                                stream.CopyTo(fs);
                                fs.Flush();
                            }
                            Console.WriteLine("document downloaded to " + filePath);

                            return fileName;

                        }
                        else
                        {
                            using (FileStream fs = new FileStream(filePath, FileMode.Create))
                            {
                                stream.CopyTo(fs);
                                fs.Flush();
                            }
                            Console.WriteLine("document downloaded to " + filePath);

                            return fileName;
                        }
                    }
                    catch (IOException ioExp)
                    {
                        DeleteDocumentIn50Secs(downloadFilePath);

                        Console.WriteLine(ioExp.Message);
                        using (FileStream fs = new FileStream(filePath, FileMode.Create))
                        {
                            stream.CopyTo(fs);
                            fs.Flush();
                        }
                        Console.WriteLine("document downloaded to " + filePath);

                        return fileName;
                    }

                }
                else
                {
                    Console.WriteLine("document download failed");
                }
            }
            return "No File";
        }
    }
}
